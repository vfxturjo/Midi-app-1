<script>
import { scaleRoot, scaleType, scaleOctave } from "../midiPianoLocal";
</script>

<div>
  <label
    >Root Note:
    <!-- on:change="{(e) => $scaleRoot = e.target.value}" -->
    <select bind:value="{$scaleRoot}">
      <option value="C">C</option>
      <option value="C#">C#</option>
      <option value="D">D</option>
      <option value="D#">D#</option>
      <option value="E">E</option>
      <option value="F">F</option>
      <option value="F#">F#</option>
      <option value="G">G</option>
      <option value="G#">G#</option>
      <option value="A">A</option>
      <option value="A#">A#</option>
      <option value="B">B</option>
    </select>
  </label>
  <label
    >Scale:
    <select bind:value="{$scaleType}">
      <option value="major">Major</option>
      <option value="minor">Minor</option>
      <option value="pentatonic">Pentatonic</option>
      <option value="chromatic">Chromatic</option>
    </select>
  </label>
  <label
    >Octave:
    <input type="number" min="0" max="10" bind:value="{$scaleOctave}" />
  </label>
</div>
