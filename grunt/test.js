module.exports = function(grunt) {
	grunt.registerTask('test', ['build', 'jasmine:specs', 'shell:hooks']);
};
