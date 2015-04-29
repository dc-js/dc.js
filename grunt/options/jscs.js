module.exports = {
	old: {
        src: ['<%= conf.spec %>/**/*.js'],
        options: {
            validateIndentation: 4
        }
    },
    source: {
        src: ['<%= conf.src %>/**/*.js', '!<%= conf.src %>/{banner,footer}.js', 'Gruntfile.js',
            '<%= conf.web %>/stock.js'],
        options: {
            config: '.jscsrc'
        }
    }
};
