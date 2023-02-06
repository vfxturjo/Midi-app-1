<script>
//#region //? imports
import { onDestroy, onMount } from "svelte";
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
import ScaleChanger from "./things/TopBar.svelte";
import { createGrid } from "./things/scaleProvider";
import FxMousePointer from "./things/Comp_FX/FxMousePointer.svelte";
import Victor from "victor";
//#endregion

let XreactiveSpaces = {};
let diatonicControlSpace;
let gravityCenter;
var activeNote = null;

$: scaleGrid = createGrid({
  rootNote: $scaleRoot,
  scaleType: $scaleType,
  gridRows: $gridRows,
  gridCols: $gridCols,
});

//#region //? Note Events
let mousePos = { x: 0, y: 0 };
let gravityPos = { x: 0, y: 0 };
let isMouseDown = false;
let currentNoteID = -1;
let currentPitch = 0;
let gridHeight, gridWidth;

$: {
  try {
    console.log(diatonicControlSpace.getBoundingClientRect());
  } catch (error) {}
}

let currentElement, centerX, centerY, currentNoteID2, mouseEvent_Dia;
export function handleMouseMove(e) {
  try {
    mouseEvent_Dia = e;
    mousePos.x = mouseEvent_Dia.clientX;
    mousePos.y = mouseEvent_Dia.clientY;
    currentNoteID = mouseEvent_Dia.target.dataset.noteid;
  } catch {
    currentNoteID2 = -1;
  }
}

$: {
  currentNoteID;
  updateGravity();
}

function updateGravity() {
  try {
    if (mouseEvent_Dia.target.nodeName === "TD") {
      let boundingRect = mouseEvent_Dia.target.getBoundingClientRect();
      gravityPos.x = boundingRect.left + boundingRect.width / 2;
      gravityPos.y = boundingRect.top + boundingRect.height / 2;
      gravityCenter.style.left = gravityPos.x + "px";
      gravityCenter.style.top = gravityPos.y + "px";
    }
    // console.log(gravityCenter);
  } catch (error) {}
}
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
  on:mousemove="{(e) => {
    handleMouseMove(e);
  }}"
>
  <div class="min-h-[40px] h-[1/12] max-h-24 ">
    <ScaleChanger />
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <table
    bind:this="{diatonicControlSpace}"
    id="diatonic_controller"
    class="w-full flex-grow table-fixed"
    bind:clientHeight="{gridHeight}"
    bind:clientWidth="{gridWidth}"
  >
    {#each scaleGrid as row}
      <tr>
        {#each row as cell}
          <td
            class="bg-red-300 border-black border-2 text-center"
            data-noteID="{cell.id}"
            ><span class="pointer-events-none select-none">
              {cell.name}</span
            ></td
          >
        {/each}
      </tr>
    {/each}
  </table>
</div>

<FxMousePointer mousePos="{mousePos}" gravityPos="{gravityPos}" />

<div
  bind:this="{gravityCenter}"
  class="bg-blue-700 h-3 w-3 z-50 absolute"
></div>
