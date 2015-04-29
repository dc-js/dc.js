module.exports = function(grunt) {
	grunt.registerMultiTask('emu', 'Documentation extraction by emu.', function () {
        var emu = require('emu'),
            srcFile = this.files[0].src[0],
            destFile = this.files[0].dest,
            source = grunt.file.read(srcFile);
        grunt.file.write(destFile, emu.getComments(source));
        grunt.log.writeln('File \'' + destFile + '\' created.');
    });
};
