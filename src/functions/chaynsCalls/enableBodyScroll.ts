/**
 * Enable or disable scrolling in the top frame
 * @param enabled - false to disable, true to enable
 * @param targetElement - needed to work correctly on iOS
 */
export default function enableBodyScroll(enabled: boolean, targetElement: string | unknown = 'body'): void {
    chayns.invokeCall({
        action: 242,
        value: {
            enabled,
            targetElement
        }
    });
}
