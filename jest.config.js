const chaynsMock = require('./test/chaynsMock')
// import {Config} from '@jest/types';

// const config: Config.InitialOptions = {
const config = {
    moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "identity-obj-proxy"
    },
    globals: {
        chayns: chaynsMock,
    }
}

module.exports = config;
