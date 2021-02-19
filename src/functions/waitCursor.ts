import Timeout = NodeJS.Timeout;

export interface WaitCursorConfig {
    text?: string;
    textTimeout?: number;
    timeout?: number;
    action?: string;
}

/**
 * Format: { [timeout: number]: "text", ... }; use null for text to show no text
 */
export type WaitCursorSteps = { [timeout: number]: string | null }

/**
 * chayns.showWaitCursor() function, but it has a built-in delay and can deal with multiple steps
 * @param config
 * @param additionalSteps
 */
export default function showWaitCursor(config?: WaitCursorConfig, additionalSteps?: WaitCursorSteps) {
    const {
        text = undefined, textTimeout = 5000, timeout: initialTimeout = 300, action = 'showWaitCursor'
    } = config || {};
    const timeoutSteps = additionalSteps
        ? Object.keys(additionalSteps)
            .map((num) => +num)
            .sort((a, b) => (a - b))
        : [];
    const timeouts: Array<Timeout | number> = [];
    timeouts.push(setTimeout(() => {
        chayns.showWaitCursor(text, textTimeout, action);
    }, initialTimeout));
    for (let i = 0; i < timeoutSteps.length; i++) {
        const currentTimeout = timeoutSteps[i];
        let stepText: string | null = '';
        if (additionalSteps) {
            stepText = additionalSteps[currentTimeout];
        }
        let timeout: Timeout | number;
        if (stepText !== null) {
            timeout = setTimeout(() => {
                chayns.showWaitCursor(stepText, 0, action);
            }, currentTimeout + initialTimeout);
        } else {
            timeout = setTimeout(() => {
                chayns.showWaitCursor(stepText, 30758400000 + Math.random(), action);
            }, currentTimeout + initialTimeout);
        }

        timeouts.push(timeout);
    }

    return () => {
        for (let i = 0; i < timeouts.length; i++) {
            clearTimeout(<Timeout>timeouts[i]);
        }
        chayns.hideWaitCursor();
    };
}
