const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const plugins = require('./build/rollup.plugins');

function output(to) {
    return {
        file: to,
        name: 'Rest',
        format: 'umd',
        sourcemap: true
    };
}

module.exports = [{
    input: "src/index.ts",
    output: output('dist/index.js'),
    plugins: [
        plugins.typescript()
    ]
}, {
    input: "src/index.ts",
    output: output('dist/index.full.js'),
    plugins: [
        plugins.json(),
        plugins.nodeResolve(),
        plugins.commonjs(),
        plugins.typescript()
    ]
}];
