/**
 * Set the view mode of the tapp to default, regular or exclusive mode. Full width only works with certain site layouts
 */
const setViewMode = (exclusive: boolean, tryFullBrowserWidth?: boolean): Promise<void> => {
    let viewMode = (tryFullBrowserWidth ?? false) ? 4 : (exclusive ? 2 : 0);
    if ((tryFullBrowserWidth ?? false) && !chayns.env.site.disposition.contentWide) {
        // eslint-disable-next-line no-console
        console.warn('[SetViewMode] Cannot use wide view on this layout. Layout with wide content required');
        viewMode = 2;
    }
    return chayns.invokeCall({
        action: 266,
        value: {
            updates: [{
                type: 'tapp',
                value: {
                    viewMode
                }
            }]
        },
    });
};

export default setViewMode;
