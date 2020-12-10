module.exports = {
    plugins: [
        ["const-enum", { "transform": "constObject" }],
        '@babel/plugin-proposal-logical-assignment-operators',
        '@babel/plugin-proposal-numeric-separator',
        ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
        '@babel/plugin-proposal-throw-expressions',
        'optimize-clsx',
    ],
}
