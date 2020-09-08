## [useFullscreenTapp](useFullscreenTapp.js)
Makes the tapp a consistent fullscreen tapp regarding the height - as far as that is currently possible in chayns.
Some site layouts may still be slightly scrollable, especially in the chayns app despite your app's iframe being the right size.
That's an issue with the chayns web that cannot be fixed on this end.

**Does not work in pagemaker iFrames!**

Not sufficiently tested for location apps and chayns.runtime.

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|initialValue | Whether fullscreen starts active or not | boolean | `true` |
|options | Advanced configuration | Object | `{}` |
|options.forceExclusive| Force the tapp into exclusive mode | boolean |`false`|
|options.fullBrowserWidth | Try to set the tapp width to the full viewport width. Only works on certain site layouts. | boolean |`false`|
|options.maxWidth | Limit the tapp's maximum width. Probably useless if options.fullBrowserWidth is false | number | `851`|
| **@returns** | `[windowData, isFullscreenActive, setIsFullscreenActive]` | [Object, boolean, function(boolean)] | |

#### Example
```javascript
const App = () => {
    // simple
    useFullscreenTapp();
    // force exclusive
    const [windowData, isFullscreenActive, setIsFullscreenActive] = useFullscreenTapp(true, {
        forceExclusive: true
    });

    return (<h1>Hello world</h1>)
};
```
