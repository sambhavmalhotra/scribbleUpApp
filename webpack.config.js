var webpack = require('webpack');
var path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './scribbleUpUI/src/js/main.js'
    },
    module: {
        loaders: [{
                test: /\.html$/,
                loader: 'ngtemplate?relativeTo=' + path.resolve(__dirname) + '/!html',
                exclude: path.resolve(__dirname, 'index.html')
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }, {
                test: /\.(jpg|jpeg|gif|png)(\?v=[a-z0-9.]+)?$/i,
                loader: 'url-loader?limit=1024&name=assets/[name].[ext]'
            }, {
                test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9=&.]+)?$/,
                loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
            }, {
                test: /\.js$/,
                loader: 'webpack-replace',
                query: {
                    replace: [{
                        from: 'css!',
                        to: ''
                    }]
                }
            }
        ]
    },
    output: {
        path: path.resolve('dist/'),
        //publicPath: '/',//commented because in unable to read bundle.js in dev env
        filename: 'bundle-[hash:6].js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            _: "underscore" //,
        }),
        new HtmlWebpackPlugin({
            template: path.resolve('index.html'),
            hash: 'true'
        }),
        new ExtractTextPlugin("-[hash:6].css")
    ],
    resolve: {
        root: [
            path.resolve('scribbleUpUI/src/js')
        ],
        alias: {
            'angular': 'angular',
            'promiseTracker': 'angular-promise-tracker'
        }
    },
    devtool: 'source-map',
    devServer: {
        colors: true,
        historyApiFallback: true,
        inline: true,
        contentBase: './dist',
        open: true,
        openPage: ''
    }
};