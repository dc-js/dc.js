module.exports = function (grunt) {
    var jsFiles = module.exports.jsFiles,
    output = {
      js: '<%= pkg.name %>.js',
      jsmin: '<%= pkg.name %>.min.js',
      map: '<%= pkg.name %>.min.js.map'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                src: jsFiles,
                dest: output.js
            }
        },
        uglify: {
            jsmin: {
                options: {
                    mangle: true,
                    compress: true,
                    sourceMap: output.map
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
        emu: {
            api: {
                src: output.js,
                dest: 'web/docs/api-<%= pkg.version %>.md'
            }
        },
        markdown: {
            html: {
                src: '<%= emu.api.dest %>',
                dest: 'web/docs/index.html'
            },
            options: {markdownOptions: {highlight: 'manual'}}
        },
        docco: {
            howto: {
                src: 'web/stock.js',
                dest: 'web/docs',
                options: {basepath:'web'}
            }
        },
        copy: {
            'dc-to-gh': {
                files: [
                    { expand: true, flatten: true, src: 'dc.css', dest: 'web/css/'},
                    { expand: true,
                      flatten: true,
                      src: [output.js,
                            output.js + ".map",
                            'node_modules/jquery/tmp/jquery.js',
                            'node_modules/d3/d3.js',
                            'node_modules/crossfilter/crossfilter.js',
                            'test/env-data.js'],
                      dest: 'web/js/'
                    }
                ],
            }
        },
        'gh-pages': {
            options: {
                base: 'web',
                message: "Synced from from master branch."
            },
            src: ['**']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-docco2');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-vows');
    grunt.registerMultiTask('emu', 'Documentation extraction by emu.', function() {
      console.log(this.files[0].src, this.files[0].dest);
        var emu = require('emu'),
            fs = require('fs'),
            srcFile = this.files[0].src[0],
            destFile = this.files[0].dest,
            source = grunt.file.read(srcFile);
        grunt.file.write(destFile, emu.getComments(source));
        grunt.log.writeln('File "' + destFile + '" created.');
    });

    grunt.registerTask('default', ['concat', 'uglify', 'sed', 'copy']);
    grunt.registerTask('docs', ['default', 'emu', 'markdown']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('test', ['default', 'vows']);
};

module.exports.jsFiles = [
    "src/banner.js",
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
    "src/capped.js",
    "src/scatter-plot.js",
    "src/number-display.js",
    "src/footer.js"
];
