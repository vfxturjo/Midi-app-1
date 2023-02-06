<script>
import JSONTree from "svelte-json-tree";
import { onMount } from "svelte";
import { NumDec as N } from "../../../core/MathOps";
import { EventListeners_list } from "../../midiPianoLocal";

let AutoOK_List = [];
let gotList = {
  mouseMoveEvent: 0,
  TouchEvents: 0,
  DeviceOrientationEvent: 0,
  DeviceMotionEvent: 0,
  MozOrientationEvent: 0,
  KeyboardEvent: 0,
};

let AllCurrentData = {
  mouseLocation: {
    x: 0,
    y: 0,
  },
  touching: false,
  keyboard: false,
  DeviceOrientation_Alpha: 0,
  DeviceOrientation_Beta: 0,
  DeviceOrientation_Gamma: 0,
  DeviceMotion_X: 0,
  DeviceMotion_Y: 0,
  DeviceMotion_Z: 0,
  MozOrientation_Alpha: 0,
  MozOrientation_Beta: 0,
  MozOrientation_Gamma: 0,
};

let CheckMouseLocation,
  CheckTouch,
  CheckKeyboard,
  CheckDeviceOrientation,
  CheckDeviceMotion,
  CheckMozOrientation;

let DeviceOrientation_sensors_permissions = {
  devicemotionOK: false,
  deviceorientationOK: false,
  MozOrientationOK: false,
};

let pressedKey;
$: CheckTouch = AllCurrentData.touching;

onMount(() => {
  // MOUSE
  {
    window.addEventListener("mousemove", (e) => {
      AllCurrentData.mouseLocation.x = e.clientX;
      AllCurrentData.mouseLocation.y = e.clientY;
      CheckMouseLocation = e.clientX;
    });
  }

  // Keyboard
  {
    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      pressedKey = event.key;
      CheckKeyboard = event.key;
    });
  }

  // TOUCH SENSOR
  {
    window.addEventListener("touchstart", () => {
      AllCurrentData.touching = true;
    });
    window.addEventListener("touchend", () => {
      AllCurrentData.touching = false;
    });
  }

  // MOTION SENSORS
  {
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        "deviceorientation",
        function (event) {
          // direct, no multiply
          AllCurrentData.DeviceOrientation_Alpha = N.r2(event.alpha);
          AllCurrentData.DeviceOrientation_Beta = N.r2(event.beta);
          AllCurrentData.DeviceOrientation_Gamma = N.r2(event.gamma);

          CheckDeviceOrientation = event.alpha;
          DeviceOrientation_sensors_permissions.deviceorientationOK = true;
        },
        true
      );
    }
    if (window.DeviceMotionEvent) {
      window.addEventListener(
        "devicemotion",
        function (event) {
          // multiply 2 to compensate
          AllCurrentData.DeviceMotion_X = N.r2(event.acceleration.x * 2);
          AllCurrentData.DeviceMotion_Y = N.r2(event.acceleration.y * 2);
          AllCurrentData.DeviceMotion_Z = N.r2(event.acceleration.z * 2);

          CheckDeviceMotion = event.acceleration.x;
          DeviceOrientation_sensors_permissions.devicemotionOK = true;
        },
        true
      );
    } else {
      window.addEventListener(
        "MozOrientation",
        function (event) {
          // multiply 50 to compensate
          AllCurrentData.MozOrientation_Alpha = N.r2(event.alpha);
          AllCurrentData.MozOrientation_Beta = N.r2(event.beta);
          AllCurrentData.MozOrientation_Gamma = N.r2(event.gamma);

          CheckMozOrientation = event.alpha;
          DeviceOrientation_sensors_permissions.MozOrientationOK = true;
        },
        true
      );
    }
  }
});

// /////// / //  / / /// Automatic adder list

// mouse and keyboard
$: {
  CheckMouseLocation;
  addToList("Mouse events", "mouseMoveEvent");
}
$: {
  CheckKeyboard;
  addToList("keyboard", "KeyboardEvent");
}
// touch
$: {
  CheckTouch;
  addToList("Touch", "TouchEvents");
}

// orientation
$: {
  CheckDeviceOrientation;
  addToList("deviceorientation", "DeviceOrientationEvent");
}
$: {
  CheckDeviceMotion;
  addToList("devicemotion", "DeviceMotionEvent");
}
$: {
  CheckMozOrientation;
  addToList("MozOrientation", "MozOrientationEvent");
}

function addToList(what, check) {
  if (AutoOK_List.includes(what)) {
    return;
  }
  if (gotList[check] > 10) {
    AutoOK_List.push(what);
    AutoOK_List = AutoOK_List;
  }
  gotList[check] += 1;
}
</script>

<div class="flex flex-col ">
  <div class="flex-1">
    do whatever you can to check what sensors are aailable: currently watching:
    NumDec works:
  </div>

  <div class="overflow-scroll" style="height: {window.innerHeight - 200}px;">
    <JSONTree value="{AllCurrentData}" defaultExpandedLevel="{1}" /> <br />

    keyPressed: {pressedKey} <br />

    Sensors TRUE FALSE:
    <JSONTree
      value="{DeviceOrientation_sensors_permissions}"
      defaultExpandedLevel="{1}"
    />

    Added to list:
    <JSONTree value="{AutoOK_List}" />
  </div>

  <div class="flex">
    <div class="overflow-scroll" style="height: {200}px;>
      Auto Added
      <button
        class="bg-red-600"
        on:click="{() => {
          ////// // // / /// /// / // save event listeners!!!
          $EventListeners_list = AutoOK_List;
        }}">SAVE???</button
      ><br />
      {#each AutoOK_List as item, i}
        {i}
        <button
          on:click="{() =>
            (AutoOK_List = AutoOK_List.filter((x) => x !== item))}"
        >
          X
        </button>
        {item} <br />
      {:else}
        nothing
      {/each}
      aaaaaaaaaaa<br />
      aaaaaaaaa<br />
      aaaaaaaaaaaaaaaaa<br />
      aaaaaaaaaaa<br />
      aaaaaaaaa<br />
      aaaaaaaaaaaaaaaaa<br />
      aaaaaaaaaaa<br />
      aaaaaaaaa<br />
      aaaaaaaaaaaaaaaaa<br />
      aaaaaaaaaaa<br />
      aaaaaaaaa<br />
      aaaaaaaaaaaaaaaaa<br />
      aaaaaaaaaaa<br />
      aaaaaaaaa<br />
      aaaaaaaaaaaaaaaaa<br />
    </div>

    <br />
    Currently ON:
    <ol>
      {#each $EventListeners_list as item, i}
        <li>
          {i + 1}: {item}
        </li>
      {:else}
        empty
      {/each}
    </ol>
  </div>
</div>
