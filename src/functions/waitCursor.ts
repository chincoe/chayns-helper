/**
 * simplify chayns.showWaitCursor with a timeout before showing the waitCursor
 * @param {Object} [config={}]
 * @param {string} [config.text=undefined] - Text that will be displayed after {@link textTimeout}
 * @param {number} [config.textTimeout=5000] - Time in ms after which {@link text} will be shown
 * @param {number} [config.timeout=300] = Time in ms after which the waitCursor will be shown
 * @param {Object.<number, string|null>} [additionalSteps=] - Show multiple texts after a timeout each. Format:
 * { [timeout]: "text", ... }. Text <undefined> will use chayns default, text <null> will display no text.
 * @return {function()} - hideWaitCursor function, will also clear the timeout
 */

export interface WaitCursorConfig {
    text?: string,
    textTimeout?: number,
    timeout?: number
}

export default function showWaitCursor(config?: WaitCursorConfig, additionalSteps?: { [key: number]: string | null }) {
    const {
        text = undefined, textTimeout = 5000, timeout: initialTimeout = 300
    } = config || {};
    /** @type {number[]} */
    const timeoutSteps = additionalSteps
        ? Object.keys(additionalSteps)
            .map((num) => +num)
            .sort((a, b) => (a - b))
        : [];
    const timeouts: number[] = [];
    // @ts-ignore
    timeouts.push(setTimeout(() => {
        chayns.showWaitCursor(text, textTimeout);
    }, initialTimeout));
    for (let i = 0; i < timeoutSteps.length; i++) {
        const currentTimeout = timeoutSteps[i];
        let stepText: string|null = '';
        if (additionalSteps) {
            stepText = additionalSteps[currentTimeout];
        }
        let timeout;
        if (stepText !== null) {
            timeout = setTimeout(() => {
                // @ts-ignore
                chayns.showWaitCursor(stepText, 0);
            }, currentTimeout + initialTimeout);
        } else {
            timeout = setTimeout(() => {
                // @ts-ignore
                chayns.showWaitCursor(stepText, 30758400000 + Math.random());
            }, currentTimeout + initialTimeout);
        }

        // @ts-ignore
        timeouts.push(timeout);
    }

    return () => {
        for (let i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        chayns.hideWaitCursor();
    };
}
