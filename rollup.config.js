import json from '@rollup/plugin-json';
import license from 'rollup-plugin-license';
import typescript from 'rollup-plugin-typescript2';

const jsonPlugin = json({ include: 'package.json', preferConst: true });
const licensePlugin = license({
    sourcemap: true,
    banner: {
        content: {
            file: 'LICENSE_BANNER',
        },
    },
});

export const d3Modules = {
    'd3-array': 'd3',
    'd3-axis': 'd3',
    'd3-brush': 'd3',
    'd3-collection': 'd3',
    'd3-dispatch': 'd3',
    'd3-ease': 'd3',
    'd3-format': 'd3',
    'd3-geo': 'd3',
    'd3-hierarchy': 'd3',
    'd3-interpolate': 'd3',
    'd3-scale-chromatic': 'd3',
    'd3-scale': 'd3',
    'd3-selection': 'd3',
    'd3-shape': 'd3',
    'd3-time': 'd3',
    'd3-time-format': 'd3',
    'd3-timer': 'd3',
    'd3-zoom': 'd3',
};

export const umdConf = {
    file: 'dist/dc.js',
    format: 'umd',
    name: 'dc',
    sourcemap: true,
    globals: d3Modules,
    paths: d3Modules,
};

export const plugins = [
    jsonPlugin,
    licensePlugin,
    typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
            compilerOptions: {
                declaration: false, // Type definitions are generated as part of ESM6 by `tsc`
                resolveJsonModule: true, // to get info from package.json
            },
        },
    }),
];

export default [
    {
        input: 'src/index-with-version.ts',
        external: Object.keys(d3Modules),
        plugins: plugins,
        output: [umdConf],
    },
];
