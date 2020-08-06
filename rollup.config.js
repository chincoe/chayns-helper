import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "esm" },
  ],
  plugins: [
    postcss(),
    autoExternal(),
    resolve({
      extensions: [".js", ".jsx", ".json"],
    }),
    commonjs(),
    babel({ babelHelpers: "runtime" }),
  ],
};
