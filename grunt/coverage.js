module.exports = function(grunt) {
	grunt.registerTask('coverage', ['build', 'jasmine:coverage']);
};
