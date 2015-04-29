module.exports = {
	jsmin: {
        options: {
            mangle: true,
            compress: true,
            sourceMap: true,
            banner : '<%= conf.banner %>'
        },
        src: '<%= conf.pkg.name %>.js',
        dest: '<%= conf.pkg.name %>.min.js'
    }
};
