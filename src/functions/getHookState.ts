/**
 * Gets the current state of a hook based on the setter
 * @param {function} setter
 * @returns {Promise<*>}
 */
const getHookState = (setter) => new Promise((resolve) => {
    setter((state) => {
        resolve(state);
        return state;
    });
});

export default getHookState;
