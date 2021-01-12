const TEXTSTRING_CONFIG = {
    prefix: '',
    libName: ''
};

export interface TextStringInit {
    /**
     * Prefix for all textstring helpers. Not necessary if no textstring helpers are used.
     */
    prefix?: string;
    /**
     * LibName for the textstring helpers. Currently only required for the auto creation of text strings.
     */
    libName?: string;
}

export const initTextStrings = (config: TextStringInit) => {
    const {
        prefix = '',
        libName = ''
    } = config || {};
    TEXTSTRING_CONFIG.prefix = prefix;
    TEXTSTRING_CONFIG.libName = libName;
};

export default TEXTSTRING_CONFIG;
