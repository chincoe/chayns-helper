/**
 * Prevent reload on user login/logout, previously handled by adding an accessTokenChangeListener.
 * @param status
 */
export default function setReloadOnLogin(status: boolean = false): void {
    parent.postMessage(JSON.stringify({
        preventReload: status,
        customPluginIframe: window.name,
    }), '*');
}

export const addChaynsLoginListener = (callback: () => any) => {
    setReloadOnLogin(false);

    function listener() {
        callback();
        setReloadOnLogin(false);
        chayns.removeAccessTokenChangeListener(listener);
    }

    chayns.addAccessTokenChangeListener(listener);
};
