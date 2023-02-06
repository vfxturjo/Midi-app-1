<script>
//#region //? imports
import { onMount } from "svelte";
import JZZ from "jzz";
import {
  scaleRoot,
  // scaleOctave,
  scaleType,
  gridRows,
  gridCols,
  scaleOffsetRule,
  midiOutPort,
  pitchBendRange,
} from "./midiPianoLocal";
// import { inPort, outPort, InPortName, OutPortName } from "./store";
import ScaleChanger from "./things/TopBar.svelte";
import { createGrid } from "./things/scaleProvider";
//#endregion

var activeNote = null;

$: scaleGrid = createGrid({
  rootNote: $scaleRoot,
  scaleType: $scaleType,
  gridRows: $gridRows,
  gridCols: $gridCols,
});

//#region //? Note Events
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;
let currentNoteID = -1;
let currentPitch = 0;
let startX = 0;
let outPort;
let startY = 0;
let pitchbend;
let mod = 0;
let gridHeight, gridWidth;
let pitchBendChangeUnit, pitchbendPixelsUnit;

onMount(() => {
  isMouseDown = false;
  window.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mouseleave", handleMouseUp);

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  window.addEventListener("mouseup", (event) => {
    isMouseDown = false;
    currentNoteID = -1;
    currentPitch = 0;
  });
  outPort = JZZ().openMidiOut("loopMIDI Port");
  console.log(outPort);
});

function handleMouseDown(event) {
  // if mouse pressed on table cell
  if (event.target.nodeName === "TD") {
    isMouseDown = true;
    startX = mouseX;
    startY = mouseY;

    currentNoteID = event.target.dataset.noteid;
    outPort.noteOn(0, currentNoteID, 120);
    // .pitchBend(0, 8192); //8192 = center
  }
}

function handleMouseUp(e) {
  if (isMouseDown == true) {
    isMouseDown = false;

    outPort.noteOff(0, currentNoteID);
    outPort.program(11, 0).pitchBend(0, 8192);
    currentNoteID = -1;
  }
}

$: {
  // 8192 = center pitch
  // gridHeight, gridRows,
  // gridWidth, gridCols,

  // making the pitchbend coincide with table columns
  pitchBendChangeUnit = 8192 / $pitchBendRange;
  pitchbendPixelsUnit = gridWidth / $gridCols;
}

$: {
  if (isMouseDown == true) {
    const xMovement = mouseX - startX;
    const yMovement = Math.abs(mouseY - startY);

    pitchbend = Math.trunc(
      8192 + (xMovement / pitchbendPixelsUnit) * pitchBendChangeUnit
    );
    mod = yMovement;

    try {
      outPort.pitchBend(0, pitchbend);
    } catch (error) {}
    try {
      outPort.program(11, yMovement);
    } catch (error) {}
  }
}

function handleClick(event) {
  if (event.target.nodeName === "TD") {
    let note = event.target.dataset.noteid;
  }
}
//#endregion
</script>

<!--? DEBUGGING -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="absolute text-blue-800 z-30 pointer-events-none select-none">
  note: {currentNoteID} <br />
  pitch: {currentPitch} <br />
  pressed: {isMouseDown}
</div>

<!-- ? Main things -->
<div
  class="w-screen h-screen flex flex-col"
  on:mousedown="{(e) => {
    currentNoteID = e.target.dataset.noteid;
    currentPitch = 0;
  }}"
>
  <div class="min-h-[40px] h-[1/12] max-h-24 ">
    <ScaleChanger />
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <table
    on:click="{handleClick}"
    class="w-full flex-grow table-fixed"
    bind:clientHeight="{gridHeight}"
    bind:clientWidth="{gridWidth}"
  >
    {#each scaleGrid as row}
      <tr>
        {#each row as cell}
          <td class="bg-red-300 rounded-xl text-center" data-noteID="{cell.id}"
            ><span class="pointer-events-none select-none">
              {cell.name}</span
            ></td
          >
        {/each}
      </tr>
    {/each}
  </table>
</div>
