const chaynsMock = require('./test/chaynsMock')

const config = {
    moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "identity-obj-proxy"
    },
    globals: {
        chayns: chaynsMock,
    },
    transformIgnorePatterns: [
        "node_modules/(?!(date-fns)/)"
    ]
}

module.exports = config;
