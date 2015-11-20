/**
## Row Chart

Includes: [Cap Mixin](#cap-mixin), [Margin Mixin](#margin-mixin), [Color Mixin](#color-mixin), [Base Mixin](#base-mixin)

Concrete row chart implementation.

#### dc.rowChart(parent[, chartGroup])
Create a row chart instance and attach it to the given parent element.

Parameters:

* parent : string - any valid d3 single selector representing typically a dom block element such as a div.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
* Once a chart is placed in a certain chart group then any interaction with such instance will only
* trigger events and redraw within the same chart group.

Return a newly created row chart instance

```js
// create a row chart under #chart-container1 element using the default global chart group
var chart1 = dc.rowChart('#chart-container1');
// create a row chart under #chart-container2 element using chart group A
var chart2 = dc.rowChart('#chart-container2', 'chartGroupA');
```

**/
dc.multiRowChart = function (parent, chartGroup) {

    var _g;

    var _labelOffsetX = 10;
    var _labelOffsetY = 15;
    var _labelCenterY = false;

    var _titleLabelOffsetX = 2;

    var _gap = 0.02;

    var _fixedBarHeight = false;
    var _rowGroupCssClass = 'row-group';
    var _rowCssClass = 'row';
    var _valLabelCssClass = 'value-label';
    var _renderTitleLabel = false;

    var _chart = dc.multiGroupMixin(dc.capMixin(dc.marginMixin(dc.colorMixin(dc.baseMixin({})))));

    var _x;

    var _elasticX;

    var _xAxis = d3.svg.axis().orient('bottom');

    var _rowData;

    _chart.rowsCap = _chart.cap;

    _chart._titleLabelFormatter = function (d) { return d; };

    function calculateAxisScale () {
        if (!_x || _elasticX) {

            var max = d3.max(_chart.groups(), function (e) {
                var groupmax = d3.max(e.dimgroup.all(), function (d) {
                    return e.accessor(d);
                });
                return groupmax;
            });

            _x = d3.scale.linear().domain([0, max])
                .range([0, _chart.effectiveWidth()]);
        }
        _xAxis.scale(_x);
    }

    function maxTitleLabelWidth (data) {
        var
            ret    = -1,
            widths = [];

        _chart.dimension().group().all().forEach(function (v, k) {
            widths.push(5.5 * _chart._titleLabelFormatter(v.value).length);
        });
        ret = d3.max(widths);

        return ret;
    }

    //function calculateLabelOffsetY (obj) {
    //var offset = 0;
    //if (_labelCenterY) {
    //offset = calculateRowHeight() / 2 + obj.getBBox().height / 2 - 2.5;
    //}
    //else {
    //offset = _labelOffsetY;
    //}
    //return offset;
    //}

    function calculateRowHeight () {
        var
            n      = _rowData.length * _chart.dimension().group().all().length,
            height = 0;

        if (!_fixedBarHeight) {
            height  = _chart.effectiveHeight() / n;
            height *= 1 - _chart.groupGap();
            height *= 1 - _chart.gap();
        } else {
            height = _fixedBarHeight;
        }
        return height;
    }

    function drawAxis () {
        var axisG = _g.select('g.axis');

        calculateAxisScale();

        if (axisG.empty()) {
            axisG = _g.append('g').attr('class', 'axis')
                .attr('transform', 'translate(0, ' + _chart.effectiveHeight() + ')');
        }

        dc.transition(axisG, _chart.transitionDuration())
            .call(_xAxis);
    }

    _chart._doRender = function () {
        _chart.resetSvg();

        _g = _chart.svg()
            .append('g')
            .attr('transform', 'translate(' + _chart.margins().left + ',' + _chart.margins().top + ')');

        drawChart();

        return _chart;
    };

    _chart.title(function (d) {
        return _chart.cappedKeyAccessor(d) + ': ' + _chart.cappedValueAccessor(d);
    });

    _chart.label(_chart.cappedKeyAccessor);

    _chart.x = function (x) {
        if (!arguments.length) {
            return _x;
        }
        _x = x;
        return _chart;
    };

    function drawGridLines () {
        _g.selectAll('g.tick')
            .select('line.grid-line')
            .remove();

        _g.selectAll('g.tick')
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', function () {
                return -_chart.effectiveHeight();
            });
    }

    function drawChart () {
        _rowData = _chart.groups();

        var groupValues = _chart.dimension().group().all();

        var rowGroups = _g.selectAll('g.' + _rowGroupCssClass)
            .data(groupValues);

        drawAxis();
        drawGridLines();

        createElements(rowGroups);
        removeElements(rowGroups);
        updateElements(rowGroups);
    }

    function createElements (rowGroups) {

        var rowGroupsEnter = rowGroups.enter()
            .append('g')
            .attr('class', function (d, i) {
                return _rowGroupCssClass + ' _' + i;
            });

        rowGroups.each(function (d, i) {
            var rowGroup = d3.select(this);
            rowGroup
                .attr('transform', function (d, j) {
                    var groupHeight = _chart.effectiveHeight() / _chart.dimension().group().all().length;
                    var y           = i * groupHeight + 0.5 * _chart.groupGap() * groupHeight;
                    return 'translate(0, ' + y + ')';
                });
            createRows(rowGroup, i);
        });
        createLabels(rowGroupsEnter);
        updateLabels(rowGroupsEnter);
    }

    function createRows (rowGroup, gIdx) {
        var data = [];
        var barHeight = calculateRowHeight();

        _rowData.forEach(function (g, i) {
            var row = {};
            row.accessor = g.accessor;
            row.data     = g.dimgroup.all()[gIdx];
            data.push(row);
        });

        var rows = rowGroup.selectAll('g.' + _rowCssClass).data(data),
            rowEnter = rows.enter();

        rowEnter.append('g')
            .attr('class', function (d, i) {
                return _rowCssClass + ' _' + i;
            })
            .on('click', onClick)
            .append('rect')
                .attr('class', 'row-bar')
                .attr('width', 0)
                .attr('y', function (d, i) {
                    return (barHeight * (1 + _chart.gap())) * i ;
                })
                .attr('height', barHeight)
                .attr('fill', function (d, i) {
                    return _chart.colors()(i);
                });
    }

    function removeElements (rowGroups) {
        rowGroups.exit().remove();
    }

    function updateElements (rowGroups) {

        var rect = _g.selectAll('rect.row-bar')
            .classed('deselected', function (d) {
                return (_chart.hasFilter()) ? !isSelectedRow(d) : false;
            })
            .classed('selected', function (d) {
                return (_chart.hasFilter()) ? isSelectedRow(d) : false;
            });

        dc.transition(rect, _chart.transitionDuration())
            .attr('width', function (d) {
                var start = _x(0) === -Infinity ? _x(1) : _x(0);
                return Math.abs(start - _x(d.accessor(d.data)));
            });

        //createTitles(rows);
        //updateLabels(rows);
    }

    //function createTitles (rows) {
    //if (_chart.renderTitle()) {
    //rows.selectAll('title').remove();
    //rows.append('title').text(_chart.title());
    //}
    //}

    function createLabels (rowGroupsEnter) {

        var rowHeight = calculateRowHeight();

        if (_chart.renderLabel()) {
            rowGroupsEnter.append('text')
                .attr('class', function (d, i) {
                    return _rowCssClass + ' row-label _' + i;
                })
                .attr('text-anchor', 'end')
                .attr('x', -_labelOffsetX)
                .text(function (d) {
                    return _chart.label()(d);
                });
        }

        if (_chart.renderTitleLabel() && rowHeight >= 10) {
            rowGroupsEnter.selectAll('g.row').append('text')
                .attr('class', function (d, i) {
                    return _valLabelCssClass + ' _' + i;
                })
                .text('0')
                .attr('text-anchor', 'start')
                .attr('data-prevvalue', function (d) {
                    return d.accessor(d.data);
                })
                .attr('x', _labelOffsetX)
                //.on('click', onClick);
                .on('click', function () {
                    console.log(this);
                });
        }

    }

    function updateLabels () {
        var rowGroups = _chart.selectAll('.row-group')[0];
        var rows      = _g.selectAll('g.row');
        var rowHeight = calculateRowHeight();

        if (_chart.renderLabel()) {
            rowGroups.forEach(function (g, i) {
                d3.select(g).selectAll('.row-label')
                    .attr('y', function () {
                        var y = rowHeight / 2 * _rowData.length + this.getBBox().height / 2 - 2.5;
                        return y;
                    });
            });
        }

        if (_chart.renderTitleLabel() && rowHeight >= 10) {

            var titlelab = rows.select('text.value-label')
                .text(function (d, i) {
                    return _chart.titleLabelFormatter()(d.accessor(d.data));
                });

            rowGroups.forEach(function (g, i) {
                var rows = d3.select(g).selectAll('g.row');
                rows[0].forEach(function (r, j) {
                    var label = d3.select(r).select('text');
                    label.attr('y', function () {
                        return (j * rowHeight * (1 + _gap)) + (rowHeight + this.getBBox().height) / 2 - 2.5;
                    });
                });
            });

            dc.transition(titlelab, _chart.transitionDuration())
                .attr('x', function (d) {
                    var ret = _chart.x()(_chart.valueAccessor()(d.data)) + _labelOffsetX;
                    ret = d3.max([_labelOffsetX, ret]);
                    ret = d3.min([_chart.effectiveWidth() - maxTitleLabelWidth(_rowData) - _labelOffsetX, ret]);
                    return ret;
                })
                .tween('text', function (d) {
                    var
                        start,
                        end,
                        i;

                    start = d3.select(this).attr('data-prevvalue');
                    end   = _chart.valueAccessor()(d.data);
                    i     = d3.interpolate(start, end);
                    return function (t) {
                        this.textContent = _chart.titleLabelFormatter()(i(t));
                    };
                })
               .each('end', function (d) {
                    d3.select(this).attr('data-prevvalue', function (d) {
                        return d.accessor(d.data);
                    });
                });
        }
    }

    /**
    #### .renderTitleLabel(boolean)
    Turn on/off Title label rendering (values) using SVG style of text-anchor 'end'

    **/
    _chart.renderTitleLabel = function (_) {
        if (!arguments.length) {
            return _renderTitleLabel;
        }
        _renderTitleLabel = _;
        return _chart;
    };

    _chart.titleLabelFormatter = function (_) {
        if (!arguments.length) {
            return _chart._titleLabelFormatter;
        }
        _chart._titleLabelFormatter = _;
        return _chart;
    };

    function onClick (d) {
        _chart.onClick(d.data);
    }

    //function translateX (d) {
    //var x = _x(_chart.cappedValueAccessor(d)),
    //x0 = _x(0),
    //s = x > x0 ? x0 : x;
    //return 'translate('+s+',0)';
    //}

    _chart._doRedraw = function () {
        drawChart();
        return _chart;
    };

    /**
    #### .xAxis()
    Get the x axis for the row chart instance.  Note: not settable for row charts.
    See the [d3 axis object](https://github.com/mbostock/d3/wiki/SVG-Axes#wiki-axis) documention for more information.
    ```js
    // customize x axis tick format
    chart.xAxis().tickFormat(function (v) {return v + '%';});
    // customize x axis tick values
    chart.xAxis().tickValues([0, 100, 200, 300]);
    ```

    **/
    _chart.xAxis = function () {
        return _xAxis;
    };

    /**
    #### .fixedBarHeight([height])
    Get or set the fixed bar height. Default is [false] which will auto-scale bars.
    For example, if you want to fix the height for a specific number of bars (useful in TopN charts)
    you could fix height as follows (where count = total number of bars in your TopN and gap is your vertical gap space).
    ```js
     chart.fixedBarHeight(chartheight - (count + 1) * gap / count);
    ```
    **/
    _chart.fixedBarHeight = function (g) {
        if (!arguments.length) {
            return _fixedBarHeight;
        }
        _fixedBarHeight = g;
        return _chart;
    };

    /**
    #### .fixedBarHeight([height])
    Get or set the fixed bar height. Default is [false] which will auto-scale bars.
    For example, if you want to fix the height for a specific number of bars (useful in TopN charts)
    you could fix height as follows (where count = total number of bars in your TopN and gap is your vertical gap space).
    ```js
     chart.fixedBarHeight(chartheight - (count + 1) * gap / count);
    ```
    **/
    _chart.fixedBarHeight = function (g) {
        if (!arguments.length) {
            return _fixedBarHeight;
        }
        _fixedBarHeight = g;
        return _chart;
    };

    /**
    #### .gap([gap])
    Get or set the vertical gap space between rows on a particular row chart instance. Default gap is 5px;

    **/
    _chart.gap = function (g) {
        if (!arguments.length) {
            return _gap;
        }
        _gap = g;
        return _chart;
    };

    /**
    #### .elasticX([boolean])
    Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescle to auto-fit the data
    range when filtered.

    **/
    _chart.elasticX = function (_) {
        if (!arguments.length) {
            return _elasticX;
        }
        _elasticX = _;
        return _chart;
    };

    /**
    #### .labelOffsetX([x])
    Get or set the x offset (horizontal space to the top left corner of a row) for labels on a particular row chart.
    Default x offset is 10px;

    **/
    _chart.labelOffsetX = function (o) {
        if (!arguments.length) {
            return _labelOffsetX;
        }
        _labelOffsetX = o;
        return _chart;
    };

    /**
    #### .labelOffsetY([y])
    Get or set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart. Default y offset is 15px;

    **/
    _chart.labelOffsetY = function (o) {
        if (!arguments.length) {
            return _labelOffsetY;
        }
        _labelOffsetY = o;
        return _chart;
    };

    _chart.labelCenterY = function (o) {
        if (!arguments.length) {
            return _labelCenterY;
        }
        _labelCenterY = o;
        return _chart;
    };

    /**
    #### .titleLabelOffsetx([x])
    Get of set the x offset (horizontal space between right edge of row and right edge or text.   Default x offset is 2px;

    **/
    _chart.titleLabelOffsetX = function (o) {
        if (!arguments.length) {
            return _titleLabelOffsetX;
        }
        _titleLabelOffsetX = o;
        return _chart;
    };

    function isSelectedRow (d) {
        return _chart.hasFilter(_chart.cappedKeyAccessor(d.data));
    }

    return _chart.anchor(parent, chartGroup);
};
