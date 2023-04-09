<script>
import { debounce } from "./debounce.js";
import { onMount } from "svelte";

let useDebounce = true;
let canvas, c;
let rect;

let points = [];

$: {
  console.log("use Debounce: ", useDebounce);
}

function positionHandler(e) {
  if (e.type == "mousemove" || e.type == "mouseout") {
    // remove previous mouse entry from the array (assumes only a single mouse is ever present)
    for (var i = 0, l = points.length; i < l; i++) {
      if (points[i].type == "mousemove") {
        points.splice(i, 1);
      }
    }
    if (e.type == "mousemove") {
      // add new mouse event entry
      points.push(e);
    }
  } else if (
    e.type == "touchstart" ||
    e.type == "touchmove" ||
    e.type == "touchend" ||
    e.type == "touchcancel"
  ) {
    // remove any points except for mouse (to allow possibility of simultaneous mouse and touch - Chromebook Pixel?)
    for (var i = 0, l = points.length; i < l; i++) {
      if (points[i].type != "mousemove") {
        points.splice(i, 1);
        i--;
        l--;
      }
    }
    // add in all entries from the array-like targetTouches

    // @ts-ignore
    for (var i = 0, l = e.targetTouches.length; i < l; i++) {
      points.push(e.targetTouches[i]);
    }
    // prevent mouse compat events
    e.preventDefault();
  } else {
    /* fairly ugly, unoptimised approach of manually replicating the targetTouches array */
    switch (e.type) {
      case "pointerdown":
      case "pointermove":
      case "MSPointerDown":
      case "MSPointerMove":
        for (var i = 0, found = false, l = points.length; i < l; i++) {
          if (points[i].pointerId == e.pointerId) {
            points[i] = e;
            found = true;
            break;
          }
        }
        if (!found) {
          points.push(e);
        }
        break;
      case "pointerup":
      case "pointerout":
      case "pointercancel":
      case "MSPointerUp":
      case "MSPointerOut":
      case "MSPointerCancel":
        for (var i = 0, l = points.length; i < l; i++) {
          if (points[i].pointerId == e.pointerId) {
            points.splice(i, 1);
            break;
          }
        }
        break;
    }
  }

  //   window.requestAnimationFrame(draw);
  //   console.log(points);
}

function init() {
  c = canvas.getContext("2d");
  resetCanvas();
  // use debounced function for better performance on older/underpowered devices (e.g. Nexus 10)
  var debouncedPositionHandler = debounce(positionHandler, 5, true);
  var events = [];
  /* feature detect - in this case not dangerous, as pointer is not exclusively touch */
  if (
    window.PointerEvent ||
    // @ts-ignore
    window.navigator.pointerEnabled ||
    // @ts-ignore
    window.navigator.msPointerEnabled
  ) {
    events = [
      "pointerover",
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointerout",
      "pointercancel",
      "MSPointerOver",
      "MSPointerDown",
      "MSPointerMove",
      "MSPointerUp",
      "MSPointerOut",
      "MSPointerCancel",
    ];
  } else {
    events = [
      "mouseover",
      "mousedown",
      "mousemove",
      "mouseup",
      "mouseout",
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ];
  }

  for (var i = 0, l = events.length; i < l; i++) {
    if (events[i] == "mousemove" || events[i] == "touchmove") {
      // ------- Debounced function
      canvas.addEventListener(events[i], debouncedPositionHandler);
      //   canvas.addEventListener(events[i], positionHandler);
    } else {
      // ------- NOT Debounced function
      canvas.addEventListener(events[i], positionHandler);
    }
  }

  // suppress context menu
  canvas.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );
  rect = canvas.getBoundingClientRect();
}

function resetCanvas() {
  // HiDPI canvas adapted from http://www.html5rocks.com/en/tutorials/canvas/hidpi/
  devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  c.scale(devicePixelRatio, devicePixelRatio);
}

onMount(() => {
  setTimeout(init, 10);
});
</script>

<p>
  use Debounce:
  <input type="checkbox" bind:checked="{useDebounce}" />
</p>

<p>
  {points}
</p>

<canvas id="theCanvas" class="w-full h-96" bind:this="{canvas}"></canvas>
