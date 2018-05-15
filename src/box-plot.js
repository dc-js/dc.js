
/**
 * A box plot is a chart that depicts numerical data via their quartile ranges.
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/box-plot-time.html Box plot time example}
 * - {@link http://dc-js.github.io/dc.js/examples/box-plot.html Box plot example}
 * @class boxPlot
 * @memberof dc
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a box plot under #chart-container1 element using the default global chart group
 * var boxPlot1 = dc.boxPlot('#chart-container1');
 * // create a box plot under #chart-container2 element using chart group A
 * var boxPlot2 = dc.boxPlot('#chart-container2', 'chartGroupA');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.boxPlot}
 */
dc.boxPlot = function (parent, chartGroup) {
    var _chart = dc.coordinateGridMixin({});

    // Returns a function to compute the interquartile range.
    function DEFAULT_WHISKERS_IQR (k) {
        return function (d) {
            var q1 = d.quartiles[0],
                q3 = d.quartiles[2],
                iqr = (q3 - q1) * k,
                i = -1,
                j = d.length;
            do { ++i; } while (d[i] < q1 - iqr);
            do { --j; } while (d[j] > q3 + iqr);
            return [i, j];
        };
    }

    var _whiskerIqrFactor = 1.5;
    var _whiskersIqr = DEFAULT_WHISKERS_IQR;
    var _whiskers = _whiskersIqr(_whiskerIqrFactor);

    var _box = d3.box();
    var _tickFormat = null;
    var _renderData = false;
    var _dataBoxPercentage = 0.8;
    var _renderTitle = false;
    var _showOutliers = true;
    var _boldOutlier = false;

    var _boxWidth = function (innerChartWidth, xUnits) {
        if (_chart.isOrdinal()) {
            return _chart.x().rangeBand();
        } else {
            return innerChartWidth / (1 + _chart.boxPadding()) / xUnits;
        }
    };

    // default to ordinal
    _chart.x(d3.scale.ordinal());
    _chart.xUnits(dc.units.ordinal);

    // valueAccessor should return an array of values that can be coerced into numbers
    // or if data is overloaded for a static array of arrays, it should be `Number`.
    // Empty arrays are not included.
    _chart.data(function (group) {
        return group.all().map(function (d) {
            d.map = function (accessor) { return accessor.call(d, d); };
            return d;
        }).filter(function (d) {
            var values = _chart.valueAccessor()(d);
            return values.length !== 0;
        });
    });

    /**
     * Get or set the spacing between boxes as a fraction of box size. Valid values are within 0-1.
     * See the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands d3 docs}
     * for a visual description of how the padding is applied.
     * @method boxPadding
     * @memberof dc.boxPlot
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands d3.scale.ordinal.rangeBands}
     * @param {Number} [padding=0.8]
     * @returns {Number|dc.boxPlot}
     */
    _chart.boxPadding = _chart._rangeBandPadding;
    _chart.boxPadding(0.8);

    /**
     * Get or set the outer padding on an ordinal box chart. This setting has no effect on non-ordinal charts
     * or on charts with a custom {@link dc.boxPlot#boxWidth .boxWidth}. Will pad the width by
     * `padding * barWidth` on each side of the chart.
     * @method outerPadding
     * @memberof dc.boxPlot
     * @instance
     * @param {Number} [padding=0.5]
     * @returns {Number|dc.boxPlot}
     */
    _chart.outerPadding = _chart._outerRangeBandPadding;
    _chart.outerPadding(0.5);

    /**
     * Get or set the numerical width of the boxplot box. The width may also be a function taking as
     * parameters the chart width excluding the right and left margins, as well as the number of x
     * units.
     * @example
     * // Using numerical parameter
     * chart.boxWidth(10);
     * // Using function
     * chart.boxWidth((innerChartWidth, xUnits) { ... });
     * @method boxWidth
     * @memberof dc.boxPlot
     * @instance
     * @param {Number|Function} [boxWidth=0.5]
     * @returns {Number|Function|dc.boxPlot}
     */
    _chart.boxWidth = function (boxWidth) {
        if (!arguments.length) {
            return _boxWidth;
        }
        _boxWidth = d3.functor(boxWidth);
        return _chart;
    };

    var boxTransform = function (d, i) {
        var xOffset = _chart.x()(_chart.keyAccessor()(d, i));
        return 'translate(' + xOffset + ', 0)';
    };

    _chart._preprocessData = function () {
        if (_chart.elasticX()) {
            _chart.x().domain([]);
        }
    };

    _chart.plotData = function () {
        var _calculatedBoxWidth = _boxWidth(_chart.effectiveWidth(), _chart.xUnitCount());

        _box.whiskers(_whiskers)
            .width(_calculatedBoxWidth)
            .height(_chart.effectiveHeight())
            .value(_chart.valueAccessor())
            .domain(_chart.y().domain())
            .duration(_chart.transitionDuration())
            .tickFormat(_tickFormat)
            .renderData(_renderData)
            .dataBoxPercentage(_dataBoxPercentage)
            .renderTitle(_renderTitle)
            .showOutliers(_showOutliers)
            .boldOutlier(_boldOutlier);

        var boxesG = _chart.chartBodyG().selectAll('g.box').data(_chart.data(), _chart.keyAccessor());

        renderBoxes(boxesG);
        updateBoxes(boxesG);
        removeBoxes(boxesG);

        _chart.fadeDeselectedArea();
    };

    function renderBoxes (boxesG) {
        var boxesGEnter = boxesG.enter().append('g');

        boxesGEnter
            .attr('class', 'box')
            .attr('transform', boxTransform)
            .call(_box)
            .on('click', function (d) {
                _chart.filter(_chart.keyAccessor()(d));
                _chart.redrawGroup();
            });
    }

    function updateBoxes (boxesG) {
        dc.transition(boxesG, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('transform', boxTransform)
            .call(_box)
            .each(function () {

                // TODO: Is there a better way to get a unique color, I don't like drilling down.
                //d3.select(this).select('rect.box').attr('fill', _chart.getColor);

                var color = _chart.getColor(d3.select(this).select('rect.box')[0][0].__data__, 0);
                d3.select(this).select('rect.box').attr('fill', color);

                // TODO: Change style to attr once we remove the fill attribute for .box circle from dc.css
                d3.select(this).selectAll('circle.data').style('fill', color);
            });
    }

    function removeBoxes (boxesG) {
        boxesG.exit().remove().call(_box);
    }

    function minDataValue () {
        return d3.min(_chart.data(), function (e) {
            return d3.min(_chart.valueAccessor()(e));
        });
    }

    function maxDataValue () {
        return d3.max(_chart.data(), function (e) {
            return d3.max(_chart.valueAccessor()(e));
        });
    }

    function yAxisRangeRatio () {
        return ((maxDataValue() - minDataValue()) / _chart.effectiveHeight());
    }

    _chart.fadeDeselectedArea = function (brushSelection) {
        if (_chart.hasFilter()) {
            if (_chart.isOrdinal()) {
                _chart.g().selectAll('g.box').each(function (d) {
                    if (_chart.isSelectedNode(d)) {
                        _chart.highlightSelected(this);
                    } else {
                        _chart.fadeDeselected(this);
                    }
                });
            } else {
                if (!(_chart.brushOn() || _chart.parentBrushOn())) {
                    return;
                }
                var start = brushSelection[0];
                var end = brushSelection[1];
                var keyAccessor = _chart.keyAccessor();
                _chart.g().selectAll('g.box').each(function (d) {
                    var key = keyAccessor(d);
                    if (key < start || key >= end) {
                        _chart.fadeDeselected(this);
                    } else {
                        _chart.highlightSelected(this);
                    }
                });
            }
        } else {
            _chart.g().selectAll('g.box').each(function () {
                _chart.resetHighlight(this);
            });
        }
    };

    _chart.isSelectedNode = function (d) {
        return _chart.hasFilter(_chart.keyAccessor()(d));
    };

    _chart.yAxisMin = function () {
        var padding = 16 * yAxisRangeRatio();
        return dc.utils.subtract(minDataValue() - padding, _chart.yAxisPadding());
    };

    _chart.yAxisMax = function () {
        var padding = 16 * yAxisRangeRatio();
        return dc.utils.add(maxDataValue() + padding, _chart.yAxisPadding());
    };

    /**
     * Set the numerical format of the boxplot median, whiskers and quartile labels. Defaults to
     * integer formatting.
     * @example
     * // format ticks to 2 decimal places
     * chart.tickFormat(d3.format('.2f'));
     * @method tickFormat
     * @memberof dc.boxPlot
     * @instance
     * @param {Function} [tickFormat]
     * @returns {Number|Function|dc.boxPlot}
     */
    _chart.tickFormat = function (tickFormat) {
        if (!arguments.length) {
            return _tickFormat;
        }
        _tickFormat = tickFormat;
        return _chart;
    };

    /**
     * Get or set whether individual data points will be rendered.
     * @method renderData
     * @memberof dc.boxPlot
     * @instance
     * @param {Boolean} [show=true]
     * @returns {Boolean|dc.boxPlot}
     */
    _chart.renderData = function (show) {
        if (!arguments.length) {
            return _renderData;
        }
        _renderData = show;
        return _chart;
    };

    /**
     * Get or set the percentage of the box to show data.
     * @method dataBoxPercentage
     * @memberof dc.boxPlot
     * @instance
     * @param {Number} [percentage=0.8]
     * @returns {Number|dc.boxPlot}
     */
    _chart.dataBoxPercentage = function (percentage) {
        if (!arguments.length) {
            return _dataBoxPercentage;
        }
        _dataBoxPercentage = percentage;
        return _chart;
    };

    /**
     * Get or set whether tooltips will be rendered.
     * @method renderTitle
     * @memberof dc.boxPlot
     * @instance
     * @param {Boolean} [show=true]
     * @returns {Boolean|dc.boxPlot}
     */
    _chart.renderTitle = function (show) {
        if (!arguments.length) {
            return _renderTitle;
        }
        _renderTitle = show;
        return _chart;
    };

    /**
     * Get or set whether outliers will be rendered.
     * @method showOutliers
     * @memberof dc.boxPlot
     * @instance
     * @param {Boolean} [show=true]
     * @returns {Boolean|dc.boxPlot}
     */
    _chart.showOutliers = function (show) {
        if (!arguments.length) {
            return _showOutliers;
        }
        _showOutliers = show;
        return _chart;
    };

    /**
     * Get or set whether outliers will be bold.
     * @method boldOutlier
     * @memberof dc.boxPlot
     * @instance
     * @param {Boolean} [show=true]
     * @returns {Boolean|dc.boxPlot}
     */
    _chart.boldOutlier = function (show) {
        if (!arguments.length) {
            return _boldOutlier;
        }
        _boldOutlier = show;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};

