## [useClampLines](src/hooks/useClampLines.ts)
Generate a text that is restricted to a certain height or line count, ended by an ellipsis (e.g. "...").
The hook requires the ref of the target node to be set with its `setRef` return value to calculate the string properly.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|input | The string for line clamping | string | required |
|options| additional configuration | Object |`{}`|
|options.type | type of line clamping | string (`'lines'` or `'height'`) | `'lines'` |
|options.limit| the limit of the respective type, either line count or max height | number | `3` |
|options.ellipsis | the ellipsis that should appear after the end of the string | string | `'...'` |
|options.appendEllipsis | whether the ellipsis should just be used for length calculation or added to the string | boolean | `true` |
|options.html | whether the string input should be treated as an html string | boolean | `false` |
|options.replacer | a function to modify the result string | (v: string) => string | `v => v` |
| **@returns** | [lineClampedText, setRef] | [string, function(ref)] | |

#### Example

```javascript
// basic usage
const App = () => {
    const [text, setRef] = useClampLines("My original text", {
        type: lineClampType.LINES,
        limit: 5,
        ellipsis: '... More'
    });
    return (
        <p ref={setRef}>{text}</p>
    );
};

// disable appendEllipsis to use react node as ellipsis
const App = () => {
    const [text, setRef] = useClampLines("My original text", {
        type: lineClampType.HEIGHT,
        limit: 200, // 200px height limit
        ellipsis: '... More',
        appendEllipsis: false
    });
    return (
        <p ref={setRef}>
            {text}
            <a onClick={() => console.log('Show more')}>... More</a>
        </p>
    );
};
```
