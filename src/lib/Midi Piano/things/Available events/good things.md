<!--
Created: Mon Feb 06 2023 13:21:58 GMT+0600 (Bangladesh Standard Time)
Modified: Mon Feb 06 2023 13:22:06 GMT+0600 (Bangladesh Standard Time)
-->

```js
const clampRoundPitch = (x: number) =>
    Math.max(0, Math.min(0x3fff, Math.round(x)))
```
