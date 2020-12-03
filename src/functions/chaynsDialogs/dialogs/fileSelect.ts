import DialogPromise from '../DialogPromise';
import {createDialogResult, DialogButton} from '../utils';

/**
 * fileTypes
 * @type {{IMAGE: string, VIDEO: string, DOCUMENT: string[], AUDIO: string}}
 */
export const fileType = {
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    DOCUMENT: [
        'application/x-latex',
        'application/x-tex',
        'text/',
        'application/json',
        'application/pdf',
        'application/msword',
        'application/msexcel',
        'application/mspowerpoint',
        'application/vnd.ms-word',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument',
        'application/vnd.oasis.opendocument'
    ]
};

/**
 * Upload and select a file from chayns space
 * @param {Object} [options={}]
 * @param {string} [options.title]
 * @param {string} [options.message]
 * @param {boolean} [options.multiselect]
 * @param {fileType[]} [options.contentType]
 * @param {fileType[]} [options.exclude]
 * @param {boolean} [options.directory]
 * @param {button[]} [buttons]
 */

export interface FileSelectDialogConfig {
    title?: string;
    message?: string;
    multiselect?: boolean;
    contentType?: string[];
    exclude?: string[];
    directory?: boolean;
}

export default function fileSelect(
    options?: FileSelectDialogConfig, buttons?: DialogButton[]
): DialogPromise<any|File> {
    return new DialogPromise<any|File>((resolve) => {
        const {
            title = '',
            message = '',
            multiselect = false,
            contentType = [],
            exclude = [],
            directory = false
        } = options || {};
        chayns.dialog.fileSelect({
            title,
            message,
            multiselect,
            buttons,
            contentType,
            exclude,
            directory
        })
            .then((result) => {
                // @ts-ignore
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}
