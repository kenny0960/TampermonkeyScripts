const { merge } = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config(), {
    entry: './src/screenshot/index.ts',
    output: {
        filename: 'screenshot.bundle.js',
    },
    externals: {
        moment: 'moment',
        html2canvas: 'html2canvas',
    }
});
