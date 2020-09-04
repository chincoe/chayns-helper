const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    const dev = env === 'development';
    return {
        mode: dev ? 'development' : 'production',
        // optimization: {
        //     minimizer: [
        //         new TerserPlugin({
        //             sourceMap: dev,
        //             parallel: true,
        //         })
        //     ],
        // },
        entry: {
            index: './src/index.js'
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                'chayns-logger': 'src/config/chayns-logger.js',
                'default-error-handler': 'src/config/default-error-handler',
                environment: 'src/config/environment'
            }
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
                                sourceMap: dev
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: dev,
                                plugins: () => [
                                    autoprefixer({ flexbox: 'no-2009' }),
                                ],
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: dev
                            }
                        }
                    ]
                }
            ]
        },
        devtool: dev ? 'inline-source-map' : undefined,
        plugins: [
            new CleanWebpackPlugin(),
            // new webpack.optimize.AggressiveMergingPlugin(),
            // new LodashModuleReplacementPlugin(),
        ]
    };
};
