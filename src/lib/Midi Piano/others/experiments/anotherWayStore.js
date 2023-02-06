import { writable, readable } from "svelte/store";

let randomNum = 0;

export let data = writable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

export let dataorig = {
  data1: 0,
  data2: 1,
  data3: {
    data1: 0,
    data2: 1,
    data3: 2,
  },
};

export let dataA = writable(dataorig);

export function chageDataOrig() {
  //   dataorig = {
  //     data1: 5,
  //     data2: 6,
  //   };
  dataorig.data1 = 100;
  dataA.set(dataorig);
}
