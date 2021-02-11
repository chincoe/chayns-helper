import DialogPromise from '../DialogPromise';
import { createDialogResult, DialogButton } from '../utils';

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

export interface FileSelectDialogConfig {
    title?: string;
    message?: string;
    multiselect?: boolean;
    contentType?: string[];
    exclude?: string[];
    directory?: boolean;
}

/**
 * Improved chayns.dialog.fileSelect
 * @param options
 * @param buttons
 */
export default function fileSelect(
    options?: FileSelectDialogConfig, buttons?: DialogButton[]
): DialogPromise<any | File> {
    return new DialogPromise<any | File>((resolve) => {
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
            .then((result: any) => {
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}
