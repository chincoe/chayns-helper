import DateTimeChooseButton from './components/buttons/DateTimeChooseButton';
import UACGroupChooseButton from './components/buttons/UACGroupChooseButton';
import ChaynsEditor from './components/chayns-editor/ChaynsEditor';
import CenteredButtonContainer from './components/containers/CenteredButtonContainer';
import CenteredContainer from './components/containers/CenteredContainer';
import CenteredWaitCursor from './components/containers/CenteredWaitCursor';
import DataRow from './components/containers/DataRow';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import RefreshComponent from './components/other/RefreshComponent';
import refresh from './components/other/Refresh';
import ResizableWaitCursor from './components/other/ResizableWaitCursor';
import SuspenseWaitCursor from './components/other/SuspenseWaitCursor';
import RestrictedAccordion from './components/restricted-accordion/RestrictedAccordion';
import { setViewMode, hideCWFooter } from './functions/chaynsCalls';
import {
    hexToRgb,
    getChaynsColor,
    getChaynsColorRgb,
    mixChaynsColorRgb,
    borderColorClass,
    backgroundColorClass,
    colorClass
} from './functions/chaynsColors';
import copyOnClick from './functions/copy';
import defaultErrorHandler from './functions/defaultErrorHandler';
import httpRequest, { RequestError, handleRequest } from './functions/httpRequest';
import showSuccessAnimation from './functions/showSuccessAnimation';
import {
    time, removeTimeZoneOffset, simpleTimeFormat, formatDate, formatDateText, fnsFormat
} from './functions/timeHelper';
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
} from './functions/types';
import { showWaitCursor } from './functions/waitCursor';
import useTimeoutState from './hooks/uniques/useTimeoutState';
import useUniqueTimeout from './hooks/uniques/useUniqueTimeout';
import useUniqueEventListener from './hooks/uniques/useUniqueEventListener';
import useUniqueInterval from './hooks/uniques/useUniqueInterval';
import useElementProps, { removeCustomProps } from './hooks/useElementProps';
import useFullscreenTapp from './hooks/useFullscreenTapp';
import useFunctionState from './hooks/useFunctionState';
import useRefresh from './hooks/useRefresh';
import useWebsocketService from './hooks/useWebsocketService';
import localStorage from './other/localStorageHelper';
import WebsocketClient from './other/webSocketClient';
import { rtkThunkCase } from './redux/rtkThunkCase';
import useActions from './redux/useActions';
import useComplexSelector from './redux/useComplexSelector';
import useShallowSelector from './redux/useShallowSelector';
import TextStringMemo, {
    useTextStrings, getTextStrings, getAllTextStrings, TextStringComplex
} from './textstring/TextStringMemo';
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
// exports.chayns-editor = chayns-editor;
// exports.CenteredButtonContainer = CenteredButtonContainer;
// exports.CenteredContainer = CenteredContainer;
// exports.CenteredWaitCursor = CenteredWaitCursor;
// exports.DataRow = DataRow;
// exports.error-boundary = error-boundary;
// exports.RefreshComponent = RefreshComponent;
// exports.refresh = refresh;
// exports.ResizableWaitCursor = ResizableWaitCursor;
// exports.SuspenseWaitCursor = SuspenseWaitCursor;
// exports.restricted-accordion = restricted-accordion;
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
