require('jest-fetch-mock').enableMocks();
const setCustomLogger = require('../src/utils/requireChaynsLogger').setCustomLogger;
setCustomLogger({
    debug: () => {},
    warning: () => {},
    info: () => {},
    critical: () => {},
    error: () => {},
})
global.chayns = require('./chaynsMock');
global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();
global.document.execCommand = jest.fn();
