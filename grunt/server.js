module.exports = function(grunt) {
	grunt.registerTask('server', ['docs', 'fileindex', 'jasmine:specs:build', 'connect:server', 'watch:jasmine']);
};
