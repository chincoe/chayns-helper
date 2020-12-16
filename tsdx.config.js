const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { babelPluginTsdx } = require('tsdx/dist/babelPluginTsdx');
const { DEFAULT_EXTENSIONS: DEFAULT_BABEL_EXTENSIONS } = require('@babel/core')

module.exports = {
    rollup(config, opts) {
        const babelPluginIdx = config.plugins.findIndex(p => p.name === 'babel')
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
            })
        }

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
