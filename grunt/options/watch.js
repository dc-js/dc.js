module.exports = {
	scripts: {
        files: ['<%= conf.src %>/**/*.js'],
        tasks: ['build', 'copy']
    },
    jasmineRunner: {
        files: ['<%= conf.spec %>/**/*.js'],
        tasks: ['jasmine:specs:build']
    },
    tests: {
        files: ['<%= conf.src %>/**/*.js', '<%= conf.spec %>/**/*.js'],
        tasks: ['test']
    },
    reload: {
        files: ['<%= conf.pkg.name %>.js',
            '<%= conf.pkg.name %>css',
            '<%= conf.web %>/js/<%= conf.pkg.name %>.js',
            '<%= conf.web %>/css/<%= conf.pkg.name %>.css',
            '<%= conf.pkg.name %>.min.js'],
        options: {
            livereload: true
        }
    }
};
