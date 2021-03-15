// @ts-expect-error
import { TextString } from 'chayns-components';

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

/**
 * Set a global text string prefix and library name for all text string helpers
 * @param config
 * @param languages
 */
export const initTextStrings = (
    config: TextStringInit,
    languages?: Array<string>
) => {
    const {
        prefix = '',
        libName = ''
    } = config || {};
    if (libName) {
        TextString.loadLibrary(
            libName,
            'langRes',
            chayns.env.parameters.translang ||
            chayns.env.site.translang ||
            chayns.env.language ||
            navigator.language ||
            'de'
        );
        if (Array.isArray(languages)) {
            for (let i = 0; i < languages.length; ++i) {
                TextString.loadLibrary(
                    libName,
                    'langRes',
                    languages[i]
                );
            }
        }
    }
    TEXTSTRING_CONFIG.prefix = prefix;
    TEXTSTRING_CONFIG.libName = libName;
};

export default TEXTSTRING_CONFIG;
