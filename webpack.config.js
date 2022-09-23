const path = require('path');

module.exports = () => {
    return {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'src')
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
        }
    };
};
