dc = {
    version: "0.3.0",
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
    return new Array(Math.abs(e - s));
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

    var width = 200, height = 200;

    var _keyFunction = function(d){return d.key;};
    var _valueFunction = function(d){return d.value;};

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

    chart.orderedGroup = function() {
        return _group.order(function(p) {
            return chart.keyFunction()(p);
        });
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

    chart.svg = function(){
        return chart.select("svg");
    }

    chart.resetSvg = function() {
        chart.select("svg").remove();
    };

    chart.generateSvg = function() {
        return chart.root().append("svg")
            .attr("width", chart.width())
            .attr("height", chart.height());
    };

    chart.turnOnReset = function() {
        chart.select("a.reset").style("display", null);
    };

    chart.turnOffReset = function() {
        chart.select("a.reset").style("display", "none");
    };

    chart.transitionDuration = function(d) {
        if (!arguments.length) return _transitionDuration;
        _transitionDuration = d;
        return chart;
    };

    // abstract function stub
    chart.filter = function(f) {
        // do nothing in base, should be overridden by sub-function
        return chart;
    };

    chart.render = function() {
        // do nothing in base, should be overridden by sub-function
        return chart;
    };

    chart.redraw = function() {
        // do nothing in base, should be overridden by sub-function
        return chart;
    };

    chart.keyFunction = function(_){
        if(!arguments.length) return _keyFunction;
        _keyFunction = _;
        return chart;
    };

    chart.valueFunction = function(_){
        if(!arguments.length) return _valueFunction;
        _valueFunction = _;
        return chart;
    };

    return chart;
};dc.coordinateGridChart = function(chart) {
    var DEFAULT_Y_AXIS_TICKS = 5;

    chart = dc.baseChart(chart);

    var _margin = {top: 10, right: 50, bottom: 30, left: 20};

    var _g;

    var _x;
    var _xAxis = d3.svg.axis();
    var _xUnits = dc.units.integers;

    var _y = d3.scale.linear().range([100, 0]);
    var _yAxis = d3.svg.axis();
    var _yElasticity = false;

    var _filter;
    var _brush = d3.svg.brush();
    var _round;

    chart.generateG = function() {
        _g = chart.generateSvg().append("g")
            .attr("transform", "translate(" + chart.margins().left + "," + chart.margins().top + ")");
    }

    chart.g = function(_){
        if(!arguments.length) return _g;
        _g = _;
        return chart;
    }

    chart.margins = function(m) {
        if (!arguments.length) return _margin;
        _margin = m;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return _x;
        _x = _;
        return chart;
    };

    chart.xAxis = function(_) {
        if (!arguments.length) return _xAxis;
        _xAxis = _;
        return chart;
    };

    chart.renderXAxis = function(g) {
        g.select("g.x").remove();
        chart.x().range([0, (chart.width() - chart.margins().left - chart.margins().right)]);
        _xAxis = _xAxis.scale(chart.x()).orient("bottom");
        g.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(" + chart.margins().left + "," + chart.xAxisY() + ")")
            .call(_xAxis);
    };

    chart.xAxisY = function() {
        return (chart.height() - chart.margins().bottom);
    };

    chart.xAxisLength = function() {
        return chart.width() - chart.margins().left - chart.margins().right;
    };

    chart.xUnits = function(_) {
        if (!arguments.length) return _xUnits;
        _xUnits = _;
        return chart;
    };

    chart.renderYAxis = function(g) {
        g.select("g.y").remove();
        _y.domain([chart.yAxisMin(), chart.yAxisMax()]).rangeRound([chart.yAxisHeight(), 0]);
        _yAxis = _yAxis.scale(_y).orient("left").ticks(DEFAULT_Y_AXIS_TICKS);
        g.append("g")
            .attr("class", "axis y")
            .attr("transform", "translate(" + chart.margins().left + "," + chart.margins().top + ")")
            .call(_yAxis);
    };

    chart.y = function(_) {
        if (!arguments.length) return _y;
        _y = _;
        return chart;
    };

    chart.yAxis = function(y) {
        if (!arguments.length) return _yAxis;
        _yAxis = y;
        return chart;
    };

    chart.yElasticity = function(_) {
        if (!arguments.length) return _yElasticity;
        _yElasticity = _;
        return chart;
    };

    chart.yAxisMin = function() {
        var min = d3.min(chart.group().all(), function(e){return chart.valueFunction()(e);});
        if(min > 0) min = 0;
        return min;
    }

    chart.yAxisMax = function() {
        return d3.max(chart.group().all(), function(e){return chart.valueFunction()(e);});
    };

    chart.yAxisHeight = function() {
        return chart.height() - chart.margins().top - chart.margins().bottom;
    };

    chart.round = function(_) {
        if (!arguments.length) return _round;
        _round = _;
        return chart;
    };

    chart._filter = function(_) {
        if (!arguments.length) return _filter;
        _filter = _;
        return chart;
    };

    chart.filter = function(_) {
        if (_) {
            chart._filter(_);
            chart.brush().extent(_);
            chart.dimension().filterRange(_);
            chart.turnOnReset();
        } else {
            chart._filter(null);
            chart.brush().clear();
            chart.dimension().filterAll();
            chart.turnOffReset();
        }

        return chart;
    };

    chart.brush = function(_) {
        if (!arguments.length) return _brush;
        _brush = _;
        return chart;
    };

    chart.renderBrush = function(g) {
        _brush.on("brushstart", brushStart)
            .on("brush", brushing)
            .on("brushend", brushEnd);

        var gBrush = g.append("g")
            .attr("class", "brush")
            .attr("transform", "translate(" + chart.margins().left + ",0)")
            .call(_brush.x(chart.x()));
        gBrush.selectAll("rect").attr("height", chart.xAxisY());
        gBrush.selectAll(".resize").append("path").attr("d", chart.resizeHandlePath);

        if (_filter) {
            chart.redrawBrush(g);
        }
    };

    function brushStart(p) {
    }

    function brushing(p) {
        var extent = _brush.extent();
        if (chart.round()) {
            extent[0] = extent.map(chart.round())[0];
            extent[1] = extent.map(chart.round())[1];
            _g.select(".brush")
                .call(_brush.extent(extent));
        }
        chart.filter([_brush.extent()[0], _brush.extent()[1]]);
        dc.redrawAll();
    }

    function brushEnd(p) {
    }

    chart._redrawBrush = function(g) {
        if (chart._filter() && chart.brush().empty())
            chart.brush().extent(chart._filter());

        var gBrush = g.select("g.brush");
        gBrush.call(chart.brush().x(chart.x()));
        gBrush.selectAll("rect").attr("height", chart.xAxisY());
    };

    // borrowed from Crossfilter example
    chart.resizeHandlePath = function(d) {
        var e = +(d == "e"), x = e ? 1 : -1, y = chart.xAxisY() / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
    };

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
        return chart.keyFunction()(d.data);
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
        colors = d3.scale.ordinal().range(c);
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
            .attr("class", function(d, i){
                return sliceCssClass + " " + i;
            });

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
        return chart.filter() == chart.keyFunction()(d.data);
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
            return chart.valueFunction()(d);
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
                if (chart.valueFunction()(data) == 0)
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
        chart.filter(chart.keyFunction()(d.data));
        dc.redrawAll();
    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};
dc.barChart = function(selector) {
    var MIN_BAR_WIDTH = 1;
    var BAR_PADDING_BOTTOM = 1;

    var chart = dc.coordinateGridChart({});
    var bars;

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();
            chart.renderXAxis(chart.g());
            chart.renderYAxis(chart.g());

            redrawBars();

            chart.renderBrush(chart.g());
        }

        return chart;
    };

    chart.redraw = function() {
        redrawBars();
        chart.redrawBrush(chart.g());
        if (chart.yElasticity())
            chart.renderYAxis(chart.g());
        return chart;
    };

    function redrawBars() {
        bars = chart.g().selectAll("rect.bar")
            .data(chart.group().all());

        // new
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return finalBarX(d);
            })
            .attr("y", chart.xAxisY())
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
            .attr("y", chart.xAxisY())
            .attr("height", 0);
    }

    function finalBarWidth() {
        var w = Math.floor(chart.xAxisLength() / chart.xUnits()(chart.x().domain()[0], chart.x().domain()[1]).length);
        if (isNaN(w) || w < MIN_BAR_WIDTH)
            w = MIN_BAR_WIDTH;
        return w;
    }

    function finalBarX(d) {
        return chart.x()(chart.keyFunction()(d)) + chart.margins().left;
    }

    function finalBarY(d) {
        return chart.margins().top + chart.y()(chart.valueFunction()(d));
    }

    function finalBarHeight(d) {
        return chart.yAxisHeight() - chart.y()(chart.valueFunction()(d)) - BAR_PADDING_BOTTOM;
    }

    chart.redrawBrush = function(g) {
        chart._redrawBrush(g);

        fadeDeselectedBars();
    }

    function fadeDeselectedBars() {
        if (!chart.brush().empty() && chart.brush().extent() != null) {
            var start = chart.brush().extent()[0];
            var end = chart.brush().extent()[1];

            bars.classed("deselected", function(d) {
                var xValue = chart.keyFunction()(d);
                return xValue < start || xValue >= end;
            });
        } else {
            bars.classed("deselected", false);
        }
    }


    dc.registerChart(chart);

    return chart.anchor(selector);
};

dc.lineChart = function(selector) {
    var chart = dc.coordinateGridChart({});

    chart.transitionDuration(500);

    chart.render = function() {
        chart.resetSvg();

        if (chart.dataAreSet()) {
            chart.generateG();

            redrawLine();

            chart.renderXAxis(chart.g());
            chart.renderYAxis(chart.g());

            chart.renderBrush(chart.g());
        }

        return chart;
    };

    chart.redraw = function() {
        redrawLine();
        chart.redrawBrush(chart.g());
        if (chart.yElasticity())
            chart.renderYAxis(chart.g());
        return chart;
    };

    function redrawLine() {
        chart.g().datum(chart.group().all());

        var path = chart.selectAll("path.line");

        if (path.empty())
            path = chart.g().append("path")
                .attr("class", "line");

        var line = d3.svg.line()
            .x(function(d) {
                return chart.x()(chart.keyFunction()(d));
            })
            .y(function(d) {
                return chart.y()(chart.valueFunction()(d));
            });

        path = path
            .attr("transform", "translate(" + chart.margins().left + "," + chart.margins().top + ")");

        dc.transition(path, chart.transitionDuration(), function(t) {
            t.ease("linear")
        })
            .attr("d", line);
    }

    chart.redrawBrush = function(g) {
        chart._redrawBrush(g);

        fadeDeselectedArea();
    }

    function fadeDeselectedArea() {

    }

    dc.registerChart(chart);

    return chart.anchor(selector);
};

dc.dataCount = function(selector) {
    var formatNumber = d3.format(",d");
    var chart = dc.baseChart({});

    chart.render = function() {
        chart.selectAll(".total-count").text(formatNumber(chart.dimension().size()));
        chart.selectAll(".filter-count").text(formatNumber(chart.group().value()));

        return chart;
    };

    chart.redraw = function(){
        return chart.render();
    };

    dc.registerChart(chart);
    return chart.anchor(selector);
};
dc.dataTable = function(selector) {
    var chart = dc.baseChart({});

    var size = 25;
    var columns = [];
    var sortBy = function(d) {
        return d;
    };
    var order = d3.ascending;
    var sort;

    chart.render = function() {
        chart.selectAll("div.row").remove();

        renderRows(renderGroups());

        return chart;
    };

    function renderGroups() {
        var groups = chart.root().selectAll("div.group")
            .data(nestEntries(), function(d) {
                return chart.keyFunction()(d);
            });

        groups.enter().append("div")
            .attr("class", "group")
            .append("span")
            .attr("class", "label")
            .text(function(d) {
                return chart.keyFunction()(d);
            });

        groups.exit().remove();

        return groups;
    }

    function nestEntries() {
        if (!sort)
            sort = crossfilter.quicksort.by(sortBy);

        var entries = chart.dimension().top(size);
        return d3.nest()
            .key(chart.group())
            .sortKeys(order)
            .entries(sort(entries, 0, entries.length));
    }

    function renderRows(groups) {
        var rows = groups.order()
            .selectAll("div.row")
            .data(function(d) {
                return d.values;
            });

        var rowEnter = rows.enter()
            .append("div")
            .attr("class", "row");

        for (var i = 0; i < columns.length; ++i) {
            var f = columns[i];
            rowEnter.append("span")
                .attr("class", "column " + i)
                .text(function(d) {
                    return f(d);
                });
        }

        rows.exit().remove();

        return rows;
    }

    chart.redraw = function() {
        return chart.render();
    };

    chart.size = function(s) {
        if (!arguments.length) return size;
        size = s;
        return chart;
    }

    chart.columns = function(_) {
        if (!arguments.length) return columns;
        columns = _;
        return chart;
    }

    chart.sortBy = function(_) {
        if (!arguments.length) return sortBy;
        sortBy = _;
        return chart;
    }

    chart.order = function(_) {
        if (!arguments.length) return order;
        order = _;
        return chart;
    }

    dc.registerChart(chart);
    return chart.anchor(selector);
};

