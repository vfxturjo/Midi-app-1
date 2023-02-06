<script>
import JZZ from "jzz";
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import settingsGear from "@iconify/icons-codicon/settings-gear";
import {
  // variables
  midiPortslist,
  midiPorts,
  // functions
  globalMidiUpdate,
  ConnectPort,
  changeMonitor,
  handleSelectChangeIN,
  handleSelectChangeOUT,
  initializeMIDI,
  refreshMidiDevices_list,
} from "../../MIDIstore";
import { preferredInPort, preferredOutPort } from "../../midiPianoLocal";

//#region //? inPortName and OutPortName management

//#endregion

onMount(() => {
  initializeMIDI();
});
</script>

<!-- #region Output ports selector -->
<div>
  <label for="midi-out">
    out: {$midiPorts.OutPortName}
  </label>
  <select
    id="midi-out"
    size="1"
    class="w-10"
    name="midi-out"
    on:click="{refreshMidiDevices_list}"
    on:change="{(e) => {
      handleSelectChangeOUT(e.target.value);
    }}"
  >
    <option value="" disabled hidden selected>
      <span> </span>
    </option>
    <option value="" disabled>
      selected: {$midiPorts.OutPortName}
    </option>

    <optgroup label="Available">
      {#if $midiPortslist.outports.length > 0}
        {#each $midiPortslist.outports as device}
          <option value="{device['name']}">{device["name"]}</option>
        {/each}
      {:else}
        loading OutPorts...
      {/if}
    </optgroup>
    <optgroup label="remove?">
      <option value="{'REMOVE'}">remove midi output port</option>
    </optgroup>
  </select>

  <!-- #endregion -->

  <!-- #region Input ports selector -->

  <!-- <label for="midi-in">
    in: {$midiPorts.InPortName}
  </label>
  <select
    id="midi-in"
    size="1"
    class="w-10"
    name="midi-in"
    on:click="{refreshMidiDevices}"
    on:change="{(e) => {
      handleSelectChangeIN(e.target.value);
    }}"
  >
    <option value="" disabled hidden selected>
      <span> </span>
    </option>
    <option value="" disabled>
      selected: {$midiPorts.InPortName}
    </option>

    <optgroup label="Available">
      {#if $midiPortslist.inPortsList > 0}
        {#each $midiPortslist.inPortsList as device}
          <option value="{device['name']}">{device["name"]}</option>
        {/each}
      {:else}
        loading InPorts...
      {/if}
    </optgroup>
    <optgroup label="remove?">
      <option value="{'REMOVE'}">remove midi input port</option>
    </optgroup>
  </select> -->
</div>
<!-- #endregion -->
