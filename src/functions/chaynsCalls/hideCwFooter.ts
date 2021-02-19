/**
 * Hide the page footer
 */
const hideCwFooter = (): Promise<any> => chayns.invokeCall({
    action: 238,
    value: { hide: true }
});

export default hideCwFooter;
