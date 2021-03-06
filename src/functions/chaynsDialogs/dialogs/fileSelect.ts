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

export type fileTypeType = (typeof fileType)[(keyof Omit<typeof fileType, 'DOCUMENT'>)]
    | (typeof fileType.DOCUMENT)[(keyof typeof fileType.DOCUMENT)] | string;

export interface FileSelectDialogConfig {
    title?: string;
    message?: string;
    multiselect?: boolean;
    contentType?: fileTypeType[];
    exclude?: fileTypeType[];
    directory?: boolean;
}

/**
 * Improved chayns.dialog.fileSelect
 * @param options
 * @param buttons
 */
export default function fileSelect(
    options?: FileSelectDialogConfig, buttons?: DialogButton[]
): DialogPromise<unknown | File> {
    return new DialogPromise<unknown | File>((resolve) => {
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
            contentType: contentType as string[],
            exclude: exclude as string[],
            directory
        })
            .then((result: { buttonType: number, selection: unknown }) => {
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}
