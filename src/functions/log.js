/**
 * Initialize logging helper.
 * Enables the use of console.notLive.log/warn/error()
 * @param {boolean} isLiveBuild
 */
// eslint-disable-next-line import/prefer-default-export
export const initLog = (isLiveBuild) => {
    // eslint-disable-next-line no-console
    console.notLive = {
        log: (...args) => {
            if (!isLiveBuild) {
                // eslint-disable-next-line no-console
                console.log(...args);
            }
        },
        warn: (...args) => {
            if (!isLiveBuild) {
                // eslint-disable-next-line no-console
                console.warn(...args);
            }
        },
        error: (...args) => {
            if (!isLiveBuild) {
                // eslint-disable-next-line no-console
                console.error(...args);
            }
        }
    };
};
