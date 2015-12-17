/**
 // Pyramid Chart
 Includes: [Cap Mixin](#cap-mixin), [Margin Mixin](#margin-mixin), [Color Mixin](#color-mixin), [Base Mixin](#base-mixin)

 Concrete pyramid chart implementation.
 //## dc.pyramidChart(parent[, chartGroup])
 Create a pyramid chart instance and attach it to the given parent element.

 Parameters:

 * parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

 * chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

 Returns:
 A newly created pyramid chart instance

 ```js
 // create a pyramid chart under #chart-container1 element using the default global chart group
 var chart1 = dc.pyramidChart('#chart-container1');
 // create a pyramid chart under #chart-container2 element using chart group A
 var chart2 = dc.rowChart('#chart-container2', 'chartGroupA');
 ```

 **/
dc.pyramidChart = function (parent, chartGroup) {

    var _g;

    var _labelOffsetX = 10;
    var _labelOffsetY = 15;
    var _hasLabelOffsetY = false;
    var _dyOffset = '0.35em';  // this helps center labels https://github.com/mbostock/d3/wiki/SVG-Shapes#svg_text
    var _titleLabelOffsetX = 2;

    var _gap = 5;

    var _fixedBarHeight = false;
    var _rowCssClass = 'row';
    var _titleRowCssClass = 'titlerow';
    var _renderTitleLabel = false;

    var _chart = dc.capMixin(dc.marginMixin(dc.colorMixin(dc.baseMixin({}))));

    var _label = _chart.label();
    var _x;

    var _elasticX;

    var _xAxis = d3.svg.axis().orient('bottom');

    var _rowData;
    var _twoLabels = true;
    var _columnLabels = ['',''];
    var _columnLabelPosition = [5,10];
    var rowOrder = [];
    var rowList = [];
    var _rowOrdering = d3.descending;
    var yTrans = 0;
    var xTrans = 0;
    var width = 0;
    var pos;

    var getRowList = function (_rowData) {
        for (var i in _rowData) {
            //d = _rowData[i]
            if (rowList.indexOf(_rowAccessor(_rowData[i],i)) < 0) {rowList.push(_rowAccessor(_rowData[i],i));}
        }

        return rowList;
    };

    _chart.rowsCap = _chart.cap;

    function calculateAxisScale () {
        if (!_x || _elasticX) {
            var extent = d3.extent(_rowData, _chart.cappedValueAccessor);
            extent[0] = -extent[1];
            _x = d3.scale.linear().domain(extent)
                .range([0, _chart.effectiveWidth()]);
        }
        _xAxis.scale(_x);
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

    _chart.label(_twoLabels ? _chart.cappedKeyAccessor : _chart.rowAccessor);

    /**
     #### .x([scale])
     Gets or sets the x scale. The x scale can be any d3
     [quantitive scale](https://github.com/mbostock/d3/wiki/Quantitative-Scales)
     **/
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
        _rowData = _chart.data();

        drawAxis();
        drawGridLines();

        var rows = _g.selectAll('g.' + _rowCssClass)
                .data(_rowData);

        createElements(rows);
        removeElements(rows);
        updateElements(rows);
    }

    function createElements (rows) {
        var rowEnter = rows.enter()
                .append('g')
                .attr('class', function (d, i) {
                    return _rowCssClass + ' _' + i;
                });

        rowEnter.append('rect').attr('width', 0)
            .attr('transform','translate(' + rootValue() + ',0)'); //rootValue is the zero of the chart.
        createLabels(rowEnter);
        updateLabels(rows);
    }

    function removeElements (rows) {
        rows.exit().remove();
    }

    function rootValue () {
        var root = _x(0);
        return (root === -Infinity || root !== root) ? _x(1) : root;
    }

    function updateElements (rows) {
        var n = _rowData.length;

        var height;
        if (!_fixedBarHeight) {
            height = (_chart.effectiveHeight() - ((n / 2) + 1) * _gap) / (n / 2);
        } else {
            height = _fixedBarHeight;
        }

        // vertically align label in center unless they override the value via property setter
        if (!_hasLabelOffsetY) {
            _labelOffsetY = height / 2;
        }

        if (typeof(_rowOrdering) === 'function') {
            rowOrder = getRowList(_rowData).sort(_rowOrdering);
        } else {
            rowOrder = _rowOrdering;
        }

        //this bit positions the bars on the vertical.
        function rectTransform (d, i) {
            var effectiveIndex = rowOrder.indexOf(_rowAccessor(d,i));
            yTrans = ((effectiveIndex + 1) * _gap + effectiveIndex * height);
            return 'translate(0,' + yTrans + ')';
        }

        var rect = rows.attr('transform', rectTransform)
                .select('rect')
                .attr('height', height)
                .attr('fill', _chart.getColor)
                .on('click', onClick)
                .classed('deselected', function (d) {
                    return (_chart.hasFilter()) ? !isSelectedRow(d) : false;
                })
                .classed('selected', function (d) {
                    return (_chart.hasFilter()) ? isSelectedRow(d) : false;
                });

        dc.transition(rect, _chart.transitionDuration())
            .attr('width', function (d) {
                return Math.abs(rootValue() - _x(_chart.valueAccessor()(d)));
            })
            .attr('transform', translateX);

        createTitles(rows);
        updateLabels(rows);
    }

    function createTitles (rows) {
        if (_chart.renderTitle()) {
            rows.selectAll('title').remove();
            rows.append('title').text(_chart.title());
        }
    }

    function labelPosition (d) {
        if (_leftColumn(d)) {
            return {
                textAnchor: 'end',
                position: rootValue() - _labelOffsetX
            };
        } else {
            return {
                textAnchor: 'start',
                position: rootValue() + _labelOffsetX
            };
        }
    }

    function createLabels (rowEnter) {
        if (_chart.renderLabel()) {
            if (_twoLabels) {

                rowEnter.append('text')
                    .attr('transform',function (d) {return 'translate(' + labelPosition(d).position + ',0)';})
                    .attr('text-anchor',function (d) {return labelPosition(d).textAnchor;})
                    .on('click', onClick);
            } else {

                _g.selectAll('text.columnLabel').data(_columnLabels).enter().append('text').classed('columnLabel',true)
                    .attr('transform',columnLabelPos)
                    .attr('text-anchor',function (d, i) {return i ? 'end' : 'start';})
                    .text(function (d) {return d;});

                rowEnter.append('text')
                    .attr('transform',function (d) {return 'translate(' + labelPosition(d).position + ',0)';})
                    .attr('text-anchor','middle')
                    .on('click', onClick);
            }

        }
        if (_chart.renderTitleLabel()) {
            if (_twoLabels) {
                rowEnter.append('text')
                    .attr('transform',function (d) {return 'translate(' + labelPosition(d).position + ',0)';})
                    .attr('text-anchor',function (d) {return labelPosition(d).textAnchor;})
                    .attr('class', _titleRowCssClass)
                    .on('click', onClick);
            } else {

                _g.selectAll('text.columnLabel').data(_columnLabels).enter().append('text').classed('columnLabel',true)
                    .attr('transform',columnLabelPos)
                    .attr('text-anchor',function (d, i) {return i ? 'end' : 'start';})
                    .text(function (d) {return d;});

                rowEnter.append('text')
                    .attr('transform',function (d) {return 'translate(' + labelPosition(d).position + ',0)';})
                    .attr('text-anchor','middle')
                    .attr('class', _titleRowCssClass)
                    .on('click', onClick);
            }
        }
    }

    function columnLabelPos (d, i) {
        pos = i * (_chart.width() - (_chart.margins().right + _chart.margins().left)) + _columnLabelPosition[0] * (i ? -1 : 1);
        return 'translate (' + pos + ', ' + _columnLabelPosition[1] + ')';

    }

    function updateLabels (rows) {
        if (_chart.renderLabel()) {
            var lab;
            if (_twoLabels) {
                lab = rows.select('text')
                //.attr('x', _labelOffsetX)
                        .attr('y', _labelOffsetY)
                        .attr('dy', _dyOffset)
                        .on('click', onClick)
                        .attr('class', function (d, i) {
                            return _rowCssClass + ' _' + i;
                        })
                        .text(function (d) {
                            return _chart.label()(d);
                        });
            } else {
                lab = rows.select('text')
                        .attr('x', 0)
                        .attr('y', _labelOffsetY)
                        .attr('dy', _dyOffset)
                        .on('click', onLabelClick)
                        .attr('class', function (d, i) {
                            return _rowCssClass + ' _' + i;
                        })
                        .text(function (d) {return _leftColumn(d) ? _chart.label()(d) : '';});
            }
            dc.transition(lab, _chart.transitionDuration());
            //.attr('transform', translateX);
        }
        if (_chart.renderTitleLabel()) {
            var titlelab;
            if (_twoLabels) {
                titlelab = rows.select('.' + _titleRowCssClass)
                        .attr('y', _labelOffsetY)
                        .attr('text-anchor', 'end')
                        .on('click', onClick)
                        .attr('class', function (d, i) {
                            return _titleRowCssClass + ' _' + i ;
                        })
                        .text(function (d) {
                            return _chart.title()(d);
                        });
            } else {
                titlelab = rows.select('.' + _titleRowCssClass)
                        .attr('x', 0)
                        .attr('y', _labelOffsetY)
                        .attr('text-anchor', 'end')
                        .on('click', onLabelClick)
                        .attr('class', function (d, i) {
                            return _titleRowCssClass + ' _' + i ;
                        })
                        .text(function (d) {return _leftColumn(d) ? _chart.label()(d) : '';});

            }
            dc.transition(titlelab, _chart.transitionDuration());
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

    function onClick (d) {
        _chart.onClick(d);
    }

    function onLabelClick (d) {
        //g = _chart.group().all()
        //row_id = _rowAccessor(d)
        for (var i in _chart.group().all()) {
            if (_rowAccessor(_chart.group().all()[i]) === _rowAccessor(d)) {
                _chart.filter(_chart.group().all()[i].key);
                dc.redrawAll();
            }
        }

    }

    function translateX (d, i) {//stick LHS in here
        var x = _x(_chart.cappedValueAccessor(d)),
            x0 = rootValue(),
            s = x > x0 ? x0 : x;

        if (_leftColumn(d,i)) {//bars to the left - translate by -1 * width
            width = Math.abs(rootValue() - _x(_chart.valueAccessor()(d)));
            xTrans = -1 * width;
            return 'translate(' + (xTrans + s) + ',0)';
        } else {

            return 'translate(' + s + ',0)';
        }
    }

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
     you could fix height as follows (where count = total number of bars in your TopN and gap is
     your vertical gap space).
     ```js
     chart.fixedBarHeight( chartheight - (count + 1) * gap / count);
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
     Get or set the elasticity on x axis. If this attribute is set to true, then the x axis will rescle to auto-fit the
     data range when filtered.

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
     Get or set the y offset (vertical space to the top left corner of a row) for labels on a particular row chart.
     Default y offset is 15px;

     **/
    _chart.labelOffsetY = function (o) {
        if (!arguments.length) {
            return _labelOffsetY;
        }
        _labelOffsetY = o;
        _hasLabelOffsetY = true;
        return _chart;
    };

    /**
     #### .titleLabelOffsetx([x])
     Get of set the x offset (horizontal space between right edge of row and right edge or text.
     Default x offset is 2px;

     **/
    _chart.titleLabelOffsetX = function (o) {
        if (!arguments.length) {
            return _titleLabelOffsetX;
        }
        _titleLabelOffsetX = o;
        return _chart;
    };

    /**
     #### .leftColumn([function])
     selects whether a row goes into the left side of the tree.
     Default is rows with even indices go left, odd go right;

     **/

    var _leftColumn = function (d, i) {return i % 2 === 0;};

    _chart.leftColumn = function (o) {
        if (!arguments.length) {
            return _leftColumn;
        }
        _leftColumn = o;
        return _chart;
    };

    /**
     #### .rowAccessor([function])
     selects which row a data rectangle goes into.
     Default is d.key, but this will plot everything on top of each other, so it's kinda mandatory;

     **/

    var _rowAccessor = function (d, i) {return d.key;};

    _chart.rowAccessor = function (o) {
        if (!arguments.length) {
            return _rowAccessor;
        }
        _rowAccessor = o;
        return _chart;
    };

    /**
     #### .rowOrdering([function] or [array])
     Orders the rows delivered by .rowAccessor.
     Function is used as an argument to javascript's sort function. Use a function that follows the
     same scheme as d3.ascending/d3.descending (described here:
     https://github.com/mbostock/d3/wiki/Arrays#ordering)
     Array is COMPLETE list of .rowAccessors in  the order you want them.
     Defaults to d3.ascending.

     **/

    _chart.rowOrdering = function (o) {
        if (!arguments.length) {
            return _rowOrdering;
        }
        _rowOrdering = o;
        if (typeof(_rowOrdering) === 'function') {rowOrder = getRowList(_rowData).sort(_rowOrdering);} else {rowOrder = _rowOrdering;}

        return _chart;
    };

    /**
     #### .label([function])
     overwriting .label to enable testing for the existance of a lable.  This is necessary for
     .twoLabels to default correctly
     **/

    _chart.label = function (o) {
        if (!arguments.length) {
            return _label;
        }

        _chart.hasLabel = true;
        _label = o;

        return _chart;

    };

    /**
     #### .twoLabels(boolean)
     true labels each rect, lable defaults to data.key
     false labels each row in the centre, defaults to .rowAccessor(data(d)). This will give the same
     value for the right and left rects, by definition.

     **/

    _chart.twoLabels = function (o) {
        if (!arguments.length) {
            return _twoLabels;
        }
        _twoLabels = o;
        _labelOffsetX = _twoLabels ? 10 : 0;
        if (!_twoLabels && !_chart.hasLabel) { _label = _chart.rowAccessor(); }
        return _chart;
    };

    /**
     #### .columnLabels(['left'],['right'])
     labels for the left and right hand sides, respectively. Defaults to empty strings: ['',''].
     **/

    _chart.columnLabels = function (o) {
        if (!arguments.length) {
            return _columnLabels ;
        }
        _columnLabels = o;

        if (_g) {  console.log(_chart); _g.selectAll('text.columnLabel').data(_columnLabels);}

        return _chart;
    };

    /**
     #### .columnPosition([x,y])
     Enables the symmetrical positioning of labels for the left and right columns. x in pix in from
     the edge of the chart <g>, y in pix from the top. Defaults to [5,10]
     **/

    _chart.columnLabelPosition = function (o) {
        if (!arguments.length) {
            return _columnLabelPosition ;
        }
        _columnLabelPosition = o;
        return _chart;
    };

    function isSelectedRow (d) {
        return _chart.hasFilter(_chart.cappedKeyAccessor(d));
    }

    return _chart.anchor(parent, chartGroup);

};

