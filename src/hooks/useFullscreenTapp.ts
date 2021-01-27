import React, {
    useState, useEffect, useReducer, useMemo, SetStateAction
} from 'react';
import hideCwFooter from '../functions/chaynsCalls/hideCwFooter';
import setViewMode from '../functions/chaynsCalls/setViewMode';
import shallowEqual from '../functions/shallowEqual';
import getHookState from '../functions/getHookState';
import { isPagemakerIFrame } from '../functions/isPagemakerIFrame';
import colorLog from '../utils/colorLog';

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
): {
    pageYOffset: number, windowHeight: number, frameY: number | any
} | any => {
    if (!data) return data;
    return {
        ...data,
        windowHeight: data.windowHeight || window.innerHeight,
        frameY: data.frameY === undefined ? (chayns.env.isChaynsnetRuntime ? 0 : 45) : data.frameY,
        pageYOffset: data.pageYOffset || 0,
    };
};

export interface WindowMetrics {
    pageYOffset: number,
    windowHeight: number,
    frameX: number,
    frameY: number,
    scrollTop: number,
    height: number
}

interface TappElement extends Element {
    style: { [key: string]: string | null }
}

/**
 * Hook to maintain a fullscreen tapp without scrolling, title image and footer. Does not work in pagemaker iframes
 * @param initialValue - fullscreen initially active or not, default: true
 * @param forceExclusive - force a page to exclusive mode, default: false
 * @returns [windowData, isFullscreenActive, setIsFullscreenActive]
 */
const useFullscreenTapp = (
    initialValue: boolean = true,
    forceExclusive?: boolean
): [WindowMetrics, boolean, React.Dispatch<SetStateAction<boolean>>] => {
    const [isFullscreenActive, setIsFullscreenActive] = useState(initialValue ?? true);
    const [windowData, setWindowData] = useReducer(windowDataReducer, undefined);
    const [resizeInterval, setResizeInterval] = <any>useState(0);
    const [, setWindowWidth] = useState(0);
    const defaultExclusive = useMemo(() => chayns.env.site.tapp.isExclusiveView, []);

    const getWindowData = (_height: any, force = true) => {
        Promise.all([
            chayns.getWindowMetrics(),
            getHookState(setWindowWidth)
        ]).then(([winData, winWidth]) => {
            if (chayns.env.isMobile && winWidth === window.innerWidth) return;
            setWindowWidth(window.innerWidth);
            const data = correctWindowData(winData);
            setWindowData({
                data,
                type: force ? 'force' : 'compare',
            });
            chayns.setHeight({
                height: data.windowHeight - (
                    typeof (data.frameY) === 'number' && typeof (data.pageYOffset) === 'number'
                        ? (data.frameY + data.pageYOffset)
                        : 45
                ),
                forceHeight: true,
            });
        });
    };

    useEffect(() => {
        if (isPagemakerIFrame()) {
            console.warn(
                ...colorLog({ ['[useFullscreenTapp]']: 'color: #aaaaaa' }),
                'Pagemaker iFrames cannot be fullscreen tapps'
            )
            return () => {};
        }
        Promise.all([
            chayns.hideTitleImage(),
            hideCwFooter(),
            ...(forceExclusive ? [
                setViewMode(isFullscreenActive ? true : !!defaultExclusive, false),
            ] : []),
        ]);
        let interval: NodeJS.Timeout = setTimeout(v => v, 0);
        clearInterval(resizeInterval);
        const tapp = <TappElement>document.querySelector('.tapp');
        if (tapp) {
            if (isFullscreenActive) {
                chayns.scrollToY(-1000);
                getWindowData(0);
                tapp.style.width = '100vw';
                tapp.style.height = '100vh';
                interval = setInterval(() => {
                    getWindowData(0, false);
                }, 2000);
                if (chayns.env.isMobile) chayns.addOnActivateListener(() => getWindowData(0, false));
                setResizeInterval(interval);
                chayns.addWindowMetricsListener(getWindowData);
            } else {
                chayns.removeWindowMetricsListener(getWindowData);
                tapp.style.padding = null;
                tapp.style.width = null;
                tapp.style.height = null;
                chayns.setHeight({
                    height: window.innerHeight,
                    forceHeight: false,
                });
            }
            return () => {
                clearInterval(interval);
                chayns.removeWindowMetricsListener(getWindowData);
                tapp.style.padding = null;
                tapp.style.width = null;
                tapp.style.height = null;
                chayns.setHeight({
                    height: window.innerHeight,
                    forceHeight: false,
                });
            };
        } else {
            console.error("[useFullscreenTapp] Cannot find element with class '.tapp'")
            return () => null;
        }

    }, [isFullscreenActive]);

    return [windowData, isFullscreenActive, setIsFullscreenActive];
};

export default useFullscreenTapp;
