module.exports = function(grunt) {
	grunt.registerMultiTask('toc', 'Generate a markdown table of contents.', function () {
        var marked = require('marked'),
            slugify = function (s) { return s.trim().replace(/[-_\s]+/g, '-').toLowerCase(); },
            srcFile = this.files[0].src[0],
            destFile = this.files[0].dest,
            source = grunt.file.read(srcFile),
            tokens = marked.lexer(source),
            toc = tokens.filter(function (item) {
                return item.type === 'heading' && item.depth === 2;
            }).reduce(function (toc, item) {
                return toc + '  * [' + item.text + '](#' + slugify(item.text) + ')\n';
            }, '');

        grunt.file.write(destFile, '# DC API\n' + toc + '\n' + source);
        grunt.log.writeln('Added TOC to \'' + destFile + '\'.');
    });
};
