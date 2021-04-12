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
|config.tryFullBrowserWidth| Try full browser width. Only works for certain site layouts and if `forceExclusive` is `true` | boolean |`false`|
|config.disableBodyScrolling| Whether hook should automatically disable&enable scrolling in the chayns web body | boolean | `true` |
|config.rootElement| A selector for your application's root element | string | `'.tapp'` |
|config.style| Inline styles to be applied to the tapp element | CSSStyleDeclaration | `{}` |
|config.active | These settings are applied when fullscreen is active. They override the base settings | FullscreenTappConfig | `undefined` |
|config.active.forceExclusive| Force the tapp into exclusive mode | boolean |`false`|
|config.active.tryFullBrowserWidth| Try full browser width. Only works for certain site layouts and if `forceExclusive` is `true` | boolean |`false`|
|config.active.disableBodyScrolling| Whether hook should automatically disable&enable scrolling in the chayns web body | boolean | `true` |
|config.active.style| Inline styles to be applied to the tapp element when fullscreen is active. Should be removed manually by setting inactiveStyles | CSSStyleDeclaration |`{ height: "100vh", width: "100vw" }`|
|config.inactive.style| Inline styles to be applied to the tapp element when fullscreen is inactive. Removes all active styles by default | CSSStyleDeclaration |`{ height: "", width: "" }`|
|config.inactive.forceExclusive| Force the tapp into exclusive mode | boolean |`false`|
|config.inactive.tryFullBrowserWidth| Try full browser width. Only works for certain site layouts and if `forceExclusive` is `true` | boolean |`false`|
|config.inactive.disableBodyScrolling| Whether hook should automatically disable&enable scrolling in the chayns web body | boolean | `true` |
| **@returns** | `[windowData, isFullscreenActive, setIsFullscreenActive]` | [object, boolean, function(boolean)] | |

#### Example

```javascript
const App = () => {
    // basic usage
    useFullscreenTapp();
    // using all features
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
