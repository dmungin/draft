'use strict';
var webpack = require('webpack'),
    path = require('path');

var APP = __dirname + '/app';

module.exports = {
    context: APP,
    entry: "./index.js",
    devtool: 'source-map',
    output: {
        path: APP,
        filename: "bundle.min.js"
    },
    plugins: [
    ]
};