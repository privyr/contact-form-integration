const path = require('path');
const outputDir = path.resolve('.', 'scripts');

module.exports = {
    entry: './app.js',
    output: {
        path: outputDir,
        filename: 'pvyr-cf.min.js',
        libraryTarget: 'var',
        library: 'PrivyrGenericCfIntegration'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }]
    }
};
