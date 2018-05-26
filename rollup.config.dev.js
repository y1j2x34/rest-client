const path = require('path');
const browsersync = require('rollup-plugin-browsersync');
const fillhtml = require('rollup-plugin-fill-html');
const plugins = require('./build/rollup.plugins');

const port = 3000;

module.exports = {
    input: "./dev/index.ts",
    output: {
        file: './serve/index.js',
        format: 'umd',
        name: 'demo',
        sourcemap: true
    },
    watch: {
        include: ['src/**/*.ts', 'dev/**/*'],
        exclude: ['node_modules/**']
    },
    plugins: [
        browsersync({
            server: './serve',
            port: port,
            open: false,
            watch: './',
            logLevel: 'debug'
        }),
        plugins.json(),
        plugins.nodeResolve(),
        plugins.commonjs(),
        plugins.typescript({
            tsconfig: './dev/tsconfig.json'
        }),
        fillhtml({
            template: 'dev/index.html',
            filename: 'index.html',
            externals: [
                {type: 'js', file: './index.js', pos: 'before'}
            ]
        })
    ]
};
