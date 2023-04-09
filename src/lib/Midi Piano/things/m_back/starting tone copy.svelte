<script>
import { onMount } from "svelte";
import * as Tone from "tone";
//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

//play a middle 'C' for the duration of an 8th note

onMount(() => {});
</script>

<button
  on:click="{() => {
    Tone.start();
  }}"
>
  START TONE
</button>
<div>
  <button
    on:mousedown="{() => {
      synth.triggerAttack('C4');
    }}"
    on:mouseup="{() => {
      synth.triggerRelease();
    }}"
  >
    C4
  </button>
</div>
