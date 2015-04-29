module.exports = {
	'dc-to-gh': {
        files: [
            {expand: true, flatten: true, src: '<%= conf.pkg.name %>.css', dest: '<%= conf.web %>/css/'},
            {
                expand: true,
                flatten: true,
                src: [
                    '<%= conf.pkg.name %>.js',
                    '<%= conf.pkg.name %>.js.map',
                    '<%= conf.pkg.name %>.min.js',
                    '<%= conf.pkg.name %>.min.js.map',
                    'node_modules/d3/d3.js',
                    'node_modules/crossfilter/crossfilter.js',
                    'test/env-data.js'
                ],
                dest: '<%= conf.web %>/js/'
            }
        ]
    }
};
