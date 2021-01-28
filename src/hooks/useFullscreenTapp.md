## [useFullscreenTapp](useFullscreenTapp.ts)
Makes the tapp a consistent fullscreen tapp regarding the height - as far as that is currently possible in chayns.
Some site layouts may still be slightly scrollable, usually just on mobile, due to the site layout.

**Does not work in pagemaker iFrames!**

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|initialValue | Whether fullscreen starts active or not | boolean | `true` |
|forceExclusive| Force the tapp into exclusive mode | boolean |`false`|
| **@returns** | `[windowData, isFullscreenActive, setIsFullscreenActive]` | [Object, boolean, function(boolean)] | |

#### Example
```javascript
const App = () => {
    // simple
    useFullscreenTapp();
    // force exclusive
    const [windowData, isFullscreenActive, setIsFullscreenActive] = useFullscreenTapp(true, true);

    return (<h1>Hello world</h1>)
};
```
