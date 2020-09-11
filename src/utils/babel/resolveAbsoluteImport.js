module.exports = function resolveAbsoluteImport(importName) {
    const values = {
        initChaynsHelper: 'config/chaynsHelperConfig.js',
        UACGroupChooseButton: 'components/buttons/UACGroupChooseButton',
        CenteredContainer: 'components/containers/CenteredContainer',
        CenteredWaitCursor: 'components/wait-cursor/CenteredWaitCursor',
        DataRow: 'components/containers/DataRow',
        ErrorBoundary: 'components/error-boundary/ErrorBoundary',
        refresh: 'components/other/refresh',
        Refresh: 'components/other/RefreshComponent',
        ResizableWaitCursor: 'components/wait-cursor/ResizableWaitCursor',
        SuspenseWaitCursor: 'components/wait-cursor/SuspenseWaitCursor',
        RestrictedAccordion: 'components/restricted-accordion/RestrictedAccordion',
        hideCwFooter: 'functions/chaynsCalls/hideCwFooter',
        setViewMode: 'functions/chaynsCalls/setViewMode',
        chaynsCall: 'functions/chaynsCalls/chaynsCalls',
        colors: 'functions/chaynsColors',
        chaynsDialog: 'functions/chaynsDialogs',
        copyToClipboard: 'functions/copy',
        defaultErrorHandler: 'functions/defaultErrorHandler',
        generateUUID: 'functions/generateUid',
        request: 'functions/httpRequest',
        statusAnimations: 'constants/statusAnimations',
        fnsFormat: 'functions/timeHelper/fnsFormat',
        time: 'constants/time',
        roundDate: 'functions/timeHelper/roundDate',
        types: 'functions/types',
        extend: 'functions/extend',
        showWaitCursor: 'functions/waitCursor',
        useTimeoutState: 'hooks/uniques/useTimeoutState',
        useUniqueEventListener: 'hooks/uniques/useUniqueEventListener',
        useUniqueInterval: 'hooks/uniques/useUniqueInterval',
        useUniqueTimeout: 'hooks/uniques/useUniqueTimeout',
        useFullscreenTapp: 'hooks/useFullscreenTapp',
        userUser: 'hooks/useUser',
        useWebsocketService: 'hooks/useWebsocketService',
        localStorage: 'other/localStorageHelper',
        WebsocketClient: 'other/WsClient',
        TextStringMemo: 'textstring/TextStringMemo',
        useTextStrings: 'textstring/useTextStrings',
        getTextStrings: 'textstring/getTextStrings',
        getHookState: 'functions/getHookState',
        shallowEqual: 'functions/shallowEqual',
        useShallowSelector: 'hooks/useShallowSelector',
        generateAxis: 'functions/recharts/generateAxis',
        useAxis: 'functions/recharts/useAxis'
    };

    if (!values[importName]) {
        throw new Error(`Unable to resolve ${importName} from chayns-helper. Please check the spelling. 
        If it's not wrong please create an issue (https://github.com/chincoe/chayns-helper/issues).`);
    }

    return `chayns-helper/lib/${values[importName]}`;
};
