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
        buttons?: Array<(DialogButton & { onClick?: () => any })>
    } = {}
) => new DialogPromise<undefined>((resolve) => {
    let { dialog = dialogType.ALERT } = options;
    const {
        message = '',
        buttons = null
    } = options;
    const dialogHtml = statusAnimations[statusType].replace(
        '<div class="chayns-helper__animation-info"/>',
        `<div>${(message || '').trim()}</div>`
    );

    if (typeof chayns.dialog[dialog] !== 'function') {
        console.warn(
            ...colorLog.gray('[statusDialog]'),
            `${dialog} is not a valid dialog type. Using ${buttons ? dialogType.CONFIRM : dialogType.ALERT} as fallback.`
        );
        dialog = buttons ? dialogType.CONFIRM : dialogType.ALERT
    }

    chayns.dialog[dialog]('', dialogHtml, buttons || undefined)
        .then((buttonType: number) => {
            if (buttons) {
                buttons.find(e => e.buttonType === buttonType && typeof e.onClick === 'function' && e.onClick());
            }
            resolve(createDialogResult(buttonType));
        });
});

export default statusDialog;
