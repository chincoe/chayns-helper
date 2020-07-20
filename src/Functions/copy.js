/**
 * Use this in an onClick function to copy the passed value to clipboard
 * @param {string} value - the value to be copied
 */
const copyOnClick = (value) => {
    const input = document.createElement('input');
    input.value = value;
    document.body.append(input);
    input.select();
    input.setSelectionRange(0, 1024);
    document.execCommand('copy');
    document.body.removeChild(document.body.lastChild);
};

export default copyOnClick;
