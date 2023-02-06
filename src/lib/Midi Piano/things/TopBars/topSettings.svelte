<script>
import {
  MiniSettingsPage,
  scaleRoot,
  scaleType,
  scaleOctave,
  gridRows,
  gridCols,
  gravityType,
  gravityPower,
  speedThreshold,
  reachCursorSpeed,
  snapNoteOnRowChange,
  playType,
} from "../../midiPianoLocal";
import scaleRules from "../../../../assets/ScaleRules.json";
import scaleDatabase from "../../../../assets/ScaleDatabase.json";
import { notation_flat } from "../../midiPianoLocal";
import SvgIcons from "../../../../assets/icons/svgIcons.svelte";
import MidiPortChooser from "./MidiPortChooser.svelte";
// import MidiPortSettings from "./midiPortSettings.svelte";
// import jzz from "jzz";

let MiniSettingsPageCount = 3;

let notes_data_raw = scaleRules.notesList[notation_flat ? "flat" : "sharp"];
let notesIDs = Object.keys(notes_data_raw).map((e) => {
  return parseInt(e);
});
let noteNames = Object.values(notes_data_raw);

let scaleTypesList = Object.keys(scaleDatabase.scaleTypes);
</script>

<div class="flex justify-between ">
  <div>
    {#if $MiniSettingsPage == 0}
      <!-- ? page 0 contents -->
      <label
        >Root Note:
        <!-- on:change="{(e) => $scaleRoot = e.target.value}" -->
        <select bind:value="{$scaleRoot}">
          {#each notesIDs as item, i (i)}
            <option value="{item + 60}">{noteNames[i]}</option>
          {/each}
        </select>
      </label>
      <label
        >Scale:
        <select bind:value="{$scaleType}">
          {#each scaleTypesList as item, i (i)}
            <option value="{item}">{scaleTypesList[i]}</option>
          {/each}
        </select>
      </label>
      <label
        >Octave:
        <input type="number" min="0" max="100" bind:value="{$scaleOctave}" />
      </label>
      <label
        >PlayType:
        <select class="w-4" bind:value="{$playType}">
          <option value="slide">Slide</option>
          <option value="keys">TODO: keys (no slide)</option>
          <option value="perString"
            >TODO: per String (slide and getack in per row)</option
          >
        </select>
      </label>
    {:else if $MiniSettingsPage == 1}
      <!-- ? page 1 contents -->
      <label
        >gridRows:
        <input type="number" min="2" max="12" bind:value="{$gridRows}" />
      </label>
      <label
        >gridCols:
        <input type="number" min="2" max="20" bind:value="{$gridCols}" />
      </label>
      <label
        >gravityPower:
        <input type="number" min="0" max="20" bind:value="{$gravityPower}" />
      </label>
      <label
        >gravityType:
        <select class="w-4" bind:value="{$gravityType}">
          <option value="linear">Linear Falloff</option>
          <option value="constVel">Constant velocity</option>
        </select>
      </label>
      <label
        >speedThreshold:
        <input type="number" min="0" max="10" bind:value="{$speedThreshold}" />
      </label>
      <label
        >reachCursorSpeed:
        <input
          type="number"
          min="0"
          max="10"
          bind:value="{$reachCursorSpeed}"
        />
      </label>
      <label
        >snapOnRowChnge:
        <select class="w-4" bind:value="{$snapNoteOnRowChange}">
          <option value="{true}">center Note on row change</option>
          <option value="{false}">dont center note on row change</option>
        </select>
      </label>
    {:else if $MiniSettingsPage == 2}
      <!-- ? page 2 contents -->
      <!-- <MidiPortSettings /> -->
    {:else}
      <MidiPortChooser />
    {/if}
  </div>
  <div class="h-full">
    <button
      on:click="{() =>
        ($MiniSettingsPage = ++$MiniSettingsPage % MiniSettingsPageCount)}"
    >
      <SvgIcons
        name="settings"
        width="32"
        height="32"
        class="hover:fill-red-600 "
      />
    </button>
  </div>
</div>
