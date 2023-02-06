import { readable, writable } from "svelte/store";
import { preferredInPort, preferredOutPort } from "./midiPianoLocal";
import JZZ from "jzz";
import { inPort } from "./store backup";

let preferredInPort_here,
  preferredOutPort_here = "";
preferredInPort.subscribe((value) => {
  preferredInPort_here = value;
});
preferredOutPort.subscribe((value) => {
  preferredOutPort_here = value;
});

let ports = {
  inPort: null,
  outPort: null,
  InPortName: "none",
  OutPortName: "none",
};
let portlists = {
  inports: [],
  outports: [],
};

export let midiPorts = writable(ports);
export let midiPortslist = writable(portlists);

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
        ConnectPort("out", portlists.outports[0]);
      } else {
        ConnectPort("out", preferredOutPort_here);
      }
    })
    .wait(50)
    .then(() => {
      refreshMidiDevices_list();
    });
}

export function refreshMidiDevices_list() {
  JZZ()
    .refresh()
    .then(() => {
      portlists.inports = JZZ.info()["inputs"];
      portlists.outports = JZZ.info()["outputs"];
    })
    .then(() => {
      console.log("refresing");
      midiPortslist.set(portlists);
    });
}

export function refreshMidiPorts_names() {
  if (ports.inPort === null) {
    ports.InPortName = "none";
  } else {
    try {
      ports.InPortName = ports.inPort.name();
      // needed for delaying first run
      if (ports.InPortName == null) {
        setTimeout(() => (ports.InPortName = ports.inPort.name()), 100);
      }
    } catch (error) {
      ports.InPortName = "error";
    }
  }
  if (ports.outPort === undefined) {
    ports.OutPortName = "none";
  } else {
    try {
      ports.OutPortName = ports.outPort.name();
      // needed for delaying first run
      if (ports.OutPortName == undefined) {
        setTimeout(() => (ports.OutPortName = ports.outPort.name()), 100);
      }
    } catch (error) {
      ports.OutPortName = "error";
    }
  }

  midiPorts.set(ports);
}

export function changeMonitor() {
  console.log("change in midi ports detected!!!");
  refreshMidiDevices_list();
}

export function ConnectPort(inOut = "", name, timeout = 3000) {
  if (inOut == "in" || inOut == "i") {
    ports.inPort = JZZ()
      .openMidiIn(name)
      // error logging
      .or(function () {
        alert("Cannot open MyMidiOut!\n" + this.log());
        ports.InPortName = "error";
        midiPorts.set(ports);
      })
      .and(() => console.log("connected MidiIn to ", ports.outPort.name()))
      .then(() => refreshMidiPorts_names());
  }

  if (inOut == "out" || inOut == "o") {
    ports.outPort = JZZ()
      .openMidiOut(name)
      // error logging
      .or(function () {
        alert("Cannot open MyMidiOut!\n" + this.log());
        ports.OutPortName = "error";
        midiPorts.set(ports);
      })
      .and(() => console.log("connected MidiOut to ", ports.outPort.name()))
      .then(() => refreshMidiPorts_names());
  }

  refreshMidiDevices_list();
}

export function handleSelectChangeOUT(name) {
  if (name == "REMOVE") {
    ports.outPort = undefined;
  } else {
    ConnectPort("out", name);
  }
  globalMidiUpdate();
}

export function handleSelectChangeIN(name) {
  if (name == "REMOVE") {
    ports.inPort = undefined;
  } else {
    ConnectPort("in", name);
  }
  globalMidiUpdate();
}

export function globalMidiUpdate() {
  refreshMidiDevices_list();
  refreshMidiPorts_names();
}
