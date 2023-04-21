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
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'sass-to-string', {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    outputStyle: 'compressed',
                                },
                            },
                        },
                    ],
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
