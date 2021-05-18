/* eslint-disable @typescript-eslint/no-var-requires,no-param-reassign */
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { babelPluginTsdx } = require('tsdx/dist/babelPluginTsdx');
const { DEFAULT_EXTENSIONS: DEFAULT_BABEL_EXTENSIONS } = require('@babel/core');

module.exports = {
    rollup(config, opts) {
        // for tree-shaking, find tsdx babel plugin and replace it with one that sets the babelHelpers to runtime
        const babelPluginIdx = config.plugins.findIndex((p) => p.name === 'babel');
        if (babelPluginIdx !== -1) {
            config.plugins[babelPluginIdx] = babelPluginTsdx({
                exclude: 'node_modules/**',
                extensions: [...DEFAULT_BABEL_EXTENSIONS, 'ts', 'tsx'],
                passPerPreset: true,
                custom: {
                    targets: opts.target === 'node' ? { node: '10' } : undefined,
                    extractErrors: opts.extractErrors,
                    format: opts.format,
                },
                babelHelpers: 'runtime',
            });
        }
        // add postcss
        config.plugins.push(
            postcss({
                plugins: [
                    autoprefixer(),
                    cssnano({
                        preset: 'default',
                    }),
                ],
            })
        );
        return config;
    }
};
