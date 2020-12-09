/* eslint-disable max-classes-per-file */
import {ButtonType} from './utils';
import advancedDate, {textBlockPosition, dateType, dateSelectType} from './dialogs/advancedDate';
import confirm from './dialogs/confirm';
import input, {inputType} from './dialogs/input';
import iFrame from './dialogs/iFrame';
import select, {selectType} from './dialogs/select';
import fileSelect, {fileType} from './dialogs/fileSelect';
import mediaSelect from './dialogs/mediaSelect';

/**
 * The dialogs of this helper all have the parameters (message, buttons), (message, options, buttons) or (option,
 * buttons) The dialogs of this helper all return an object like this: { buttonType: -1|0|1, value: ... }, so all
 * results will have the keys "buttonType" and "value" Custom handlers based on buttonType: ButtonType 1:
 * chaynsDialog.dialog().positive(value => ...) ButtonType 0: chaynsDialog.dialog().negative(value => ...) ButtonType
 * -1: chaynsDialog.dialog().cancel(value => ...)
 *
 * General: chaynsDialog.dialog().then(({ buttonType, value }) => ...)
 * or: const { buttonType, value } = await chaynsDialog.dialog();
 */
const chaynsDialog = {
    alert,
    confirm,
    input,
    iFrame,
    select,
    advancedDate,
    fileSelect,
    mediaSelect,
    fileType,
    // @ts-ignore
    buttonType: ButtonType,
    inputType,
    // @ts-ignore
    selectType,
    // @ts-ignore
    textBlockPosition,
    // @ts-ignore
    dateType,
    // @ts-ignore
    dateSelectType
};

export default chaynsDialog;
