const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');
module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new Dotenv({
            safe: true,
            systemvars: true
        })
    ]
});
