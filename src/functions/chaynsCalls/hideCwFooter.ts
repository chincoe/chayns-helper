

/**
 * Hide the Tapp's footer
 */
const hideCWFooter = (): Promise<any> => chayns.invokeCall({
    action: 238,
    value: { hide: true }
});

export default hideCWFooter;
