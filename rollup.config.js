const typescript = require('rollup-plugin-typescript2');

module.exports = {
    input: "src/index.ts",
    output: {
        file: 'dist/index.js',
        name: 'Rest',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: {
                sourceMap: true,
                compilerOptions: {
                    module: "ES2015"
                }
            }
        })
    ]
};
