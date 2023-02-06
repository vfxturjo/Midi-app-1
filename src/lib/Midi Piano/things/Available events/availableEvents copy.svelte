<script>
import JSONTree from "svelte-json-tree";
import { onMount } from "svelte";
let currentOBJ = {
  alpha: 0,
  beta: 0,
  gamma: 0,
  Ralpha: 0,
  Rbeta: 0,
  Rgamma: 0,
};
let touchsee = {
  touching: false,
  nothing: "AAAA",
};
let aaa;

function motionListener(e) {
  currentOBJ.alpha = e.acceleration.alpha;
  currentOBJ.beta = e.acceleration.beta;
  currentOBJ.gamma = e.acceleration.gamma;
  console.log(e);
  currentOBJ.Ralpha = e.rotationRate.alpha;
  currentOBJ.Rbeta = e.rotationRate.beta;
  currentOBJ.Rgamma = e.rotationRate.gamma;
}

function OrientationListener(e) {
  console.log();
}

onMount(() => {
  window.addEventListener("touchstart", () => {
    touchsee.touching = true;
  });
  window.addEventListener("touchend", () => {
    touchsee.touching = false;
  });
  //   window.addEventListener("deviceorientation", OrientationListener);
  window.addEventListener("devicemotion", motionListener);

  let listener = (e) => {
    const beta = e.beta || 0;
    const x = beta;
    var aaa = x;
  };
  window.addEventListener("deviceorientation", listener);
});
//   window.addEventListener("devicemotion", function (event) {
//     currentOBJ = event.acceleration;
//     //   console.log(event.acceleration.x, event.acceleration.y, event.acceleration.z);
//   });
</script>

do whatever you can to check what sensors are aailable: currently watching:
{aaa}

<JSONTree value="{touchsee}" />
<JSONTree value="{currentOBJ}" defaultExpandedLevel="{1}" />
