import {
    useState, useEffect, useReducer, useMemo,
} from 'react';
import hideCWFooter from '../functions/chaynsCalls/hideCwFooter';
import setViewMode from '../functions/chaynsCalls/setViewMode';
import shallowEqual from '../functions/shallowEqual';
import types from '../functions/types';

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
 * @param {Object} options
 * @param {boolean} [options.forceExclusive=false]
 * @param {boolean} [options.fullBrowserWidth=false]
 * @param {number} [options.maxWidth=851]
 * @return {[Object, function, boolean]}
 */
const useFullscreenTapp = (initialValue = true, {
    forceExclusive = false,
    fullBrowserWidth = false,
    maxWidth = 851,
}) => {
    const [isFullscreenActive, setIsFullscreenActive] = useState(initialValue);
    const [windowData, setWindowData] = useReducer(windowDataReducer, undefined);
    const [resizeInterval, setResizeInterval] = useState(0);
    const defaultExclusive = useMemo(() => chayns.env.site.tapp.isExclusiveView, []);

    const getWindowData = (force = true) => {
        chayns.getWindowMetrics()
            .then((winData) => {
                const data = correctWindowData(winData);
                setWindowData({
                    data,
                    type: force ? 'force' : 'compare',
                });
                if (!chayns.env.user.adminMode) {
                    chayns.setHeight({
                        height: data.windowHeight - (
                            chayns.utils.isNumber(data.frameY) && chayns.utils.isNumber(data.pageYOffset)
                            ? (data.frameY + data.pageYOffset)
                            : 45
                        ),
                        forceHeight: true,
                    });
                }
            });
    };

    useEffect(() => {
        Promise.all([
            chayns.hideTitleImage(),
            hideCWFooter(),
            ...(forceExclusive || fullBrowserWidth ? [
                setViewMode(isFullscreenActive ? true : defaultExclusive, fullBrowserWidth),
            ] : []),
        ]);
        let interval = 0;
        clearInterval(resizeInterval);
        const tapp = document.querySelector('.tapp');
        if (isFullscreenActive) {
            chayns.scrollToY(-1000);
            getWindowData();
            tapp.style.padding = '0';
            tapp.style.width = '100vw';
            tapp.style.height = '100vh';
            tapp.style.maxWidth = types.isNumber(maxWidth) ? `${maxWidth}px` : maxWidth;
            if (!chayns.env.isMobile) {
                interval = setInterval(() => {
                    getWindowData(false);
                }, 2000);
            } else {
                chayns.addOnActivateListener(() => getWindowData(false));
            }
            setResizeInterval(interval);
            if (!chayns.env.isApp) chayns.addWindowMetricsListener(getWindowData, true);
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
        return () => { clearInterval(interval); };
    }, [isFullscreenActive]);

    return [windowData, setIsFullscreenActive, isFullscreenActive];
};

export default useFullscreenTapp;
