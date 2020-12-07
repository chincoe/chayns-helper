import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';


const alert = (message: string, options?: { title?: string }): DialogPromise<undefined> => new DialogPromise<undefined>((resolve: (value?: any) => any) => {
    chayns.dialog.alert(options?.title || '', message ?? '')
        .then((type: any) => {
            // @ts-ignore
            resolve(createDialogResult(type));
        });
});

export default alert;
