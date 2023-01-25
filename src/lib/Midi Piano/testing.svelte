<script>
import { JZZ } from "jzz";
let canvas;
let ctx;
let isMouseDown = false;
let lastX;
let lastY;
let note;
let channel = 0;
let startX;
let startY;
let pitchbend = 0;
let timbre = 0;
let pressure = 0;
let mpe = false;
let jzz = JZZ();

function handleMouseDown(event) {
  isMouseDown = true;
  startX = event.clientX;
  startY = event.clientY;
  // send "note on" MIDI message

  note = Math.floor((event.clientY / event.toElement.clientHeight) * 128);
  console.log(note);
  jzz.MIDI.noteOn(note, channel);
  if (mpe) {
    timbre = Math.floor((event.clientX / event.toElement.offsetWidth) * 128);
    // jzz.MIDI().timbre(timbre, channel);
  }
}

function handleMouseMove(event) {
  if (isMouseDown) {
    // calculate horizontal and vertical movement
    const xMovement = event.clientX - startX;
    const yMovement = event.clientY - startY;
    // send "pitchbend" MIDI message based on horizontal movement
    pitchbend = Math.floor((xMovement / event.toElement.offsetWidth) * 16384);
    // jzz.MIDI().pitchBend(pitchbend, channel);
    if (mpe) {
      pressure = Math.floor((yMovement / event.toElement.offsetHeight) * 128);
      //   jzz.MIDI().pressure(pressure, channel);
    }
  }
}

function handleMouseUp(event) {
  isMouseDown = false;
  // send "note off" MIDI message
  console.log("mouseupped");
  jzz.MIDI.noteOff(note, channel);
  if (mpe) {
    // jzz.MIDI().timbre(0, channel);
    // jzz.MIDI().pressure(0, channel);
  }
}
</script>

<div
  class="w-[700px] h-[700px] bg-yellow-600"
  on:mousedown="{handleMouseDown}"
  on:mousemove="{handleMouseMove}"
  on:mouseup="{handleMouseUp}"
  on:mouseleave="{handleMouseUp}"
></div>
