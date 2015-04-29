module.exports = function(grunt) {
	grunt.registerTask('watch:jasmine', function () {
        grunt.config('watch', {
            options: {
                interrupt: true
            },
            runner: grunt.config('watch').jasmineRunner,
            scripts: grunt.config('watch').scripts
        });
        grunt.task.run('watch');
    });
};
