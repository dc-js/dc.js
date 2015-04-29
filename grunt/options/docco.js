module.exports = {
	options: {
        dst: '<%= conf.web %>/docs',
        basepath:'<%= conf.web %>'
    },
    howto: {
        files: [
            {
                src: ['<%= conf.web %>/stock.js']
            }
        ]
    }
};
