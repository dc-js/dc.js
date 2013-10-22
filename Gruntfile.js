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
            source: {
                src: ['src/**/*.js'],
                options: {
                    indent:4,
                    ignores: ['src/banner.js','src/footer.js','src/d3.box.js']
                }
            },
            testAndBuld: {
                src: ['Gruntfile.js', 'test/**/*.js'],
                options: { '-W041': true }
            }
        },
        vows: {
            all: {
                options: {
                    /* reporter: "spec" */
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
        },
        shell: {
            merge: {
                command: function(pr) {
                    return ['git fetch origin',
                            'git checkout master',
                            'git reset --hard origin/master',
                            'git fetch origin',
                            'git merge --no-ff origin/pr/'+pr+' -m "Merge pull request #'+pr+'"'
                    ].join('&&');
                },
                options: { stdout: true, failOnError: true }
            },
            amend: {
                command: 'git commit -a --amend --no-edit',
                options: { stdout: true, failOnError: true }
            }
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
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-vows');

    // custom tasks
    grunt.registerMultiTask('emu', 'Documentation extraction by emu.', function() {
        var emu = require('emu'),
            fs = require('fs'),
            srcFile = this.files[0].src[0],
            destFile = this.files[0].dest,
            source = grunt.file.read(srcFile);
        grunt.file.write(destFile, emu.getComments(source));
        grunt.log.writeln('File "' + destFile + '" created.');
    });
    grunt.registerTask('merge', 'Merge a github pull request.', function(pr) {
        grunt.log.writeln('Merge Github Pull Request #' + pr);
        grunt.task.run(['shell:merge:'+pr,'test','shell:amend']);
    });
    grunt.registerTask('web-baseline', 'Rerender the example baselines.', function() {
        var render = require('./test/web-test');
        render(grunt.log.writeln);
    });

    // task aliases
    grunt.registerTask('build', ['concat', 'uglify', 'sed']);
    grunt.registerTask('docs', ['build', 'copy', 'emu', 'markdown', 'docco']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('test', ['docs', 'vows']);
    grunt.registerTask('lint', ['build', 'jshint']);
    grunt.registerTask('default', ['build']);
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
    "src/series-chart.js",
    "src/geo-choropleth-chart.js",
    "src/bubble-overlay.js",
    "src/row-chart.js",
    "src/legend.js",
    "src/capped.js",
    "src/scatter-plot.js",
    "src/number-display.js",
    "src/heatmap.js",
    "src/d3.box.js",
    "src/box-plot.js",
    "src/footer.js"
];
