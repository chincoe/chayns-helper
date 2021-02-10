/**
 * Decodes a utf 8 text
 *
 * @param {string} utfText Utf encoded text
 * @returns {string} Decoded Text
 */
function decodeUtf8(utfText: string) {
    let result = '',
        i = 0, c = 0, c1 = 0, c2 = 0;

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
 * @param {string} tobitAccessToken Tobit Access Token.
 * @returns {{} | *} Json object
 */
export default function getJwtPayload(tobitAccessToken: string) {
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
