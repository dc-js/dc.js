module.exports = function (grunt) {
    'use strict';

    var jsFiles = module.exports.jsFiles;

    var output = {
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
                src: ['src/**/*.js','Gruntfile.js', 'spec/**/*.js', 'web/stock.js'],
                options: {
                    indent: 4,
                    ignores: ['src/banner.js','src/footer.js','src/d3.box.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['build', 'copy']
            },
            jasmine_runner: {
                files: ['spec/**/*.js'],
                tasks: ['jasmine:specs:build']
            },
            tests: {
                files: ['src/**/*.js', 'spec/**/*.js'],
                tasks: ['test']
            },
            reload: {
                files: ['dc.js', 'dc.css', 'web/js/dc.js', 'web/css/dc.css', 'dc.min.js'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8888,
                    base: '.'
                }
            }
        },
        jasmine: {
            specs: {
                options: {
                    display: "short",
                    summary: true,
                    specs:  "spec/*-spec.js",
                    helpers: "spec/helpers/*.js",
                    version: "2.0.0",
                    outfile: "spec/index.html",
                    keepRunner: true
                },
                src: [
                    "web/js/d3.js",
                    "web/js/crossfilter.js",
                    "web/js/colorbrewer.js",
                    "dc.js"
                ]
            },
            coverage:{
                src: '<%= jasmine.specs.src %>',
                options:{
                    specs: '<%= jasmine.specs.options.specs %>',
                    helpers: '<%= jasmine.specs.options.helpers %>',
                    version: '<%= jasmine.specs.options.version %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/jasmine/coverage.json',
                        report: [
                            {
                                type: 'html',
                                options: {
                                    dir: 'coverage/jasmine'
                                }
                            }
                        ]
                    }
                }
            }
        },
        'saucelabs-jasmine': {
            all: {
                options: {
                    urls: ["http://localhost:8888/spec/"],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: [
                        { browserName: "firefox", version: "25", platform: "linux" },
                        { browserName: "safari", version: "7", platform: "OS X 10.9" },
                        { browserName: "internet explorer", version: "10", platform: "WIN8" }
                    ],
                    testname: "dc.js"
                }
            }
        },
        emu: {
            api: {
                src: output.js,
                dest: 'web/docs/api-latest.md'
            }
        },
        toc: {
            api: {
                src: '<%= emu.api.dest %>',
                dest: '<%= emu.api.dest %>'
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
            options: {
                dst: 'web/docs',
                basepath:'web'
            },
            howto: {
                files: [
                    {
                        src: ['web/stock.js']
                    }
                ]
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
                            'node_modules/d3/d3.js',
                            'node_modules/crossfilter/crossfilter.js',
                            'test/env-data.js'],
                      dest: 'web/js/'
                    }
                ]
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
            },
            hooks: {
                command: 'cp -n scripts/pre-commit.sh .git/hooks/pre-commit' +
                    ' || echo "Cowardly refusing to overwrite your existing git pre-commit hook."'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-docco2');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-debug-task');

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
    grunt.registerMultiTask('toc', 'Generate a markdown table of contents.', function() {
        var marked = require('marked'),
            slugify = function(s) { return s.trim().replace(/[-_\s]+/g, '-').toLowerCase(); },
            srcFile = this.files[0].src[0],
            destFile = this.files[0].dest,
            source = grunt.file.read(srcFile),
            tokens = marked.lexer(source),
            toc = tokens.filter(function (item) {
                return item.type == "heading" && item.depth == 2;
            }).reduce(function(toc, item) {
                return toc + "  * [" + item.text + "](#" + slugify(item.text) + ")\n";
            }, "");

        grunt.file.write(destFile, "# DC API\n" + toc +"\n"+ source);
        grunt.log.writeln('Added TOC to "' + destFile + '".');
    });
    grunt.registerTask('test-stock-example', 'Test a new rendering of the stock example web page against a baseline rendering', function (option) {
        require('./regression/stock-regression-test.js').testStockExample(this.async(), option === "diff");
    });
    grunt.registerTask('update-stock-example', 'Update the baseline stock example web page.', function () {
        require('./regression/stock-regression-test.js').updateStockExample(this.async());
    });
    grunt.registerTask('watch:jasmine', function () {
        grunt.config('watch', {
            options: { interrupt: true },
            runner: grunt.config('watch').jasmine_runner,
            scripts: grunt.config('watch').scripts
        });
        grunt.task.run('watch');
    });

    // task aliases
    grunt.registerTask('build', ['concat', 'uglify', 'sed']);
    grunt.registerTask('docs', ['build', 'copy', 'emu', 'toc', 'markdown', 'docco']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('server', ['docs', 'jasmine:specs:build', 'connect:server', 'watch:jasmine']);
    grunt.registerTask('test', ['docs', 'jasmine:specs', 'test-stock-example', 'shell:hooks']);
    grunt.registerTask('coverage', ['docs', 'jasmine:coverage']);
    grunt.registerTask('ci', ['test', 'jasmine:specs:build', 'connect:server', 'saucelabs-jasmine']);
    grunt.registerTask('ci-pull', ['test', 'jasmine:specs:build', 'connect:server']);
    grunt.registerTask('lint', ['build', 'jshint']);
    grunt.registerTask('default', ['build']);
};

module.exports.jsFiles = [
    "src/banner.js",
    "src/core.js",
    "src/errors.js",
    "src/utils.js",
    "src/logger.js",
    "src/events.js",
    "src/filters.js",
    "src/base-mixin.js",
    "src/margin-mixin.js",
    "src/color-mixin.js",
    "src/coordinate-grid-mixin.js",
    "src/stack-mixin.js",
    "src/cap-mixin.js",
    "src/bubble-mixin.js",
    "src/pie-chart.js",
    "src/bar-chart.js",
    "src/line-chart.js",
    "src/data-count.js",
    "src/data-table.js",
    "src/data-grid.js",
    "src/bubble-chart.js",
    "src/composite-chart.js",
    "src/series-chart.js",
    "src/geo-choropleth-chart.js",
    "src/bubble-overlay.js",
    "src/row-chart.js",
    "src/legend.js",
    "src/scatter-plot.js",
    "src/number-display.js",
    "src/heatmap.js",
    "src/d3.box.js",
    "src/box-plot.js",
    "src/footer.js"  // NOTE: keep this last
];
