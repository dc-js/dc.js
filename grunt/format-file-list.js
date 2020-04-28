module.exports = function (grunt) {
    const PER_ROW = 4;
    return function (list, opts) {
        const files = list.sort().map(entry => {
            const f = entry.replace(/.*\//, '');
            return [f.replace('.html', '').replace(/-/g, ' '), f];
        }).filter(e => e[0] !== 'index');
        const rows = [];
        for (let i = 0; i < files.length; i += PER_ROW) {
            const cols = [];
            for (let j = 0; j < PER_ROW; ++j) {
                if (i + j >= files.length) {
                    break;
                }
                const file = files[i + j];
                cols.push(`    <td><a href="${file[1]}">${file[0]}</a></td>`);
            }
            rows.push(`  <tr>\n${cols.join('\n')}\n  </tr>`);
        }
        const alsoSee = opts.also ? `<p>Also see ${opts.also.map(cat => `<a href="../${cat}/">${cat}</a>`).join(' &ndash; ')}.</p>`: '';
        const body = `<table class="table">\n${rows.join('\n')}\n</table>`;
        return [
            `<html><head><title>${opts.title}</title>`,
            '<link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css"></head>',
            '<body><div class="container">',
            `<h2>${opts.heading}</h2>`,
            `<p>${opts.description}</p>`,
            alsoSee,
            '<p>Contributions <a href="https://github.com/dc-js/dc.js/blob/master/CONTRIBUTING.md">welcome</a>.',
            `Source <a href="${opts.sourceLink}">`,
            'here</a>.</p>',
            body,
            '</div></body></html>'
        ].join('\n');
    };
};
