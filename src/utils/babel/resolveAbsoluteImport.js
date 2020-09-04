module.exports = function resolveAbsoluteImport(importName) {
    const values = {
        initChaynsHelper: 'config/chaynsHelperConfig.js',
        DateTimeChooseButton: 'components/buttons/DateTimeChooseButton',
        UACGroupChooseButton: 'components/buttons/UACGroupChooseButton',
        ChaynsEditor: 'components/chayns-editor/ChaynsEditor',
        CenteredButtonContainer: 'components/containers/CenteredButtonContainer',
        CenteredContainer: 'components/containers/CenteredContainer',
        CenteredWaitCursor: 'components/containers/CenteredWaitCursor',
        DataRow: 'components/containers/DataRow',
        ErrorBoundary: 'components/error-boundary/ErrorBoundary',
        refresh: 'components/other/Refresh',
        RefreshComponent: 'components/other/RefreshComponent',
        ResizableWaitCursor: 'components/other/ResizableWaitCursor',
        SuspenseWaitCursor: 'components/other/SuspenseWaitCursor',
        RestrictedAccordion: 'components/restricted-accordion/RestrictedAccordion',
        hideCwFooter: 'functions/chaynsCalls/hideCwFooter',
        setViewMode: 'functions/chaynsCalls/setViewMode',
        chaynsCall: 'functions/chaynsCalls/chaynsCalls',
        colors: 'functions/chaynsColors',
        chaynsDialog: 'functions/chaynsDialogs',
        copyOnClick: 'functions/copy',
        defaultErrorHandler: 'config/default-error-handler',
        generateUUID: 'functions/generateUid',
        request: 'functions/httpRequest',
        showFailureAnimation: 'functions/statusAnimations/showSuccessAnimation',
        showSuccessAnimation: 'functions/statusAnimations/showFailureAnimation',
        timeHelper: 'functions/timeHelper',
        types: 'functions/types',
        extend: 'functions/extend',
        showWaitCursor: 'functions/waitCursor',
        useTimeoutState: 'hooks/uniques/useTimeoutState',
        useUniqueEventListener: 'hooks/uniques/useUniqueEventListener',
        useUniqueInterval: 'hooks/uniques/useUniqueInterval',
        useUniqueTimeout: 'hooks/uniques/useUniqueTimeout',
        useFullscreenTapp: 'hooks/useFullscreenTapp',
        useFunctionState: 'hooks/useFunctionState',
        useRefresh: 'hooks/useRefresh',
        userUser: 'hooks/useUser',
        useWebsocketService: 'hooks/useWebsocketService',
        localStorage: 'other/localStorageHelper',
        WebsocketClient: 'other/WsClient',
        TextStringMemo: 'textstring/TextStringMemo',
        TextStringComplex: 'textstring/TextStringComplex',
        useTextStrings: 'textstring/useTextStrings',
        getTextStrings: 'textstring/getTextStrings',
        AsyncPromise: 'functions/AsyncPromise',
        createEnum: 'functions/createEnum',
        getHookState: 'functions/getHookState',
        shallowEqual: 'functions/shallowEqual'
    };

    if (!values[importName]) {
        throw new Error(`Unable to resolve ${importName} from chayns-helper. Please check the spelling. If it's not wrong please create an issue (https://github.com/chincoe/chayns-helper/issues).`);
    }

    return `chayns-helper/lib/${values[importName]}`;
};
