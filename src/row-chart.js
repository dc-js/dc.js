dc.rowChart = function(parent, chartGroup) {

    var _g;

    var _labelOffsetX = 10;

    var _labelOffsetY = 15;

    var _gap = 5;

    var _rowCssClass = "row";

    var _chart = dc.marginable(dc.singleSelectionChart(dc.colorChart(dc.baseChart({}))));

    var _xScale;

    var _xAxis = d3.svg.axis().orient("bottom");

    var _rowsCap = Infinity;

    var _othersLabel = "Others";

    var _othersHandler = function (data, value) {
        data.push({"key": _othersLabel, "value": value });
    };

    var _rowData = null;

    function assembleData() {
        if (_rowsCap == Infinity) {
            _rowData = _chart.orderedGroup().top(_rowsCap); // ordered by keys
        } else {
            var topRows = _chart.group().top(_rowsCap); // ordered by value
            var topRowsSum = d3.sum(topRows, _chart.valueAccessor());

            var allRows = _chart.group().all();
            var allRowsSum = d3.sum(allRows, _chart.valueAccessor());

            _othersHandler(topRows, allRowsSum - topRowsSum);

            _rowData = topRows;
        }
    }

    _chart.doRender = function() {
        assembleData();
        _xScale = d3.scale.linear().domain([0, d3.max(_rowData, _chart.valueAccessor())]).range([0, _chart.effectiveWidth()]);

        _chart.resetSvg();

        _g = _chart.svg()
            .append("g")
            .attr("transform", "translate(" + _chart.margins().left + "," + _chart.margins().top + ")");

        _xAxis.scale(_xScale);

        _g.append("g").attr("class", "axis")
                        .attr("transform", "translate(0, " + _chart.effectiveHeight() + ")")
                        .call(_xAxis);

        drawGridLines();
        drawChart();

        return _chart;
    };

    _chart.title(function (d) {
        return _chart.keyAccessor()(d) + ": " + _chart.valueAccessor()(d) ;
    });

    _chart.label(function (d) {
        return _chart.keyAccessor()(d);
    });

    function drawGridLines() {
        var ticks = _xAxis.tickValues() ? _xAxis.tickValues() : _xScale.ticks(_xAxis.ticks()[0]);

        var gridLineG = _g.append("g")
                          .attr("class", "grid-line vertical");

        var lines = gridLineG.selectAll("line")
                             .data(ticks);

        var linesGEnter = lines.enter()
                               .append("line")
                               .attr("x1", function (d) { return _xScale(d); })
                               .attr("y1", function (d) { return 0; })
                               .attr("x2", function (d) { return _xScale(d); })
                               .attr("y2", function (d) { return _chart.effectiveHeight(); });
    }

    function drawChart() {
        var rows = _g.selectAll("g." + _rowCssClass)
                     .data(_rowData);

        createElements(rows, _rowData);
        removeElements(rows);
        updateElements(rows);
    }

    function createElements(rows, rowData) {
        var rowEnter = rows.enter()
                           .append("g")
                           .attr("class", function(d, i) {
                                return _rowCssClass + " _" + i;
                           });

        rowEnter.append("rect").attr("width", 0);

        createTitles(rowEnter);

        createLabels(rowEnter);
        updateLabels(rows);
    }

    function removeElements(rows) {
        rows.exit().remove();
    }

    function updateElements(rows) {
        var n = _rowData.length;

        var height = (_chart.effectiveHeight() - (n + 1) * _gap) / n;

        var rect = rows.attr("transform", function(d, i) { return "translate(0," + ((i + 1) * _gap + i * height) + ")"; })
                       .select("rect")
                           .attr("height", height)
                           .attr("fill", _chart.getColor)
                           .on("click", onClick)
                           .classed("deselected", function (d) { return (_chart.hasFilter()) ? !_chart.isSelectedRow(d) : false; })
                           .classed("selected", function (d) { return (_chart.hasFilter()) ? _chart.isSelectedRow(d) : false; });

        dc.transition(rect, _chart.transitionDuration())
               .attr("width", function(d) {
                    return _xScale(_chart.valueAccessor()(d));
               });
    }

    function createTitles(rowEnter) {
        if (_chart.renderTitle()) {
            rowEnter.append("title").text(function(d) {
                return _chart.title()(d);
            });
        }
    }

    function createLabels(rowEnter) {
        if (_chart.renderLabel()) {
            rowEnter.append("text");
        }
    }

    function updateLabels(rows) {
        if (_chart.renderLabel()) {
            rows.select("text")
                        .attr("x", _labelOffsetX)
                        .attr("y", _labelOffsetY)
                        .on("click", onClick)
                        .attr("class", function (d, i) {
                            return _rowCssClass + " _" + i;
                        })
                        .text(function(d) {
                            if (_chart.valueAccessor()(d) > 0) {
                                return _chart.label()(d);
                            } else {
                                return "";
                            }
                        });
        }
    }

    function numberOfRows() {
        return _rowData.length;
    }

    function rowHeight() {
        var n = numberOfRows();
        return (_chart.effectiveHeight() - (n + 1) * _gap) / n;
    }

    function onClick(d) {
        _chart.onClick(d);
    }

    _chart.doRedraw = function() {
        drawChart();
        return _chart;
    };

    _chart.xAxis = function () {
        return _xAxis;
    };

    _chart.gap = function(g) {
        if (!arguments.length) return _gap;
        _gap = g;
        return _chart;
    };

    _chart.labelOffsetX = function (o) {
        if (!arguments.length) return _labelOffsetX;
        _labelOffset = o;
        return _chart;
    };

    _chart.labelOffsetY = function (o) {
        if (!arguments.length) return _labelOffsetY;
        _labelOffset = o;
        return _chart;
    };

    _chart.isSelectedRow = function (d) {
        return _chart.filter() == _chart.keyAccessor()(d);
    };

    _chart.rowsCap = function (_) {
        if (!arguments.length) return _rowsCap;
        _rowsCap = _;
        return _chart;
    };

    _chart.othersLabel = function (_) {
        if (!arguments.length) return _othersLabel;
        _othersLabel = _;
        return _chart;
    };

    _chart.othersHandler = function (_) {
        if (!arguments.length) return _othersHandler;
        _othersHandler = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
