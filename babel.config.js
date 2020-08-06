const resolveAbsoluteImport = require('chayns-components/lib/utils/babel/resolveAbsoluteImport.js');

module.exports = {
    plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-logical-assignment-operators',
        '@babel/plugin-proposal-numeric-separator',
        ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-syntax-import-meta',
        [
            'transform-imports', {
            'chayns-components': {
                transform: resolveAbsoluteImport,
                preventFullImport: true,
            },
        }
        ],
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                targets: {
                    "node": "current"
                }
            }
        ],
        '@babel/preset-react',
    ],
    env: {
        production: {
            plugins: [
                '@babel/plugin-transform-react-constant-elements',
                '@babel/plugin-transform-react-inline-elements',
                'transform-react-remove-prop-types',
            ],
        },
        development: {
            plugins: [
                'react-hot-loader/babel',
            ],
        },
    },
};
