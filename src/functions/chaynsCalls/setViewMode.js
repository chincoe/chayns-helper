/**
 * Set the viewMode of a tapp (normal, exclusive, wide)
 * @param {boolean} exclusive
 * @param {boolean} [tryFullBrowserWidth=false]
 * @return {*}
 */
const setViewMode = (exclusive, tryFullBrowserWidth = false) => {
    let viewMode = tryFullBrowserWidth ? 4 : (exclusive ? 2 : 0);
    if (tryFullBrowserWidth && !chayns.env.site.disposition.contentWide) {
        // eslint-disable-next-line no-console
        console.warn('[SetViewMode] Cannot use wide view on this layout. Layout with wide content required');
        viewMode = 2;
    }
    return chayns.invokeCall({
        action: 101,
        value: {
            tappId: chayns.env.site.tapp.id,
            viewMode,
        },
    });
};

export default setViewMode;
