module.exports = function (grunt) {
    const formatFileList = require('./grunt/format-file-list')(grunt);
    const config = {
        src: 'src',
        spec: 'spec',
        web: 'web',
        pkg: require('./package.json'),
        banner: grunt.file.read('./LICENSE_BANNER'),
        jsFiles: module.exports.jsFiles
    };
    const path = require('path');
    const cssnano = require('cssnano');
    const webpack = require('webpack');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-lib-phantomjs', '!grunt-template-jasmine-istanbul']
    });
    require('time-grunt')(grunt);

    grunt.initConfig({
        conf: config,

        concat: {
            welcome: {
                src: ['docs/welcome.base.md', 'web/img/class-hierarchy.svg'],
                dest: 'welcome.md',
                options: {
                    process (src, filepath) {
                        return /svg/.test(filepath) ?
                            src.split('\n').slice(5).join('\n') :
                            src;
                    }
                }
            }
        },
        eslint: {
            source: {
                options: {
                    quiet: true
                },
                src: [
                    './index.js',
                    '<%= conf.src %>/**/*.js',
                    // '<%= conf.spec %>/**/*.js',
                    'Gruntfile.js'
                    // 'grunt/*.js',
                    // '<%= conf.web %>/stock.js'
                ]
            }
        },
        watch: {
            jsdoc2md: {
                files: ['welcome.md', '<%= conf.src %>/**/*.js'],
                tasks: ['build', 'jsdoc', 'jsdoc2md']
            },
            scripts: {
                files: ['style/<%= conf.pkg.name %>.scss', '<%= conf.src %>/**/*.js', '<%= conf.web %>/stock.js'],
                tasks: ['docs']
            },
            jasmineRunner: {
                files: ['<%= conf.spec %>/**/*.js'],
                tasks: ['jasmine:specs:build']
            },
            tests: {
                files: ['style/<%= conf.pkg.name %>.scss', '<%= conf.src %>/**/*.js', '<%= conf.spec %>/**/*.js'],
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
                    port: 8888,
                    base: '.'
                }
            }
        },
        jasmine: {
            specs: {
                options: {
                    display: 'short',
                    summary: true,
                    specs: '<%= conf.spec %>/*-spec.js',
                    helpers: [
                        '<%= conf.web %>/js/jasmine-jsreporter.js',
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
            },
            coverage: {
                src: '<%= jasmine.specs.src %>',
                options: {
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
                    urls: ['http://localhost:8888/spec/'],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    browsers: [
                        {
                            browserName: 'firefox',
                            version: '45.0',
                            platform: 'Linux'
                        },
                        {
                            browserName: 'safari',
                            version: '9.0',
                            platform: 'OS X 10.11'
                        },
                        {
                            browserName: 'internet explorer',
                            version: '11.0',
                            platform: 'Windows 10'
                        },
                        {
                            browserName: 'internet explorer',
                            version: '11.0',
                            platform: 'Windows 8.1'
                        },
                        {
                            browserName: 'MicrosoftEdge',
                            version: '14',
                            platform: 'Windows 10'
                        }
                    ],
                    testname: '<%= conf.pkg.name %>.js'
                }
            }
        },
        jsdoc: {
            dist: {
                src: ['welcome.md', '<%= conf.src %>/**/*.js'],
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
                            'node_modules/d3/d3.js',
                            'node_modules/crossfilter2/crossfilter.js',
                            'node_modules/queue-async/build/queue.js',
                            'node_modules/grunt-saucelabs/examples/jasmine/lib/jasmine-jsreporter/jasmine-jsreporter.js',
                            'node_modules/file-saver/FileSaver.js'
                        ],
                        dest: '<%= conf.web %>/js/'
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
                command (pr) {
                    return [
                        'git fetch origin',
                        'git checkout master',
                        'git reset --hard origin/master',
                        'git fetch origin',
                        `git merge --no-ff origin/pr/${pr} -m 'Merge pull request #${pr}'`
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
        webpack: {
            options: {
                progress: false, // freaked on windows
                failOnError: true,
                externals: {
                    crossfilter2: {
                        root: 'crossfilter',
                        commonjs: 'crossfilter2',
                        commonjs2: 'crossfilter2',
                        amd: 'crossfilter2',
                        toJSON: () => 'crossfilter2'
                    },
                    d3: 'd3'
                },
                entry: {
                    dc: path.resolve('./index.js')
                },
                devtool: 'source-map',
                module: {
                    rules: [
                        {test: /\.js$/, enforce: 'pre', use: 'source-map-loader'},
                        {test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'},
                        {
                            test: /\.(sass|scss)$/,
                            use: ExtractTextPlugin.extract({fallback: 'style-loader', use: ['css-loader', 'sass-loader']})
                        }
                    ]
                }
            },
            debug: {
                plugins: [
                    new webpack.DefinePlugin({
                        __VERSION__: JSON.stringify(config.pkg.version)
                    }),
                    new ExtractTextPlugin({
                        filename: '[name].css',
                        disable: false,
                        allChunks: true
                    }),
                    new webpack.BannerPlugin({banner: '<%= conf.banner %>', raw: true})
                ],
                output: {
                    filename: '[name].js',
                    library: 'dc',
                    libraryTarget: 'umd',
                    devtoolModuleFilenameTemplate: 'webpack:///<%= conf.pkg.name %>/[resource-path]'
                }
            },
            dist: {
                plugins: [
                    new webpack.DefinePlugin({
                        __VERSION__: JSON.stringify(config.pkg.version)
                    }),
                    new ExtractTextPlugin({
                        filename: '[name].min.css',
                        disable: false,
                        allChunks: true
                    }),
                    new OptimizeCssAssetsPlugin({
                        cssProcessor: cssnano,
                        cssProcessorOptions: {discardComments: {removeAll: true}}
                    }),
                    new webpack.optimize.UglifyJsPlugin({sourceMap: true, comments: false}),
                    new webpack.BannerPlugin({banner: '<%= conf.banner %>', raw: true})
                ],
                output: {
                    filename: '[name].min.js',
                    library: 'dc',
                    libraryTarget: 'umd',
                    devtoolModuleFilenameTemplate: 'webpack:///<%= conf.pkg.name %>/[resource-path]'
                }
            }
        }
    });

    grunt.registerTask('merge', 'Merge a github pull request.', (pr) => {
        grunt.log.writeln(`Merge Github Pull Request #${pr}`);
        grunt.task.run([`shell:merge:${pr}`, 'test', 'shell:amend']);
    });
    grunt.registerTask(
        'test-stock-example',
        'Test a new rendering of the stock example web page against a baseline rendering',
        function (option) {
            require('./regression/stock-regression-test.js').testStockExample(this.async(), option === 'diff');
        }
    );
    grunt.registerTask('update-stock-example', 'Update the baseline stock example web page.', function () {
        require('./regression/stock-regression-test.js').updateStockExample(this.async());
    });
    grunt.registerTask('watch:jasmine-docs', () => {
        grunt.config('watch', {
            options: {
                interrupt: true
            },
            runner: grunt.config('watch').jasmineRunner,
            scripts: grunt.config('watch').scripts,
            sass: grunt.config('watch').sass
        });
        grunt.task.run('watch');
    });

    // task aliases
    grunt.registerTask('build', ['concat', 'webpack']);
    grunt.registerTask('docs', ['build', 'copy', 'jsdoc', 'jsdoc2md', 'docco', 'fileindex']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('server', ['docs', 'fileindex', 'jasmine:specs:build', 'connect:server', 'watch:jasmine-docs']);
    grunt.registerTask('test', ['build', 'copy', 'jasmine:specs']);
    grunt.registerTask('coverage', ['build', 'copy', 'jasmine:coverage']);
    grunt.registerTask('ci', ['test', 'jasmine:specs:build', 'connect:server', 'saucelabs-jasmine']);
    grunt.registerTask('ci-pull', ['test', 'jasmine:specs:build', 'connect:server']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('default', ['build', 'shell:hooks']);
    grunt.registerTask('doc-debug', ['build', 'jsdoc', 'jsdoc2md', 'watch:jsdoc2md']);
};

module.exports.jsFiles = [
    'src/banner.js', // NOTE: keep this first
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
    'src/select-menu.js',
    'src/footer.js' // NOTE: keep this last
];
