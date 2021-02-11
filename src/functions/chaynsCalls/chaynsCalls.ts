import generateUid from '../generateUid';

export interface ChaynsCall {
    action: number;
    value?: {
        callback?: string | ((param?: any) => any);
        addJSONParam?: string;
    }
}

/**
 * A wrapper that makes callback-based chayns calls promise based so they can be awaited
 */
const chaynsCall = (call: ChaynsCall): Promise<{
    addJSONParam: object;
    callback: string;
    retval: object
}> => {
    const callbackName: string = `chaynsCallback_${generateUid().split('-').join('')}`;
    const { action, value = {} } = call;
    return new Promise((resolve) => {
        // @ts-expect-error
        window[callbackName] = (v: any) => {
            if (typeof (value?.callback) === 'function') {
                value.callback(v);
            } else if (value?.callback
                       && typeof (value.callback) === 'string'
                       && /^window\./.test(value.callback)
                       // @ts-expect-error
                       && typeof (window[value.callback.replace('window.', '')]) === 'function'
            ) {
                // @ts-expect-error
                window[value?.callback?.replace('window.', '')](v);
            }
            resolve(v);
            // @ts-expect-error
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
