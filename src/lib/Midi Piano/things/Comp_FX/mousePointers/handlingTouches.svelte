<script>
// import "pepjs";
import _initAnimFrame from "./dependencies/rAF.js";
_initAnimFrame();
import { _initPolyfill } from "./dependencies/canvas-ellipse-polyfill.js";
_initPolyfill();
import debounce from "./dependencies/debounce.js";
import startCanvas from "./dependencies/myhandler.js";
import { onMount } from "svelte";

onMount(() => {
  startCanvas("multiTouch1", 1000, 1000);
});
</script>

<canvas id="multiTouch1"></canvas>

<style>
canvas {
  background-color: #eee;
  display: block;
  position: absolute;
}
</style>
