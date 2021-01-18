export function isPagemakerIFrame(): boolean {
    const pagemakerIframeRegex = /^CustomPluginIframe([a-z0-9]+)$/;
    return !!(window.name && window.name.match(pagemakerIframeRegex))
}

export function isCustomTappIFrame(): boolean {
    const tappIframeRegex = /^CustomTappIframe__([0-9]+)$/;
    return !!(window.name && window.name.match(tappIframeRegex))
}
