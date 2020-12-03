import generateUid from '../generateUid';

/**
 * @typedef chaynsCallResult
 * @property {Object} addJSONParam
 * @property {string} callback
 * @property {Object} retval
 */
/**
 * chaynsCall
 * @param {Object} call
 * @param {number} call.action
 * @param {Object} [call.value=]
 * @param {string|function} [call.value.callback=]
 * @param {string} [call.value.addJSONParam=]
 * @returns {Promise<chaynsCallResult>}
 */
const chaynsCall = (call) => {
    const callbackName = `chaynsCallback_${generateUid().split('-').join('')}`;
    const { action, value = {} } = call;
    return new Promise((resolve) => {
        window[callbackName] = (v) => {
            if (chayns.utils.isFunction(value?.callback)) {
                value.callback(v);
            } else if (value?.callback
                && chayns.utils.isString(value?.callback)
                && /^window\./.test(value?.callback)
                && chayns.utils.isFunction(window[value?.callback?.replace('window.', '')])) {
                window[value?.callback?.replace('window.', '')](v);
            }
            resolve(v);
            if (!value?.callback) delete window[callbackName];
        };
        const config = {
            ...value,
            callback: `window.${callbackName}`
        };
        chayns.invokeCall(JSON.stringify({ action, value: config, }));
    });
};

export default chaynsCall;
