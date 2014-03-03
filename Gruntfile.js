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
                src: ['src/**/*.js'],
                options: {
                    indent:4,
                    ignores: ['src/banner.js','src/footer.js','src/d3.box.js']
                }
            },
            others: {
                src: ['Gruntfile.js', 'spec/**/*.js', 'web/stock.js'],
                options: { '-W041': true }
            }
        },
        watch: {
          scripts: {
            files: ['src/**/*.js'],
            tasks: ['build', 'copy']
          },
          tests: {
            files: ['src/**/*.js', 'spec/**/*.js'],
            tasks: ['test']
          },
          jasmine_runner: {
            files: ['spec/**/*.js'],
            tasks: ['jasmine:specs:build']
          },
          reload: {
            files: ['dc.js', 'dc.css', 'web/js/dc.js', 'web/css/dc.css', 'dc.min.js'],
            options: {
              livereload: true
            }
          }
        },
        jasmine: {
            specs: {
                options: {
                    specs:  "spec/*-spec.js",
                    helpers: "spec/helpers/*.js",
                    version: "2.0.0-rc5",
                    keepRunner: true,
                    outfile: "web/jasmine-runner.html"
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-docco2');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-shell');

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
        var phantomjs = require('grunt-lib-phantomjs').init(grunt);
        var passed = false;
        require(__dirname + "/regression/difflib.js");

        function diffPages(first, second) {
            var firstLines = difflib.stringAsLines(first);
            var secondLines = difflib.stringAsLines(second);
            var seq = new difflib.SequenceMatcher(firstLines, secondLines);
            var ops = seq.get_opcodes();
            var diffs = [];

            for (var i = 0; i < ops.length; i++) {
                var op = ops[i];
                var firstDiff = firstLines.slice(op[1], op[2]).join("\n");
                var secondDiff = secondLines.slice(op[3], op[4]).join("\n");

                if (op[0] === 'replace') {
                    if (!onlyDiffersByDelta(firstDiff, secondDiff, 0.01)) {
                        diffs.push("Replacement:");
                        diffs.push(firstDiff.red);
                        diffs.push(secondDiff.green);
                    }
                } else if (op[0] === 'insert') {
                    diffs.push("Insertion:");
                    diffs.push(secondDiff.green);
                } else if (op[0] === 'delete') {
                    diffs.push("Deletion:");
                    diffs.push(firstDiff.red);
                }
            }

            return diffs.join("\n\n");
        }

        function onlyDiffersByDelta(firstLine, secondLine, delta) {
            var findNums = /(?:[0-9]*\.[0-9]+|[0-9]+)/g;

            var firstNums = firstLine.match(findNums);
            var secondNums = secondLine.match(findNums);

            var firstWithoutNums = firstLine.replace(findNums, "NUMBER");
            var secondWithoutNums = secondLine.replace(findNums, "NUMBER");

            if (firstWithoutNums !== secondWithoutNums) {
                return false;
            }

            if (secondNums.length !== firstNums.length) {
                return false;
            }

            for (var i = 0; i < firstNums.length; i++) {
                if (Math.abs(+firstNums[i] - +secondNums[i]) > delta) {
                    return false;
                }
            }

            return true;
        }

        phantomjs.on('rendered', function(pageStr) {
            require("fs").readFile(__dirname + '/regression/rendered-stock-fixture.html', function (err, data) {
                var fixtureStr = data.toString();

                if (err) {
                    grunt.log.error("Failed to open stock example.");
                } else {
                    var diffs = diffPages(fixtureStr, pageStr);
                    if (diffs.length > 0) {
                        grunt.log.error("Failed comparison to stock example.");
                        grunt.log.error("If these changes are intentional, please run `grunt update-stock-example` to overwrite the fixture.");
                        if (option === "diff") {
                            grunt.log.writeln("\n" + diffs + "\n");
                        } else {
                            grunt.log.error("Run `grunt test-stock-example:diff` to see differences.");
                        }
                    } else {
                        grunt.log.writeln("Passed comparison to stock example.");
                        passed = true;
                    }
                }
                phantomjs.halt();
            });
        });

        var done = this.async();
        phantomjs.spawn('web/index.html', {
            options: {
                inject: __dirname + "/regression/inject-serializer.js"
            },
            done: function () {
                if (!passed) {
                    grunt.fatal("Failed regression test.");
                }
                done();
            }
        });
    });
    grunt.registerTask('update-stock-example', 'Update the baseline stock example web page.', function () {
        var phantomjs = require('grunt-lib-phantomjs').init(grunt);
        var ok = false;

        phantomjs.on('rendered', function(pageStr) {
            require("fs").writeFile(__dirname + '/regression/rendered-stock-fixture.html', pageStr, function (err) {
                if (!err) {
                    grunt.log.writeln("Overwrote stock example.");
                    ok = true;
                }
                phantomjs.halt();
            });
        });

        var done = this.async();
        phantomjs.spawn('web/index.html', {
            options: {
                inject: __dirname + "/regression/inject-serializer.js"
            },
            done: function () {
                if (!ok) {
                    grunt.fatal("Failed to overwrite stock example.");
                }
                done();
            }
        });
    });

    // task aliases
    grunt.registerTask('build', ['concat', 'uglify', 'sed']);
    grunt.registerTask('docs', ['build', 'copy', 'emu', 'toc', 'markdown', 'docco']);
    grunt.registerTask('web', ['docs', 'gh-pages']);
    grunt.registerTask('test', ['docs', 'jasmine:specs', 'test-stock-example', 'shell:hooks']);
    grunt.registerTask('coverage', ['jasmine:coverage']);
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
