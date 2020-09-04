import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: [
        { file: pkg.main, format: 'cjs' },
        { file: pkg.module, format: 'esm' },
    ],
    plugins: [
        alias({
            entries: [
                { find: 'chayns-logger', replacement: 'src/config/chayns-logger.js' },
                { find: 'default-error-handler', replacement: 'src/config/default-error-handler.js' },
                { find: 'environment', replacement: 'src/config/environment.js' },
            ]
        }),
        postcss(),
        autoExternal(),
        resolve({
            extensions: ['.js', '.jsx', '.json'],
        }),
        commonjs(),
        babel({ babelHelpers: 'runtime' }),
    ],
};
