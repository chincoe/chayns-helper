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
 * Collection of improved versions of chayns dialogs and their enums
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
    buttonType: ButtonType,
    inputType,
    selectType,
    textBlockPosition,
    dateType,
    dateSelectType
};

export default chaynsDialog;
