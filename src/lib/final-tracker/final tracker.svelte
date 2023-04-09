<script>
import { debounce } from "./debounce.js";

var canvas, c; // c is the canvas' context 2D
var devicePixelRatio;
var container;
var rect;

var points = [];

function draw() {
  var radiusX, radiusY, rotationAngle, pressure;

  //#region //? reset for orientation change
  /* hack to work around lack of orientationchange/resize event */
  //////////// Implement a reset button>>>???
  if (canvas.height != window.innerHeight * devicePixelRatio) {
    resetCanvas();
    rect = canvas.getBoundingClientRect();
  } else {
    c.clearRect(0, 0, canvas.width, canvas.height);
  }
  //#endregion

  for (var i = 0, l = points.length; i < l; i++) {
    // HUD (hacky)
    var hud_props = [];

    switch (points[i].type) {
      case undefined:
        hud_props = ["touch", "identifier: " + points[i].identifier];
        if (points[i].touchType !== undefined) {
          hud_props.push("touchType: " + points[i].touchType);
        }
        hud_props.push(
          /////!!!! optimize the toFixed(n) func
          "clientX: " +
            points[i].clientX.toFixed(2) +
            " clientY: " +
            points[i].clientY.toFixed(2)
        );
        hud_props.push(
          "rectX: " +
            points[i].clientX.toFixed(2) +
            " rectY: " +
            points[i].clientY.toFixed(2)
        );
        if (
          points[i].force !== undefined ||
          points[i].webkitForce !== undefined
        ) {
          hud_props.push(
            "force: " +
              (points[i].force !== undefined
                ? points[i].force.toFixed(5)
                : points[i].webkitForce.toFixed(5))
          );
        }
        break;

      case "pointerover":
      case "pointerdown":
      case "pointermove":
      case "pointerup":
      case "MSPointerOver":
      case "MSPointerDown":
      case "MSPointerMove":
      case "MSPointerUp":
        hud_props = [
          "pointer (" +
            points[i].pointerType +
            ")" +
            (points[i].isPrimary === true ? " primary" : ""),
          "pointerType: " + points[i].pointerType,
          "isPrimary: " + points[i].isPrimary,
          "pointerId: " + points[i].pointerId,
          "clientX: " +
            points[i].clientX.toFixed(5) +
            " clientY: " +
            points[i].clientY.toFixed(5),
          "rectX: " +
            (points[i].clientX.toFixed(5) - rect.x) +
            " clientY: " +
            (points[i].clientY.toFixed(5) - rect.y),
          "button: " + points[i].button,
          "buttons: " + points[i].buttons,
          "pressure: " + points[i].pressure.toFixed(5),
        ];

        break;

      case "mousedown":
      case "mousemove":
      case "mouseup":
        hud_props = [
          "mouse",
          "clientX: " + points[i].clientX + " clientY: " + points[i].clientY,
          "rectX: " +
            (points[i].clientX - rect.x) +
            " rectY: " +
            (points[i].clientY - rect.y),
        ];
        if (
          points[i].force !== undefined ||
          points[i].webkitForce !== undefined
        ) {
          hud_props.push(
            points[i].force !== undefined
              ? "force: " + points[i].force.toFixed(5)
              : "webkitForce: " + points[i].webkitForce.toFixed(5)
          );
        }
        break;

      default:
        console.log("donnnoo");
    }

    c.font = "30px Arial";
    c.fillStyle = "#fff";
    c.fillText(hud_props[0], points[i].clientX, points[i].clientY);
    c.fillStyle = "#222";
    c.font = "10px Arial";
    for (var h_i = 1, h_j = hud_props.length; h_i < h_j; h_i++) {
      c.fillText(
        hud_props[h_i],
        points[i].clientX,
        points[i].clientY + (h_i + 1) * 12 - rect.y
      );
    }
  }
  console.log(hud_props);
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
  window.requestAnimationFrame(draw);
}

function init() {
  //   canvas = document.createElement("canvas");
  c = canvas.getContext("2d");
  container = document.createElement("div");
  container.className = "container";
  resetCanvas();
  container.appendChild(canvas);
  document.body.appendChild(container);
  // use debounced function for better performance on older/underpowered devices (e.g. Nexus 10)
  var debouncedPositionHandler = debounce(positionHandler, 5, true);
  var events = [];
  /* feature detect - in this case not dangerous, as pointer is not exclusively touch */
  if (
    window.PointerEvent ||
    window.navigator.pointerEnabled ||
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
      canvas.addEventListener(events[i], debouncedPositionHandler, false);
    } else {
      canvas.addEventListener(events[i], positionHandler, false);
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

window.addEventListener(
  "load",
  function () {
    /* hack to prevent firing the init script before the window object's values are populated */
    setTimeout(init, 100);
  },
  false
);
</script>

<canvas id="theCanvas" bind:this="{canvas}"></canvas>
