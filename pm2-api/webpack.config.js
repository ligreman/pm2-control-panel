const path = require('path'),
    nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    mode: 'production', // production // development
    // context: __dirname,
    entry: './src/app.js',
    output: {
        filename: 'pm2-api.js',
        path: path.resolve(__dirname, 'target')
    },
    // externals: [nodeExternals()]
};
