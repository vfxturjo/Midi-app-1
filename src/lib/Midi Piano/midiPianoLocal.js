import { persisted } from "svelte-local-storage-store";

// First param `preferences` is the local storage key.
// Second param is the initial value.

//#region //? visuals
export let note_ID_shown = persisted("note_ID_shown", false);
export let note_size_editing = persisted("note_size_editing", false);
export let note_size = persisted("note_size", { x: 300, y: 90, gap: 10 });
//#endregion

//#region //? scaleGrid info
export let scaleRoot = persisted("scaleRoot", 60);
export let scaleType = persisted("scaleType", "major");
export let scaleOctave = persisted("scaleOctave", "4");
export let gridRows = persisted("gridRows", 4);
export let gridCols = persisted("gridCols", 6);
export let scaleOffsetRule = persisted("scaleOffsetRule", "3s");
//#endregion

//#region //? app info
export let midiOutPort = persisted("midiOutPort", "MidiView");
//#endregion
