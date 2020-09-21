import {
    useState, useEffect, useReducer, useMemo
} from 'react';
import hideCwFooter from '../functions/chaynsCalls/hideCwFooter';
import setViewMode from '../functions/chaynsCalls/setViewMode';
import shallowEqual from '../functions/shallowEqual';
import getHookState from '../functions/getHookState';

/**
 * Reducer to update the windowData state
 * @param {Object} state
 * @param {number} state.frameY
 * @param {number} state.windowHeight
 * @param {number} state.pageYOffset
 * @param {Object} action
 * @param {Object} action.data
 * @param {number} action.data.frameY
 * @param {number} action.data.windowHeight
 * @param {number} action.data.pageYOffset
 * @param {string} action.type - "compare" or "force" to either check for equality or force a rerender
 * @return {*}
 */
const windowDataReducer = (state, action) => {
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
 * @param {Object} data
 * @return {{pageYOffset: number, windowHeight: number, frameY: (number|*)}|*}
 */
const correctWindowData = (data) => {
    if (!data) return data;
    return {
        ...data,
        windowHeight: data.windowHeight || window.innerHeight,
        frameY: data.frameY === undefined ? (chayns.env.isChaynsnetRuntime ? 0 : 45) : data.frameY,
        pageYOffset: data.pageYOffset || 0,
    };
};

/**
 * Hook to maintain a fullscreen tapp without scrolling, title image and footer
 * @param {boolean} initialValue - fullscreen active initially or not
 * @param {boolean} [forceExclusive=false]
 * @return {[Object, boolean, function]} - [windowData, isFullscreenActive, setFullscreenActive]
 */
const useFullscreenTapp = (initialValue, forceExclusive) => {
    const [isFullscreenActive, setIsFullscreenActive] = useState(initialValue ?? true);
    const [windowData, setWindowData] = useReducer(windowDataReducer, undefined);
    const [resizeInterval, setResizeInterval] = useState(0);
    const [, setWindowWidth] = useState(0);
    const defaultExclusive = useMemo(() => chayns.env.site.tapp.isExclusiveView, []);

    const getWindowData = (height, force = true) => {
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
                    chayns.utils.isNumber(data.frameY) && chayns.utils.isNumber(data.pageYOffset)
                    ? (data.frameY + data.pageYOffset)
                    : 45
                ),
                forceHeight: true,
            });
        });
    };

    useEffect(() => {
        Promise.all([
            chayns.hideTitleImage(),
            hideCwFooter(),
            ...(forceExclusive ? [
                setViewMode(isFullscreenActive ? true : defaultExclusive, false),
            ] : []),
        ]);
        let interval = 0;
        clearInterval(resizeInterval);
        const tapp = document.querySelector('.tapp');
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
    }, [isFullscreenActive]);

    return [windowData, isFullscreenActive, setIsFullscreenActive];
};

export default useFullscreenTapp;
