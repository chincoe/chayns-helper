import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import external from 'rollup-plugin-peer-deps-external';
import cleanup from 'rollup-plugin-cleanup';

const pkg = require('./package.json');

const env = process.env.NODE_ENV;

export default {
    input: 'src/index.js',
    output: {
        file: {
            es: pkg.module,
            cjs: pkg.main,
        }[env],
        format: env
    },
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
    plugins: [
        external({
            packageJsonPath: 'src/package.json'
        }),
        alias({
            entries: [
                { find: 'chayns-logger', replacement: 'src/config/chayns-logger.js' },
                { find: 'react-redux', replacement: 'src/config/react-redux.js' },
            ]
        }),
        autoExternal(),
        babel({
            exclude: /node_modules/,
            babelHelpers: 'runtime'
        }),
        resolve({
            extensions: ['.js', '.jsx'],
        }),
        commonjs(),
        postcss({
            plugins: []
        }),
        cleanup({
            comments: 'none'
        })
    ],
};
