import statusAnimations from '../../constants/statusAnimations';
import colorLog from '../../utils/colorLog';
import DialogPromise from './DialogPromise';
import { createDialogResult, DialogButton } from './utils';

export const dialogStatusType = {
    ERROR: 'ERROR',
    WARNING: 'WARNING',
    SUCCESS: 'SUCCESS'
};

export const dialogType = {
    ALERT: 'alert',
    CONFIRM: 'confirm'
};

const statusDialog = (
    statusType: 'ERROR' | 'WARNING' | 'SUCCESS',
    options: {
        message?: string,
        dialog?: 'alert' | 'confirm',
        buttons?: Array<DialogButton>
    } = {}
): DialogPromise<undefined> => new DialogPromise<undefined>((resolve) => {
    let { dialog = dialogType.ALERT } = options;
    const {
        message = '',
        buttons = null
    } = options;
    const dialogHtml = statusAnimations[statusType].replace(
        '<div class="chayns-helper__animation-info"/>',
        `<div>${(message || '').trim()}</div>`
    );

    // @ts-expect-error access to chayns.dialog this way is viable and necessary
    if (typeof chayns.dialog[dialog] !== 'function') {
        // eslint-disable-next-line no-console
        console.warn(
            ...colorLog.gray('[statusDialog]'),
            `${dialog} isn't a valid dialog type. Using ${buttons ? dialogType.CONFIRM : dialogType.ALERT} as fallback.`
        );
        dialog = buttons ? dialogType.CONFIRM : dialogType.ALERT;
    }

    // @ts-expect-error access to chayns.dialog this way is viable and necessary
    chayns.dialog[dialog]('', dialogHtml, buttons || undefined)
        .then((buttonType: number) => {
            resolve(createDialogResult(buttonType));
        });
});

export default statusDialog;
