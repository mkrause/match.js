
const path = require('path');
const webpack = require('webpack');


module.exports = {
    target: 'node',
    
    entry: {
        match: path.join(__dirname, 'src/match.js'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        
        libraryTarget: 'umd',
        library: 'match',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                
                use: [ 'babel-loader' ],
            },
        ],
    },
};
