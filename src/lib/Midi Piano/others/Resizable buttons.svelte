<script>
	import Midi Piano from './Midi Piano.svelte';
//#region imports
import { Button, P, Modal, Label, Input } from "flowbite-svelte";
import { createEventDispatcher } from "svelte";
let dispatch = createEventDispatcher();

import {
  note_ID_shown, note_size, note_size_editing
} from "../midiPianoLocal";

//#endregion
export let item = { id: 0, count: 0, name: "Counter Name" };
export let i = 0;

let editing = false;
// let formModal = false;

function handleEdit(e) {
  let data = onFormSubmit(e, ["name", "count"]);
  console.log(data.count);
  if (data.count === "") {
    data.count = item.count;
  }
  dispatch("update", data);
  editing = false;
}
</script>

<div
  class="relative overflow-hidden rounded-lg dark:bg-slate-800"
  style="{` width: ${$Counter_size.x}px; 
  height: ${$Counter_size.y}px`}"
>
  {#if $rename_mode}
    <!-- ? rename mode -->
    <button
      transition:fade
      class="transition-all absolute right-0 top-0 bg-violet-400 bg-opacity-30 w-full h-full"
      on:click="{() => (editing = true)}"></button>
  {:else if $delete_mode}
    <button
      class="absolute left-0 top-0 w-[30%] h-[100%] bg-red-400 bg-opacity-30"
      on:click="{() => dispatch('delete', item.id)}"></button>
  {:else if $smart_mode}
    {#if $minus_mode}
      <button
        transition:fade
        class="absolute left-0 top-0 w-[30%] h-[100%] bg-red-400 bg-opacity-30"
        on:click="{() => dispatch('down')}"></button>
    {/if}
    <button
      transition:fade
      class="transition-all absolute right-0 top-0 h-[100%] bg-blue-400 bg-opacity-30
      {$minus_mode ? 'w-[68%]' : 'w-[100%]'}"
      on:click="{() => dispatch('up')}"></button>
  {/if}

  <!-- Info part -->
  {#if $counter_id_shown}
    <div class="absolute pointer-events-none  p-1 pl-2">
      <P weight="light" space="tight" align="left" size="xs">{i + 1}</P>
    </div>
  {/if}
  <div class="pointer-events-none h-full" transition:fly|local="{{ x: 10 }}">
    {#if $smart_text}
      {#key item.count}
        <span class="centerrr noselect" in:fly|local="{{ y: -10 }}">
          <P size="2xl">
            {item.count}
          </P>
        </span>
      {/key}
      <div class="absolute bottom-0 w-full noselect">
        <P size="xs" align="center" class="text-gray-600 dark:text-gray-300 "
          >{item.name}</P
        >
      </div>
    {:else}
      <div class="centerrr noselect">
        <P size="lg" align="center"
          >{item.name}: &nbsp
          {#key item.count}
            <span class="absolute" in:fly|="{{ y: -10 }}">
              {item.count}
            </span>
          {/key}
        </P>
      </div>
    {/if}
  </div>

  {#if !$smart_mode}
    {#if $minus_mode}
      <div class="absolute bottom-0 p-2">
        <Button size="lg" color="green" on:click="{() => dispatch('down')}"
          >-1</Button
        >
      </div>
    {/if}
    <div class="absolute bottom-0 right-0 p-2">
      <Button size="lg" on:click="{() => dispatch('up')}">+1</Button>
    </div>
  {/if}
</div>

<!--  -->
<!--  -->
<!--  -->
<!--! RENAMING MODAL -->
<Modal bind:open="{editing}" size="xs" class="h-min">
  <form
    class="flex flex-col space-y-6"
    on:submit|preventDefault="{(e) => handleEdit(e)}"
  >
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      Rename Counter
    </h3>
    <Label class="space-y-2">
      <span>Name</span>
      <Input name="name" placeholder="{item.name}" />
    </Label>
    <Label class="space-y-2">
      <span>Value</span>
      <Input type="number" name="count" placeholder="{item.count}" />
    </Label>

    <Button type="submit" class="w-full1">Set</Button>
  </form>
</Modal>
