/**
 * All storage keys. A set of data needs a key to be managed by this helper
 * @type {{}}
 */
export const storageKeys = {};

/**
 * True: Cache is active
 * False: Never use cache
 * Disables cache in DEV and/or if the URL parameter "nocache" is present
 * @return {boolean}
 */
export const isStorageActive = () => !(__DEV__ || Object.prototype.hasOwnProperty.call(
    chayns.env.parameters,
    'nocache'
));
// const isStorageActive = () => true;

export const minutes = (t) => t * 60 * 1000;

export const storageSettings = [];

/**
 * Add a key to the storage
 * @param {string} name
 * @param {number} [duration=5] - maximum cache age in minutes
 */
export const addKey = (name, duration) => {
    storageSettings.push({
        key: name,
        duration: minutes(duration ?? 5)
    });
    storageKeys[name] = name;
};

/**
 * clear the cache for the given key.
 * If no key is provided, clear the cache for all keys
 * @param {string} [key=undefined]
 */
export const clearStorage = (key = undefined) => {
    if (key) {
        chayns.utils.ls.remove(key);
    } else {
        const keys = Object.keys(storageKeys);
        for (let i = 0; i < keys.length; i += 1) {
            chayns.utils.ls.remove(keys[i]);
        }
    }
};

/**
 * read data for the key from local storage
 * @param {string} key
 * @return {null|*}
 */
export const getStorage = (key) => {
    const cache = chayns.utils.ls.get(key);
    if (isStorageActive()
        && cache
        && cache.data
        && cache.timestamp
        && storageSettings.find((c) => c.key === key)
        && new Date().getTime() <= cache.timestamp + storageSettings.find((c) => c.key === key).duration) {
        return cache.data;
    }
    chayns.utils.ls.remove(key);
    return null;
};

/**
 * write data for the key to local storage
 * @param {string} key
 * @param {*} value
 */
export const setStorage = (key, value) => {
    chayns.utils.ls.set(key, {
        timestamp: new Date().getTime(),
        data: value
    });
};

const localStorage = {
    get: getStorage,
    clear: clearStorage,
    set: setStorage,
    add: addKey,
    keys: storageKeys,
    settings: storageSettings
};

export default localStorage;
