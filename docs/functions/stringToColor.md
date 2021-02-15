## [stringToColor](src/functions/colors/stringToColor.ts)
Turn a string into a consistent color

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
| str | the string to be turned into a color | string | required |
| rgb | whether to return an rgb(a) object like [hexToRgb](docs/functions/hexToRgb.md) or a hex color string | boolean | `false` |
| **@returns** | an rgb(a) object or a hex color String with a custom toRgb(a?: number) method | RGBAObject/string | |

### Examples
```javascript
const color = stringToColor('test'); // => '#924436';
const colorRgb = stringToColor('test', true); // => { r: 146, g: 68, b: 54 a: null }
const colorRgba = color.toRgb(0.5); // => { r: 146, g: 68, b: 54 a: 0.5 }
```
