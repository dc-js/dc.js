dc.pieChart = function(selector) {
    var sliceCssClass = "pie-slice";

    var radius = 0, innerRadius = 0;

    var g;

    var arc;
    var dataPie;
    var slices;
    var slicePaths;

    var labels;

    var chart = dc.singleSelectionChart(dc.colorChart(dc.baseChart({})));

    chart.label(function(d) {
        return chart.xValue()(d.data);
    });
    chart.renderLabel(true);
    chart.transitionDuration(350);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            g = chart.generateSvg()
                .append("g")
                .attr("transform", "translate(" + chart.cx() + "," + chart.cy() + ")");

            dataPie = calculateDataPie();

            arc = chart.buildArcs();

            slices = chart.drawSlices(g, dataPie, arc);

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
            .data(dataPie(chart.orderedGroup().top(Infinity)))
            .enter()
            .append("g")
            .attr("class", function(d, i) {
                return sliceCssClass + " " + i;
            });

        slicePaths = slices.append("path")
            .attr("fill", function(d, i) {
                return chart.colors()(i);
            })
            .attr("d", arcs);

        slicePaths
            .transition()
            .duration(chart.transitionDuration())
            .attrTween("d", tweenPie);

        slicePaths.on("click", onClick);

        return slices;
    };

    chart.drawLabels = function(slices, arc) {
        if (chart.renderLabel()) {
            labels = slices.append("text");
            redrawLabels(arc);
            labels.on("click", onClick);
        }
    };

    chart.highlightFilter = function() {
        var normalOpacity = 1;
        var highlightStrokeWidth = 3;
        var fadeOpacity = 0.1;
        var normalStrokeWidth = 0;
        if (chart.hasFilter()) {
            chart.selectAll("g." + sliceCssClass).select("path").each(function(d) {
                if (chart.isSelectedSlice(d)) {
                    d3.select(this).attr("fill-opacity", normalOpacity)
                        .attr('stroke', "#ccc")
                        .attr('stroke-width', highlightStrokeWidth);
                } else {
                    d3.select(this).attr("fill-opacity", fadeOpacity)
                        .attr('stroke-width', normalStrokeWidth);
                }
            });
        } else {
            chart.selectAll("g." + sliceCssClass).selectAll("path")
                .attr("fill-opacity", normalOpacity)
                .attr('stroke-width', normalStrokeWidth);
        }
    };

    chart.isSelectedSlice = function(d) {
        return chart.filter() == chart.xValue()(d.data);
    };

    chart.redraw = function() {
        chart.highlightFilter();
        var data = dataPie(chart.orderedGroup().top(Infinity));
        slicePaths = slicePaths.data(data);
        labels = labels.data(data);
        dc.transition(slicePaths, chart.transitionDuration(), function(s) {
            s.attrTween("d", tweenPie);
        });
        redrawLabels(arc);
        return chart;
    }

    function calculateDataPie() {
        return d3.layout.pie().value(function(d) {
            return chart.yValue()(d);
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
                if (chart.yValue()(data) == 0)
                    return "";
                return chart.label()(d);
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

    function onClick(d) {
        chart.filter(chart.xValue()(d.data));
        dc.redrawAll();
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
