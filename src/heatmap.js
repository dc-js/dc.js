dc.heatMap = function (parent, chartGroup) {

    var _chartBody;

    var _cols;
    var _rows;

    var _fillAccessor = function(d,i) { return i; };
    var _fill;
    var _fillDefault = d3.scale.quantize().range(["#a50026","#d73027","#f46d43","#fdae61","#fee08b",
                                        "#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]);

    var _chart = dc.coordinateGridChart({});
    _chart._mandatoryAttributes(['group']);
    _chart.title(_fillAccessor);

    function uniq(d,i,a) {
        return !i || a[i-1] != d;
    }

    _chart.rows = function (_) {
        if (arguments.length) {
            _rows = _;
            return _chart;
        }
        if (_rows) return _rows;
        var rowValues = _chart.data().map(_chart.valueAccessor());
        rowValues.sort(d3.ascending);
        return d3.scale.ordinal().domain(rowValues.filter(uniq));
    };

    _chart.cols = function (_) {
        if (arguments.length) {
            _cols = _;
            return _chart;
        }
        if (_cols) return _cols;
        var colValues = _chart.data().map(_chart.keyAccessor());
        colValues.sort(d3.ascending);
        return d3.scale.ordinal().domain(colValues.filter(uniq));
    };

    _chart.fill = function (_) {
        if (arguments.length) {
            _fill = _;
            return _chart;
        }
        if (_fill) return _fill;
        return _fillDefault.domain(d3.extent(_chart.data(),_fillAccessor));
    };

    _chart.fillAccessor = function (_) {
        if (!arguments.length) return _fillAccessor;
        _fillAccessor = _;
        return _chart;
    };

    _chart.doRender = function () {
        _chart.resetSvg();

        _chartBody = _chart.svg()
          .append("g")
          .attr("class", "heatmap")
          .attr("transform", "translate(" + _chart.margins().left + "," + _chart.margins().top + ")");

        return _chart.doRedraw();
    };

    _chart.doRedraw = function () {
        var rows = _chart.rows(),
            cols = _chart.cols(),
            fill = _chart.fill(),
            rowCount = rows.domain().length,
            colCount = cols.domain().length,
            boxWidth = Math.floor(_chart.effectiveWidth() / colCount),
            boxHeight = Math.floor(_chart.effectiveHeight() / rowCount);

        cols.rangeRoundBands([0, _chart.effectiveWidth()]);
        rows.rangeRoundBands([_chart.effectiveHeight(), 0]);

        var boxes = _chartBody.selectAll("g.box-group").data(_chart.data(), function(d,i) {
            return _chart.keyAccessor()(d,i) + '\0' + _chart.valueAccessor()(d,i);
        });
        var gEnter = boxes.enter().append("g")
            .attr("class", "box-group")
        gEnter.append("rect")
            .attr("fill", "white")
        gEnter.append("title")
            .text(function (d) { return _chart.title()(d); });

        dc.transition(boxes.select("rect"), _chart.transitionDuration())
            .attr("class","heat-box")
            .attr("x", function(d,i) { return cols(_chart.keyAccessor()(d,i)); })
            .attr("y", function(d,i) { return rows(_chart.valueAccessor()(d,i)); })
            .attr("rx", 0.15 * boxWidth)
            .attr("ry", 0.15 * boxHeight)
            .attr("fill", function(d,i) { return fill(_fillAccessor(d,i)); })
            .attr("width", boxWidth)
            .attr("height", boxHeight);

        boxes.exit().remove();

        var gCols = _chartBody.selectAll("g.cols");
        if (gCols.empty())
            gCols = _chartBody.append("g").attr("class", "cols axis");
        gCols.selectAll('text').data(cols.domain())
            .enter().append("text")
              .attr("x", function(d) { return cols(d) + boxWidth/2; })
              .style("text-anchor", "middle")
              .attr("y", _chart.effectiveHeight())
              .attr("dy", 12)
              .text(function(d) { return d; });
        var gRows = _chartBody.selectAll("g.rows");
        if (gRows.empty())
            gRows = _chartBody.append("g").attr("class", "rows axis");
        gRows.selectAll('text').data(rows.domain())
            .enter().append("text")
              .attr("y", function(d) { return rows(d) + boxHeight/2; })
              .attr("dy", 6)
              .style("text-anchor", "end")
              .attr("x", 0)
              .attr("dx", -2)
              .text(function(d) { return d; });
    };

    return _chart.anchor(parent, chartGroup);
};
