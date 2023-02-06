<script>
import JZZ from "jzz";
import { onMount } from "svelte";
import Icon from "@iconify/svelte";
import settingsGear from "@iconify/icons-codicon/settings-gear";
import { is_function } from "svelte/internal";

let openInPorts_list = {},
  openOutPorts_list = {},
  preferredInPort = "",
  preferredOutPort = "";
export let inPort = undefined;
export let outPort = undefined;

//#region //? inPortName and OutPortName management
export let InPortName = "None";
export let OutPortName = "None";

$: {
  if (inPort === undefined) {
    InPortName = "none";
  } else {
    try {
      InPortName = inPort.name();
      // needed for delaying first run
      if (InPortName == undefined) {
        setTimeout(() => (InPortName = inPort.name()), 100);
      }
    } catch (error) {
      InPortName = "error";
    }
  }
}
$: {
  if (outPort === undefined) {
    OutPortName = "none";
  } else {
    try {
      OutPortName = outPort.name();
      // needed for delaying first run
      if (OutPortName == undefined) {
        setTimeout(() => (OutPortName = outPort.name()), 100);
      }
    } catch (error) {
      OutPortName = "error";
    }
  }
}
//#endregion

function ConnectPort(inOut = "", name, timeout = 3000) {
  if (inOut == "in" || inOut == "i") {
    inPort = JZZ()
      .openMidiIn(name)
      // error logging
      .or(function () {
        alert("Cannot open MyMidiOut!\n" + this.log());
        InPortName = "error";
      })
      .and(() => console.log("connected MidiIn to ", outPort.name()));
  }

  if (inOut == "out" || inOut == "o") {
    outPort = JZZ()
      .openMidiOut(name)
      // error logging
      .or(function () {
        alert("Cannot open MyMidiOut!\n" + this.log());
        OutPortName = "error";
      })
      .and(() => console.log("connected MidiOut to ", outPort.name()));
  }
}

function refreshMidiDevices() {
  JZZ()
    .refresh()
    .then(() => {
      openInPorts_list = JZZ.info()["inputs"];
      openOutPorts_list = JZZ.info()["outputs"];
    });
}

function changeMonitor() {
  console.log("change in midi ports detected!!!");
  refreshMidiDevices();
}

onMount(() => {
  JZZ()
    .wait(100)
    .onChange(changeMonitor)
    .then(() => {
      if (preferredInPort == "") {
      } else {
        ConnectPort("in", preferredInPort);
      }
      if (preferredOutPort == "") {
        ConnectPort("out", openOutPorts_list[0]);
      } else {
        ConnectPort("out", preferredOutPort);
      }
    })
    .then(() => {
      setTimeout(refreshMidiDevices, 50);
    });
});

function handleSelectChangeOUT(name) {
  if (name == "REMOVE") {
    outPort = undefined;
  } else {
    ConnectPort("out", name);
  }
}

function handleSelectChangeIN(name) {
  if (name == "REMOVE") {
    inPort = undefined;
  } else {
    ConnectPort("in", name);
  }
}
</script>

<!-- #region Output ports selector -->
<div class="bg-blue-400">
  <label for="midi-out">
    out: {OutPortName}
  </label>
  <select
    id="midi-out"
    size="1"
    class="w-10"
    name="midi-out"
    on:click="{refreshMidiDevices}"
    on:change="{(e) => {
      handleSelectChangeOUT(e.target.value);
    }}"
  >
    <option value="" disabled hidden selected>
      <span> </span>
    </option>
    <option value="" disabled>
      selected: {OutPortName}
    </option>

    <optgroup label="Available">
      {#if openOutPorts_list.length > 0}
        {#each openOutPorts_list as device}
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
</div>

<!-- #endregion -->

<!-- #region Input ports selector -->

<div class="bg-blue-400">
  <label for="midi-in">
    in: {InPortName}
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
      selected: {InPortName}
    </option>

    <optgroup label="Available">
      {#if openInPorts_list.length > 0}
        {#each openInPorts_list as device}
          <option value="{device['name']}">{device["name"]}</option>
        {/each}
      {:else}
        loading InPorts...
      {/if}
    </optgroup>
    <optgroup label="remove?">
      <option value="{'REMOVE'}">remove midi input port</option>
    </optgroup>
  </select>
</div>
<!-- #endregion -->

<!-- #region midi tester -->

<!-- <Icon icon="{settingsGear}" /> -->
<button
  on:click="{() => {
    try {
      outPort.note(0, 'C5', 127, 1000);
      // .or(() => alert('cant send bro'))
      // .and(() => {
      // alert('sent!');
      // });
    } catch (TypeError) {
      alert('Midi device not ready');
    }
  }}"
>
  <!-- 
  c = Channel
  nn = Note
  vv = Velocity
  mm = Most Significant Byte (MSB)
  ll = Least Significant Byte (LSB)
  b = Boolean On/Off
  xx = Other Parameter 1
  yy = Other Parameter 2
 -->

  CHECK MIDIOUT
</button>

<!-- handle error like this? -->
<!-- window.addEventListener("error", function (e) {
   alert("Error occurred: " + e.error.message);
   return false;
}) -->

<!-- ES6 import syntax!!! -->
<!-- 
import JZZ from "jzz";
import TINY from "jzz-synth-tiny";
TINY(JZZ);
 -->

<!-- backup scripts -->
<!-- 

// // // // // // // // refreshMidiDevicesHard

let openInPorts1 = [],
  openOutPorts1 = [];
function refreshMidiDevicesHard() {
  JZZ().refresh();
  JZZ().and(() => {
    let currentLength = JZZ.info().outputs.length;
    let currentOutputs = JZZ.info().outputs;
    console.log("currentlen = ", currentLength, currentOutputs);
    openOutPorts1 = [];
    openInPorts1 = [];
    for (var i = 0; i < currentLength; i++) {
      console.log("pushung", currentOutputs[i]["name"]);
      openOutPorts1.push(currentOutputs[i]["name"]);
    }

    openOutPorts1 = openOutPorts1;
  });
}


-->
