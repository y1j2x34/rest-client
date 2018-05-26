const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');

function ext(opt1, opt2) {
    return Object.assign({}, opt1, opt2);
}

module.exports = {
    typescript(opt){
        return typescript(ext({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: {
                sourceMap: true,
                compilerOptions: {
                    module: "ES2015"
                }
            }
        }, opt));
    },
    nodeResolve(opt){
        return nodeResolve(ext({
            jsnext: true,
            main: true,
            module: true,
            browser: true,
            preferBuiltins: false
        }, opt));
    },
    commonjs(opt){
        return commonjs(ext({
            include: ['node_modules/**'],
            namedExports: {
                'node_modules/superagent/lib/client.js': ['get', 'post', 'patch', 'head', 'put', 'del'],
                'node_modules/file-type/index.js': ['call']
            }
        }, opt));
    },
    json(opt) {
        return json(ext({
            include: 'node_modules/**',
            preferConst: false
        }, opt));
    }
};
