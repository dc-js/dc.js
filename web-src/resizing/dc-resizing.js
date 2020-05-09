var find_query = function () {
    var _map = window.location.search.substr(1).split('&').map(function (a) {
        return a.split('=');
    }).reduce(function (p, v) {
        if (v.length > 1)
            p[v[0]] = decodeURIComponent(v[1].replace(/\+/g, " "));
        else
            p[v[0]] = true;
        return p;
    }, {});
    return function (field) {
        return _map[field] || null;
    };
}();
var resizeMode = (find_query('resize') || 'widhei').toLowerCase();

// apply resizing to a chart or charts
// if resizeMode is on, use viewbox resizing, which stretches the SVG instead of redrawing it
// otherwise, add a window.onresize handler to set the chart sizes based on the size of the window
// adjustX and adjustY are either adjustment functions
// or numbers to subtract from window.innerWidth and window.innerHeight
function apply_resizing(chart, adjustX, adjustY, onresize) {
    if (resizeMode === 'viewbox') {
        if(Array.isArray(chart))
            chart.forEach(c => apply_resizing(c, adjustX, adjustY, onresize));
        else {
            chart
                .width(600)
                .height(400)
                .useViewBoxResizing(true);
                d3.select(chart.anchor()).classed('fullsize', true);
        }
    } else {
        if(!Array.isArray(chart))
            chart = [chart];
        if(!isNaN(adjustX))
            adjustX = (dx => x => x-dx)(adjustX);
        adjustX = adjustX || (x => x);
        if(!isNaN(adjustY))
            adjustY = (dy => y => y-dy)(adjustY);
        adjustY = adjustY || adjustX || (y => y);
        chart.forEach(c => c.width(adjustX(window.innerWidth))
                      .height(adjustY(window.innerHeight)));
        window.onresize = function () {
            if (onresize) {
                chart.forEach(onresize);
            }
            chart.forEach(c => {
                c.width(adjustX(window.innerWidth))
                    .height(adjustY(window.innerHeight));
                if (c.rescale) {
                    c.rescale();
                }
            });
            redraw_chart_no_transitions(chart);
        };
    }
}
