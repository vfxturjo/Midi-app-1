<script>
// var JZZ = require("jzz");
import * as jzz from "jzz";

//#region //? mouselocationData
let mouseX = 0,
  mouseY = 0,
  start_mouseX = 0,
  start_mouseY = 0,
  mousedown = 0;

window.addEventListener("mousedown", (event) => {
  mousedown = 1;
});

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});
//#endregion

let port = jzz()
  .or("Cannot start MIDI engine!")
  .openMidiOut("MidiView")
  .or("MIDI-Out: Cannot open!")
  .and(function () {
    console.log("MIDI-Out:", this.name());
  });

function thing() {
  port.note(0, "C#5", 127, 500);
  // port1
  //   .mpe(0, 4)
  //   .program(25) // program change on master channel (0)
  //   .noteOn("E4")
  //   .noteOn("A4")
  //   .noteOn("E5")
  //   .wait(50)
  //   .noteOff("E4")
  //   .noteOff("A4")
  //   .noteOff("E5")
  //   .noteOff("A5")
  //   .noteOff("C#6")
  //   .noteOff("E6");
}
// port1.close();

let count = 0;
let deltaX = 0;
var monitor;

function mouseDownHandle() {
  console.log("mousedowned");
  mousedown = 1;
  start_mouseX = mouseX;
  start_mouseY = mouseY;
  monitor = setInterval(() => {
    deltaX = start_mouseX - mouseX;
    count = deltaX;
    port.ch(0).noteOn("C#5").wait(10).noteOff("C#5");
  }, 17);
}

window.addEventListener("mouseup", (event) => {
  // buttonClicked ? console.log("mosueupped") : {};
  mousedown = 0;
  clearInterval(monitor);
});
</script>

<div class="absolute p-4 z-50 pointer-events-none">
  mouseCurrent : x={mouseX} y={mouseY} <br />
  mousedown : {mousedown}<br />
  mouseDrag : x={deltaX}
</div>

<div class="w-screen h-screen justify-center">
  <table class="w-full h-full border-2">
    <tr>
      <td> aaaawdawd </td>
      <td> aaaawdawd </td>
      <td> aaaawdawd </td>
    </tr>
    <tr>
      <td> aaaawdawd </td>
      <td> aaaawdawd </td>
      <td> aaaawdawd </td>
    </tr>
  </table>
</div>

<button on:mousedown="{mouseDownHandle}">
  count is {count}
</button>
