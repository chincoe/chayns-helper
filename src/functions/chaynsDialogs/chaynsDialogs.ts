/* eslint-disable max-classes-per-file */
import { ButtonType } from './utils';
import advancedDate, { dateSelectType, dateType, textBlockPosition } from './dialogs/advancedDate';
import confirm from './dialogs/confirm';
import input, { inputType } from './dialogs/input';
import iFrame from './dialogs/iFrame';
import select, { selectType } from './dialogs/select';
import fileSelect, { fileType } from './dialogs/fileSelect';
import mediaSelect from './dialogs/mediaSelect';
import alertDialog from './dialogs/alert';
import status, { dialogStatusType } from './statusDialog';

/**
 * Collection of improved versions of chayns dialogs and their enums
 */
const chaynsDialog = {
    alert: alertDialog,
    confirm,
    input,
    iFrame,
    select,
    advancedDate,
    fileSelect,
    mediaSelect,
    status,
    fileType,
    buttonType: ButtonType,
    inputType,
    selectType,
    textBlockPosition,
    dateType,
    dateSelectType,
    statusType: dialogStatusType
};

export default chaynsDialog;
