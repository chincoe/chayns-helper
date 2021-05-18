import React, {
    Reducer,
    ReducerStateWithoutAction,
    ReducerWithoutAction,
    SetStateAction, useEffect, useReducer, useState
} from 'react';
import hideCwFooter from '../functions/chaynsCalls/hideCwFooter';
import setViewMode, { ViewMode } from '../functions/chaynsCalls/setViewMode';
import shallowEqual from '../functions/shallowEqual';
import getHookState from '../functions/getHookState';
import { isPagemakerIFrame } from '../functions/isPagemakerIFrame';
import colorLog from '../utils/colorLog';
import enableBodyScroll from '../functions/chaynsCalls/enableBodyScroll';

/**
 * Reducer to update the windowData state
 */
const windowDataReducer: Reducer<WindowMetrics, { data: WindowMetrics, type: 'compare' | 'force' }> = (
    state: WindowMetrics,
    action: {
        data: WindowMetrics,
        type: 'compare' | 'force'
    }
): WindowMetrics => {
    if (!action) return state;
    const { data } = action;
    if (action.type === 'compare') {
        if (!state) return data;
        if (!data) return state;
        if (shallowEqual(data, state)) {
            return state;
        }
        return data;
    }
    if (action.type === 'force') {
        return data;
    }
    return state;
};

/**
 * Correct window data for edge cases like location apps and chayns runtime
 */
const correctWindowData = (
    data: WindowMetricsRaw
): WindowMetricsRaw | { pageYOffset: number, windowHeight: number, frameY?: number } | unknown => {
    if (!data) return data;
    return {
        ...data,
        windowHeight: data.windowHeight ?? window.innerHeight,
        frameY: data.frameY ?? (chayns.env.isChaynsnetRuntime ? 0 : 45),
        pageYOffset: data.pageYOffset ?? 0,
    };
};

const setStyles = (element: HTMLElement, style: Partial<CSSStyleDeclaration> & Record<string, string>) => {
    const keys = Object.keys(style);
    for (let i = 0; i < keys.length; ++i) {
        // eslint-disable-next-line no-param-reassign
        (element.style as unknown as Record<string, string>)[keys[i]] = style[keys[i]];
    }
};

export interface WindowMetricsRaw {
    pageYOffset?: number,
    windowHeight: number,
    frameX?: number,
    frameY?: number,
    scrollTop: number,
    height: number
}

export interface WindowMetrics {
    pageYOffset: number,
    windowHeight: number,
    frameX: number,
    frameY: number,
    scrollTop: number,
    height: number
}

export interface FullscreenTappConfig {
    viewMode?: ViewMode;
    disableBodyScrolling?: boolean;
    style?: Partial<CSSStyleDeclaration> & Record<string, string>;
}

/**
 * Hook to maintain a fullscreen tapp without scrolling, title image and footer. Does not work in pagemaker iframes
 * @param initialValue - fullscreen initially active or not, default: true
 * @param config
 * @returns [windowData, isFullscreenActive, setIsFullscreenActive]
 */
const useFullscreenTapp = (
    initialValue = true,
    config?: FullscreenTappConfig & {
        rootElement?: string | '.tapp';
        active?: FullscreenTappConfig,
        inactive?: FullscreenTappConfig
    }
): [WindowMetrics, boolean, React.Dispatch<SetStateAction<boolean>>] => {
    const {
        active,
        inactive,
        style,
        rootElement = '.tapp'
    } = config || {};
    const [isFullscreenActive, setIsFullscreenActive] = useState(initialValue ?? true);
    const {
        viewMode = ViewMode.Exclusive,
        disableBodyScrolling: disableScrolling,
    } = { ...(config || {}), ...((isFullscreenActive ? active : inactive) || {}) };
    const [windowData, setWindowData] = useReducer(windowDataReducer, undefined as unknown as WindowMetrics);
    const [resizeInterval, setResizeInterval] = useState(0);
    const [, setWindowWidth] = useState(0);
    const [, setWindowHeight] = useState(0);

    const getInactiveStyle = (
        activeStyle: Partial<CSSStyleDeclaration> & Record<string, string> = {}
    ) => inactive?.style
        || (activeStyle
            ? Object.keys(activeStyle || {}).reduce((total, current) => ({
                ...total,
                [current]: ''
            }), {})
            : {});

    const getWindowData = (_height: number | undefined, force = true) => {
        if (force) chayns.scrollToY(-1000);
        Promise.all([
            chayns.getWindowMetrics(),
            getHookState(setWindowWidth),
            getHookState(setWindowHeight)
        ]).then(([winData, winWidth, winHeight]) => {
            const data = correctWindowData(winData) as WindowMetricsRaw;
            const height = data.windowHeight - (
                typeof (data.frameY) === 'number' && typeof (data.pageYOffset) === 'number'
                    ? (data.frameY + data.pageYOffset)
                    : 45
            );
            if (chayns.env.isMobile && winWidth === window.innerWidth && Math.abs(height - winHeight) > 70) return;
            setWindowHeight(height);
            setWindowWidth(window.innerWidth);
            setWindowData({
                data: data as WindowMetrics,
                type: force ? 'force' : 'compare',
            });
            setTimeout(() => {
                chayns.setHeight({
                    height,
                    force: true
                });
            }, winWidth === 0 ? 500 : 1);
        });
    };

    useEffect(() => {
        if (isPagemakerIFrame()) {
            // eslint-disable-next-line no-console
            console.warn(...colorLog.gray('[useFullscreenTapp]'), 'Pagemaker iFrames cannot be fullscreen tapps');
        }
        chayns.hideTitleImage();
        hideCwFooter();
    }, []);

    // viewMode settings
    useEffect(() => {
        if (isPagemakerIFrame()) return;
        if (viewMode || viewMode === ViewMode.Regular) { setViewMode(viewMode); }
    }, [viewMode, isFullscreenActive]);

    // style settings
    useEffect(() => {
        if (isPagemakerIFrame()) return () => null;
        const tapp = <HTMLDivElement>(document.querySelector(rootElement || '.tapp')
            || document.querySelector('body')?.firstChild);
        if (!tapp) {
            console.error(...colorLog.gray('[useFullscreenTapp]'), `Cannot find element for selector '${rootElement}'`);
            return () => null;
        }
        if (isFullscreenActive) {
            tapp.style.width = '100vw';
            tapp.style.height = '100vh';
            setStyles(tapp, { ...(style || {}), ...(active?.style || {}) });
        } else {
            tapp.style.width = '';
            tapp.style.height = '';
            setStyles(tapp, getInactiveStyle(active?.style));
        }
        return () => {
            tapp.style.width = '';
            tapp.style.height = '';
            setStyles(tapp, getInactiveStyle({ ...(active?.style || {}), ...(style || {}) }));
        };
    }, [style, inactive, active, isFullscreenActive]);

    // disable body scroll
    useEffect(() => {
        if (isPagemakerIFrame()) return () => null;
        if (disableScrolling) {
            if (isFullscreenActive) {
                enableBodyScroll(false);
            } else if (disableScrolling) enableBodyScroll(true);
            return () => { enableBodyScroll(true); };
        }
        if (disableScrolling as boolean | undefined === false) {
            enableBodyScroll(true);
        }
        return () => null;
    }, [isFullscreenActive, disableScrolling]);

    // core workflow
    useEffect(() => {
        if (isPagemakerIFrame()) return () => null;
        let interval: number = <number><unknown>setTimeout(() => null, 0);
        clearInterval(resizeInterval);
        if (isFullscreenActive) {
            interval = <number><unknown>setInterval(() => {
                getWindowData(0, false);
            }, 2000);
            setResizeInterval(interval);
            chayns.scrollToY(-1000);
            getWindowData(0);
            if (chayns.env.isMobile) chayns.addOnActivateListener(() => getWindowData(0, false));
            chayns.addWindowMetricsListener(getWindowData);
        } else {
            chayns.removeWindowMetricsListener(getWindowData);
            chayns.setHeight({
                height: window.innerHeight,
                force: false,
            });
        }
        return () => {
            clearInterval(interval);
            chayns.removeWindowMetricsListener(getWindowData);
            chayns.setHeight({
                height: window.innerHeight,
                force: false,
            });
        };
    }, [isFullscreenActive]);

    return [windowData, isFullscreenActive, setIsFullscreenActive];
};

export default useFullscreenTapp;
