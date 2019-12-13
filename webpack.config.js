const path = require('path');
const outputDir = path.resolve('.', 'scripts');

// module.exports = {
//     entry: './app.js',
//     output: {
//         path: outputDir,
//         filename: 'pvyr-cf.min.js',
//         libraryTarget: 'var',
//         library: 'PrivyrGenericCfIntegration'
//     },
//     module: {
//         rules: [{
//             test: /\.js$/,
//             use: ['babel-loader']
//         }]
//     }
// };

module.exports = [{
    entry: './app/generic-app.js',
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
}, {
    entry: './app/ninja-app.js',
    output: {
        path: outputDir,
        filename: 'pvyr-ninja-cf.min.js',
        libraryTarget: 'var',
        library: 'PrivyrNinjaCfIntegration'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }]
    }
}, {
    entry: './app/up-app.js',
    output: {
        path: outputDir,
        filename: 'pvyr-up-cf.min.js',
        libraryTarget: 'var',
        library: 'PrivyrUPCfIntegration'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader']
        }]
    }
}];
