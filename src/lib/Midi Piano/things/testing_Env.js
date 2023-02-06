import scaleRules from "../../../assets/ScaleRules.json";
import { notation_flat } from "../midiPianoLocal";

let notes_data_raw = scaleRules.notesList[notation_flat ? "flat" : "sharp"]; //=
let notesIDs = Object.keys(notes_data_raw).map((e) => {
  return parseInt(e);
}); //=
let noteNames = Object.values(notes_data_raw);
