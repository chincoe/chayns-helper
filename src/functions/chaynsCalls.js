/**
 * Set the viewMode of a tapp (normal, exclusive, wide)
 * @param {boolean} exclusive
 * @param {boolean} [tryUltrawide=false]
 * @return {*}
 */
export const setViewMode = (exclusive, tryUltrawide = false) => {
    let viewMode = tryUltrawide ? 4 : (exclusive ? 2 : 0);
    if (tryUltrawide && !chayns.env.site.disposition.contentWide) {
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

/**
 * Hide the Tapp's footer
 * @return {*}
 */
export const hideCWFooter = () => chayns.invokeCall({
    action: 238,
    value: { hide: true }
});
