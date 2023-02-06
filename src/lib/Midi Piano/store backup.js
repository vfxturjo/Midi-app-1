import { readable, writable } from "svelte/store";
import { preferredInPort, preferredOutPort } from "./midiPianoLocal";
import JZZ from "jzz";

let preferredInPort_here,
  preferredOutPort_here = "";
preferredInPort.subscribe((value) => {
  preferredInPort_here = value;
});
preferredOutPort.subscribe((value) => {
  preferredOutPort_here = value;
});

export let openInPorts_list = writable({});
export let openOutPorts_list = writable({});
// trying port
// export let newPort = writable(JZZ().openMidiOut());
// export let inPort = writable(undefined);
// // export let outPort = writable(undefined);
// export let outPort = writable(JZZ().openMidiOut());

export let ports = writable({
  inPort: null,
  outPort: null,
  InPortName: "none",
  OutPortName: "none",
});
export let inPort, outPort;

// export let InPortName = writable("");
// export let OutPortName = writable("");
export let OutPortName, InPortName;

$: {
  if (inPort === undefined) {
    InPortName = readable("none");
  } else {
    try {
      InPortName = readable(inPort.name());
      // needed for delaying first run
      if (InPortName == undefined) {
        setTimeout(() => (InPortName = readable(inPort.name())), 100);
      }
    } catch (error) {
      InPortName = readable("error");
    }
  }
}
$: {
  if (outPort === undefined) {
    OutPortName = readable("none");
  } else {
    try {
      OutPortName = readable(outPort.name());
      // needed for delaying first run
      if (OutPortName == undefined) {
        setTimeout(() => (OutPortName = readable(outPort.name())), 100);
      }
    } catch (error) {
      OutPortName = readable("error");
    }
  }
}

export function initializeMIDI() {
  JZZ()
    .wait(100)
    .onChange(changeMonitor)
    .then(() => {
      if (preferredInPort_here == "") {
      } else {
        ConnectPort("in", preferredInPort_here);
      }
      if (preferredOutPort_here == "") {
        ConnectPort("out", openOutPorts_list[0]);
      } else {
        ConnectPort("out", preferredOutPort_here);
      }
    })
    .then(() => {
      setTimeout(refreshMidiDevices, 50);
    });
}

export function refreshMidiDevices() {
  JZZ()
    .refresh()
    .then(() => {
      openInPorts_list = JZZ.info()["inputs"];
      openOutPorts_list = JZZ.info()["outputs"];
    });
}

export function changeMonitor() {
  console.log("change in midi ports detected!!!");
  refreshMidiDevices();
}

export function ConnectPort(inOut = "", name, timeout = 3000) {
  if (inOut == "in" || inOut == "i") {
    inPort = writable(
      JZZ()
        .openMidiIn(name)
        // error logging
        .or(function () {
          alert("Cannot open MyMidiOut!\n" + this.log());
          InPortName = writable("error");
        })
        .and(() => console.log("connected MidiIn to ", outPort.name()))
    );
  }

  if (inOut == "out" || inOut == "o") {
    outPort = writable(
      JZZ()
        .openMidiOut(name)
        // error logging
        .or(function () {
          alert("Cannot open MyMidiOut!\n" + this.log());
          OutPortName = writable("error");
        })
        .and(() => console.log("connected MidiOut to ", outPort.name()))
    );
  }
}

export function handleSelectChangeOUT(name) {
  if (name == "REMOVE") {
    outPort = undefined;
  } else {
    ConnectPort("out", name);
  }
}

export function handleSelectChangeIN(name) {
  if (name == "REMOVE") {
    inPort = undefined;
  } else {
    ConnectPort("in", name);
  }
}
