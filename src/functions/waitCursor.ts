
export interface WaitCursorConfig {
    text?: string,
    textTimeout?: number,
    timeout?: number
}

/**
 * Format: { [timeout: number]: "text", ... }; use null for text to show no text
 */
export type WaitCursorSteps = { [timeout: number]: string | null }

export default function showWaitCursor(config?: WaitCursorConfig, additionalSteps?: WaitCursorSteps) {
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
