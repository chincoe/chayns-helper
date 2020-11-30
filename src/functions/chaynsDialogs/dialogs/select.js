import DialogPromise from '../DialogPromise';
import { createDialogResult } from '../utils';

/**
 * select dialog type
 * @type {{ICON: number, DEFAULT: number}}
 * @enum
 */
export const selectType = {
    DEFAULT: chayns.dialog.selectType.DEFAULT,
    ICON: chayns.dialog.selectType.ICON
};
/**
 * @typedef selectListItem
 * @property {string} name
 * @property {string|number|Object} value
 * @property {string} backgroundColor
 * @property {string} className - fontawesome icon classname for ICON type
 * @property {string} url - iconUrl for ICON type
 * @property {boolean} isSelected - is selected by default
 */
/**
 * @typedef selectDialogResultItem
 * @property {string} name
 * @property {string|number|Object} value
 */

/**
 * @typedef selectDialogResult
 * @property {buttonType} buttonType
 * @property {selectDialogResultItem|selectDialogResultItem[]|null} value
 */
/**
 * Select dialog. Returns an array of selections as value (with multiselect) or the selected object as value (without
 * multiselect)
 * @param {Object} [options]
 * @param {string} [options.message='']
 * @param {string} [options.title='']
 * @param {selectListItem[]} options.list
 * @param {boolean} [options.multiselect]
 * @param {boolean|null} [options.quickfind]
 * @param {selectType} [options.type] - one of chaynsDialog.selectType
 * @param {boolean} [options.preventCloseOnClick]
 * @param {?string} [options.selectAllButton] - add a checkbox with this prop as label that (de)selects all elements at
 *     once
 * @param {button[]} [buttons=undefined]
 *
 * @property {selectType} type
 *
 * @return {DialogPromise<dialogResult>}
 */
export default function select(options, buttons) {
    return new DialogPromise((resolve) => {
        const {
            message = '',
            title = '',
            list = null,
            multiselect = false,
            quickfind = null,
            preventCloseOnClick = false,
            type = selectType.DEFAULT,
            selectAllButton = null
        } = options || {};
        chayns.dialog.select({
            title,
            message,
            list,
            multiselect,
            quickfind: quickfind === null ? (list || []).length > 5 : quickfind,
            type,
            preventCloseOnClick,
            buttons,
            selectAllButton
        })
            .then((result) => {
                const { buttonType: bType, selection } = result;
                if (!multiselect && selection && selection?.length === 1) {
                    const { name, value } = selection[0];
                    resolve(createDialogResult(bType, { name, value }));
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

select.type = { ...selectType };
