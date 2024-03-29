const { merge } = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config(), {
    entry: './src/werp/index.ts',
    output: {
        filename: 'werp.bundle.js',
    },
    externals: {
        moment: 'moment',
        chart: 'Chart',
        html2canvas: 'html2canvas',
    }
});
