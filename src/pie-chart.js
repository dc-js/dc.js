dc.pieChart = function(selector) {

    var NO_FILTER = null;

    var filter = NO_FILTER;

    var sliceCssClass = "pie-slice";

    var colors = d3.scale.category20c();

    var radius = 0, innerRadius = 0;

    var chart = dc.baseMixin({});

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            var topG = chart.generateSvg()
                .append("g")
                .attr("transform", "translate(" + chart.cx() + "," + chart.cy() + ")");

            var dataPie = d3.layout.pie().value(function(d) {
                return d.value;
            });

            var arcs = chart.buildArcs();

            var slices = chart.drawSlices(topG, dataPie, arcs);

            chart.drawLabels(slices, arcs);

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
                dc.redrawAll();
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

    chart.redraw = function(){
        return chart.render();
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
