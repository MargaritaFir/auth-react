const path = require("path");
const webpack = require('webpack');

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output:{
        path: path.join(__dirname, "/dist"),
        filename:"bundle.js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: ['@babel/plugin-transform-arrow-functions', 'babel-plugin-transform-class-properties']
                    }
                },
            },
            {
                test:/\.scss/,
                use: ["style-loader", "css-loader"]
            },

            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new webpack.HotModuleReplacementPlugin()

    ],
    devServer: {
        contentBase: "./src",
        port: 7000,
        hot: true
    }
};