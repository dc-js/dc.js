module.exports = function(grunt) {
	grunt.registerTask('docs', ['build', 'copy', 'emu', 'toc', 'markdown', 'docco']);
};
