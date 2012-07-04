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

dc.deregisterAllCharts = function() {
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
    };

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

    chart.resetSvg = function() {
        chart.select("svg").remove();
    };

    chart.generateTopLevelG = function() {
        return chart.root().append("svg")
            .data([chart.group().all()])
            .attr("width", chart.width())
            .attr("height", chart.height())
            .append("g");
    };

    return chart;
};dc.pieChart = function(selector) {

    var sliceCssClass = "pie-slice";

    var colors = d3.scale.category20c();

    var radius = 0, innerRadius = 0;

    var chart = dc.baseMixin({});

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            var topG = chart.generateTopLevelG()
                .attr("transform", "translate(" + chart.cx() + "," + chart.cy() + ")");

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
dc.barChart = function(selector) {

    var DEFAULT_Y_AXIS_TICKS = 5;
    var MIN_BAR_WIDTH = 1;

    var chart = dc.baseMixin({});

    var margin = {top: 10, right: 50, bottom: 30, left: 20};

    var x;
    var y = d3.scale.linear().range([100, 0]);
    var axisX = d3.svg.axis();
    var axisY = d3.svg.axis();
    var xUnits;

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            var g = chart.generateTopLevelG().attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.rangeRound([0, (chart.width() - margin.left - margin.right)]);
            axisX = axisX.scale(x).orient("bottom");

            y.domain([0, maxY()]).rangeRound([yAxisHeight(), 0]);
            axisY = axisY.scale(y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);

            g.selectAll("rect")
                .data(chart.group().all())
                .enter()
                .append("rect")
                .attr("x", function(d) {
                    return x(d.key) + margin.left;
                })
                .attr("y", function(d) {
                    return margin.top + y(d.value);
                })
                .attr("width", function(){
                    var w = Math.floor(chart.width() / xUnits(x.domain()[0], x.domain()[1]).length);
                    if(isNaN(w) || w < MIN_BAR_WIDTH)
                        w = MIN_BAR_WIDTH;
                    return w;
                })
                .attr("height", function(d) {
                    return yAxisHeight() - y(d.value);
                });

            g.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(" + margin.left + "," + xAxisY() + ")")
                .call(axisX);

            g.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(axisY);
        }
    };

    function maxY() {
        return chart.group().top(1)[0].value;
    }

    function yAxisHeight() {
        return chart.height() - margin.top - margin.bottom;
    }

    function xAxisY() {
        return (chart.height() - margin.bottom);
    }

    chart.margins = function(m) {
        if (!arguments.length) return margin;
        margin = m;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return x;
        x = _;
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return y;
        y = _;
        return chart;
    };

    chart.xUnits = function(f){
        if (!arguments.length) return xUnits;
        xUnits = f;
        return chart;
    };

    chart.axisX = function(x){
        if (!arguments.length) return axisX;
        axisX = x;
        return chart;
    };

    chart.axisY = function(y){
        if (!arguments.length) return axisY;
        axisY = y;
        return chart;
    };

    dc.registerChart(chart);

    return chart.anchor(selector);
};
