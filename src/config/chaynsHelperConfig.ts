// eslint-disable-next-line import/no-cycle
import TEXTSTRING_PREFIX from '../textstring/textstringPrefix';
import RequestError from "../functions/httpRequest/RequestError";
import ChaynsError from "../functions/httpRequest/ChaynsError";

export interface ChaynsHelperConfig {
    errorHandler: (err: Error | RequestError | ChaynsError, statusCode?: number, resolve?: (value?: any) => any, reject?: (value?: any) => any) => any
}

export const helperConfig: ChaynsHelperConfig = {
    errorHandler: console.error
};

export interface ChaynsHelperInit {
    textStringPrefix?: string;
    requestErrorHandler?: (err: Error | RequestError | ChaynsError, statusCode?: number, resolve?: (value?: any) => any, reject?: (value?: any) => any) => any;
}

const initChaynsHelper = (config: ChaynsHelperInit) => {
    const {
        textStringPrefix = '',
        requestErrorHandler = console.error
    } = config || {};
    TEXTSTRING_PREFIX.value = textStringPrefix;
    helperConfig.errorHandler = requestErrorHandler;
};

export default initChaynsHelper;
