import types from './types';

const createEnum = (input) => {
    const result = {};
    const keys = types.isArray(input) ? input : Object.keys(input);
    for (let i = 0; i < keys.length; i += 1) {
        result[keys[i]] = i;
    }
    return Object.freeze(result);
};

export default createEnum;
