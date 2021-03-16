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
): Promise<any> => {
    const {
        prefix = '',
        libName = ''
    } = config || {};
    TEXTSTRING_CONFIG.prefix = prefix;
    TEXTSTRING_CONFIG.libName = libName;
    const defaultLang = chayns.env.parameters.translang ||
                        chayns.env.site.translang ||
                        chayns.env.language ||
                        navigator.language ||
                        'de';
    const promises = [];
    if (libName) {
        try {
            promises.push(TextString.loadLibrary(
                libName,
                'langRes',
                defaultLang
            ));
        } catch (e) {
            console.warn(
                ...colorLog.gray('[TextStringInit]'),
                `Failed to load TextString library '${libName}' for language '${defaultLang}'`, e
            );
        }
        if (Array.isArray(languages)) {
            for (let i = 0; i < languages.length; ++i) {
                try {
                    promises.push(TextString.loadLibrary(
                        libName,
                        'langRes',
                        languages[i]
                    ));
                } catch (e) {
                    console.warn(
                        ...colorLog.gray('[TextStringInit]'),
                        `Failed to load TextString library '${libName}' for language '${languages[i]}'`, e
                    );
                }
            }
        }
    }
    return Promise.all(promises).catch((e) => {
        console.warn(...colorLog.gray('[TextStringInit]'), `Failed to load TextString library '${libName}'`, e);
    })
};

export default TEXTSTRING_CONFIG;
