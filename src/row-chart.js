dc.rowChart = function(parent, chartGroup) {

    var _g;

    var _labelOffset = 5;

    var _rowCssClass = "row";

    var _chart = dc.singleSelectionChart(dc.colorChart(dc.baseChart({})));

    var _xScale;

    var _gap = 5;

    _chart.doRender = function() {
        _xScale = d3.scale.linear().domain([0, d3.max(_chart.group().all(), _chart.valueAccessor())]).range([0, _chart.width()]);

        _chart.resetSvg();

        _g = _chart.svg()
            .append("g");

        drawChart();

        return _chart;
    };

    function drawChart() {
        var rows = _g.selectAll("g." + _rowCssClass)
                     .data(_chart.group().all());

        createElements(rows, _chart.group().all());
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
        createLabels(rowEnter);
        updateLabels(rows);
    }

    function removeElements(rows) {
        rows.exit().remove();
    }

    function updateElements(rows) {
        var n = _chart.group().all().length;
        var height = (_chart.height() - (n + 1) * _gap) / n;

        var rect = rows.attr("transform", function(d, i) { return "translate(0," + ((i + 1) * _gap + i * height) + ")"; })
                       .select("rect")
                           .attr("height", height);

        dc.transition(rect, _chart.transitionDuration())
               .attr("width", function(d) {
                    return _xScale(_chart.valueAccessor()(d));
               });
    }

    function createLabels(rowEnter) {
        rowEnter.append("text");
    }

    function updateLabels(rows) {
        rows.select("text")
                    .attr("x", _labelOffset)
                    .attr("y", rowHeight() / 2 + _labelOffset)
                    .text(function(d) {
                        return _chart.keyAccessor()(d);
                    });
    }

    function numberOfRows() {
        return _chart.group().all().length;
    }

    function rowHeight() {
        var n = numberOfRows();
        return (_chart.height() - (n + 1) * _gap) / n;
    }

    _chart.doRedraw = function() {
        drawChart();
        return _chart;
    };

    _chart.gap = function(g) {
        if (!arguments.length) return _gap;
        _gap = g;
        return _chart;
    };

    _chart._labelOffset = function(o) {
        if (!arguments.length) return _labelOffset;
        _labelOffset = o;
        return _chart;
    };


    return _chart.anchor(parent, chartGroup);
};