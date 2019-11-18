import {terser} from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';
import glob from 'glob';
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

/*
It will have entries like
{
    'html-legend': 'src/base/html-legend.js',
    'bar-chart': 'src/charts/bar-chart.js'
}

This list is populated base on files in the src folder.
If needed, some entries can be removed.
*/
const modulesMap = {};
glob.sync('src/**/*.js', {}).forEach(function (f) {
    const res = f.match(/\/([^\/]*).js$/);
    modulesMap[res[1]] = f;
});

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
    },
    {
        input: modulesMap,
        external: ['d3'],
        plugins: [
            jsonPlugin,
            licensePlugin
        ],
        output: {
            dir: 'dist/esm',
            format: 'esm'
        }
    }
];
