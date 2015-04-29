module.exports = {
	html: {
        src: '<%= emu.api.dest %>',
        dest: '<%= conf.web %>/docs/index.html'
    },
    options: {markdownOptions: {highlight: 'manual'}}
};
