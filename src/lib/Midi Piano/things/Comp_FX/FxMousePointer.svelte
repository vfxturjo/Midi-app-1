<script>
import {
  gravityPower,
  gravityType,
  reachCursorSpeed,
  snapNoteOnRowChange,
  speedThreshold,
} from "./../../midiPianoLocal.js";
import { spring } from "svelte/motion";
import { createEventDispatcher, onMount } from "svelte";
import Victor from "victor";

const dispatch = createEventDispatcher();

export let circle_color = "red";
export let circle_radius = 4;
export let border_radius = 2;
let cursorObject;

onMount(() => {
  // initiate the loop
  updatePosition();
});

// MAIN VARIABLES
export let mousePos = { x: 0, y: 0 };
let prevMousePos = { x: 0, y: 0 };
let mouseMoved = { x: 0, y: 0 };
export let gravityPos = { x: 0, y: 0 };
let gravityPosYbefore = 0;
let gravityDist = { x: 0, y: 0 };
let gravityDistLen = 0;
let divPos = { x: 0, y: 0 };
let gravity = { x: 0, y: 0 };

$: gravityMultiplier = $gravityPower / 100;

// update the position of the div every frame

// USING FORCE!

function updatePosition() {
  // calculating amount of mouse movement and applying it on the div
  // mouseMoved.x = mousePos.x - prevMousePos.x
  mouseMoved.x = mousePos.x - prevMousePos.x;
  mouseMoved.y = mousePos.y - prevMousePos.y;
  prevMousePos.x = mousePos.x;
  prevMousePos.y = mousePos.y;

  // calculating gravity
  gravityDist.x = gravityPos.x - divPos.x;
  gravityDist.y = gravityPos.y - divPos.y;

  // current allowed: gravityType = "constVel", "linear"
  if ($gravityType == "constVel") {
    gravityDistLen = Math.hypot(gravityDist.x, gravityDist.y);
    // multiplying to somewhat match the power of linear gravity type
    gravityDist.x /= gravityDistLen / 70;
    gravityDist.y /= gravityDistLen / 70;
  }

  // snap to note center when row is changed
  if (gravityPos.y != gravityPosYbefore && $snapNoteOnRowChange) {
    divPos.x = gravityPos.x;
    gravityPosYbefore = gravityPos.y;
  }

  // if movement speed is greater than the threshold speed, gravity wont be applied
  if ($speedThreshold != 0 && mouseMoved.x >= $speedThreshold) {
    divPos.x += mouseMoved.x + (mousePos.x - divPos.x) / $reachCursorSpeed;
    divPos.y += mouseMoved.y + (mousePos.y - divPos.y) / $reachCursorSpeed;
  } else {
    divPos.x += gravityDist.x * gravityMultiplier + mouseMoved.x;
    divPos.y += gravityDist.y * gravityMultiplier + mouseMoved.y;
  }

  requestAnimationFrame(updatePosition);
}
</script>

<div
  class="mouse-follow-script"
  bind:this="{cursorObject}"
  style="
        width: {circle_radius * 2}px;
        height: {circle_radius * 2}px;
        border: {border_radius}px solid {circle_color};
        border-radius: 50%;
        top: {divPos.y}px;
        left: {divPos.x}px;"
></div>

<div
  style="position: absolute; top:{gravityPos.x};
left:{gravityPos.y};"
>
  aaaa
</div>

<style>
.mouse-follow-script {
  position: absolute;
  pointer-events: none;
  z-index: 100;
  transform-origin: center;
}

/* GET INSPIRATIONS FROM HERE:
https://codemyui.com/tag/mouse-pointer/ 
*/
</style>
