<script>
import { onMount } from "svelte";
import * as jzz from "jzz";
import {
  scaleRoot,
  scaleOctave,
  scaleType,
  gridRows,
  gridCols,
  scaleOffsetRule,
  midiOutPort,
} from "./midiPianoLocal";
import ScaleChanger from "./things/scaleChanger.svelte";
import { createGrid } from "./things/scaleProvider";
scaleRoot;

var activeNote = null;
var scaleGrid = createGrid({
  rootNote: 60,
  scaleType: $scaleType,
  gridRows: $gridRows,
  gridCols: $gridCols,
});

//#region //? settings change
function settingsChange() {
  var activeNote = null;
  var scaleGrid = createGrid({
    rootNote: 60,
    scaleType: $scaleType,
    gridRows: $gridRows,
    gridCols: $gridCols,
  });
}
//#endregion

//#region //? Note Events
let mouseX = 0;
let mouseY = 0;
let mousePressed = false;
let currentNoteID = -1;
let currentPitch = 0;
let startX = 0;
let startY = 0;
let port;

onMount(() => {
  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (mousePressed) {
      currentPitch = mouseX - startX;
    }
  });
  window.addEventListener("mousedown", (event) => {
    mousePressed = true;
    startX = mouseX;
    startY = mouseY;
    console.log(event.target);
    currentNoteID = event.target.dataset.noteid;
    currentPitch = 0;
  });
  window.addEventListener("mouseup", (event) => {
    mousePressed = false;
    currentNoteID = -1;
    currentPitch = 0;
  });

  port = jzz()
    .or("Cannot start MIDI engine!")
    .openMidiOut($midiOutPort)
    .or("MIDI-Out: Cannot open!")
    .and(function () {
      console.log("MIDI-Out:", this.name());
    });
});

function playNote(note) {
  // Use the Web Audio API or a library to play the note
  console.log(`Playing note ${note}`);
}

function handleMouseMove(e) {}

function stopNote(note) {
  // Use the Web Audio API or a library to stop the note
  console.log(`Stopping note ${note}`);
}

function handleClick(event) {
  if (event.target.nodeName === "TD") {
    let note = event.target.dataset.noteid;

    // let prevActiveNote = activeNote;
    // activeNote = note;
    // if (prevActiveNote) {
    //   stopNote(prevActiveNote);
    // }

    playNote(note);
  }
}
//#endregion

// // send midi for every change
$: currentNoteID, {};
// $: send midi (currentPitch)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<!-- <canvas
  ref={(el) => {
    canvas = el;
    ctx = canvas.getContext("2d");
  }}
  on:mousedown={handleMouseDown}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
>
  Sorry, your browser doesn't support canvas.
</canvas> -->

<div class="absolute text-red-800">
  note: {currentNoteID} <br />
  pitch: {currentPitch} <br />
  pressed: {mousePressed}
</div>

<div
  class="w-screen h-screen"
  on:mousedown="{(e) => {
    currentNoteID = e.target.dataset.noteid;
    currentPitch = 0;
  }}"
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <table on:click="{handleClick}" class="w-full h-full">
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

<!-- svelte-ignore a11y-click-events-have-key-events
<table on:click="{handleClick}">
  {#each scaleGrid as row}
    <tr>
      {#each row as cell}
        <td class:active="{cell.active}">{cell.note}</td>
      {/each}
    </tr>
  {/each}
</table> -->

<!-- trying with chatGPT
  in svelte, create a canvas that has a table. when mouse is pressed down on a cell, "note on" midi is sent. when mouse is dragged left or right, "pitchbend" midi is sent according to how much horizontal mouse movement is occured. note that when dragging, mouse could leave the button and go further. "pitchbend" should still be sent. when the mouse is released, "note off" midi should be sent.
 -->
