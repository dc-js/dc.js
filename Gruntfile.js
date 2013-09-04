module.exports = function (grunt) {

    var jsFiles = [
        "src/core.js",
        "src/errors.js",
        "src/utils.js",
        "src/events.js",
        "src/cumulative.js",
        "src/base-chart.js",
        "src/marginable.js",
        "src/coordinate-grid-chart.js",
        "src/color-chart.js",
        "src/stackable-chart.js",
        "src/abstract-bubble-chart.js",
        "src/pie-chart.js",
        "src/bar-chart.js",
        "src/line-chart.js",
        "src/data-count.js",
        "src/data-table.js",
        "src/bubble-chart.js",
        "src/composite-chart.js",
        "src/geo-choropleth-chart.js",
        "src/bubble-overlay.js",
        "src/row-chart.js",
        "src/legend.js",
        "src/scatter-plot.js"
    ],
    output = {
      js: './<%= pkg.name %>.js',
      jsmin: './<%= pkg.name %>.min.js',
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                banner: ['/*!',
                    ' *  <%= pkg.name %> <%= pkg.version %>',
                    ' *  <%= pkg.homepage %>',
                    ' *  Copyright <%= pkg.copyright %> <%= pkg.author.name %> and other contributors',
                    ' *',
                    ' *  Licensed under the Apache License, Version 2.0 (the "License");',
                    ' *  you may not use this file except in compliance with the License.',
                    ' *  You may obtain a copy of the License at',
                    ' *',
                    ' *      http://www.apache.org/licenses/LICENSE-2.0',
                    ' *',
                    ' *  Unless required by applicable law or agreed to in writing, software',
                    ' *  distributed under the License is distributed on an "AS IS" BASIS,',
                    ' *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
                    ' *  See the License for the specific language governing permissions and',
                    ' *  limitations under the License.',
                    ' */\n\n',
                    'dc = (function(){\n'
                ].join('\n'),
                footer: 'return dc;})();'
            },
            js: {
                src: jsFiles,
                dest: output.js
            }
        },
        uglify: {
            jsmin: {
                options: {
                    mangle: true,
                    compress: true
                },
                src: output.js,
                dest: output.jsmin
            }
        },
        sed: {
            version: {
                pattern: '%VERSION%',
                replacement: '<%= pkg.version %>',
                path: [output.js, output.jsmin]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: { '-W014': true /*'-W041': true*/ }
        },
        vows: {
            all: {
                options: {
                    reporter: "spec"
                },
                src: ["test/*.js", "spec/*"]
            }
        },
        copy: {
            'dc-to-gh' : {
                src: output.js,
                dest: 'web/js/'
            }
        },
        'gh-pages': {
            options: {
                base: 'web'
            },
            src: ['**']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-vows');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify', 'sed']);
    grunt.registerTask('update-web', ['copy:dc-to-gh', 'gh-pages']);

};
