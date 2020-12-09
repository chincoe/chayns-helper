const autoExternal = require('rollup-plugin-auto-external');
const postcss = require('rollup-plugin-postcss');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const autoprefixer = require('autoprefixer');

module.exports = {
    rollup(config, options) {
        config.plugins.push(postcss({
            plugins: [
                autoprefixer()
            ],
        }))
        return config;
    }
}
