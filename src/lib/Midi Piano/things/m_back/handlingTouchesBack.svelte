<script>
import { onMount } from "svelte";

let canvasElement;
let currentEvents = {
  id: 0,
  isPrimary: false,
  pressure: 0,
  X: 0,
  Y: 0,
};

onMount(() => {
  //#region //? backup
  // [
  //   "click",
  //   "wheel",
  //   "mouseenter",
  //   "mouseout",
  //   "mousedown",
  //   "mouseup",
  //   "mousemove",
  //   "touchstart",
  //   "touchend",
  //   "touchmove",
  //   "pointerenter",
  //   "pointerout",
  //   "pointerup",
  //   "pointerdown",
  //   "pointermove",
  //   "lostpointercapture",
  // ].forEach((evt) => canvasElement.addEventListener(evt, handleEvent, false));
  //#endregion

  canvasElement.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handlePointerDown(e);
  });

  canvasElement.addEventListener("pointermove", (e) => {
    e.preventDefault();
    handlePointerMove(e);
  });

  canvasElement.addEventListener("pointerup", (e) => {
    e.preventDefault();
    handlePointerUp(e);
  });

  //#region //? backup
  // canvasElement.addEventListener(
  //   "click wheel " +
  //     "mouseenter mouseout mousedown mouseup mousemove " +
  //     "touchstart touchend touchmove " +
  //     "pointerenter pointerout pointerup pointerdown pointermove lostpointercapture",
  //   function (event) {
  //     event.preventDefault();
  //     handleEvent(event);
  //   }
  // );
  //#endregion
});

function handlePointerDown(e) {
  currentEvents.X = e.clientX;
  currentEvents.Y = e.clientY;
  currentEvents.pressure = e.pressure;
  currentEvents.isPrimary = e.isPrimary;
  currentEvents.id = e.pointerId;
}
function handlePointerMove(e) {
  currentEvents.X = e.clientX;
  currentEvents.Y = e.clientY;
  currentEvents.pressure = e.pressure;
  currentEvents.id = e.pointerId;
  console.log(e);
}
function handlePointerUp(e) {
  currentEvents.X = e.clientX;
  currentEvents.Y = e.clientY;
  currentEvents.pressure = e.pressure;
  currentEvents.isPrimary = e.isPrimary;
  currentEvents.id = e.pointerId;
}

function handleEvent(e) {
  console.log(e.type);
  // console.log("AA");
}
</script>

{JSON.stringify(currentEvents)}
<canvas id="multiTouch1" width="500" height="500" bind:this="{canvasElement}"
></canvas>

<!-- {#each currentEvents as aaa}
  <p>{aaa.key}</p>
{:else}
  a?
{/each} -->
<style>
canvas {
  background-color: #eee;
  display: block;
  position: absolute;
}
</style>
