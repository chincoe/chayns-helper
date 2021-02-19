const loginListeners: { listeners: Array<() => void>; globalReloadOnLogin: boolean; noReloadOnLogin: number } = {
    listeners: [],
    globalReloadOnLogin: true,
    noReloadOnLogin: 0
};

function setReload(reload: boolean = false) {
    parent.postMessage(JSON.stringify({
        preventReload: !reload,
        customPluginIframe: window.name,
    }), '*');
}

/**
 * For pagemakerV2 iframes, prevent reload on user login/logout, otherwise handled by adding an
 * accessTokenChangeListener.
 * @param reload
 */
export default function setReloadOnLogin(reload: boolean = false): void {
    loginListeners.globalReloadOnLogin = reload;
    setReload(reload);
}

/**
 * Add an accessTokenChangeListener that will prevent reload on login/logout even in pagemaker iframes
 * @param callback
 * @param once - remove after being called once
 * @returns callback - the reference of the listener callback needed to remove it
 */
export const addChaynsLoginListener = (callback: () => any, once: boolean = false): (() => void) => {
    loginListeners.noReloadOnLogin++;
    if (loginListeners.globalReloadOnLogin || loginListeners.noReloadOnLogin === 1) {
        setReload(false);
    }

    const listener = once ? () => {
        callback();
        loginListeners.noReloadOnLogin--;
        if (!loginListeners.globalReloadOnLogin && !loginListeners.noReloadOnLogin) {
            setReload(true);
        }
        chayns.removeAccessTokenChangeListener(listener);
    } : callback;

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
            setReload(true);
        }
        chayns.removeAccessTokenChangeListener(callback);
        return true;
    }
    return false;
};
