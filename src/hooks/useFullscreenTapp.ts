import React, { SetStateAction, useEffect, useMemo, useReducer, useState } from 'react';
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
const windowDataReducer = (
    state: {
        frameY: number,
        windowHeight: number,
        pageYOffset: number
    },
    action: {
        data: {
            frameY: number,
            windowHeight: number,
            pageYOffset: number
        },
        type: 'compare' | 'force'
    }
): any => {
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
    data: { [key: string]: number }
): { pageYOffset: number, windowHeight: number, frameY: number | any } | any => {
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
        // @ts-expect-error
        element.style[keys[i]] = style[keys[i]];
    }
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
    initialValue: boolean = true,
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
    } = config || {}
    const [isFullscreenActive, setIsFullscreenActive] = useState(initialValue ?? true);
    let {
        viewMode = ViewMode.Exclusive,
        disableBodyScrolling: disableScrolling = true,
    } = {...(config || {}), ...((isFullscreenActive ? active : inactive) || {})};
    const [windowData, setWindowData] = useReducer(windowDataReducer, undefined);
    const [resizeInterval, setResizeInterval] = useState(0);
    const [, setWindowWidth] = useState(0);
    const [, setWindowHeight] = useState(0);
    const defaultExclusive = useMemo(() => chayns.env.site.tapp.isExclusiveView, []);

    const getInactiveStyle = (activeStyle: Partial<CSSStyleDeclaration> & Record<string, string> = {}) => {
        return inactive?.style
               || (activeStyle
                ? Object.keys(activeStyle || {}).reduce((total, current) => ({ ...total, [current]: '' }), {})
                : {})
    }

    const getWindowData = (_height: any, force = true) => {
        if (force) chayns.scrollToY(-1000);
        Promise.all([
            chayns.getWindowMetrics(),
            getHookState(setWindowWidth),
            getHookState(setWindowHeight)
        ]).then(([winData, winWidth, winHeight]) => {
            const data = correctWindowData(winData);
            const height = data.windowHeight - (
                typeof (data.frameY) === 'number' && typeof (data.pageYOffset) === 'number'
                    ? (data.frameY + data.pageYOffset)
                    : 45
            );
            if (chayns.env.isMobile && winWidth === window.innerWidth && Math.abs(height - winHeight) > 70) return;
            setWindowHeight(height);
            setWindowWidth(window.innerWidth);
            setWindowData({
                data,
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
            console.warn(
                ...colorLog.gray('[useFullscreenTapp]'),
                'Pagemaker iFrames cannot be fullscreen tapps'
            )
            return () => {};
        }
        chayns.hideTitleImage();
        hideCwFooter()
        if (viewMode) { setViewMode(viewMode); }
        let interval: number = <number><unknown>setTimeout(() => null, 0);
        clearInterval(resizeInterval);
        const tapp = <HTMLDivElement>document.querySelector(rootElement || '.tapp');
        if (tapp) {
            if (isFullscreenActive) {
                chayns.scrollToY(-1000);
                getWindowData(0);
                tapp.style.width = '100vw';
                tapp.style.height = '100vh';
                setStyles(tapp, {...(style || {}), ...(active?.style || {})})
                interval = <number><unknown>setInterval(() => {
                    getWindowData(0, false);
                }, 2000);
                if (chayns.env.isMobile) chayns.addOnActivateListener(() => getWindowData(0, false));
                setResizeInterval(interval);
                chayns.addWindowMetricsListener(getWindowData);
                if (disableScrolling) enableBodyScroll(false);
            } else {
                chayns.removeWindowMetricsListener(getWindowData);
                tapp.style.width = "";
                tapp.style.height = "";
                setStyles(tapp, getInactiveStyle(active?.style))
                chayns.setHeight({
                    height: window.innerHeight,
                    force: false,
                });
                if (disableScrolling) enableBodyScroll(true);
            }
            return () => {
                clearInterval(interval);
                chayns.removeWindowMetricsListener(getWindowData);
                tapp.style.width = "";
                tapp.style.height = "";
                setStyles(tapp, getInactiveStyle({ ...(active?.style || {}), ...(style || {}) }))
                chayns.setHeight({
                    height: window.innerHeight,
                    force: false,
                });
                if (disableScrolling) enableBodyScroll(true);
            };
        } else {
            console.error(...colorLog.gray('[useFullscreenTapp]'), `Cannot find element for selector '${rootElement}'`)
            return () => null;
        }

    }, [isFullscreenActive]);

    return [windowData, isFullscreenActive, setIsFullscreenActive];
};

export default useFullscreenTapp;
