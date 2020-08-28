import generateUid from './generateUid';
import types from './types';
/**
 * Set the viewMode of a tapp (normal, exclusive, wide)
 * @param {boolean} exclusive
 * @param {boolean} [tryUltrawide=false]
 * @return {*}
 */
export const setViewMode = (exclusive, tryUltrawide = false) => {
    let viewMode = tryUltrawide ? 4 : (exclusive ? 2 : 0);
    if (tryUltrawide && !chayns.env.site.disposition.contentWide) {
        // eslint-disable-next-line no-console
        console.warn('[SetViewMode] Cannot use wide view on this layout. Layout with wide content required');
        viewMode = 2;
    }
    return chayns.invokeCall({
        action: 101,
        value: {
            tappId: chayns.env.site.tapp.id,
            viewMode,
        },
    });
};

/**
 * Hide the Tapp's footer
 * @return {*}
 */
export const hideCWFooter = () => chayns.invokeCall({
    action: 238,
    value: { hide: true }
});

/**
 * Open chayns site
 * @param {string} siteId
 * @param {int} tappId
 * @param {Object} jsonParam
 * @return {Promise<*>}
 */
export const openChaynsSite = (siteId, tappId, jsonParam) => chayns.invokeCall({
    action: 137,
    value: {
        siteId,
        tappId,
        addJSONParam: jsonParam
    }
});

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
 * @param {string} [call.value.callback=]
 * @param {string} [call.value.addJSONParam=]
 * @returns {Promise<chaynsCallResult>}
 */
const chaynsCall = (call) => {
    const callbackName = `chaynsCallback_${generateUid().split('-').join('')}`;
    const { action, value = {} } = call;
    return new Promise((resolve) => {
        window[callbackName] = (v) => {
            if (types.isFunction(value?.callback)) {
                value.callback(v);
            } else if (value?.callback
                && types.isString(value?.callback)
                && /^window\./.test(value?.callback)
                && types.isFunction(window[value?.callback?.replace('window.', '')])) {
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
