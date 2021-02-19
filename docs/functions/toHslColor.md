## [toHslColor](src/functions/colors/toHslColor.ts)
Turn a string or number into a consistent hsl color, thus always generating colors with a certain level of saturation.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| stringOrInt | the string or number to be turned into an hsl color | string/number | required |
| s | saturation, must be between 0 and 100 | number | `70` |
| l | lightness, must be between 0 and 100 | number | `40` |
| **@returns** | an hsl object with a custom toString() function that returns a css string like `hsl(120, 30%, 40%)` | { h: number, s: number, l: number, toString: () => string } |

### Examples
```javascript
const color = toHslColor('test'); // => { h: 58, s: 70, l: 40 }
const str = color.toString(); // => 'hsl(58, 70%, 40%)'
```
