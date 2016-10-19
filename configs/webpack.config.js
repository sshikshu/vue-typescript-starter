const path = require('path');
const webpack = require('webpack');

const BabiliPlugin = require('babili-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDashboardPlugin = require('webpack-dashboard/plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = function (environment) {
    env = { prod: environment === 'production' };
    let config = {
        entry: {
            main: './src/main.ts'
        },
        devtool: env.prod ? 'source-map' : 'eval',
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: (env.prod)? '[name].[chunkhash].bundle.js' :'[name].bundle.js',
            pathinfo: !env.prod
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                'vue$': 'vue/dist/vue'
            }
        },
        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader',
                    query: {
                        useForkChecker: true
                    }
                },
                {
                    test: /\.css$/,
                    loader: 'style!css'
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                    exclude: [
                        path.resolve(__dirname, './src/index.html')
                    ]
                },
                {
                    test: /\.vue$/,
                    loader: 'vue'
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                PROD: env.prod ? 'true' : 'false'
            }),
            new ForkCheckerPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new webpack.optimize.CommonsChunkPlugin({
                minChunks: Infinity,
                name: 'common',
                filename: (env.prod)? '[name].[chunkhash].js' : '[name].js',
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new WebpackDashboardPlugin(),
            new CopyWebpackPlugin([{
                from: 'assets',
                to: 'assets'
            }]),
        ],
        node: {
            global: true,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };

    if (env.prod) {
        config.plugins = config.plugins.concat([
            /*new UglifyJsPlugin({
                beautify: false,
                mangle: { screw_ie8: true, keep_fnames: true },
                compress: { screw_ie8: true },
                comments: false
            }),*/
            new BabiliPlugin(),
            new webpack.LoaderOptionsPlugin({
                minimize: true
            }),
            new WebpackMd5Hash(),
        ]);
    }

    return config;
}