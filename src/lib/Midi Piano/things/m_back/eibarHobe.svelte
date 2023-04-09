<script>
import { onMount } from "svelte";

let audioCtx;
let analyserNode;
let gainNode;
let oscillatorNode;

let touches = {};

onMount(async () => {
  window.addEventListener("mousemove", createAudioCtx);
});

function createAudioCtx() {
  const audioCtx = new AudioContext();
  //   audioCtx = await webAudioApi.getContext();

  analyserNode = audioCtx.createAnalyser();
  gainNode = audioCtx.createGain();
  oscillatorNode = audioCtx.createOscillator();
  window.removeEventListener("mousemove", createAudioCtx);
}

const start = (evt) => {
  const { identifier, x, y } = evt.changedTouches[0];
  oscillatorNode.frequency.value = x;
  gainNode.gain.value = y;
  oscillatorNode.start();
  touches[identifier] = { x, y };
};

const move = (evt) => {
  const { identifier, x, y } = evt.changedTouches[0];
  const { x: startX, y: startY } = touches[identifier];
  const diffX = x - startX;
  const diffY = y - startY;
  oscillatorNode.frequency.value = startX + diffX;
  gainNode.gain.value = startY + diffY;
};

const end = (evt) => {
  const { identifier } = evt.changedTouches[0];
  oscillatorNode.stop();
  delete touches[identifier];
};
</script>

<div
  class="w-full h-52 bg-yellow-200"
  on:touchstart="{start}"
  on:touchmove="{move}"
  on:touchend="{end}"
>
  Touch Here to control the Theremin
</div>
;
