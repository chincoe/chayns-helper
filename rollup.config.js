import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';

const pkg = require('./package.json');

export default {
    input: 'src/index.js',
    output: [
        { file: pkg.main, format: 'cjs', sourcemap: true },
        { file: pkg.module, format: 'esm', sourcemap: true },
    ],
    plugins: [
        autoExternal(),
        resolve({
            extensions: ['.js', '.jsx', '.json'],
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'runtime'
        }),
        commonjs(),
        postcss({}),
    ],
};
