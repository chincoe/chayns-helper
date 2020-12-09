module.exports = (api, options) => {
    const { cjs = false, cssImports } = options;

    return {
        presets: [
            ['@babel/env', { modules: cjs ? 'cjs' : false, loose: true }],
            '@babel/react',
            '@babel/typescript'
        ],
        plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
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
            '@babel/transform-runtime',
            'optimize-clsx',
            'dev-expression',
            '@babel/plugin-transform-react-constant-elements',
            '@babel/plugin-transform-react-inline-elements',
            ['@babel/proposal-class-properties', { loose: true }],
            cssImports === 'remove' && [
                'transform-remove-imports',
                { test: '\\.(scss|css)$' },
            ],
            cssImports === 'rename' && [
                'transform-rename-import',
                {
                    original: '^(.+)\\.scss$',
                    replacement: '$1.css',
                },
            ],
        ].filter(Boolean),
    };
};
