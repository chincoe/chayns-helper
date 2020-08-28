/**
 * simplify chayns.showWaitCursor with a timeout before showing the waitCursor
 * @param {string} [text=undefined] - Text that will be displayed after {@link textTimeout}
 * @param {number} [textTimeout=5000] - Time in ms after which {@link text} will be shown
 * @param {number} [timeout=300] = Time in ms after which the waitCursor will be shown
 * @return {function(number)} - hideWaitCursor function, will also clear the timeout
 */
export const showWaitCursor = (text = undefined, textTimeout = 5000, timeout = 300) => {
    const t = setTimeout(() => {
        chayns.showWaitCursor(text, textTimeout);
    }, timeout);
    return () => {
        clearTimeout(t);
        chayns.hideWaitCursor();
    };
};
