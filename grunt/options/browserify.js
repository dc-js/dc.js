module.exports = {
	dev: {
        src: '<%= conf.pkg.name %>.js',
        dest: 'bundle.js',
        options: {
            browserifyOptions: {
                standalone: 'dc'
            }
        }
    }
};
