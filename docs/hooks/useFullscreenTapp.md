## [useFullscreenTapp](src/hooks/useFullscreenTapp.ts)
Makes the tapp a consistent fullscreen tapp regarding the height - as far as that is currently possible in chayns.
Some site layouts may still be slightly scrollable, usually just on mobile, due to the site layout.

**Does not work in pagemaker iFrames!** The offset from the top in pagemaker iFrames cannot be calculated properly, so this helper does not work there.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|initialValue | Whether fullscreen starts active or not | boolean | `true` |
|forceExclusive| Force the tapp into exclusive mode | boolean |`false`|
| **@returns** | `[windowData, isFullscreenActive, setIsFullscreenActive]` | [object, boolean, function(boolean)] | |

#### Example
```javascript
const App = () => {
    // basic usage
    useFullscreenTapp();
    // force exclusive
    const [windowData, isFullscreenActive, setIsFullscreenActive] = useFullscreenTapp(true, true);
    const {
        windowHeight,
        frameX,
        frameY,
        height,
        pageYOffset,
        scrollTop
    } = windowData;

    return (<h1>Hello world</h1>)
};
```
