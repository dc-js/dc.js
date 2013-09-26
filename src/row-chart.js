/**
## <a name="row-chart" href="#row-chart">#</a> Row Chart [Concrete] < [Color Chart](#color-chart) < [Base Chart](#base-chart)
Concrete row chart implementation.

#### dc.rowChart(parent[, chartGroup])
Create a row chart instance and attach it to the given parent element.

Parameters:

* parent : string - any valid d3 single selector representing typically a dom block element such as a div.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed in a certain chart group then any interaction with such instance will only trigger events and redraw within the same chart group.

Return a newly created row chart instance

```js
// create a row chart under #chart-container1 element using the default global chart group
var chart1 = dc.rowChart("#chart-container1");
// create a row chart under #chart-container2 element using chart group A
var chart2 = dc.rowChart("#chart-container2", "chartGroupA");
```

**/
dc.rowChart = function (parent, chartGroup) {

    var _g;

    var _labelOffsetX = 10;

    var _labelOffsetY = 15;

    var _gap = 5;

    var _rowCssClass = "row";

    var _chart = dc.capped(dc.marginable(dc.colorChart(dc.baseChart({}))));

    var _x;

    var _elasticX;

    var _xAxis = d3.svg.axis().orient("bottom");

    var _rowData;

    _chart.rowsCap = _chart.cap;

    function calculateAxisScale() {
        if (!_x || _elasticX) {
            var extent = d3.extent(_rowData, _chart.valueAccessor());
            if (extent[0] > 0) extent[0] = 0;
            _x = d3.scale.linear().domain(extent)
                .range([0, _chart.effectiveWidth()]);

            _xAxis.scale(_x);
        }
    }

    function drawAxis() {
        var axisG = _g.select("g.axis");

        calculateAxisScale();

        if (axisG.empty())
            axisG = _g.append("g").attr("class", "axis")
                .attr("transform", "translate(0, " + _chart.effectiveHeight() + ")");

        dc.transition(axisG, _chart.transitionDuration())
            .call(_xAxis);
    }

    _chart.doRender = function () {
        _chart.resetSvg();

        _g = _chart.svg()
            .append("g")
            .attr("transform", "translate(" + _chart.margins().left + "," + _chart.margins().top + ")");

        drawChart();

        return _chart;
    };

    _chart.title(function (d) {
        return _chart.keyAccessor()(d) + ": " + _chart.valueAccessor()(d);
    });

    _chart.label(function (d) {
        return _chart.keyAccessor()(d);
    });

    _chart.x = function(x){
        if(!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    function drawGridLines() {
        _g.selectAll("g.tick")
            .select("line.grid-line")
            .remove();

        _g.selectAll("g.tick")
            .append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", function () {
                return -_chart.effectiveHeight();
            });
    }

    function drawChart() {
        _rowData = _chart.assembleCappedData();

        drawAxis();
        drawGridLines();

        var rows = _g.selectAll("g." + _rowCssClass)
            .data(_rowData);

        createElements(rows);
        removeElements(rows);
        updateElements(rows);
    }

    function createElements(rows) {
        var rowEnter = rows.enter()
            .append("g")
            .attr("class", function (d, i) {
                return _rowCssClass + " _" + i;
            });

        rowEnter.append("rect").attr("width", 0);

        createLabels(rowEnter);
        updateLabels(rows);
    }

    function removeElements(rows) {
        rows.exit().remove();
    }

    function updateElements(rows) {
        var n = _rowData.length;

        var height = (_chart.effectiveHeight() - (n + 1) * _gap) / n;

        var rect = rows.attr("transform",function (d, i) {
                return "translate(0," + ((i + 1) * _gap + i * height) + ")";
            }).select("rect")
            .attr("height", height)
            .attr("fill", _chart.getColor)
            .on("click", onClick)
            .classed("deselected", function (d) {
                return (_chart.hasFilter()) ? !_chart.isSelectedRow(d) : false;
            })
            .classed("selected", function (d) {
                return (_chart.hasFilter()) ? _chart.isSelectedRow(d) : false;
            });

        dc.transition(rect, _chart.transitionDuration())
            .attr("width", function (d) {
                var start = _x(0) == -Infinity ? _x(1) : _x(0);
                return Math.abs(start - _x(_chart.valueAccessor()(d)));
            })
            .attr("transform", translateX);

        createTitles(rows);
        updateLabels(rows);
    }

    function createTitles(rows) {
        if (_chart.renderTitle()) {
            rows.selectAll("title").remove();
            rows.append("title").text(function (d) {
                return _chart.title()(d);
            });
        }
    }

    function createLabels(rowEnter) {
        if (_chart.renderLabel()) {
            rowEnter.append("text")
                .on("click", onClick);
        }
    }

    function updateLabels(rows) {
        if (_chart.renderLabel()) {
            var lab = rows.select("text")
                .attr("x", _labelOffsetX)
                .attr("y", _labelOffsetY)
                .on("click", onClick)
                .attr("class", function (d, i) {
                    return _rowCssClass + " _" + i;
                })
                .text(function (d) {
                    return _chart.label()(d);
                });
            dc.transition(lab, _chart.transitionDuration())
                .attr("transform", translateX);
        }
    }

    function onClick(d) {
        _chart.onClick(d);
    }

    function translateX(d) {
        var x = _x(_chart.valueAccessor()(d)),
            x0 = _x(0),
            s = x > x0 ? x0 : x;
        return "translate("+s+",0)";
    }

    _chart.doRedraw = function () {
        drawChart();
        return _chart;
    };

    _chart.xAxis = function () {
        return _xAxis;
    };

    /**
    #### .gap([gap])
    Get or set the vertical gap space between rows on a particular row chart instance. Default gap is 5px;

    **/
    _chart.gap = function (g) {
        if (!arguments.length) return _gap;
        _gap = g;
        return _chart;
    };

    /**
    #### .elasticX([boolean])
    Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescle to auto-fit the data
    range when filtered.

    **/
    _chart.elasticX = function (_) {
        if (!arguments.length) return _elasticX;
        _elasticX = _;
        return _chart;
    };

    /**
    #### .labelOffsetX([x])
    Get or set the x offset (horizontal space to the top left corner of a row) for labels on a particular row chart. Default x offset is 10px;

    **/
    _chart.labelOffsetX = function (o) {
        if (!arguments.length) return _labelOffsetX;
        _labelOffsetX = o;
        return _chart;
    };

    /**
    #### .labelOffsetY([y])
    Get of set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart. Default y offset is 15px;

    **/
    _chart.labelOffsetY = function (o) {
        if (!arguments.length) return _labelOffsetY;
        _labelOffsetY = o;
        return _chart;
    };

    _chart.isSelectedRow = function (d) {
        return _chart.hasFilter(_chart.keyAccessor()(d));
    };

    return _chart.anchor(parent, chartGroup);
};
