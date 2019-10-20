import {terser} from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';

const jsonPlugin = json({include: 'package.json', preferConst: true});

const umdConf = {
    file: 'dist/es6/dc.js',
    external: ['d3'],
    format: 'umd',
    name: 'dc',
    sourcemap: true,
    globals: {
        d3: 'd3'
    }
};

const umdMinConf = Object.assign({}, umdConf, {file: 'dist/es6/dc.min.js'});

const esmFlat = {
    format: 'esm',
    sourcemap: true,
    file: 'dist/esf/dc.esm.js'
};

const esmFlatMin = Object.assign({}, esmFlat, {file: 'dist/esf/dc.esm.min.js'});

const modulesMap = {
    'index': 'src/index.js',
    'legend': 'src/base/legend.js',
    'html-legend': 'src/base/html-legend.js',
    'bar-chart': 'src/charts/bar-chart.js',
    'box-plot': 'src/charts/box-plot.js',
    'bubble-chart': 'src/charts/bubble-chart.js',
    'bubble-overlay': 'src/charts/bubble-overlay.js',
    'cbox-menu': 'src/charts/cbox-menu.js',
    'composite-chart': 'src/charts/composite-chart.js',
    'data-count': 'src/charts/data-count.js',
    'data-grid': 'src/charts/data-grid.js',
    'data-table': 'src/charts/data-table.js',
    'geo-choropleth-chart': 'src/charts/geo-choropleth-chart.js',
    'heatmap': 'src/charts/heatmap.js',
    'line-chart': 'src/charts/line-chart.js',
    'number-display': 'src/charts/number-display.js',
    'pie-chart': 'src/charts/pie-chart.js',
    'row-chart': 'src/charts/row-chart.js',
    'scatter-plot': 'src/charts/scatter-plot.js',
    'select-menu': 'src/charts/select-menu.js',
    'series-chart': 'src/charts/series-chart.js',
    'sunburst-chart': 'src/charts/sunburst-chart.js',
    'text-filter-widget': 'src/charts/text-filter-widget.js'
};

export default [
    {
        input: 'src/index.js',
        plugins: [
            terser({include: [/^.+\.min\.js$/]}),
            jsonPlugin
        ],
        output: [
            umdConf,
            umdMinConf,
            esmFlat,
            esmFlatMin
        ]
    },
    {
        input: modulesMap,
        plugins: [
            jsonPlugin
        ],
        output: {
            dir: 'dist/esm',
            format: 'esm'
        }
    },
    {
        input: modulesMap,
        plugins: [
            terser(),
            jsonPlugin
        ],
        output: {
            dir: 'dist/esm-min',
            format: 'esm'
        }
    }
];
