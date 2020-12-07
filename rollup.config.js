import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import autoExternal from 'rollup-plugin-auto-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';

const extensions = [".js", ".jsx", ".ts", ".tsx"];
const input = "src/index.ts";

const plugins = [
    autoExternal(),
    resolve({
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    }),
    typescript({
        typescript: require("typescript"),
    }),
    postcss({}),
];

export default [
    {
        input,
        output: {
            file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
        plugins,
    },
    {
        input,
        output: {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins,
    },
];
