const loginListeners: {listeners: Array<() => void>, globalReloadOnLogin: boolean, noReloadOnLogin: number} = {
    listeners: [],
    globalReloadOnLogin: true,
    noReloadOnLogin: 0
};

/**
 * Prevent reload on user login/logout, previously handled by adding an accessTokenChangeListener.
 * @param status
 * @param updateGlobalStatus
 */
export default function setReloadOnLogin(status: boolean = false, updateGlobalStatus: boolean = true): void {
    if (updateGlobalStatus) loginListeners.globalReloadOnLogin = status;
    parent.postMessage(JSON.stringify({
        preventReload: !status,
        customPluginIframe: window.name,
    }), '*');

}

/**
 * Add an accessTokenChangeListener that will prevent reload on login/logout
 * @param callback
 */
export const addChaynsLoginListener = (callback: () => any): (() => void) => {
    loginListeners.noReloadOnLogin++;
    if (loginListeners.noReloadOnLogin === 1) {
        setReloadOnLogin(false, false);
    }

    function listener() {
        callback();
        loginListeners.noReloadOnLogin--;
        if (!loginListeners.globalReloadOnLogin && !loginListeners.noReloadOnLogin) {
            setReloadOnLogin(true, false);
        }
        chayns.removeAccessTokenChangeListener(listener);
    }

    loginListeners.listeners.push(listener);

    chayns.addAccessTokenChangeListener(listener);

    return listener;
};

/**
 * Remove a previously set login listener
 * @param callback
 * @return success
 */
export const removeChaynsLoginListener = (callback: () => any): boolean => {
    const listenerIdx = loginListeners.listeners.findIndex(l => l === callback);
    if (listenerIdx >= 0) {
        loginListeners.listeners.filter((_, index) => index != listenerIdx);
        loginListeners.noReloadOnLogin--;
        if (!loginListeners.globalReloadOnLogin && !loginListeners.noReloadOnLogin) {
            setReloadOnLogin(true, false);
        }
        chayns.removeAccessTokenChangeListener(callback);
        return true;
    }
    return false;
}
