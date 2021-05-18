import { SelectDialogItem } from 'chayns-doc';
import DialogPromise from '../DialogPromise';
import { createDialogResult, DialogButton, DialogResult } from '../utils';

export enum selectType {
    DEFAULT = 0,
    ICON = 1
}

export interface SelectDialogListItem<T extends string | number | Record<string, unknown> | boolean> {
    name: string;
    value: T;
    backgroundColor?: string;
    className?: string;
    url?: string;
    isSelected?: boolean;
}

export interface SelectDialogResult<T extends string | number | Record<string, unknown> | boolean> {
    name: string;
    value: T;
}

export interface SelectDialogConfig<T extends string | number | Record<string, unknown> | boolean> {
    list: SelectDialogListItem<T>[];
    message?: string;
    title?: string;
    multiselect?: boolean;
    quickfind?: boolean;
    type?: selectType | number;
    preventCloseOnClick?: boolean;
    selectAllButton?: string;
}

/**
 * Improved chayns.dialog.select
 * @param options
 * @param buttons
 */
export default function select<T extends string | number | Record<string, unknown> | boolean>(
    options: SelectDialogConfig<T>,
    buttons?: DialogButton[]
): DialogPromise<SelectDialogResult<T> | SelectDialogResult<T>[] | null> {
    return new DialogPromise<SelectDialogResult<T> | SelectDialogResult<T>[] | null>((resolve) => {
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
            list: list as SelectDialogItem[],
            multiselect,
            quickfind: quickfind === null ? (list || []).length > 5 : quickfind,
            type,
            preventCloseOnClick,
            buttons,
            selectAllButton
        }).then((result: {
            buttonType: number,
            selection: Array<SelectDialogResult<string | number | Record<string, unknown> | boolean>>
        }) => {
            const { buttonType: bType, selection } = result;
            if (!multiselect && selection && selection?.length === 1) {
                const { name, value } = selection[0];
                resolve(createDialogResult(bType, { name, value }) as DialogResult<SelectDialogResult<T>>);
            } else if (!multiselect) {
                resolve(createDialogResult(bType, null) as DialogResult<null>);
            }
            if (multiselect && selection && selection?.length > 0) {
                resolve(createDialogResult(bType, selection) as DialogResult<SelectDialogResult<T>[]>);
            } else {
                resolve(createDialogResult(bType, []));
            }
        });
    });
}

select.type = { ...selectType };
