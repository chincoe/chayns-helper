import typescript from '@rollup/plugin-typescript';
import pkg from "./package.json";
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'
import tsconfig from './tsconfig.json';

const input = "src/index.ts";

export default [
    {
        input,
        output: {
            dir: "dist/cjs",
            // file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins: [
            autoExternal(),
            resolve({
                extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            }),
            commonjs(),
            typescript({}),
            postcss({}),
        ],
    },
    {
        input,
        output: {
            dir: "dist/esm",
            // file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
        plugins: [
            autoExternal(),
            resolve({
                extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            }),
            commonjs(),
            typescript({}),
            postcss({}),
        ],
    }
]
