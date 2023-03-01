import license from 'rollup-plugin-license';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import json5 from 'json5';

generateRollupTsConfig();
generateVersionFile();

const typescriptPlugin = typescript({ tsconfig: './tsconfig-rollup.json' });

const licensePlugin = license({
    sourcemap: true,
    banner: {
        content: {
            file: 'LICENSE_BANNER',
        },
    },
});

export const plugins = [licensePlugin, typescriptPlugin];

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

export default [
    {
        input: 'src/index-with-version.ts',
        external: Object.keys(d3Modules),
        plugins: plugins,
        output: [umdConf],
    },
];

// Utility functions

/*
 * Could not figure out howto override the `exclude` option for `@rollup/plugin-typescript`.
 * So, a round about way to write an updated tsconfig to be used by rollup.
 */
function generateRollupTsConfig() {
    const origTsConfig = json5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));
    const tsConfig = {
        ...origTsConfig,
        compilerOptions: {
            ...origTsConfig.compilerOptions,
            // `declaration` generation will fail for `compat` classes.
            declaration: false,
        },
        // to include `compat` classes
        exclude: [],
    };
    fs.writeFileSync('./tsconfig-rollup.json', JSON.stringify(tsConfig, null, 2), 'utf-8');
}

function generateVersionFile() {
    const version = json5.parse(fs.readFileSync('./package.json', 'utf-8')).version;
    fs.writeFileSync('src/version.ts', `export const version='${version}';\n`, 'utf-8');
}
