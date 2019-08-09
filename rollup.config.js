
export default {
    input: ['src/index.js'],
    external: ['d3'],
    output: {
        format: 'umd',
        file: 'web/js/dc.js',
        name: 'dc',
        sourcemap: true,
        globals: {
            d3: 'd3'
        }
    }
}
