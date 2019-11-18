import {terser} from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';
import license from 'rollup-plugin-license';

const jsonPlugin = json({include: 'package.json', preferConst: true});
const licensePlugin = license({
    sourcemap: true,
    banner: {
        content: {
            file: 'LICENSE_BANNER'
        }
    }
});

const umdConf = {
    file: 'dist/dc.js',
    format: 'umd',
    name: 'dc',
    sourcemap: true,
    globals: {
        d3: 'd3'
    }
};

const umdMinConf = Object.assign({}, umdConf, {file: 'dist/dc.min.js'});

export default [
    {
        input: 'src/index-with-version.js',
        external: ['d3'],
        plugins: [
            terser({include: [/^.+\.min\.js$/]}),
            jsonPlugin,
            licensePlugin
        ],
        output: [
            umdConf,
            umdMinConf
        ]
    }
];
