module.exports = {
	source: {
        src: ['<%= conf.src %>/**/*.js', 'Gruntfile.js', '<%= conf.web %>/stock.js'],
        options: {
            jshintrc: '.jshintrc',
            ignores: ['<%= conf.src %>/banner.js', '<%= conf.src %>/footer.js']
        }
    }
};
