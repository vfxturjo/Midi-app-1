<script>
import { P } from "flowbite-svelte";

export let alwaysOnTop = true;

let x = 0;
let y = 0;

window.addEventListener("mousemove", (event) => {
    x = event.clientX;
    y = event.clientY;
});
</script>

{#if alwaysOnTop}
    <p style="position: fixed; top: 0; left: 0;">Mouse position: ({x}, {y})</p>
{:else}
    <P>Mouse position: ({x}, {y})</P>
{/if}
