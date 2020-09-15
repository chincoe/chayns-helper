const regexRegex = /^\/((.[^/]+)|(\\\/))*?[^/]+\/[gmi]{0,3}$/;
const fullMatchRegex = /(^\^)|(\$$)/g;

/**
 * Turn a string into a regex.
 * Will recognize a stringified regex (e.g. /..../g
 * @param {string} str
 * @param {boolean} [fullMatch=false]
 * @returns {RegExp}
 */
const stringToRegex = (str, fullMatch = false) => {
    if (!regexRegex.test(str)) {
        return new RegExp(fullMatch ? `^${str.replace(fullMatchRegex, '')}$` : str);
    }
    const arr = str.toString().split('/');
    const regStr = arr.slice(1, arr.length - 1).join('/');
    return new RegExp(fullMatch ? `^${regStr.replace(fullMatchRegex, '')}$` : regStr, arr[arr.length - 1]);
};

export default stringToRegex;
