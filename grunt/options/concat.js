module.exports = {
    options: {
        process: true,
        sourceMap: true,
        banner : '<%= conf.banner %>'
    },
    js: {
        src: '<%= conf.jsFiles %>',
        dest: '<%= conf.pkg.name %>.js'
    }
};
