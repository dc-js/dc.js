module.exports = {
	specs: {
        options: {
            display: 'short',
            summary: true,
            specs:  '<%= conf.spec %>/*-spec.js',
            helpers: '<%= conf.spec %>/helpers/*.js',
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
    },
    browserify: {
        options: {
            display: 'short',
            summary: true,
            specs:  '<%= conf.spec %>/*-spec.js',
            helpers: '<%= conf.spec %>/helpers/*.js',
            version: '2.0.0',
            outfile: '<%= conf.spec %>/index-browserify.html',
            keepRunner: true
        },
        src: [
            'bundle.js'
        ]
    }
};
