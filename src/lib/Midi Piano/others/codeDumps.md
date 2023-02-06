<!--
Created: Sat Feb 04 2023 03:38:49 GMT+0600 (Bangladesh Standard Time)
Modified: Sat Feb 04 2023 03:39:45 GMT+0600 (Bangladesh Standard Time)
-->
add the reactive space so that it can be compared with current mouseX and mouseY to determine if reactivity is needed or not
// optimization thing

```js
window.onresize = function(event) {
    {
        let temp = diatonicControlSpace.getBoundingClientRect();
        XreactiveSpaces.diatonicControlSpace = {
            left: temp.left,
            right: temp.right,
            top: temp.top,
            bottom: temp.bottom,
        };
        console.log(XreactiveSpaces);
    }
};
```
