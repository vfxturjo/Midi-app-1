import { noteType } from "./noteType";
import scaleDatabase from "../../../assets/ScaleDatabase.json";

export function createAllowedNotes(scaleType) {
  let scaleData = scaleDatabase["scaleTypes"][scaleType];

  let notesDataRelativeKeys = Object.keys(scaleData);
  let notesDataRelativeValues = Object.values(scaleData);
  let scaleNotesData = {};

  for (var i = 0; i < notesDataRelativeKeys.length; i++) {
    if (!isNaN(Number(notesDataRelativeKeys[i]))) {
      scaleNotesData[Number(notesDataRelativeKeys[i])] = new noteType(
        notesDataRelativeValues[i]
      );
    }
    // else { console.log("ignoring"); }
  }

  // creating allowed ID list
  {
    let allowedIdList = [];
    for (var i = 0; i < 12; i++) {
      if (scaleNotesData[i].allowed() == true) {
        allowedIdList = [...allowedIdList, i];
      }
    }
    scaleNotesData.allowedIdList = allowedIdList;
  }

  return scaleNotesData;
}

export function relative_to_absolute_list(relativeList, firstOffset = 0) {
  // alternative method
  // const absoluteValues = [-firstOffset];
  // for (let i = 1; i < offsetValues.length; i++) {
  //   absoluteValues.push(absoluteValues[i - 1] + offsetValues[i]);
  // }

  return relativeList.reduce(
    (acc, cur) => {
      acc.push(acc[acc.length - 1] + cur);
      return acc;
    },
    [firstOffset == 0 ? 0 : -firstOffset]
  );
}

// export function createGrid(
//   rootNote = 60,
//   scaleType = "major",
//   gridRows = 4,
//   gridCols = 6,
//   rowOffsetRule = "3s",
//   firstOffset = 1
export function createGrid({
  rootNote = 60,
  scaleType = "major",
  gridRows = 4,
  gridCols = 6,
  rowOffsetRule = "3s",
  firstOffset = 1,
}) {
  let rowOffsetList_Absolute = relative_to_absolute_list(
    scaleDatabase["rowOffsetTypes"][rowOffsetRule]
  );

  var scaleNotesData = createAllowedNotes(scaleType);
  let startingNoteID = rootNote - firstOffset;

  // let notesNeeded = gridCols * gridRows;
  //   let endingNoteNumber =
  //     startingNoteNumber + rowOffsetList_Absolute[scaleRows] + scaleCols; //=

  //   var gridNotesList = [];
  //   for (var i = startingNoteNumber; i < startingNoteNumber + 24; i++) {
  //     gridNotesList.push({
  //       id: i,
  //       name: `${scaleDatabase.notesList["sharp"][i % 12]}${Math.floor(i / 12)}`,
  //       type: scaleNotesData[i % 12],
  //     });
  //   }

  var grid = [];
  for (var rowN = 0; rowN < gridRows; rowN++) {
    var thisRow = [];
    for (let colN = 0; colN < gridCols; colN++) {
      let id = startingNoteID + rowOffsetList_Absolute[rowN] + colN;
      thisRow.push(
        // Constructing Note Object
        {
          id: id,
          name: `${scaleDatabase.notesList["sharp"][id % 12]}${Math.floor(
            id / 12
          )}`,
          type: scaleNotesData[id % 12],
        }
      );
    }
    grid.push(thisRow);
  }

  return grid;
}
