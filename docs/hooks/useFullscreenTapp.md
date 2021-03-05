## [useFullscreenTapp](src/hooks/useFullscreenTapp.ts)

Makes the tapp a consistent fullscreen tapp regarding the height - as far as that is currently possible in chayns. Some
site layouts may still be slightly scrollable, usually just on mobile, due to the site layout.

**Does not work in pagemaker iFrames!** The offset from the top in pagemaker iFrames cannot be calculated properly, so
this helper does not work there.

It is recommended that you apply the `.tapp` class to your root div to use this helper properly

| Parameter | Description | Type | Default/required |
|------|--------------|-----------|-------------|
|initialValue | Whether fullscreen starts active or not | boolean | `true` |
|config.forceExclusive| Force the tapp into exclusive mode | boolean |`false`|
|config.activeStyle| Inline styles to be applied to the tapp element when fullscreen is active. Must be removed manually by setting inactiveStyles | CSSStyleDeclaration |`{ height: "100vh", width: "100vw" }`|
|config.inactiveStyle| Inline styles to be applied to the tapp element when fullscreen is inactive | CSSStyleDeclaration |`{ height: "", width: "" }`|
| **@returns** | `[windowData, isFullscreenActive, setIsFullscreenActive]` | [object, boolean, function(boolean)] | |

#### Example

```javascript
const App = () => {
    // basic usage
    useFullscreenTapp();
    // force exclusive
    const [windowData, isFullscreenActive, setIsFullscreenActive] = useFullscreenTapp(true, {
        forceExclusive: true,
        activeStyles: {
            maxWidth: '100px'
        },
        inactiveStyles: {
            maxWidth: ''
        }
    });
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
