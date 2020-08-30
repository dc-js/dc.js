module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-karma');

    const formatFileList = require('./grunt/format-file-list')(grunt);

    const config = {
        src: 'src',
        spec: 'spec',
        web: 'web',
        websrc: 'web-src',
        dist: 'dist',
        pkg: require('./package.json'),
        banner: grunt.file.read('./LICENSE_BANNER')
    };

    // in d3v4 and d3v5 pre-built d3.js are in different sub folders
    const d3pkgSubDir = config.pkg.dependencies.d3.split('.')[0].replace(/[^\d]/g, '') === '4' ? 'build' : 'dist';

    const lintableFiles = `'${config.src}' '${config.spec}' '*.js' 'grunt/*.js' '<%= conf.websrc %>/stock.js'`;

    const sass = require('node-sass');

    grunt.initConfig({
        conf: config,

        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    '<%= conf.dist %>/style/<%= conf.pkg.name %>.css': 'style/<%= conf.pkg.name %>.scss'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            main: {
                files: {
                    '<%= conf.dist %>/style/<%= conf.pkg.name %>.min.css': ['<%= conf.dist %>/style/<%= conf.pkg.name %>.css']
                }
            }
        },
        watch: {
            jsdoc2md: {
                files: ['docs/welcome.base.md', '<%= conf.src %>/**/*.js'],
                tasks: ['build', 'jsdoc', 'jsdoc2md']
            },
            scripts: {
                files: ['<%= conf.src %>/**/*.js', '<%= conf.web %>/stock.js'],
                tasks: ['docs']
            },
            websrc: {
                files: ['<%= conf.websrc %>/**/*.html', '<%= conf.websrc %>/**/*.js'],
                tasks: ['docs']
            },
            sass: {
                files: ['style/<%= conf.pkg.name %>.scss'],
                tasks: ['sass', 'cssmin:main', 'copy:dc-to-gh']
            },
            tests: {
                files: [
                    '<%= conf.src %>/**/*.js',
                    '<%= conf.spec %>/*.js',
                    '<%= conf.spec %>/helpers/*.js',
                    '<%= conf.websrc %>/**/*',
                    'docs/**/*'],
                tasks: ['test']
            },
            reload: {
                files: ['<%= conf.dist %>/<%= conf.pkg.name %>.js',
                        '<%= conf.dist %>/style/<%= conf.pkg.name %>.css',
                        '<%= conf.web %>/js/<%= conf.pkg.name %>.js',
                        '<%= conf.web %>/css/<%= conf.pkg.name %>.css',
                        '<%= conf.dist %>/<%= conf.pkg.name %>.min.js'],
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
                        '<%= conf.spec %>/helpers/*.js',
                        '<%= conf.spec %>/3rd-party/*.js'
                    ],
                    styles: [
                        '<%= conf.dist %>/style/dc.css'
                    ],
                    outfile: '<%= conf.spec %>/index.html',
                    keepRunner: true
                },
                src: [
                    '<%= conf.dist %>/<%= conf.pkg.name %>.js'
                ]
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            unit: {},
            coverage: {
                reporters: ['progress', 'coverage'],

                preprocessors: {
                    // source files, that you wanna generate coverage for
                    // do not include tests or libraries
                    // (these files will be instrumented by Istanbul)
                    '<%= conf.dist %>/<%= conf.pkg.name %>.js': ['coverage']
                },

                // optionally, configure the reporter
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/'
                }
            },
            ci: {
                browsers: ['ChromeNoSandboxHeadless', 'FirefoxHeadless'],
                concurrency: 1,
                reporters: ['dots', 'summary']
            },
            'ci-windows': {
                browsers: ['EdgeHeadless', 'ChromeNoSandboxHeadless', 'FirefoxHeadless'],
                concurrency: 1,
                reporters: ['dots', 'summary']
            },
            'ci-macos': {
                browsers: ['Safari', 'ChromeNoSandboxHeadless', 'FirefoxHeadless'],
                concurrency: 1,
                reporters: ['dots', 'summary']
            },
        },
        jsdoc: {
            dist: {
                src: ['docs/welcome.base.md', '<%= conf.src %>/**/*.js', '!<%= conf.src %>/{banner,footer}.js'],
                options: {
                    destination: '<%= conf.web %>/docs/html',
                    template: 'node_modules/ink-docstrap/template',
                    configure: 'jsdoc.conf.json'
                }
            }
        },
        jsdoc2md: {
            dist: {
                src: '<%= conf.dist %>/<%= conf.pkg.name %>.js',
                dest: 'docs/api-latest.md'
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
                        nonull: true,
                        cwd: '<%= conf.websrc %>',
                        src: '**',
                        dest: '<%= conf.web %>/'
                    },
                    {
                        expand: true,
                        cwd: 'docs/old-api-docs',
                        src: '**',
                        dest: '<%= conf.web %>/docs/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: ['<%= conf.dist %>/style/<%= conf.pkg.name %>.css', '<%= conf.dist %>/style/<%= conf.pkg.name %>.min.css'],
                        dest: '<%= conf.web %>/css/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            '<%= conf.dist %>/<%= conf.pkg.name %>.js',
                            '<%= conf.dist %>/<%= conf.pkg.name %>.js.map',
                            '<%= conf.dist %>/<%= conf.pkg.name %>.min.js',
                            '<%= conf.dist %>/<%= conf.pkg.name %>.min.js.map',
                            `node_modules/d3/${d3pkgSubDir}/d3.js`,
                            'node_modules/crossfilter2/crossfilter.js',
                            'node_modules/file-saver/FileSaver.js',
                            'node_modules/reductio/reductio.js',
                            'node_modules/regression/dist/regression.js'
                        ],
                        dest: '<%= conf.web %>/js/'
                    }
                ]
            },
            'specs': {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            `node_modules/d3/${d3pkgSubDir}/d3.js`,
                            'node_modules/crossfilter2/crossfilter.js',
                        ],
                        dest: '<%= conf.spec %>/3rd-party/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            'node_modules/compare-versions/index.js'
                        ],
                        dest: '<%= conf.spec %>/3rd-party/',
                        rename: function (dest, src) {
                            return `${dest}compare-versions.js`;
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
                    also: ['transitions', 'resizing', 'zoom'],
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/<%= conf.websrc %>/examples'
                },
                files: [
                    {dest: '<%= conf.web %>/examples/index.html', src: ['<%= conf.websrc %>/examples/*.html']}
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
                    also: ['examples', 'resizing', 'zoom'],
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/<%= conf.websrc %>/transitions'
                },
                files: [
                    {dest: '<%= conf.web %>/transitions/index.html', src: ['<%= conf.websrc %>/transitions/*.html']}
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
                    also: ['examples', 'transitions', 'zoom'],
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/<%= conf.websrc %>/resizing'
                },
                files: [
                    {dest: '<%= conf.web %>/resizing/index.html', src: ['<%= conf.websrc %>/resizing/*.html']}
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
                    also: ['examples', 'transitions', 'resizing'],
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/<%= conf.websrc %>/zoom'
                },
                files: [
                    {dest: '<%= conf.web %>/zoom/index.html', src: ['<%= conf.websrc %>/zoom/*.html']}
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
                command: 'dot -Tsvg -o <%= conf.websrc %>/img/class-hierarchy.svg class-hierarchy.dot'
            },
            'dist-clean': {
                command: 'rm -rf dist/'
            },
            rollup: {
                command: 'rollup --config'
            },
            eslint: {
                command: `eslint ${lintableFiles}`
            },
            'eslint-fix': {
                command: `eslint ${lintableFiles} --fix`
            }
        }
    });

    grunt.registerTask('merge', 'Merge a github pull request.', pr => {
        grunt.log.writeln(`Merge Github Pull Request #${pr}`);
        grunt.task.run([`shell:merge:${pr}`, 'test' , 'shell:amend']);
    });
    grunt.registerTask(
        'test-stock-example',
        'Test a new rendering of the stock example web page against a baseline rendering',
        function (option) {
            require('./regression/stock-regression-test.js').testStockExample(this.async(), option === 'diff');
        });
    grunt.registerTask('update-stock-example', 'Update the baseline stock example web page.', function () {
        require('./regression/stock-regression-test.js').updateStockExample(this.async());
    });
    grunt.registerTask('watch:scripts-sass-docs', () => {
        grunt.config('watch', {
            scripts: grunt.config('watch').scripts,
            websrc: grunt.config('watch').websrc,
            sass: grunt.config('watch').sass
        });
        grunt.task.run('watch');
    });

    // task aliases
    grunt.registerTask('build', ['shell:dist-clean', 'shell:rollup', 'sass', 'cssmin']);
    grunt.registerTask('docs', ['build', 'copy', 'jsdoc', 'jsdoc2md', 'docco', 'fileindex']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('server-only', ['docs', 'fileindex', 'jasmine:specs:build', 'connect:server']);
    grunt.registerTask('server', ['server-only', 'watch:scripts-sass-docs']);
    // This task will active server, test when initiated, and then keep a watch for changes, and rebuild and test as needed
    grunt.registerTask('test-n-serve', ['server-only', 'test', 'watch:tests']);
    grunt.registerTask('test', ['build', 'copy', 'karma:unit']);
    grunt.registerTask('coverage', ['build', 'copy', 'karma:coverage']);
    grunt.registerTask('ci-pull', ['build', 'copy', 'karma:ci']);
    grunt.registerTask('ci-windows', ['build', 'copy', 'karma:ci-windows']);
    grunt.registerTask('ci-macos', ['build', 'copy', 'karma:ci-macos']);
    grunt.registerTask('lint', ['shell:eslint']);
    grunt.registerTask('lint-fix', ['shell:eslint-fix']);
    grunt.registerTask('default', ['build', 'shell:hooks']);
    grunt.registerTask('doc-debug', ['build', 'jsdoc', 'jsdoc2md', 'watch:jsdoc2md']);
};
