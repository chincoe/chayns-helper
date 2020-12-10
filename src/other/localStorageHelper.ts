
/**
 * All storage keys. A set of data needs a key to be managed by this helper
 */
export const storageKeys: {[key: string]: string} = {};

/**
 * True: Cache is active
 * False: Never use cache
 * Disables cache in DEV and/or if the URL parameter "nocache" is present
 */
export const isStorageActive = ():boolean => !(process.env.NODE_ENV === 'development' || Object.prototype.hasOwnProperty.call(
    chayns.env.parameters,
    'nocache'
));
// const isStorageActive = () => true;

export const minutes = (t: number): number => t * 60 * 1000;

export const storageSettings: Array<{key: string, duration: number}> = [];

/**
 * Add a key to the storage
 */
export const addKey = (name: string, duration: number = 5): void => {
    storageSettings.push({
        key: name,
        duration: minutes(duration ?? 5)
    });
    storageKeys[name] = name;
};

/**
 * clear the cache for the given key.
 * If no key is provided, clear the cache for all keys
 */
export const clearStorage = (key: string|undefined = undefined): void => {
    if (key) {
        chayns.utils.ls.remove(key);
    } else {
        const keys = Object.keys(storageKeys);
        for (let i = 0; i < keys.length; i += 1) {
            chayns.utils.ls.remove(keys[i]);
        }
    }
};

interface CacheItem {data: any, timestamp: number}

/**
 * read data for the key from local storage
 */
export const getStorage = (key: string): null|any => {
    const cache: CacheItem = <CacheItem><unknown>chayns.utils.ls.get(key);
    if (isStorageActive()
        && cache
        && cache.data
        && cache.timestamp
        && storageSettings.find((c) => c.key === key)
        // @ts-expect-error
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
export const setStorage = (key: string, value: any) => {
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
