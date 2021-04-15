// @ts-expect-error
import { TextString } from 'chayns-components';
import colorLog from '../utils/colorLog';

const TEXTSTRING_CONFIG = {
    prefix: '',
    libName: '',
    autoCreation: process.env.NODE_ENV === 'production'
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
    /**
     * Whether autoCreation is globally enabled or disabled
     */
    autoCreation?: boolean
}

/**
 * Set a global text string prefix and library name for all text string helpers
 * @param config
 * @param languages
 */
export const initTextStrings = async (
    config: TextStringInit,
    languages?: Array<string>
) => {
    const {
        prefix = '',
        libName = '',
        autoCreation = process.env.NODE_ENV === 'production'
    } = config || {};
    TEXTSTRING_CONFIG.prefix = prefix;
    TEXTSTRING_CONFIG.libName = libName;
    TEXTSTRING_CONFIG.autoCreation = autoCreation;
    const defaultLang = chayns.env.parameters.translang
                        || chayns.env.site.translang
                        || chayns.env.language
                        || navigator.language
                        || 'de';
    const promises = [];
    if (libName) {
        promises.push(TextString.loadLibrary(
            libName,
            'langRes',
            defaultLang
        ));

        if (Array.isArray(languages)) {
            for (let i = 0; i < languages.length; ++i) {
                promises.push(TextString.loadLibrary(
                    libName,
                    'langRes',
                    languages[i]
                ));
            }
        }
    }
    try {
        await Promise.all(promises);
    } catch (e) {
        console.warn(...colorLog.gray('[TextStringInit]'), `Failed to load TextString library '${libName}'`, e);
    }
};

export default TEXTSTRING_CONFIG;
