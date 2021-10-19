import { d3Modules, plugins, umdConf } from './rollup.config';
import { terser } from 'rollup-plugin-terser';

const umdMinConf = Object.assign({}, umdConf, {
    file: 'dist/dc.min.js',
    plugins: [terser()],
});

export default [
    {
        input: 'src/index-with-version.ts',
        external: Object.keys(d3Modules),
        plugins: plugins,
        output: [umdConf, umdMinConf],
    },
    {
        input: 'src/compat/index-compat.ts',
        external: Object.keys(d3Modules),
        plugins: plugins,
        output: [
            Object.assign({}, umdConf, { file: 'dist/dc-compat.js' }),
            Object.assign({}, umdMinConf, { file: 'dist/dc-compat.min.js' }),
        ],
    },
];
