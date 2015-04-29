module.exports = function(grunt) {
	grunt.registerTask('test-browserify', ['build', 'browserify', 'jasmine:browserify']);
};
