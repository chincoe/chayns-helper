## [hexToRgb](src/functions/colors/hexToRgb.ts)
A helper to convert a hex color to an RGB color object.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|hex | the hex string to be converted | string | required |
| **@returns** | An rgb(a) object with a custom toString() method that returns a css string like `rgb(r, g, b)` | { r: number, g: number, b: number, a?: number, toString: () => string } |

### Examples
```javascript
const color = hexToRgb('#ff0000'); // => { r: 255, g: 0, b: 0, a: null }
color.g = 100;
color.a = 0.5;
const str = color.toString(); // => 'rgba(255, 100, 0, 0.5)'
```
