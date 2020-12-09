import DialogPromise from '../DialogPromise';
import {createDialogResult, DialogButton} from '../utils';

export const enum selectType {
    DEFAULT = 0,
    ICON = 1
}

export interface SelectDialogListItem {
    name: string;
    value: string | number | object;
    backgroundColor?: string;
    className?: string;
    url?: string;
    isSelected?: boolean;
}

export interface SelectDialogResult {
    name: string;
    value: string | number | object;
}

export interface SelectDialogConfig {
    list: SelectDialogListItem[];
    message?: string;
    title?: string;
    multiselect?: boolean;
    quickfind?: boolean;
    type?: typeof selectType|number;
    preventCloseOnClick?: boolean;
    selectAllButton?: string;
}

export default function select(options: SelectDialogConfig, buttons?: DialogButton[]): DialogPromise<SelectDialogResult | SelectDialogResult[]> {
    return new DialogPromise<SelectDialogResult | SelectDialogResult[]>((resolve) => {
        const {
            message = '',
            title = '',
            list,
            multiselect = false,
            quickfind = null,
            preventCloseOnClick = false,
            type = selectType.DEFAULT,
            selectAllButton = undefined
        } = options || {};
        chayns.dialog.select({
            title,
            message,
            list,
            multiselect,
            quickfind: quickfind === null ? (list || []).length > 5 : quickfind,
            // @ts-ignore
            type,
            preventCloseOnClick,
            buttons,
            selectAllButton
        })
            .then((result: any) => {
                const {buttonType: bType, selection} = result;
                if (!multiselect && selection && selection?.length === 1) {
                    const {name, value} = selection[0];
                    resolve(createDialogResult(bType, {name, value}));
                } else if (!multiselect) {
                    resolve(createDialogResult(bType, null));
                }
                if (multiselect && selection && selection?.length > 0) {
                    resolve(createDialogResult(bType, selection));
                } else {
                    resolve(createDialogResult(bType, []));
                }
            });
    });
}
