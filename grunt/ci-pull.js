module.exports = function(grunt) {
	grunt.registerTask('ci-pull', ['test', 'jasmine:specs:build', 'connect:server']);
};
