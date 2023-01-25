<script>
import { tick } from "svelte";

let notes = ["C", "D", "E", "F", "G", "A", "B"];
let currentScale = "C";
let currentOctave = 4;
let activeNote = null;

function createGrid() {
  let grid = [];
  for (let i = 0; i < notes.length; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      let note = notes[(i + j) % 7] + currentOctave;
      row.push({ note, active: false });
    }
    grid.push(row);
  }
  return grid;
}
let scaleGrid = createGrid();

function playNote(note) {
  // Use the Web Audio API or a library to play the note
  console.log(`Playing note ${note}`);
}

function stopNote(note) {
  // Use the Web Audio API or a library to stop the note
  console.log(`Stopping note ${note}`);
}

function changeScale(newScale) {
  currentScale = newScale;
  notes = newScale.split("");
  scaleGrid = createGrid();
}

function changeOctave(newOctave) {
  currentOctave = newOctave;
  scaleGrid = createGrid();
}

function handleClick(event) {
  if (event.target.nodeName === "TD") {
    let note = event.target.textContent;
    let prevActiveNote = activeNote;
    activeNote = note;

    if (prevActiveNote) {
      stopNote(prevActiveNote);
    }
    playNote(note);
  }
}
</script>

<table on:click="{handleClick}">
  {#each scaleGrid as row}
    <tr>
      {#each row as cell}
        <td class:active="{cell.active}">{cell.note}</td>
      {/each}
    </tr>
  {/each}
</table>

<div>
  <label
    >Scale:
    <select
      bind:value="{currentScale}"
      on:change="{(e) => changeScale(e.target.value)}"
    >
      <option value="C">C</option>
      <option value="G">G</option>
      <option value="D">D</option>
      <option value="A">A</option>
      <option value="E">E</option>
      <option value="B">B</option>
      <option value="F#">F#</option>
      <option value="Db">Db</option>
      <option value="Ab">Ab</option>
      <option value="Eb">Eb</option>
      <option value="Bb">Bb</option>
      <option value="F">F</option>
    </select>
  </label>
  <label
    >Octave:
    <input
      type="number"
      min="0"
      max="10"
      bind:value="{currentOctave}"
      on:change="{(e) => changeOctave(e.target.value)}"
    />
  </label>
</div>
