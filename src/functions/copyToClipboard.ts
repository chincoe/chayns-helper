/**
 * Use this in an onClick function to copy the passed value to clipboard
 */
const copyToClipboard = (value: string): void => {
    const input = document.createElement('textarea');
    input.className = 'chayns-helper__copy-to-clipboard-element';
    input.value = value;
    document.body.append(input);
    input.select();
    input.setSelectionRange(0, Number.MAX_SAFE_INTEGER);
    document.execCommand('copy');
    document.body.removeChild(input);
};

export default copyToClipboard;
