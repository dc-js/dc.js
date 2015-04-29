module.exports = {
	'examples-listing': {
        options: {
            format: function (list) {
                var examples = list.sort().map(function (entry) {
                    return entry.replace(/.*examples\//, '');
                }).filter(function (e) { return e !== 'index.html'; });
                var rows = [];
                for (var i = 0; i < examples.length; i += 5) {
                    var cols = [];
                    for (var j = 0; j < 5; ++j) {
                        if (i + j >= examples.length) {
                            break;
                        }
                        var fname = examples[i + j];
                        cols.push('    <td><a href="' + fname + '">' + fname + '</a></td>');
                    }
                    rows.push('  <tr>\n' + cols.join('\n') + '\n<tr>');
                }
                var body = '<table class="table">\n' + rows.join('\n') + '\n</table>';
                return [
                    '<html><head><title>Index of dc.js examples</title>',
                    '<link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css"></head>',
                    '<body><div class="container">',
                    '<h2>Examples of using dc.js</h2>',
                    '<p>An attempt to present a simple example of each chart type.',
                    '<a href="https://github.com/dc-js/dc.js/blob/master/CONTRIBUTING.md">',
                    'Contributions welcome</a>.</p>',
                    '<p>Source <a href="https://github.com/dc-js/dc.js/tree/master/<%= conf.web %>/examples">',
                    'here</a>.</p>',
                    body,
                    '</div></body></html>'
                ].join('\n');
            },
            absolute: true
        },
        files: [
            {dest: '<%= conf.web %>/examples/index.html', src: ['<%= conf.web %>/examples/*.html']}
        ]
    }
};
