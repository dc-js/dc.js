dc.pieChart = function(selector) {
    var NO_FILTER = null;

    var filter = NO_FILTER;

    var sliceCssClass = "pie-slice";

    var colors = d3.scale.category20c();

    var radius = 0, innerRadius = 0;
    var arc;
    var dataPie;
    var slices;
    var slicePaths;
    var labels;
    var chart = dc.baseChart({});

    chart.transitionDuration(350);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            var topG = chart.generateSvg()
                .append("g")
                .attr("transform", "translate(" + chart.cx() + "," + chart.cy() + ")");

            dataPie = calculateDataPie();

            arc = chart.buildArcs();

            slices = chart.drawSlices(topG, dataPie, arc);

            chart.drawLabels(slices, arc);

            chart.highlightFilter();
        }

        return chart;
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
        slices = topG.selectAll("g." + sliceCssClass)
            .data(dataPie)
            .enter()
            .append("g")
            .attr("class", sliceCssClass);

        slicePaths = slices.append("path")
            .attr("fill", function(d, i) {
                return colors(i);
            })
            .attr("d", arcs);

        slicePaths
            .transition()
            .duration(chart.transitionDuration())
            .attrTween("d", tweenPie);

        slicePaths.on("click", function(d) {
            chart.filter(d.data.key);
            chart.highlightFilter();
            dc.redrawAll();
        });

        return slices;
    };

    chart.drawLabels = function(slices, arc) {
        labels = slices.append("text");

        redrawLabels(arc);
    };

    chart.hasFilter = function() {
        return filter != NO_FILTER;
    };

    chart.filter = function(f) {
        if (!arguments.length) return filter;

        filter = f;

        if (chart.dataAreSet())
            chart.dimension().filter(filter);

        return chart;
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

    chart.redraw = function() {
        slicePaths = slicePaths.data(dataPie(chart.group().top(Infinity)));
        dc.transition(slicePaths, chart.transitionDuration(), function(s){s.attrTween("d", tweenPie);});
        labels = labels.data(dataPie(chart.group().top(Infinity)));
        redrawLabels(arc);
        return chart;
    }

    function calculateDataPie() {
        return d3.layout.pie().value(function(d) {
            return d.value;
        });
    }

    function redrawLabels(arc) {
        dc.transition(labels, chart.transitionDuration())
            .attr("transform", function(d) {
                d.innerRadius = chart.innerRadius();
                d.outerRadius = radius;
                var centroid = arc.centroid(d);
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
    }

    function tweenPie(b) {
        b.innerRadius = chart.innerRadius();
        var current = this._current;
        if (isOffCanvas(current))
            current = {startAngle: 0, endAngle: 0};
        var i = d3.interpolate(current, b);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }

    function isOffCanvas(current) {
        return current == null || isNaN(current.startAngle) || isNaN(current.endAngle);
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
