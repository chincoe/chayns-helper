/**
 * simplify chayns.showWaitCursor with a timeout before showing the waitCursor
 * @param {Object} [config={}]
 * @param {string} [config.text=undefined] - Text that will be displayed after {@link textTimeout}
 * @param {number} [config.textTimeout=5000] - Time in ms after which {@link text} will be shown
 * @param {number} [config.timeout=300] = Time in ms after which the waitCursor will be shown
 * @return {function()} - hideWaitCursor function, will also clear the timeout
 */
const showWaitCursor = (config) => {
    const {
        text, textTimeout, timeout
    } = config || {};
    const t = setTimeout(() => {
        chayns.showWaitCursor(text, textTimeout);
    }, (timeout ?? 300));
    return () => {
        clearTimeout(t);
        chayns.hideWaitCursor();
    };
};

export default showWaitCursor;
