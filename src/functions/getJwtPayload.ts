/* eslint-disable no-bitwise */
/**
 * Decodes a utf 8 text
 *
 * @param utfText Utf encoded text
 * @returns Decoded Text
 */
function decodeUtf8(utfText: string) {
    let result = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;

    while (i < utfText.length) {
        c = utfText.charCodeAt(i);
        if (c < 128) {
            result += String.fromCharCode(c);
            i++;
        } else if (c > 191 && c < 224) {
            c1 = utfText.charCodeAt(i + 1);
            result += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        } else {
            c1 = utfText.charCodeAt(i + 1);
            c2 = utfText.charCodeAt(i + 2);
            result += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }

    return result;
}

/**
 * Returns the JWT payload as JSON.
 *
 * @param tobitAccessToken Tobit Access Token.
 * @returns {{} | *} Json object
 */
export default function getJwtPayload(tobitAccessToken: string | unknown): Record<string, unknown> | null {
    if (tobitAccessToken && typeof tobitAccessToken === 'string' && tobitAccessToken.length > 0) {
        const spl = tobitAccessToken.split('.');
        if (spl && spl.length === 3) {
            try {
                spl[1] = spl[1].replace(/-/g, '+').replace(/_/g, '/');
                return JSON.parse(decodeUtf8(atob(spl[1])));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}
