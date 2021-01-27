/**
 * Check if the current application is inside a pagemaker iframe based on the iframe name
 */
export function isPagemakerIFrame(): boolean {
    const pagemakerIframeRegex = /^CustomPluginIframe([a-z0-9]+)$/;
    return !!(window.name && window.name.match(pagemakerIframeRegex))
}

/**
 * Check if the current application is a custom tapp iframe based on the iframe name
 */
export function isCustomTappIFrame(): boolean {
    const tappIframeRegex = /^CustomTappIframe__([0-9]+)$/;
    return !!(window.name && window.name.match(tappIframeRegex))
}
