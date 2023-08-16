const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        seller: './src/seller.tsx',
        admin: './src/admin.tsx',
        customer: './src/customer.tsx'
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
            template: 'index.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['admin'],
            filename: 'admin.html',
            template: 'index.html'
        }),
        new HtmlWebpackPlugin({
            chunks: ['customer'],
            filename: 'customer.html',
            template: 'index.html'
        }),
    ]
};