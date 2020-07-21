const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => {
    return {
        mode: 'production',
        optimization: {
            minimizer: [
                new TerserPlugin({
                    sourceMap: false,
                    parallel: true,
                })
            ],
        },
        entry: { index: './src/index.js' },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        output: {
            path: path.resolve('dist'),
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.s?css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: false,
                                plugins: () => [
                                    autoprefixer({ flexbox: 'no-2009' }),
                                ],
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false
                            }
                        }
                    ]
                }
            ]
        },
        devtool: undefined,
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new LodashModuleReplacementPlugin(),
        ]
    };
};
