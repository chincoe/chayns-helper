/**
 * Open chayns site
 * @param {string} siteId
 * @param {int} tappId
 * @param {Object} jsonParam
 * @return {Promise<*>}
 */
const openChaynsSite = (siteId, tappId, jsonParam) => chayns.invokeCall({
    action: 137,
    value: {
        siteId,
        tappId,
        addJSONParam: jsonParam
    }
});

export default openChaynsSite;
