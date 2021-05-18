const config = {
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
    },
    setupFiles: [
        './test/setup.js'
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(date-fns)/)'
    ],
};

module.exports = config;
