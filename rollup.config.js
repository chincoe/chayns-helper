import typescript from '@rollup/plugin-typescript';
import pkg from "./package.json";
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'

const input = "src/index.ts";

const plugins = [
    autoExternal(),
    resolve({
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    }),
    commonjs(),
    typescript({}),
    postcss({}),
];

export default [
    {
        input,
        output: {
            // dir: "dist/esm",
            file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
        plugins,
    },
    {
        input,
        output: {
            // dir: "dist/cjs",
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins,
    },
];
