export enum ViewMode {
    Regular = 0,
    Exclusive = 2,
    Wide = 4,
    Initial = -1
}
/**
 * Set the view mode of the tapp to default, regular or exclusive mode. Full width only works with certain site layouts
 * @param exclusive
 * @param tryFullBrowserWidth
 */
function setViewMode(exclusive: boolean, tryFullBrowserWidth?: boolean) : Promise<void>;
/**
 * Set the view mode of the tapp to default, regular or exclusive mode. Full width only works with certain site layouts
 * @param viewMode
 */
function setViewMode(viewMode: ViewMode): Promise<void>;

/**
 * Set the view mode of the tapp to default, regular or exclusive mode. Full width only works with certain site layouts
 */
function setViewMode(mode: boolean | ViewMode, tryFullBrowserWidth: boolean = false): Promise<void> {
    let viewMode: ViewMode
    if (typeof mode === 'boolean')
        viewMode = tryFullBrowserWidth ? ViewMode.Wide : (mode ? ViewMode.Exclusive : ViewMode.Regular);
    else viewMode = mode === ViewMode.Initial
        ? +!!chayns.env.site?.tapp?.isExclusiveView && ViewMode.Exclusive
        : mode;
    if (viewMode === ViewMode.Wide && !chayns.env.site?.disposition?.contentWide) {
        // eslint-disable-next-line no-console
        console.warn('[SetViewMode] Cannot use wide view on this layout. Layout with wide content required');
        viewMode = ViewMode.Exclusive;
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
