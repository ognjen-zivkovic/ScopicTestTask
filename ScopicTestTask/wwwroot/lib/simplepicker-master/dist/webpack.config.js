var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var path = require('path');
var webpack = require('webpack');
var MiniCSSExtractPlugin = require('mini-css-extract-plugin');
var ROOT_DIR = __dirname;
module.exports = function (env) {
    var production = env === 'production';
    var config = {
        entry: {
            simplepicker: [
                './lib/simplepicker.css',
                './lib/index.ts'
            ]
        },
        output: {
            filename: '[name].js',
            path: path.resolve(ROOT_DIR, 'dist'),
            library: 'SimplePicker',
            libraryTarget: 'var'
        },
        resolve: {
            extensions: ['.css', '.ts', '.js']
        },
        context: ROOT_DIR,
        target: 'web',
        mode: production ? 'production' : 'development',
        devtool: 'source-map',
        plugins: [
            new webpack.HashedModuleIdsPlugin(),
            new MiniCSSExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            })
        ]
    };
    config.module = {};
    config.module.rules = [
        {
            test: /\.css$/,
            use: [
                MiniCSSExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        minimize: production
                    }
                },
            ]
        }, {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }
    ];
    if (production) {
        config.module.rules.push({
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/env'] }
            }
        });
        // build a commonjs format file for comsption with
        // build tools like webpack, and rollup.
        var nodeConfig = { output: {} };
        nodeConfig.output.libraryTarget = 'commonjs2';
        nodeConfig.entry = {
            'simplepicker.node': './lib/index.ts'
        };
        config = [config, __assign(__assign({}, config), nodeConfig)];
    }
    else {
        config.output.publicPath = '/dist/';
    }
    return config;
};
