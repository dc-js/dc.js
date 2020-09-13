module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*'],
    });
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-karma');

    const formatFileList = require('./grunt/format-file-list')(grunt);
    const lintableFiles = "'spec/**/*.js' '*.js' 'grunt/*.js' 'web-src/stock.js'";

    const sass = require('node-sass');

    grunt.initConfig({
        sass: {
            options: {
                implementation: sass,
            },
            dist: {
                files: {
                    'dist/style/dc.css': 'style/dc.scss',
                },
            },
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
            },
            main: {
                files: {
                    'dist/style/dc.min.css': ['dist/style/dc.css'],
                },
            },
        },
        watch: {
            typedoc: {
                files: ['docs/**/*', 'src/**/*.ts', '!src/compat/**/*'], // Typedoc excludes compat
                tasks: ['shell:typedoc'],
                options: {
                    atBegin: true,
                    interrupt: true,
                },
            },
            docco: {
                files: ['web-src/stock.js'],
                tasks: ['copy:web', 'docco'],
                options: {
                    atBegin: true,
                    interrupt: true,
                },
            },
            websrc: {
                files: ['web-src/**/*', '!web-src/stock.js'],
                tasks: ['shell:web-clean', 'copy:web', 'fileindex'],
                options: {
                    atBegin: true,
                    interrupt: true,
                },
            },
            sass: {
                files: ['style/dc.scss'],
                tasks: ['sass', 'cssmin:main', 'copy:web'],
                options: {
                    atBegin: true,
                    interrupt: true,
                },
            },
            tests: {
                files: [
                    'src/**/*.ts',
                    'spec/*.js',
                    'spec/helpers/*.js',
                    'tsconfig.json',
                    'rollup.config.js',
                ],
                tasks: ['test'],
                options: {
                    atBegin: true,
                    interrupt: true,
                },
            },
            reload: {
                files: [
                    'dist/dc.js',
                    'dist/style/dc.css',
                    'web/js/dc.js',
                    'web/css/dc.css',
                    'dist/dc.min.js',
                ],
                options: {
                    livereload: true,
                },
            },
        },
        connect: {
            server: {
                options: {
                    port: process.env.PORT || 8888,
                    base: '.',
                },
            },
        },
        jasmine: {
            specs: {
                options: {
                    display: 'short',
                    summary: true,
                    specs: 'spec/*-spec.js',
                    helpers: ['spec/helpers/*.js', 'spec/3rd-party/*.js'],
                    styles: ['dist/style/dc.css'],
                    outfile: 'spec/index.html',
                    keepRunner: true,
                },
                src: ['dist/dc.js'],
            },
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
            },
            unit: {},
            coverage: {
                reporters: ['progress', 'coverage'],

                preprocessors: {
                    // source files, that you wanna generate coverage for
                    // do not include tests or libraries
                    // (these files will be instrumented by Istanbul)
                    'dist/dc.js': ['coverage'],
                },

                // optionally, configure the reporter
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/',
                },
            },
            ci: {
                browsers: ['ChromeNoSandboxHeadless', 'FirefoxHeadless'],
                concurrency: 1,
                reporters: ['dots', 'summary'],
            },
            'ci-windows': {
                browsers: ['EdgeHeadless', 'ChromeNoSandboxHeadless', 'FirefoxHeadless'],
                concurrency: 1,
                reporters: ['dots', 'summary'],
            },
            'ci-macos': {
                browsers: ['Safari', 'ChromeNoSandboxHeadless', 'FirefoxHeadless'],
                concurrency: 1,
                reporters: ['dots', 'summary'],
            },
        },
        docco: {
            options: {
                dst: 'web/docs',
            },
            howto: {
                files: [
                    {
                        expand: true,
                        cwd: 'web',
                        src: ['stock.js'],
                    },
                ],
            },
        },
        copy: {
            web: {
                files: [
                    {
                        expand: true,
                        nonull: true,
                        cwd: 'web-src',
                        src: '**',
                        dest: 'web/',
                    },
                    {
                        expand: true,
                        cwd: 'docs/old-api-docs',
                        src: '**',
                        dest: 'web/docs/',
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: ['dist/style/dc.css', 'dist/style/dc.min.css'],
                        dest: 'web/css/',
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            'dist/*.js',
                            'dist/*.js.map',
                            `node_modules/d3/dist/d3.js`,
                            'node_modules/crossfilter2/crossfilter.js',
                            'node_modules/file-saver/FileSaver.js',
                            'node_modules/reductio/reductio.js',
                            'node_modules/regression/dist/regression.js',
                        ],
                        dest: 'web/js/',
                    },
                ],
            },
            specs: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: [
                            `node_modules/d3/dist/d3.js`,
                            'node_modules/crossfilter2/crossfilter.js',
                        ],
                        dest: 'spec/3rd-party/',
                    },
                    {
                        expand: true,
                        flatten: true,
                        nonull: true,
                        src: ['node_modules/compare-versions/index.js'],
                        dest: 'spec/3rd-party/',
                        rename: function (dest, src) {
                            return `${dest}compare-versions.js`;
                        },
                    },
                ],
            },
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
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/web-src/examples',
                },
                files: [{ dest: 'web/examples/index.html', src: ['web-src/examples/*.html'] }],
            },
            'transitions-listing': {
                options: {
                    format: formatFileList,
                    absolute: true,
                    title: 'Index of dc.js transition tests',
                    heading: 'Eyeball tests for dc.js transitions',
                    description:
                        'Transitions can only be tested by eye. ' +
                        'These pages automate the transitions so they can be visually verified.',
                    also: ['examples', 'resizing', 'zoom'],
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/web-src/transitions',
                },
                files: [
                    { dest: 'web/transitions/index.html', src: ['web-src/transitions/*.html'] },
                ],
            },
            'resizing-listing': {
                options: {
                    format: formatFileList,
                    absolute: true,
                    title: 'Index of dc.js resizing tests',
                    heading: 'Eyeball tests for resizing dc.js charts',
                    description:
                        "It's a lot easier to test resizing behavior by eye. " +
                        "These pages fit the charts to the browser dynamically so it's easier to test. " +
                        'For the examples with a single chart taking up the entire window, you can add <code>?resize=viewbox</code> ' +
                        'to the URL to test resizing the chart using the ' +
                        '<a href="http://dc-js.github.io/dc.js/docs/html/dc.baseMixin.html#useViewBoxResizing__anchor">' +
                        'useViewBoxResizing</a> strategy.',
                    also: ['examples', 'transitions', 'zoom'],
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/web-src/resizing',
                },
                files: [{ dest: 'web/resizing/index.html', src: ['web-src/resizing/*.html'] }],
            },
            'zoom-listing': {
                options: {
                    format: formatFileList,
                    absolute: true,
                    title: 'Index of dc.js zoom tests',
                    heading: 'Interactive test for dc.js chart zoom',
                    description:
                        "It's hard to conceive of a way to test zoom except by trying it. " +
                        'So this is a substitute for automated tests in this area',
                    also: ['examples', 'transitions', 'resizing'],
                    sourceLink: 'https://github.com/dc-js/dc.js/tree/develop/web-src/zoom',
                },
                files: [{ dest: 'web/zoom/index.html', src: ['web-src/zoom/*.html'] }],
            },
        },
        'gh-pages': {
            options: {
                base: 'web',
                message: 'Synced from from master branch.',
            },
            src: ['**'],
        },
        shell: {
            merge: {
                command: function (pr) {
                    return [
                        'git fetch origin',
                        'git checkout master',
                        'git reset --hard origin/master',
                        'git fetch origin',
                        `git merge --no-ff origin/pr/${pr} -m 'Merge pull request #${pr}'`,
                    ].join('&&');
                },
                options: {
                    stdout: true,
                    failOnError: true,
                },
            },
            amend: {
                command: 'git commit -a --amend --no-edit',
                options: {
                    stdout: true,
                    failOnError: true,
                },
            },
            hooks: {
                command:
                    'cp -n scripts/pre-commit.sh .git/hooks/pre-commit' +
                    " || echo 'Cowardly refusing to overwrite your existing git pre-commit hook.'",
            },
            hierarchy: {
                command: 'dot -Tsvg -o web-src/img/class-hierarchy.svg class-hierarchy.dot',
            },
            'dist-clean': {
                command: 'rm -rf dist/',
            },
            'web-clean': {
                command: 'rm -rf web/',
            },
            'specs-clean': {
                command: 'rm -rf spec/3rd-party',
            },
            rollup: {
                command: 'rollup --config',
            },
            typedoc: {
                command: 'typedoc src/index.ts',
            },
            eslint: {
                command: `eslint ${lintableFiles}`,
            },
            'eslint-fix': {
                command: `eslint ${lintableFiles} --fix`,
            },
            tslint: {
                command: 'tslint src/**/*.ts',
            },
            'tslint-fix': {
                command: 'tslint src/**/*.ts --fix',
            },
            tsc: {
                command: 'tsc',
            },
            'prettier-check': {
                command: 'prettier --check src',
            },
            prettier: {
                command: 'prettier --write src',
            },
        },
    });

    grunt.registerTask('merge', 'Merge a github pull request.', pr => {
        grunt.log.writeln(`Merge Github Pull Request #${pr}`);
        grunt.task.run([`shell:merge:${pr}`, 'test', 'shell:amend']);
    });
    grunt.registerTask(
        'test-stock-example',
        'Test a new rendering of the stock example web page against a baseline rendering',
        function (option) {
            require('./regression/stock-regression-test.js').testStockExample(
                this.async(),
                option === 'diff'
            );
        }
    );
    grunt.registerTask(
        'update-stock-example',
        'Update the baseline stock example web page.',
        function () {
            require('./regression/stock-regression-test.js').updateStockExample(this.async());
        }
    );

    grunt.registerTask('watch:web-sass-docs-tests', () => {
        grunt.config('watch', {
            typedoc: grunt.config('watch').typedoc,
            docco: grunt.config('watch').docco,
            websrc: grunt.config('watch').websrc,
            sass: grunt.config('watch').sass,
            tests: grunt.config('watch').tests,
        });
        grunt.task.run('watch');
    });
    grunt.registerTask('watch:typedoc-docco', () => {
        grunt.config('watch', {
            typedoc: grunt.config('watch').typedoc,
            docco: grunt.config('watch').docco,
        });
        grunt.task.run('watch');
    });
    grunt.registerTask('watch:tests-web-sass', () => {
        grunt.config('watch', {
            websrc: grunt.config('watch').websrc,
            sass: grunt.config('watch').sass,
            tests: grunt.config('watch').tests,
        });
        grunt.task.run('watch');
    });

    // task aliases
    grunt.registerTask('build', [
        'shell:dist-clean',
        'shell:tsc',
        'shell:rollup',
        'sass',
        'cssmin',
    ]);
    grunt.registerTask('clean-copy', ['shell:web-clean', 'shell:specs-clean', 'copy']);
    grunt.registerTask('build-copy', ['build', 'clean-copy']);
    grunt.registerTask('pre-test', ['build-copy']);

    grunt.registerTask('test', ['pre-test', 'karma:unit']);
    grunt.registerTask('coverage', ['pre-test', 'karma:coverage']);
    grunt.registerTask('lint', ['shell:tslint', 'shell:eslint', 'shell:prettier-check']);
    grunt.registerTask('lint-fix', ['shell:tslint-fix', 'shell:eslint-fix', 'shell:prettier']);

    grunt.registerTask('docs', ['shell:typedoc', 'docco']);
    grunt.registerTask('web', ['build-copy', 'docs', 'gh-pages']);

    grunt.registerTask('server', ['connect:server', 'watch:web-sass-docs-tests']);
    grunt.registerTask('test-n-serve', ['connect:server', 'watch:tests-web-sass']);
    grunt.registerTask('docs-n-serve', ['connect:server', 'watch:typedoc-docco']);

    grunt.registerTask('ci', ['pre-test', 'karma:ci']);
    grunt.registerTask('ci-windows', ['pre-test', 'karma:ci-windows']);
    grunt.registerTask('ci-macos', ['pre-test', 'karma:ci-macos']);

    grunt.registerTask('default', ['build', 'shell:hooks']);
};
