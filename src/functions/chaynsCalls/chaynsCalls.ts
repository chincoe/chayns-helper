import generateUid from '../generateUid';

export interface ChaynsCall {
    action: number;
    value?: {
        callback?: string | ((param?: any) => any);
        addJSONParam?: string
    }
}

const chaynsCall = (call: ChaynsCall): Promise<{
    addJSONParam: object;
    callback: string;
    retval: object
}> => {
    const callbackName: string = `chaynsCallback_${generateUid().split('-').join('')}`;
    const {action, value = {}} = call;
    return new Promise((resolve) => {
        // @ts-expect-error
        window[callbackName] = (v: any) => {
            if (chayns.utils.isFunction(value?.callback)) {
                // @ts-expect-error
                value.callback(v);
            } else if (value?.callback
                && chayns.utils.isString(value?.callback)
                // @ts-expect-error
                && /^window\./.test(value?.callback)
                // @ts-expect-error
                && chayns.utils.isFunction(window[value?.callback?.replace('window.', '')])) {
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
        chayns.invokeCall(JSON.stringify({action, value: config,}));
    });
};

export default chaynsCall;
