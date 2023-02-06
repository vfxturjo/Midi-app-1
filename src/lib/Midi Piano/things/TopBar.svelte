<script>
import { showMiniSettings } from "../midiPianoLocal";
import SvgIcons from "../../../assets/icons/svgIcons.svelte";
import TopSettings from "./TopBars/topSettings.svelte";
</script>

<div class="flex justify-between">
  <div class="flex-grow">
    {#if $showMiniSettings}
      <TopSettings />
    {:else}
      other modules/buttons will come here
    {/if}
  </div>
  <div class="h-full">
    <button on:click="{() => ($showMiniSettings = !$showMiniSettings)}">
      <SvgIcons
        name="settings"
        width="32"
        height="32"
        class="hover:fill-red-600 "
      />
    </button>
  </div>
</div>
