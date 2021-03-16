// @ts-expect-error
import { TextString } from 'chayns-components';
import colorLog from '../utils/colorLog';

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
    const defaultLang = chayns.env.parameters.translang ||
                        chayns.env.site.translang ||
                        chayns.env.language ||
                        navigator.language ||
                        'de';
    if (libName) {
        try {
            TextString.loadLibrary(
                libName,
                'langRes',
                defaultLang
            );
        } catch (e) {
            console.warn(
                ...colorLog.gray('[TextStringInit]'),
                `Failed to load TextString library '${libName}' for language '${defaultLang}'`
            );
        }
        if (Array.isArray(languages)) {
            for (let i = 0; i < languages.length; ++i) {
                try {
                    TextString.loadLibrary(
                        libName,
                        'langRes',
                        languages[i]
                    );
                } catch (e) {
                    console.warn(
                        ...colorLog.gray('[TextStringInit]'),
                        `Failed to load TextString library '${libName}' for language '${languages[i]}'`
                    );
                }
            }
        }
    }
    TEXTSTRING_CONFIG.prefix = prefix;
    TEXTSTRING_CONFIG.libName = libName;
};

export default TEXTSTRING_CONFIG;
