module.exports = function(grunt) {
	grunt.registerTask('lint', ['build', 'jshint', 'jscs']);
};
