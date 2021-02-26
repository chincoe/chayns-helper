export const regexRegex = /^\/((.[^/]+)|(\\\/))*?[^/]+\/[gmi]{0,3}$/;
const fullMatchRegex = /(^\^)|(\$$)/g;

/**
 * Turn a string into a regex.
 * Will recognize a stringified regex (e.g. "/..../g")
 */
const stringToRegex = (str: string, fullMatch: boolean = false): RegExp => stringToRegexBase(str, false, fullMatch);
/**
 * Turn a stringified regex (e.g. "/..../g") into a regex.
 * Returns a regex that matches nothing if it's not a stringified regex
 */
export const stringToRegexStrict = (str: string, fullMatch: boolean = false): RegExp =>
    stringToRegexBase(str, true, fullMatch);

const stringToRegexBase = (str: string, strict: boolean, fullMatch: boolean = false): RegExp => {
    if (!regexRegex.test(str)) {
        return strict ? /a^/ : new RegExp(fullMatch ? `^${str.replace(fullMatchRegex, '')}$` : str);
    }
    const arr = str.toString().split('/');
    const regStr = arr.slice(1, arr.length - 1).join('/');
    return new RegExp(fullMatch ? `^${regStr.replace(fullMatchRegex, '')}$` : regStr, arr[arr.length - 1]);
}

export default stringToRegex;
