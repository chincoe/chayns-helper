import DialogPromise from '../DialogPromise';
import {createDialogResult, DialogButton} from '../utils';

export interface MediaSelectDialogConfig {
    title?: string;
    message?: string;
    multiselect?: boolean;
}

export default function mediaSelect(options?: MediaSelectDialogConfig, buttons?: DialogButton[]) {
    return new DialogPromise<File|any>((resolve) => {
        const {
            title = '',
            message = '',
            multiselect = false
        } = options || {};
        chayns.dialog.mediaSelect({
            title,
            message,
            multiSelect: multiselect,
            buttons
        })
            .then((result) => {
                // @ts-ignore
                resolve(createDialogResult(result?.buttonType, result?.selection));
            });
    });
}
