dc = {
    version: "0.1.0",
    __charts__: []
};

dc.registerChart = function(chart) {
    dc.__charts__.push(chart);
};

dc.hasChart = function(chart) {
    return dc.__charts__.indexOf(chart) >= 0;
};

dc.removeAllCharts = function() {
    dc.__charts__ = [];
};

dc.filterAll = function() {
    for (var i = 0; i < dc.__charts__.length; ++i) {
        dc.__charts__[i].filterAll();
    }
};

dc.renderAll = function() {
    for (var i = 0; i < dc.__charts__.length; ++i) {
        dc.__charts__[i].render();
    }
};
dc.createPieChart = function(selector) {
    var pieChart = new this.PieChart().anchor(selector);
    dc.registerChart(pieChart);
    return pieChart;
};

dc.PieChart = function() {
    var NO_FILTER = null;
    var sliceCssClass = "pie-slice";

    var anchor;
    var root;

    var colors = d3.scale.category20c();

    var dimension;
    var group;

    var width;
    var height;
    var radius;
    var innerRadius = 0;

    var filter = NO_FILTER;

    this.render = function() {
        doRender();
    };

    this.select = function(s) {
        return root.select(s);
    };

    this.selectAll = function(s) {
        return root.selectAll(s);
    };

    this.anchor= function(a) {
        if (!arguments.length) return anchor;
        anchor = a;
        root = d3.select(anchor);
        return this;
    };

    this.innerRadius = function(r) {
        if (!arguments.length) return innerRadius;
        innerRadius = r;
        return this;
    };

    this.colors = function(c) {
        if (!arguments.length) return colors;
        colors = c;
        return this;
    };

    this.dimension = function(d) {
        if (!arguments.length) return dimension;
        dimension = d;
        return this;
    };

    this.group = function(g) {
        if (!arguments.length) return group;
        group = g;
        return this;
    };

    this.filter = function(f) {
        dimension.filter(f);
        return this;
    };

    this.width = function(w) {
        if (!arguments.length) return width;
        width = w;
        return this;
    };

    this.height = function(h) {
        if (!arguments.length) return height;
        height = h;
        return this;
    };

    this.radius = function(r) {
        if (!arguments.length) return radius;
        radius = r;
        return this;
    };

    this.filter = function(i) {
        if (!arguments.length) return filter;
        doFilter(i);
        return this;
    };

    this.filterAll = function() {
        return this.filter(NO_FILTER);
    };

    this.hasFilter = function() {
        return filter != NO_FILTER;
    };

    function doRender() {
        root.select("svg").remove();

        if (dataAreSet()) {
            var topG = generateTopLevelG();

            var dataPie = d3.layout.pie().value(function(d) {
                return d.value;
            });

            var arcs = buildArcs();

            var slices = drawSlices(topG, dataPie, arcs);

            drawLabels(slices, arcs);

            highlightFilter();
        }
    }

    function generateTopLevelG() {
        return root.append("svg")
            .data([group.all()])
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + cx() + "," + cy() + ")");
    }

    function cx() {
        return width / 2;
    }

    function cy() {
        return height / 2;
    }

    function buildArcs() {
        return d3.svg.arc().outerRadius(radius).innerRadius(innerRadius);
    }

    function drawSlices(topG, dataPie, arcs) {
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
            .on("click", function(d, i) {
                doFilter(d.data.key);
                dc.renderAll();
            });

        return slices;
    }

    function drawLabels(slices, arcs) {
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
    }

    function doFilter(d) {
        filter = d;

        highlightFilter();

        if (dataAreSet())
            dimension.filter(filter);
    }

    function isSelectedSlice(d) {
        return filter == d.data.key;
    }

    function highlightFilter() {
        if (filter) {
            root.selectAll("g." + sliceCssClass).select("path").each(function(d, i) {
                if (isSelectedSlice(d)) {
                    d3.select(this).attr("fill-opacity", 1)
                        .attr('stroke', "#ccc")
                        .attr('stroke-width', 3);
                } else {
                    d3.select(this).attr("fill-opacity", 0.1)
                        .attr('stroke-width', 0);
                }
            });
        }
    }

    function dataAreSet() {
        return dimension != undefined && group != undefined;
    }

};

