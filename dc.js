dc = {
    version: "0.1.0",
    _charts: []
};

dc.registerChart = function(chart) {
    dc._charts.push(chart);
};

dc.hasChart = function(chart) {
    return dc._charts.indexOf(chart) >= 0;
};

dc.removeAllCharts = function() {
    dc._charts = [];
};

dc.filterAll = function() {
    for (var i = 0; i < dc._charts.length; ++i) {
        dc._charts[i].filterAll();
    }
};

dc.renderAll = function() {
    for (var i = 0; i < dc._charts.length; ++i) {
        dc._charts[i].render();
    }
};
dc.baseMixin = function(chart) {
    var NO_FILTER = null;

    var _dimension;
    var _group;
    var _filter = NO_FILTER;

    var _anchor;
    var _root;

    var width = 0, height = 0;

    chart.dimension = function(d) {
        if (!arguments.length) return _dimension;
        _dimension = d;
        return chart;
    };

    chart.group = function(g) {
        if (!arguments.length) return _group;
        _group = g;
        return chart;
    };

    chart.filter = function(f) {
        if (!arguments.length) return _filter;

        _filter = f;

        if (chart.dataAreSet())
            chart.dimension().filter(_filter);

        return chart;
    };

    chart.filterAll = function() {
        return chart.filter(NO_FILTER);
    };

    chart.hasFilter = function() {
        return _filter != NO_FILTER;
    };

    chart.dataAreSet = function() {
        return _dimension != undefined && _group != undefined;
    };

    chart.select = function(s) {
        return _root.select(s);
    };

    chart.selectAll = function(s) {
        return _root.selectAll(s);
    };

    chart.anchor = function(a) {
        if (!arguments.length) return _anchor;
        _anchor = a;
        _root = d3.select(_anchor);
        return chart;
    };

    chart.root = function(r) {
        if (!arguments.length) return _root;
        _root = r;
        return chart;
    }

    chart.width = function(w) {
        if (!arguments.length) return width;
        width = w;
        return chart;
    };

    chart.height = function(h) {
        if (!arguments.length) return height;
        height = h;
        return chart;
    };

    return chart;
};dc.pieChart = function(selector) {

    var sliceCssClass = "pie-slice";

    var colors = d3.scale.category20c();

    var radius = 0, innerRadius = 0;

    var chart = dc.baseMixin({});

    chart.render = function() {
        chart.select("svg").remove();

        if (chart.dataAreSet()) {
            var topG = chart.generateTopLevelG();

            var dataPie = d3.layout.pie().value(function(d) {
                return d.value;
            });

            var arcs = chart.buildArcs();

            var slices = chart.drawSlices(topG, dataPie, arcs);

            chart.drawLabels(slices, arcs);

            chart.highlightFilter();
        }
    };

    chart.innerRadius = function(r) {
        if (!arguments.length) return innerRadius;
        innerRadius = r;
        return chart;
    };

    chart.colors = function(c) {
        if (!arguments.length) return colors;
        colors = c;
        return chart;
    };

    chart.radius = function(r) {
        if (!arguments.length) return radius;
        radius = r;
        return chart;
    };

    chart.generateTopLevelG = function() {
        return chart.root().append("svg")
            .data([chart.group().all()])
            .attr("width", chart.width())
            .attr("height", chart.height())
            .append("g")
            .attr("transform", "translate(" + chart.cx() + "," + chart.cy() + ")");
    };

    chart.cx = function() {
        return chart.width() / 2;
    };

    chart.cy = function() {
        return chart.height() / 2;
    };

    chart.buildArcs = function() {
        return d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);
    };

    chart.drawSlices = function(topG, dataPie, arcs) {
        var slices = topG.selectAll("g." + sliceCssClass)
            .data(dataPie)
            .enter()
            .append("g")
            .attr("class", sliceCssClass);

        slices.append("path")
            .attr("fill", function(d, i) {
                return colors(i);
            })
            .attr("d", arcs)
            .on("click", function(d) {
                chart.filter(d.data.key);
                chart.highlightFilter();
                dc.renderAll();
            });

        return slices;
    };

    chart.drawLabels = function(slices, arcs) {
        slices.append("text")
            .attr("transform", function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                var centroid = arcs.centroid(d);
                if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                    return "translate(0,0)";
                } else {
                    return "translate(" + centroid + ")";
                }
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                var data = d.data;

                if (data.value == 0)
                    return "";

                return data.key;
            });
    };

    chart.isSelectedSlice = function(d) {
        return chart.filter() == d.data.key;
    };

    chart.highlightFilter = function() {
        if (chart.hasFilter()) {
            chart.selectAll("g." + sliceCssClass).select("path").each(function(d) {
                if (chart.isSelectedSlice(d)) {
                    d3.select(this).attr("fill-opacity", 1)
                        .attr('stroke', "#ccc")
                        .attr('stroke-width', 3);
                } else {
                    d3.select(this).attr("fill-opacity", 0.1)
                        .attr('stroke-width', 0);
                }
            });
        }
    };

    dc.registerChart(chart);

    return chart.anchor(selector);
};
