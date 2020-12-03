import DialogPromise from '../DialogPromise';
import {createDialogResult, DialogButton} from '../utils';

const confirm = (message: string, options?: { title?: string }, buttons?: DialogButton[]): DialogPromise<undefined> => new DialogPromise<undefined>((resolve: (value?: any) => any) => {
    chayns.dialog.confirm(options?.title || '', message ?? '', buttons)
        .then((type) => {
            resolve(createDialogResult(type));
        });
});

export default confirm;
