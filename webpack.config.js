const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        seller: './src/index.tsx',
        admin: './src/index.tsx',
        contact: './src/index.tsx'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        port: 9999
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['seller'],
            filename: 'seller.html',
        }),
        new HtmlWebpackPlugin({
            chunks: ['admin'],
            filename: 'admin.html',
        }),
        new HtmlWebpackPlugin({
            chunks: ['contact'],
            filename: 'contact.html',
        }),
    ]
};