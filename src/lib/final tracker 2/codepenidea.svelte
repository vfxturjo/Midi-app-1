<script>
import { onMount } from "svelte";
import * as Tone from "Tone";

let canvas;
let synth;
let isSynthInitialized = false;
let isToneInitialized = false;
let vw;
let synths = [];

function createSynth() {
  // let synth = new Tone.Synth({
  //   oscillator: {
  //     type: "sine",
  //   },
  // }).toDestination();

  let synth = new Tone.Synth({
    volume: 0,
    detune: 0,
    portamento: 0,
    envelope: {
      attack: 0.01,
      attackCurve: "linear",
      decay: 0.1,
      decayCurve: "linear",
      release: 0.01,
      releaseCurve: "linear",
      sustain: 0.2,
    },
    oscillator: {
      partialCount: 0,
      phase: 0,
      type: "sine",
    },
  }).toDestination();

  // let synth = new Tone.Oscillator({
  //   volume: -8,
  //   detune: 0,
  //   frequency: 440,
  //   partialCount: 0,
  //   phase: 0,
  //   type: "sine",
  // }).toDestination();

  // synths.push(synth);
  return synth;
}

function freqFromX(coordX) {
  console.log((coordX / vw) * 250 + 250);
  return (coordX / vw) * 250 + 250;
}

onMount(() => {
  Tone.start();
  vw = canvas.clientWidth;

  // Initialize with a single synth
  synths = [createSynth()];

  console.log(synths);
  synth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
  });

  //#region //? handling touches
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchend", handleTouchEnd);
  canvas.addEventListener("touchmove", handleTouchMove);
  //#endregion

  //#region //? handling mouse events
  canvas.addEventListener("mousedown", handleMouseStart);
  canvas.addEventListener("mouseup", handleMouseEnd);
  canvas.addEventListener("mousemove", handleMouseMove);
  //#endregion
});

//#region //? Touch handlers
function handleTouchStart(event) {
  if (!isToneInitialized) {
    Tone.start();
  }

  Tone.context.resume();
  for (let i = 0; i < event.touches.length; i++) {
    let touch = event.touches.item(i);
    console.log(`(${touch.clientX}, ${touch.clientY})`);
    let freq = freqFromX(touch.clientX);
    console.log(freq);
    let synth = createSynth();
    synth.triggerAttack(freq);
  }
}

function handleTouchEnd(event) {
  for (let i = 0; i < synths.length; i++) {
    let synth = synths[i];
    let found = false;
    for (let j = 0; j < event.touches.length; j++) {
      let touch = event.touches.item(j);
      if (synth.note === freqFromX(touch.clientX)) {
        found = true;
        break;
      }
    }
    if (!found) {
      synth.triggerRelease();
      synths.splice(i, 1);
      i--;
    }
  }
}

function handleTouchMove(event) {
  event.preventDefault();
  for (let i = 0; i < event.touches.length; i++) {
    let touch = event.touches.item(i);
    console.log(`(${touch.clientX}, ${touch.clientY})`);
    let freq = freqFromX(touch.clientX);
    console.log(`touchmove freq: ${freq}`);
    let synth = synths[i];
    if (!synth) {
      synth = createSynth();
    }
    synth.set({
      frequency: freq,
    });
  }
}
//#endregion

//#region //? mouse handlers
function handleMouseStart(event) {
  event.preventDefault();
  canvas.addEventListener("mousemove", handleMouseMove);

  if (!isToneInitialized) {
    Tone.start();
  }

  Tone.context.resume();
  let freq = freqFromX(event.screenX);
  // let synth = createSynth();
  synths[0].triggerAttack(freq);
}

function handleMouseEnd(event) {
  event.preventDefault();
  synths[0].triggerRelease();
  canvas.removeEventListener("mousemove", handleMouseMove);
}

function handleMouseMove(event) {
  event.preventDefault();
  let freq = freqFromX(event.clientX);
  synths[0].set({
    frequency: freq,
  });
}
//#endregion
</script>

<canvas bind:this="{canvas}" id="main" class="w-full h-full bg-yellow-100 ">
</canvas>
