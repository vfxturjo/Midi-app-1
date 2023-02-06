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
export let playType = persisted("playType", "slide"); // can be "slide" // waiting "perString"
export let gravityPower = persisted("gravityPower", 80);
// current allowed: gravityType = "", "constVel", "linear"
export let gravityType = persisted("gravityType", "linear");
// gravity wont work if mouse speed is faster than this speed
export let speedThreshold = persisted("speedThreshold", 2);
export let reachCursorSpeed = persisted("reachCursorSpeed", 8);
export let snapNoteOnRowChange = persisted("snapNoteOnRowChange", true);
//#endregion

//#region //? app info
export let showMiniSettings = persisted("showMiniSettings", false);
export let MiniSettingsPage = persisted("MiniSettingsPage", 0);
export let notation_flat = persisted("notation_flat", false);
export let pitchBendRange = persisted("pitchBendRange", 16);
export let midiOutPort = persisted("midiOutPort", "");
export let EventListeners_list = persisted("EventListeners_list", []);
//#endregion

//#region //? midi info
export let preferredInPort = persisted("preferredInPort", "");
export let preferredOutPort = persisted("preferredOutPort", "");
//#endregion
