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

dc.redrawAll = function() {
    for (var i = 0; i < dc._charts.length; ++i) {
        dc._charts[i].redraw();
    }
};

dc.transition = function(selections, duration, callback) {
    if (duration <= 0)
        return selections;

    var s = selections
        .transition()
        .duration(duration);

    if (callback instanceof Function) {
        callback(s);
    }

    return s;
};

dc.units = {};

dc.units.integers = function(s, e) {
    return new Array(e - s);
};

dc.round = {};

dc.round.floor = function(n) {
    return Math.floor(n);
};
dc.baseChart = function(chart) {
    var _dimension;
    var _group;

    var _anchor;
    var _root;

    var width = 0, height = 0;

    var _transitionDuration = 750;

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

    chart.orderedGroup = function(){
        return _group.order(function(p){return p.key;});
    }

    chart.filterAll = function() {
        return chart.filter(null);
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

    chart.generateSvg = function() {
        return chart.root().append("svg")
            .data([chart.group().top(Infinity)])
            .attr("width", chart.width())
            .attr("height", chart.height());
    };

    chart.turnOnReset = function(){
        chart.select("a.reset").style("display", null);
    };

    chart.turnOffReset = function(){
        chart.select("a.reset").style("display", "none");
    };

    chart.transitionDuration = function(d){
        if(!arguments.length) return _transitionDuration;
        _transitionDuration = d;
        return chart;
    }

    return chart;
};dc.pieChart = function(selector) {
    var filter;

    var sliceCssClass = "pie-slice";

    var colors = d3.scale.category20c();

    var radius = 0, innerRadius = 0;
    var g;
    var arc;
    var dataPie;
    var slices;
    var slicePaths;
    var labels;
    var chart = dc.baseChart({});

    var labelFunction = function(d) {
        return d.data.key;
    };

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
            .data(dataPie(chart.orderedGroup().top(Infinity)))
            .enter()
            .append("g")
            .attr("id", function(d) {
                return d.data.key;
            })
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

        slicePaths.on("click", onClick);

        return slices;
    };

    chart.drawLabels = function(slices, arc) {
        labels = slices.append("text");

        redrawLabels(arc);

        labels.on("click", onClick);
    };

    chart.hasFilter = function() {
        return filter != null;
    };

    chart.filter = function(f) {
        if (!arguments.length) return filter;

        filter = f;

        if (chart.dataAreSet())
            chart.dimension().filter(filter);

        if (f) {
            chart.turnOnReset();
        } else {
            chart.turnOffReset();
        }

        return chart;
    };

    chart.isSelectedSlice = function(d) {
        return chart.filter() == d.data.key;
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

    chart.label = function(f) {
        labelFunction = f;
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
                return labelFunction(d);
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
        chart.filter(d.data.key);
        dc.redrawAll();
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
dc.barChart = function(selector) {

    var DEFAULT_Y_AXIS_TICKS = 5;
    var MIN_BAR_WIDTH = 1;
    var BAR_PADDING_BOTTOM = 1;

    var chart = dc.baseChart({});

    var margin = {top: 10, right: 50, bottom: 30, left: 20};

    var x;
    var y = d3.scale.linear().range([100, 0]);
    var axisX = d3.svg.axis();
    var axisY = d3.svg.axis();
    var elasticAxisY = false;
    var xUnits = dc.units.integers;

    var g;
    var bars;
    var filter;
    var brush = d3.svg.brush();
    var round;

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            g = chart.generateSvg().append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            renderAxisX();

            renderAxisY();

            redrawBars();

            renderBrush();
        }

        return chart;
    };

    function renderAxisX() {
        g.select("g.x").remove();
        x.range([0, (chart.width() - margin.left - margin.right)]);
        axisX = axisX.scale(x).orient("bottom");
        g.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(" + margin.left + "," + xAxisY() + ")")
            .call(axisX);
    }

    function renderAxisY() {
        g.select("g.y").remove();
        y.domain([0, maxY()]).rangeRound([yAxisHeight(), 0]);
        axisY = axisY.scale(y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);
        g.append("g")
            .attr("class", "axis y")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(axisY);
    }

    function renderBrush() {
        brush.on("brushstart", brushStart)
            .on("brush", brushing)
            .on("brushend", brushEnd);

        var gBrush = g.append("g")
            .attr("class", "brush")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(brush.x(x));
        gBrush.selectAll("rect").attr("height", xAxisY());
        gBrush.selectAll(".resize").append("path").attr("d", resizePath);

        if (filter) {
            redrawBrush();
        }
    }

    function brushStart(p) {
    }

    function brushing(p) {
        var extent = brush.extent();
        if (round) {
            extent[0] = extent.map(round)[0];
            extent[1] = extent.map(round)[1];
            g.select(".brush")
                .call(brush.extent(extent));
        }
        chart.filter([brush.extent()[0], brush.extent()[1]]);
        dc.redrawAll();
    }

    function brushEnd(p) {
    }

    chart.redraw = function() {
        redrawBars();
        redrawBrush();
        if(elasticAxisY)
            renderAxisY();
        return chart;
    };

    function redrawBars() {
        bars = g.selectAll("rect.bar")
            .data(chart.group().all());

        // new
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return finalBarX(d);
            })
            .attr("y", xAxisY())
            .attr("width", function() {
                return finalBarWidth();
            });
        dc.transition(bars, chart.transitionDuration())
            .attr("y", function(d) {
                return finalBarY(d);
            })
            .attr("height", function(d) {
                return finalBarHeight(d);
            });

        // update
        dc.transition(bars, chart.transitionDuration())
            .attr("y", function(d) {
                return finalBarY(d);
            })
            .attr("height", function(d) {
                return finalBarHeight(d);
            });

        // delete
        dc.transition(bars.exit(), chart.transitionDuration())
            .attr("y", xAxisY())
            .attr("height", 0);
    }

    chart.axisXLength = function() {
        return chart.width() - chart.margins().left - chart.margins().right;
    }

    function finalBarWidth() {
        var w = Math.floor(chart.axisXLength() / xUnits(x.domain()[0], x.domain()[1]).length);
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function finalBarX(d) {
        return x(d.key) + margin.left;
    }

    function finalBarY(d) {
        return margin.top + y(d.value);
    }

    function finalBarHeight(d) {
        return yAxisHeight() - y(d.value) - BAR_PADDING_BOTTOM;
    }

    function redrawBrush() {
        if (filter && brush.empty())
            brush.extent(filter);

        var gBrush = g.select("g.brush");
        gBrush.call(brush.x(x));
        gBrush.selectAll("rect").attr("height", xAxisY());

        fadeDeselectedBars();
    }

    function fadeDeselectedBars() {
        if (!brush.empty() && brush.extent() != null) {
            var start = brush.extent()[0];
            var end = brush.extent()[1];

            bars.classed("deselected", function(d) {
                return d.key < start || d.key >= end;
            });
        } else {
            bars.classed("deselected", false);
        }
    }

    function maxY() {
        return chart.group().orderNatural().top(1)[0].value;
    }

    function yAxisHeight() {
        return chart.height() - margin.top - margin.bottom;
    }

    function xAxisY() {
        return (chart.height() - margin.bottom);
    }

    // borrowed from Crossfilter example
    function resizePath(d) {
        var e = +(d == "e"), x = e ? 1 : -1, y = xAxisY() / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
    }

    chart.filter = function(_) {
        if (_) {
            filter = _;
            brush.extent(_);
            chart.dimension().filterRange(_);
            chart.turnOnReset();
        } else {
            filter = null;
            brush.clear();
            chart.dimension().filterAll();
            chart.turnOffReset();
        }

        return chart;
    };

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

    chart.xUnits = function(f) {
        if (!arguments.length) return xUnits;
        xUnits = f;
        return chart;
    };

    chart.axisX = function(x) {
        if (!arguments.length) return axisX;
        axisX = x;
        return chart;
    };

    chart.axisY = function(y) {
        if (!arguments.length) return axisY;
        axisY = y;
        return chart;
    };

    chart.round = function(_) {
        if (!arguments.length) return round;
        round = _;
        return chart;
    };

    chart.elasticAxisY = function(_){
        if(!arguments.length) return elasticAxisY;
        elasticAxisY = _;
        return chart;
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
