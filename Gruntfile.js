module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-karma');

    var formatFileList = require('./grunt/format-file-list')(grunt);

    var config = {
        src: 'src',
        spec: 'spec',
        web: 'web',
        pkg: require('./package.json'),
        banner: grunt.file.read('./LICENSE_BANNER'),
        jsFiles: module.exports.jsFiles
    };

    // in d3v4 and d3v5 pre-built d3.js are in different sub folders
    var d3pkgSubDir = config.pkg.dependencies.d3.split('.')[0].replace(/[^\d]/g, '') === '4' ? 'build' : 'dist';

    grunt.initConfig({
        conf: config,

        concat: {
            js: {
                src: '<%= conf.jsFiles %>',
                dest: '<%= conf.pkg.name %>.js',
                options: {
                    process: true,
                    sourceMap: true,
                    banner: '<%= conf.banner %>'
                }
            },
            welcome: {
                src: ['docs/welcome.base.md', 'web/img/class-hierarchy.svg'],
                dest: 'welcome.md',
                options: {
                    process: function (src, filepath) {
                        return /svg/.test(filepath) ?
                            src.split('\n').slice(5).join('\n') :
                            src;
                    }
                }
            }
        },
        sass: {
            dist: {
                files: {
                    '<%= conf.pkg.name %>.css': 'style/<%= conf.pkg.name %>.scss'
                }
            }
        },
        uglify: {
            jsmin: {
                options: {
                    mangle: true,
                    compress: true,
                    sourceMap: true,
                    banner: '<%= conf.banner %>'
                },
                src: '<%= conf.pkg.name %>.js',
                dest: '<%= conf.pkg.name %>.min.js'
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            main: {
                files: {
                    '<%= conf.pkg.name %>.min.css': ['<%= conf.pkg.name %>.css']
                }
            }
        },
        jscs: {
            source: {
                src: [
                    '<%= conf.src %>/**/*.js',
                    '!<%= conf.src %>/{banner,footer,d3v3-compat}.js',
                    '<%= conf.spec %>/**/*.js',
                    'Gruntfile.js',
                    'grunt/*.js',
                    '<%= conf.web %>/stock.js'],
                options: {
                    config: '.jscsrc'
                }
            }
        },
        jshint: {
            source: {
                src: [
                    '<%= conf.src %>/**/*.js',
                    '!<%= conf.src %>/{banner,footer,d3v3-compat}.js',
                    '<%= conf.spec %>/**/*.js',
                    'Gruntfile.js',
                    'grunt/*.js',
                    '<%= conf.web %>/stock.js'
                ],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },
        watch: {
            jsdoc2md: {
                files: ['welcome.md', '<%= conf.src %>/**/*.js'],
                tasks: ['build', 'jsdoc', 'jsdoc2md']
            },
            scripts: {
                files: ['<%= conf.src %>/**/*.js', '<%= conf.web %>/stock.js'],
                tasks: ['docs']
            },
            sass: {
                files: ['style/<%= conf.pkg.name %>.scss'],
                tasks: ['sass', 'cssmin:main', 'copy:dc-to-gh']
            },
            tests: {
                files: ['<%= conf.src %>/**/*.js', '<%= conf.spec %>/**/*.js'],
                tasks: ['test']
            },
            reload: {
                files: ['<%= conf.pkg.name %>.js',
                    '<%= conf.pkg.name %>.css',
                    '<%= conf.web %>/js/<%= conf.pkg.name %>.js',
                    '<%= conf.web %>/css/<%= conf.pkg.name %>.css',
                    '<%= conf.pkg.name %>.min.js'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: process.env.PORT || 8888,
                    base: '.'
                }
            }
        },
        jasmine: {
            specs: {
                options: {
                    display: 'short',
                    summary: true,
                    specs:  '<%= conf.spec %>/*-spec.js',
                    helpers: [
                        '<%= conf.web %>/js/jasmine-jsreporter.js',
                        '<%= conf.web %>/js/compare-versions.js',
                        '<%= conf.spec %>/helpers/*.js'
                    ],
                    styles: [
                        '<%= conf.web %>/css/dc.css'
                    ],
                    version: '2.0.0',
                    outfile: '<%= conf.spec %>/index.html',
                    keepRunner: true
                },
                src: [
                    '<%= conf.web %>/js/d3.js',
                    '<%= conf.web %>/js/crossfilter.js',
                    '<%= conf.web %>/js/colorbrewer.js',
                    '<%= conf.pkg.name %>.js'
                ]
            }
        },
        karma: {
            options: {
                basePath: '',
                frameworks: ['jasmine'],
                files: [
                    // CSS files
                    '<%= conf.web %>/css/dc.css',
                    // Helpers
                    '<%= conf.web %>/js/jasmine-jsreporter.js',
                    '<%= conf.web %>/js/compare-versions.js',
                    '<%= conf.spec %>/helpers/*.js',
                    // JS code dependencies
                    '<%= conf.web %>/js/d3.js',
                    '<%= conf.web %>/js/crossfilter.js',
                    '<%= conf.web %>/js/colorbrewer.js',
                    // Code to be tested
                    '<%= conf.pkg.name %>.js',
                    // Jasmine spec files
                    '<%= conf.spec %>/*spec.js'
                ],
                exclude: [],
                preprocessors: {},
                // possible values: 'dots', 'progress'
                reporters: ['progress', 'summary'],
                summaryReporter: {
                    // 'failed', 'skipped' or 'all'
                    show: 'failed',
                    // Limit the spec label to this length
                    specLength: 100,
                    // Show an 'all' column as a summary
                    overviewColumn: true
                },
                port: 9876,
                colors: true,
                logLevel: 'INFO',
                autoWatch: false,
                browsers: ['Firefox'],
                browserConsoleLogOptions: {level: 'error'},
                singleRun: true,
                concurrency: Infinity
            },
            unit: {},
            coverage: {
                reporters: ['progress', 'coverage'],

                preprocessors: {
                    // source files, that you wanna generate coverage for
                    // do not include tests or libraries
                    // (these files will be instrumented by Istanbul)
                    '<%= conf.pkg.name %>.js': ['coverage']
                },

                // optionally, configure the reporter
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/'
                }
            },
            ci: {
                browsers: ['Chrome', 'Firefox'],
                concurrency: 1,
                reporters: ['dots', 'summary']
            },
            sauceLabs: {
                testName: 'dc.js unit tests',
                customLaunchers: {
                    slFirefoxLinux: {
                        base: 'SauceLabs',
                        browserName: 'firefox',
                        version: '45.0',
                        platform: 'Linux'
                    },
                    slSafari: {
                        base: 'SauceLabs',
                        browserName: 'safari',
                        version: '9.0',
                        platform: 'OS X 10.11'
                    },
                    slInternetExplorer11: {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        platform: 'Windows 10',
                        version: '11.0'
                    },
                    slInternetExplorer11win8: {
                        base: 'SauceLabs',
                        browserName: 'internet explorer',
                        version: '11.0',
                        platform: 'Windows 8.1'
                    },
                    slMicrosoftEdge: {
                        base: 'SauceLabs',
                        browserName: 'MicrosoftEdge',
                        version: '14',
                        platform: 'Windows 10'
                    }
                },
                browsers: ['slInternetExplorer11', 'slInternetExplorer11win8', 'slMicrosoftEdge',
                    'slFirefoxLinux', 'slSafari'],
                concurrency: 2,
                browserNoActivityTimeout: 120000,
                reporters: ['saucelabs', 'summary'],
                singleRun: true
            }
        },
        jsdoc: {
            dist: {
                src: ['welcome.md', '<%= conf.src %>/**/*.js', '!<%= conf.src %>/{banner,footer}.js'],
                options: {
                    destination: 'web/docs/html',
                    template: 'node_modules/ink-docstrap/template',
                    configure: 'jsdoc.conf.json'
                }
            }
        },
        jsdoc2md: {
            dist: {
                src: 'dc.js',
                dest: 'web/docs/api-latest.md'
            }
        },
        docco: {
            options: {
                dst: '<%= conf.web %>/docs'
            },
            howto: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= conf.web %>',
                        src: ['stock.js']
                    }
                ]
            }
        },
        copy: {
            'dc-to-gh': {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: ['<%= conf.pkg.name %>.css', '<%= conf.pkg.name %>.min.css'],
                        dest: '<%= conf.web %>/css/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            '<%= conf.pkg.name %>.js',
                            '<%= conf.pkg.name %>.js.map',
                            '<%= conf.pkg.name %>.min.js',
                            '<%= conf.pkg.name %>.min.js.map',
                            'node_modules/d3/' + d3pkgSubDir + '/d3.js',
                            'node_modules/crossfilter2/crossfilter.js',
                            'node_modules/file-saver/FileSaver.js'
                        ],
                        dest: '<%= conf.web %>/js/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            'node_modules/compare-versions/index.js'
                        ],
                        dest: '<%= conf.web %>/js/',
                        rename: function (dest, src) {
                            return dest + 'compare-versions.js';
                        }
                    }
                ]
            }
        },
        fileindex: {
            'examples-listing': {
                options: {
                    format: formatFileList,
                    absolute: true,
                    title: 'Index of dc.js examples',
                    heading: 'Examples of using dc.js',
                    description: 'An attempt to present a simple example of each chart type.',
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/master/<%= conf.web %>/examples'
                },
                files: [
                    {dest: '<%= conf.web %>/examples/index.html', src: ['<%= conf.web %>/examples/*.html']}
                ]
            },
            'transitions-listing': {
                options: {
                    format: formatFileList,
                    absolute: true,
                    title: 'Index of dc.js transition tests',
                    heading: 'Eyeball tests for dc.js transitions',
                    description: 'Transitions can only be tested by eye. ' +
                        'These pages automate the transitions so they can be visually verified.',
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/master/<%= conf.web %>/transitions'
                },
                files: [
                    {dest: '<%= conf.web %>/transitions/index.html', src: ['<%= conf.web %>/transitions/*.html']}
                ]
            },
            'resizing-listing': {
                options: {
                    format: formatFileList,
                    absolute: true,
                    title: 'Index of dc.js resizing tests',
                    heading: 'Eyeball tests for resizing dc.js charts',
                    description: 'It\'s a lot easier to test resizing behavior by eye. ' +
                        'These pages fit the charts to the browser dynamically so it\'s easier to test. ' +
                        'For the examples with a single chart taking up the entire window, you can add <code>?resize=viewbox</code> ' +
                        'to the URL to test resizing the chart using the ' +
          '<a href="http://dc-js.github.io/dc.js/docs/html/dc.baseMixin.html#useViewBoxResizing__anchor">useViewBoxResizing</a> strategy.',
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/master/<%= conf.web %>/resizing'
                },
                files: [
                    {dest: '<%= conf.web %>/resizing/index.html', src: ['<%= conf.web %>/resizing/*.html']}
                ]
            },
            'zoom-listing': {
                options: {
                    format: formatFileList,
                    absolute: true,
                    title: 'Index of dc.js zoom tests',
                    heading: 'Interactive test for dc.js chart zoom',
                    description: 'It\'s hard to conceive of a way to test zoom except by trying it. ' +
                        'So this is a substitute for automated tests in this area',
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/master/<%= conf.web %>/zoom'
                },
                files: [
                    {dest: '<%= conf.web %>/zoom/index.html', src: ['<%= conf.web %>/zoom/*.html']}
                ]
            }
        },

        'gh-pages': {
            options: {
                base: '<%= conf.web %>',
                message: 'Synced from from master branch.'
            },
            src: ['**']
        },
        shell: {
            merge: {
                command: function (pr) {
                    return [
                        'git fetch origin',
                        'git checkout master',
                        'git reset --hard origin/master',
                        'git fetch origin',
                        'git merge --no-ff origin/pr/' + pr + ' -m \'Merge pull request #' + pr + '\''
                    ].join('&&');
                },
                options: {
                    stdout: true,
                    failOnError: true
                }
            },
            amend: {
                command: 'git commit -a --amend --no-edit',
                options: {
                    stdout: true,
                    failOnError: true
                }
            },
            hooks: {
                command: 'cp -n scripts/pre-commit.sh .git/hooks/pre-commit' +
                    ' || echo \'Cowardly refusing to overwrite your existing git pre-commit hook.\''
            },
            hierarchy: {
                command: 'dot -Tsvg -o web/img/class-hierarchy.svg class-hierarchy.dot'
            }
        },
        browserify: {
            dev: {
                src: '<%= conf.pkg.name %>.js',
                dest: 'bundle.js',
                options: {
                    browserifyOptions: {
                        standalone: 'dc'
                    }
                }
            }
        }
    });

    grunt.registerTask('merge', 'Merge a github pull request.', function (pr) {
        grunt.log.writeln('Merge Github Pull Request #' + pr);
        grunt.task.run(['shell:merge:' + pr, 'test' , 'shell:amend']);
    });
    grunt.registerTask('test-stock-example', 'Test a new rendering of the stock example web page against a ' +
        'baseline rendering', function (option) {
            require('./regression/stock-regression-test.js').testStockExample(this.async(), option === 'diff');
        });
    grunt.registerTask('update-stock-example', 'Update the baseline stock example web page.', function () {
        require('./regression/stock-regression-test.js').updateStockExample(this.async());
    });
    grunt.registerTask('watch:scripts-sass-docs', function () {
        grunt.config('watch', {
            options: {
                interrupt: true
            },
            scripts: grunt.config('watch').scripts,
            sass: grunt.config('watch').sass
        });
        grunt.task.run('watch');
    });
    grunt.registerTask('safe-sauce-labs', function () {
        if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
            grunt.log.writeln('Skipping Sauce Lab tests - SAUCE_USERNAME/SAUCE_ACCESS_KEY not set');
            return;
        }
        grunt.task.run('karma:sauceLabs');
    });

    // task aliases
    grunt.registerTask('build', ['concat', 'sass', 'uglify', 'cssmin']);
    grunt.registerTask('docs', ['build', 'copy', 'jsdoc', 'jsdoc2md', 'docco', 'fileindex']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('server', ['docs', 'fileindex', 'jasmine:specs:build', 'connect:server', 'watch:scripts-sass-docs']);
    grunt.registerTask('test', ['build', 'copy', 'karma:unit']);
    // grunt.registerTask('test-browserify', ['build', 'copy', 'browserify', 'jasmine:browserify']);
    grunt.registerTask('coverage', ['build', 'copy', 'karma:coverage']);
    grunt.registerTask('ci', ['ci-pull', 'safe-sauce-labs']);
    grunt.registerTask('ci-pull', ['build', 'copy', 'karma:ci']);
    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.registerTask('default', ['build', 'shell:hooks']);
    grunt.registerTask('doc-debug', ['build', 'jsdoc', 'jsdoc2md', 'watch:jsdoc2md']);
};

module.exports.jsFiles = [
    'src/banner.js',   // NOTE: keep this first
    'src/core.js',
    'src/errors.js',
    'src/utils.js',
    'src/logger.js',
    'src/config.js',
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
    'src/sunburst-chart.js',
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
    'src/html-legend.js',
    'src/scatter-plot.js',
    'src/number-display.js',
    'src/heatmap.js',
    'src/d3.box.js',
    'src/box-plot.js',
    'src/select-menu.js',
    'src/text-filter-widget.js',
    'src/cbox-menu.js',
    'src/footer.js'  // NOTE: keep this last
];
