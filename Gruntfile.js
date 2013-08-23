module.exports = function(grunt) {

grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  concat: {
    dist: {
      src: [
        "src/core.js",
        "src/errors.js",
        "src/utils.js",
        "src/events.js",
        "src/cumulative.js",
        "src/base-chart.js",
        "src/marginable.js",
        "src/coordinate-grid-chart.js",
        "src/color-chart.js",
        "src/stackable-chart.js",
        "src/abstract-bubble-chart.js",
        "src/pie-chart.js",
        "src/bar-chart.js",
        "src/line-chart.js",
        "src/data-count.js",
        "src/data-table.js",
        "src/bubble-chart.js",
        "src/composite-chart.js",
        "src/geo-choropleth-chart.js",
        "src/bubble-overlay.js",
        "src/row-chart.js",
        "src/legend.js"
      ],
      dest: './<%= pkg.name %>.js'
    }
  },
  uglify: {
    options: {
      banner: '<%= banner %>'
    },
    dist: {
      src: '<%= concat.dist.dest %>',
      dest: './<%= pkg.name %>.min.js'
    }
  },
  jshint: {
    all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    options: { '-W014': true, /*'-W041': true*/ }
  },
  vows: {
    all: {
      options: {
        reporter: "spec"
      },
      src: ["test/*.js", "spec/*"]
    }
  }
});

// These plugins provide necessary tasks.
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-vows');

// Default task.
grunt.registerTask('default', ['concat', 'uglify']);

};
