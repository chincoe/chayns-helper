import DateTimeChooseButton from './Components/Buttons/DateTimeChooseButton';
import UACGroupChooseButton from './Components/Buttons/UACGroupChooseButton';
import ChaynsEditor from './Components/ChaynsEditor/ChaynsEditor';
import CenteredButtonContainer from './Components/Containers/CenteredButtonContainer';
import CenteredContainer from './Components/Containers/CenteredContainer';
import CenteredWaitCursor from './Components/Containers/CenteredWaitCursor';
import DataRow from './Components/Containers/DataRow';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import RefreshComponent from './Components/Other/RefreshComponent';
import refresh from './Components/Other/Refresh';
import ResizableWaitCursor from './Components/Other/ResizableWaitCursor';
import SuspenseWaitCursor from './Components/Other/SuspenseWaitCursor';
import RestrictedAccordion from './Components/RestrictedAccordion/RestrictedAccordion';
import { setViewMode, hideCWFooter } from './Functions/chaynsCalls';
import {
    hexToRgb,
    getChaynsColor,
    getChaynsColorRgb,
    mixChaynsColorRgb,
    borderColorClass,
    backgroundColorClass,
    colorClass
} from './Functions/chaynsColors';
import copyOnClick from './Functions/copy';
import defaultErrorHandler from './Functions/defaultErrorHandler';
import httpRequest, { RequestError, handleRequest } from './Functions/httpRequest';
import showSuccessAnimation from './Functions/showSuccessAnimation';
import {
    time, removeTimeZoneOffset, simpleTimeFormat, formatDate, formatDateText, fnsFormat
} from './Functions/timeHelper';
import types, {
    safeValue,
    hasKey,
    forEachKey,
    mapObjectToArray,
    mapObject,
    reduceObject,
    isNullOrEmpty,
    extend,
    replaceAll,
    replaceEmpty
} from './Functions/types';
import { showWaitCursor } from './Functions/waitCursor';
import useTimeoutState from './Hooks/Uniques/useTimeoutState';
import useUniqueTimeout from './Hooks/Uniques/useUniqueTimeout';
import useUniqueEventListener from './Hooks/Uniques/useUniqueEventListener';
import useUniqueInterval from './Hooks/Uniques/useUniqueInterval';
import useElementProps, { removeCustomProps } from './Hooks/useElementProps';
import useFullscreenTapp from './Hooks/useFullscreenTapp';
import useFunctionState from './Hooks/useFunctionState';
import useRefresh from './Hooks/useRefresh';
import useWebsocketService from './Hooks/useWebsocketService';
import localStorage from './Other/localStorageHelper';
import WebsocketClient from './Other/webSocketClient';
import { rtkThunkCase } from './Redux/rtkThunkCase';
import useActions from './Redux/useActions';
import useComplexSelector from './Redux/useComplexSelector';
import useShallowSelector from './Redux/useShallowSelector';
import TextStringMemo, {
    useTextStrings, getTextStrings, getAllTextStrings, TextStringComplex
} from './TextString/TextStringMemo';
import { initChaynsHelper } from './chaynsHelperConfig';

export {
    DateTimeChooseButton,
    UACGroupChooseButton,
    ChaynsEditor,
    CenteredButtonContainer,
    CenteredContainer,
    CenteredWaitCursor,
    DataRow,
    ErrorBoundary,
    RefreshComponent,
    refresh,
    ResizableWaitCursor,
    SuspenseWaitCursor,
    RestrictedAccordion,
    setViewMode,
    hideCWFooter,
    hexToRgb,
    getChaynsColor,
    getChaynsColorRgb,
    mixChaynsColorRgb,
    borderColorClass,
    backgroundColorClass,
    colorClass,
    copyOnClick,
    defaultErrorHandler,
    httpRequest,
    handleRequest,
    RequestError,
    showSuccessAnimation,
    time,
    removeTimeZoneOffset,
    simpleTimeFormat,
    formatDateText,
    formatDate,
    fnsFormat,
    types,
    showWaitCursor,
    useTimeoutState,
    useUniqueTimeout,
    useUniqueEventListener,
    useUniqueInterval,
    useElementProps,
    removeCustomProps,
    useFullscreenTapp,
    useFunctionState,
    useRefresh,
    useWebsocketService,
    localStorage,
    WebsocketClient,
    rtkThunkCase,
    useActions,
    useComplexSelector,
    useShallowSelector,
    TextStringMemo,
    useTextStrings,
    getTextStrings,
    getAllTextStrings,
    TextStringComplex,
    initChaynsHelper,
    safeValue,
    hasKey,
    forEachKey,
    mapObjectToArray,
    mapObject,
    reduceObject,
    isNullOrEmpty,
    extend,
    replaceAll,
    replaceEmpty
}

// exports.DateTimeChooseButton = DateTimeChooseButton;
// exports.UACGroupChooseButton = UACGroupChooseButton;
// exports.ChaynsEditor = ChaynsEditor;
// exports.CenteredButtonContainer = CenteredButtonContainer;
// exports.CenteredContainer = CenteredContainer;
// exports.CenteredWaitCursor = CenteredWaitCursor;
// exports.DataRow = DataRow;
// exports.ErrorBoundary = ErrorBoundary;
// exports.RefreshComponent = RefreshComponent;
// exports.refresh = refresh;
// exports.ResizableWaitCursor = ResizableWaitCursor;
// exports.SuspenseWaitCursor = SuspenseWaitCursor;
// exports.RestrictedAccordion = RestrictedAccordion;
// exports.setViewMode = setViewMode;
// exports.hideCWFooter = hideCWFooter;
// exports.hexToRgb = hexToRgb;
// exports.getChaynsColor = getChaynsColor;
// exports.getChaynsColorRgb = getChaynsColorRgb;
// exports.mixChaynsColorRgb = mixChaynsColorRgb;
// exports.borderColorClass = borderColorClass;
// exports.backgroundColorClass = backgroundColorClass;
// exports.colorClass = colorClass;
// exports.copyOnClick = copyOnClick;
// exports.defaultErrorHandler = defaultErrorHandler;
// exports.httpRequest = httpRequest;
// exports.handleRequest = handleRequest;
// exports.RequestError = RequestError;
// exports.showSuccessAnimation = showSuccessAnimation;
// exports.time = time;
// exports.removeTimeZoneOffset = removeTimeZoneOffset;
// exports.simpleTimeFormat = simpleTimeFormat;
// exports.formatDateText = formatDateText;
// exports.formatDate = formatDate;
// exports.fnsFormat = fnsFormat;
// exports.types = types;
// exports.showWaitCursor = showWaitCursor;
// exports.useTimeoutState = useTimeoutState;
// exports.useUniqueTimeout = useUniqueTimeout;
// exports.useUniqueEventListener = useUniqueEventListener;
// exports.useUniqueInterval = useUniqueInterval;
// exports.useElementProps = useElementProps;
// exports.removeCustomProps = removeCustomProps;
// exports.useFullscreenTapp = useFullscreenTapp;
// exports.useFunctionState = useFunctionState;
// exports.useRefresh = useRefresh;
// exports.useWebsocketService = useWebsocketService;
// exports.localStorage = localStorage;
// exports.WebsocketClient = WebsocketClient;
// exports.rtkThunkCase = rtkThunkCase;
// exports.useActions = useActions;
// exports.useComplexSelector = useComplexSelector;
// exports.useShallowSelector = useShallowSelector;
// exports.TextStringMemo = TextStringMemo;
// exports.useTextStrings = useTextStrings;
// exports.getTextStrings = getTextStrings;
// exports.getAllTextStrings = getAllTextStrings;
// exports.TextStringComplex = TextStringComplex;
// exports.initChaynsHelper = initChaynsHelper;
// exports.safeValue = safeValue;
// exports.hasKey = hasKey;
// exports.forEachKey = forEachKey;
// exports.mapObjectToArray = mapObjectToArray;
// exports.mapObject = mapObject;
// exports.reduceObject = reduceObject;
// exports.isNullOrEmpty = isNullOrEmpty;
// exports.extend = extend;
// exports.replaceAll = replaceAll;
// exports.replaceEmpty = replaceEmpty;
