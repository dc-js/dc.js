/**
 ## Heat Map

 Includes: [Color Mixin](#color-mixin), [Margin Mixin](#margin-mixin), [Base Mixin](#base-mixin)

 A heat map is matrix that represents the values of two dimensions of data using colors.

 #### dc.heatMap(parent[, chartGroup])
 Create a heat map instance and attach it to the given parent element.

 Parameters:
* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

 Returns:
 A newly created heat map instance

 ```js
 // create a heat map under #chart-container1 element using the default global chart group
 var heatMap1 = dc.heatMap('#chart-container1');
 // create a heat map under #chart-container2 element using chart group A
 var heatMap2 = dc.heatMap('#chart-container2', 'chartGroupA');
 ```

 **/
dc.heatMap = function (parent, chartGroup) {

    var DEFAULT_BORDER_RADIUS = 6.75;

    var _chartBody;

    var _cols;
    var _rows;
    var _xBorderRadius = DEFAULT_BORDER_RADIUS;
    var _yBorderRadius = DEFAULT_BORDER_RADIUS;

    var _chart = dc.colorMixin(dc.marginMixin(dc.baseMixin({})));
    _chart._mandatoryAttributes(['group']);
    _chart.title(_chart.colorAccessor());

    var _colsLabel = function (d) {
        return d;
    };
    var _rowsLabel = function (d) {
        return d;
    };

   /**
    #### .colsLabel([labelFunction])
    Set or get the column label function. The chart class uses this function to render
    column labels on the X axis. It is passed the column name.
    ```js
    // the default label function just returns the name
    chart.colsLabel(function(d) { return d; });
    ```
    **/
    _chart.colsLabel = function (_) {
        if (!arguments.length) {
            return _colsLabel;
        }
        _colsLabel = _;
        return _chart;
    };

   /**
    #### .rowsLabel([labelFunction])
    Set or get the row label function. The chart class uses this function to render
    row labels on the Y axis. It is passed the row name.
    ```js
    // the default label function just returns the name
    chart.rowsLabel(function(d) { return d; });
    ```
    **/
    _chart.rowsLabel = function (_) {
        if (!arguments.length) {
            return _rowsLabel;
        }
        _rowsLabel = _;
        return _chart;
    };

    var _xAxisOnClick = function (d) { filterAxis(0, d); };
    var _yAxisOnClick = function (d) { filterAxis(1, d); };
    var _boxOnClick = function (d) {
        var filter = d.key;
        dc.events.trigger(function () {
            _chart.filter(filter);
            _chart.redrawGroup();
        });
    };

    function filterAxis(axis, value) {
        var cellsOnAxis = _chart.selectAll('.box-group').filter(function (d) {
            return d.key[axis] === value;
        });
        var unfilteredCellsOnAxis = cellsOnAxis.filter(function (d) {
            return !_chart.hasFilter(d.key);
        });
        dc.events.trigger(function () {
            if (unfilteredCellsOnAxis.empty()) {
                cellsOnAxis.each(function (d) {
                    _chart.filter(d.key);
                });
            } else {
                unfilteredCellsOnAxis.each(function (d) {
                    _chart.filter(d.key);
                });
            }
            _chart.redrawGroup();
        });
    }

    dc.override(_chart, 'filter', function (filter) {
        if (!arguments.length) {
            return _chart._filter();
        }

        return _chart._filter(dc.filters.TwoDimensionalFilter(filter));
    });

    function uniq(d, i, a) {
        return !i || a[i - 1] !== d;
    }

    /**
     #### .rows([values])
     Gets or sets the values used to create the rows of the heatmap, as an array. By default, all
     the values will be fetched from the data using the value accessor, and they will be sorted in
     ascending order.
     **/

    _chart.rows = function (_) {
        if (arguments.length) {
            _rows = _;
            return _chart;
        }
        if (_rows) {
            return _rows;
        }
        var rowValues = _chart.data().map(_chart.valueAccessor());
        rowValues.sort(d3.ascending);
        return d3.scale.ordinal().domain(rowValues.filter(uniq));
    };

    /**
     #### .cols([keys])
     Gets or sets the keys used to create the columns of the heatmap, as an array. By default, all
     the values will be fetched from the data using the key accessor, and they will be sorted in
     ascending order.
     **/
    _chart.cols = function (_) {
        if (arguments.length) {
            _cols = _;
            return _chart;
        }
        if (_cols) {
            return _cols;
        }
        var colValues = _chart.data().map(_chart.keyAccessor());
        colValues.sort(d3.ascending);
        return d3.scale.ordinal().domain(colValues.filter(uniq));
    };

    _chart._doRender = function () {
        _chart.resetSvg();

        _chartBody = _chart.svg()
            .append('g')
            .attr('class', 'heatmap')
            .attr('transform', 'translate(' + _chart.margins().left + ',' + _chart.margins().top + ')');

        return _chart._doRedraw();
    };

    _chart._doRedraw = function () {
        var rows = _chart.rows(),
            cols = _chart.cols(),
            rowCount = rows.domain().length,
            colCount = cols.domain().length,
            boxWidth = Math.floor(_chart.effectiveWidth() / colCount),
            boxHeight = Math.floor(_chart.effectiveHeight() / rowCount);

        cols.rangeRoundBands([0, _chart.effectiveWidth()]);
        rows.rangeRoundBands([_chart.effectiveHeight(), 0]);

        var boxes = _chartBody.selectAll('g.box-group').data(_chart.data(), function (d, i) {
            return _chart.keyAccessor()(d, i) + '\0' + _chart.valueAccessor()(d, i);
        });
        var gEnter = boxes.enter().append('g')
            .attr('class', 'box-group');

        gEnter.append('rect')
            .attr('class', 'heat-box')
            .attr('fill', 'white')
            .on('click', _chart.boxOnClick());

        if (_chart.renderTitle()) {
            gEnter.append('title')
                .text(_chart.title());
        }

        dc.transition(boxes.selectAll('rect'), _chart.transitionDuration())
            .attr('x', function (d, i) { return cols(_chart.keyAccessor()(d, i)); })
            .attr('y', function (d, i) { return rows(_chart.valueAccessor()(d, i)); })
            .attr('rx', _xBorderRadius)
            .attr('ry', _yBorderRadius)
            .attr('fill', _chart.getColor)
            .attr('width', boxWidth)
            .attr('height', boxHeight);

        boxes.exit().remove();

        var gCols = _chartBody.selectAll('g.cols');
        if (gCols.empty()) {
            gCols = _chartBody.append('g').attr('class', 'cols axis');
        }
        var gColsText = gCols.selectAll('text').data(cols.domain());
        gColsText.enter().append('text')
              .attr('x', function (d) { return cols(d) + boxWidth / 2; })
              .style('text-anchor', 'middle')
              .attr('y', _chart.effectiveHeight())
              .attr('dy', 12)
              .on('click', _chart.xAxisOnClick())
              .text(_chart.colsLabel());
        dc.transition(gColsText, _chart.transitionDuration())
               .text(_chart.colsLabel())
               .attr('x', function (d) { return cols(d) + boxWidth / 2; });
        gColsText.exit().remove();
        var gRows = _chartBody.selectAll('g.rows');
        if (gRows.empty()) {
            gRows = _chartBody.append('g').attr('class', 'rows axis');
        }
        var gRowsText = gRows.selectAll('text').data(rows.domain());
        gRowsText.enter().append('text')
              .attr('dy', 6)
              .style('text-anchor', 'end')
              .attr('x', 0)
              .attr('dx', -2)
              .on('click', _chart.yAxisOnClick())
              .text(_chart.rowsLabel());
        dc.transition(gRowsText, _chart.transitionDuration())
              .text(_chart.rowsLabel())
              .attr('y', function (d) { return rows(d) + boxHeight / 2; });
        gRowsText.exit().remove();

        if (_chart.hasFilter()) {
            _chart.selectAll('g.box-group').each(function (d) {
                if (_chart.isSelectedNode(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll('g.box-group').each(function () {
                _chart.resetHighlight(this);
            });
        }
        return _chart;
    };
    /**
     #### .boxOnClick([handler])
     Gets or sets the handler that fires when an individual cell is clicked in the heatmap.
     By default, filtering of the cell will be toggled.
     **/
    _chart.boxOnClick = function (f) {
        if (!arguments.length) {
            return _boxOnClick;
        }
        _boxOnClick = f;
        return _chart;
    };

    /**
     #### .xAxisOnClick([handler])
     Gets or sets the handler that fires when a column tick is clicked in the x axis.
     By default, if any cells in the column are unselected, the whole column will be selected,
     otherwise the whole column will be unselected.
     **/
    _chart.xAxisOnClick = function (f) {
        if (!arguments.length) {
            return _xAxisOnClick;
        }
        _xAxisOnClick = f;
        return _chart;
    };

    /**
     #### .yAxisOnClick([handler])
     Gets or sets the handler that fires when a row tick is clicked in the y axis.
     By default, if any cells in the row are unselected, the whole row will be selected,
     otherwise the whole row will be unselected.
     **/
    _chart.yAxisOnClick = function (f) {
        if (!arguments.length) {
            return _yAxisOnClick;
        }
        _yAxisOnClick = f;
        return _chart;
    };

    /**
     #### .xBorderRadius([value])
     Gets or sets the X border radius.  Set to 0 to get full rectangles.  Default: 6.75
     */
    _chart.xBorderRadius = function (d) {
        if (!arguments.length) {
            return _xBorderRadius;
        }
        _xBorderRadius = d;
        return _chart;
    };

    /**
     #### .xBorderRadius([value])
     Gets or sets the Y border radius.  Set to 0 to get full rectangles.  Default: 6.75
     */
    _chart.yBorderRadius = function (d) {
        if (!arguments.length) {
            return _yBorderRadius;
        }
        _yBorderRadius = d;
        return _chart;
    };

    _chart.isSelectedNode = function (d) {
        return _chart.hasFilter(d.key);
    };

    return _chart.anchor(parent, chartGroup);
};
