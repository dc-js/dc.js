module.exports = function (grunt) {
    'use strict';

    function gruntLoadConfig(path, grunt) {
        var glob = require('glob');
        var object = {};
        var key;

        glob.sync('*', {cwd: path}).forEach(function(option) {
            key = option.replace(/\.js$/,'');
            object[key] = require(process.cwd() + path.replace('.', '') + option);
            if (typeof object[key] === 'function') {
                object[key] = object[key](grunt);
            }
        });

        return object;
    }

    // if this variable exists we have already set up grunt
    if (!grunt || !grunt.config || !grunt.config.data || !grunt.config.data.config) {

        // Load grunt modules from package.json automatically
        require('load-grunt-tasks')(grunt, {
            pattern: ['grunt-*', '!grunt-lib-phantomjs', '!grunt-template-jasmine-istanbul']
        });
        require('time-grunt')(grunt);

        // config variables, these are accessible like '<%= conf.dev %>'
        var gruntConfig = {conf: {
            src: 'src',
            spec: 'spec',
            web: 'web',
            pkg: require('./package.json'),
            banner: grunt.file.read('./LICENSE_BANNER'),
            jsFiles: [
                'src/banner.js',   // NOTE: keep this first
                'src/core.js',
                'src/errors.js',
                'src/utils.js',
                'src/logger.js',
                'src/events.js',
                'src/filters.js',
                'src/base-mixin.js',
                'src/margin-mixin.js',
                'src/color-mixin.js',
                'src/coordinate-grid-mixin.js',
                'src/stack-mixin.js',
                'src/cap-mixin.js',
                'src/bubble-mixin.js',
                'src/pie-chart.js',
                'src/bar-chart.js',
                'src/line-chart.js',
                'src/data-count.js',
                'src/data-table.js',
                'src/data-grid.js',
                'src/bubble-chart.js',
                'src/composite-chart.js',
                'src/series-chart.js',
                'src/geo-choropleth-chart.js',
                'src/bubble-overlay.js',
                'src/row-chart.js',
                'src/legend.js',
                'src/scatter-plot.js',
                'src/number-display.js',
                'src/heatmap.js',
                'src/d3.box.js',
                'src/box-plot.js',
                'src/footer.js'  // NOTE: keep this last
            ]
        }};

        // loads tasks in the 'grunt' folder
        grunt.loadTasks('grunt');
        // loads task options in the 'grunt/options' folder
        grunt.initConfig(grunt.util._.extend(gruntConfig, gruntLoadConfig('./grunt/options/', grunt)));
    }
};
