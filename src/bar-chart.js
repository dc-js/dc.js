import * as d3 from 'd3';
import {warn} from './logger';
import {constants, override, transition} from './core';
import {pluck, utils} from './utils';
import stackMixin from './stack-mixin';
import coordinateGridMixin from './coordinate-grid-mixin';

/**
 * Concrete bar chart/histogram implementation.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/crime/index.html Canadian City Crime Stats}
 * @class barChart
 * @memberof dc
 * @mixes dc.stackMixin
 * @mixes dc.coordinateGridMixin
 * @example
 * // create a bar chart under #chart-container1 element using the default global chart group
 * let chart1 = dc.barChart('#chart-container1');
 * // create a bar chart under #chart-container2 element using chart group A
 * let chart2 = dc.barChart('#chart-container2', 'chartGroupA');
 * // create a sub-chart under a composite parent chart
 * let chart3 = dc.barChart(compositeChart);
 * @param {String|node|d3.selection|dc.compositeChart} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector}
 * specifying a dom block element such as a div; or a dom element or d3 selection.  If the bar
 * chart is a sub-chart in a {@link dc.compositeChart Composite Chart} then pass in the parent
 * composite chart instance instead.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.barChart}
 */
export default function barChart (parent, chartGroup) {
    const MIN_BAR_WIDTH = 1;
    const DEFAULT_GAP_BETWEEN_BARS = 2;
    const LABEL_PADDING = 3;

    const _chart = stackMixin(coordinateGridMixin({}));

    let _gap = DEFAULT_GAP_BETWEEN_BARS;
    let _centerBar = false;
    let _alwaysUseRounding = false;

    let _barWidth;

    override(_chart, 'rescale', () => {
        _chart._rescale();
        _barWidth = undefined;
        return _chart;
    });

    override(_chart, 'render', () => {
        if (_chart.round() && _centerBar && !_alwaysUseRounding) {
            warn('By default, brush rounding is disabled if bars are centered. ' +
                         'See dc.js bar chart API documentation for details.');
        }
        return _chart._render();
    });

    _chart.label(d => utils.printSingleValue(d.y0 + d.y), false);

    _chart.plotData = function () {
        const layers = _chart.chartBodyG().selectAll('g.stack')
            .data(_chart.data());

        calculateBarWidth();

        layers
            .enter()
            .append('g')
            .attr('class', (d, i) => `stack _${i}`);

        const last = layers.size() - 1;
        layers.each(function (d, i) {
            const layer = d3.select(this);

            renderBars(layer, d);

            if (_chart.renderLabel() && last === i) {
                renderLabels(layer, d);
            }
        });
    };

    function barHeight (d) {
        return utils.safeNumber(Math.abs(_chart.y()(d.y + d.y0) - _chart.y()(d.y0)));
    }

    function renderLabels (layer, datum) {
        const labels = layer.selectAll('text.barLabel')
            .data(datum.values, pluck('x'));

        labels.enter()
            .append('text')
            .attr('class', 'barLabel')
            .attr('text-anchor', 'middle');

        if (_chart.isOrdinal()) {
            labels.on('click', _chart.onClick);
            labels.attr('cursor', 'pointer');
        }

        transition(labels, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', (d) => {
                let x = _chart.x()(d.x);
                if (!_centerBar) {
                    x += _barWidth / 2;
                }
                return utils.safeNumber(x);
            })
            .attr('y', (d) => {
                let y = _chart.y()(d.y + d.y0);

                if (d.y < 0) {
                    y -= barHeight(d);
                }

                return utils.safeNumber(y - LABEL_PADDING);
            })
            .text(_chart.label());

        transition(labels.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('height', 0)
            .remove();
    }

    function renderBars (layer, datum) {
        const bars = layer.selectAll('rect.bar')
            .data(datum.values, pluck('x'));

        const enter = bars.enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('fill', pluck('data', _chart.getColor))
            .attr('y', _chart.yAxisHeight())
            .attr('height', 0);

        if (_chart.renderTitle()) {
            enter.append('title').text(pluck('data', _chart.title(datum.name)));
        }

        if (_chart.isOrdinal()) {
            bars.on('click', _chart.onClick);
        }

        transition(bars, _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', (d) => {
                let x = _chart.x()(d.x);
                if (_centerBar) {
                    x -= _barWidth / 2;
                }
                if (_chart.isOrdinal() && _gap !== undefined) {
                    x += _gap / 2;
                }
                return utils.safeNumber(x);
            })
            .attr('y', (d) => {
                let y = _chart.y()(d.y + d.y0);

                if (d.y < 0) {
                    y -= barHeight(d);
                }

                return utils.safeNumber(y);
            })
            .attr('width', _barWidth)
            .attr('height', barHeight)
            .attr('fill', pluck('data', _chart.getColor))
            .select('title')
            .text(pluck('data', _chart.title(datum.name)));

        transition(bars.exit(), _chart.transitionDuration(), _chart.transitionDelay())
            .attr('x', d => _chart.x()(d.x))
            .attr('width', _barWidth * 0.9)
            .remove();
    }

    function calculateBarWidth () {
        if (_barWidth === undefined) {
            const numberOfBars = _chart.xUnitCount();

            // please can't we always use rangeBands for bar charts?
            if (_chart.isOrdinal() && _gap === undefined) {
                _barWidth = Math.floor(_chart.x().rangeBand());
            } else if (_gap) {
                _barWidth = Math.floor((_chart.xAxisLength() - (numberOfBars - 1) * _gap) / numberOfBars);
            } else {
                _barWidth = Math.floor(_chart.xAxisLength() / (1 + _chart.barPadding()) / numberOfBars);
            }

            if (_barWidth === Infinity || isNaN(_barWidth) || _barWidth < MIN_BAR_WIDTH) {
                _barWidth = MIN_BAR_WIDTH;
            }
        }
    }

    _chart.fadeDeselectedArea = function () {
        const bars = _chart.chartBodyG().selectAll('rect.bar');
        const extent = _chart.brush().extent();

        if (_chart.isOrdinal()) {
            if (_chart.hasFilter()) {
                bars.classed(constants.SELECTED_CLASS, d => _chart.hasFilter(d.x));
                bars.classed(constants.DESELECTED_CLASS, d => !_chart.hasFilter(d.x));
            } else {
                bars.classed(constants.SELECTED_CLASS, false);
                bars.classed(constants.DESELECTED_CLASS, false);
            }
        } else if (!_chart.brushIsEmpty(extent)) {
            const start = extent[0];
            const end = extent[1];

            bars.classed(constants.DESELECTED_CLASS, d => d.x < start || d.x >= end);
        } else {
            bars.classed(constants.DESELECTED_CLASS, false);
        }
    };

    /**
     * Whether the bar chart will render each bar centered around the data position on the x-axis.
     * @method centerBar
     * @memberof dc.barChart
     * @instance
     * @param {Boolean} [centerBar=false]
     * @returns {Boolean|dc.barChart}
     */
    _chart.centerBar = function (centerBar) {
        if (!arguments.length) {
            return _centerBar;
        }
        _centerBar = centerBar;
        return _chart;
    };

    override(_chart, 'onClick', d => _chart._onClick(d.data));

    /**
     * Get or set the spacing between bars as a fraction of bar size. Valid values are between 0-1.
     * Setting this value will also remove any previously set {@link dc.barChart#gap gap}. See the
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_rangeBands d3 docs}
     * for a visual description of how the padding is applied.
     * @method barPadding
     * @memberof dc.barChart
     * @instance
     * @param {Number} [barPadding=0]
     * @returns {Number|dc.barChart}
     */
    _chart.barPadding = function (barPadding) {
        if (!arguments.length) {
            return _chart._rangeBandPadding();
        }
        _chart._rangeBandPadding(barPadding);
        _gap = undefined;
        return _chart;
    };

    _chart._useOuterPadding = function () {
        return _gap === undefined;
    };

    /**
     * Get or set the outer padding on an ordinal bar chart. This setting has no effect on non-ordinal charts.
     * Will pad the width by `padding * barWidth` on each side of the chart.
     * @method outerPadding
     * @memberof dc.barChart
     * @instance
     * @param {Number} [padding=0.5]
     * @returns {Number|dc.barChart}
     */
    _chart.outerPadding = _chart._outerRangeBandPadding;

    /**
     * Manually set fixed gap (in px) between bars instead of relying on the default auto-generated
     * gap.  By default the bar chart implementation will calculate and set the gap automatically
     * based on the number of data points and the length of the x axis.
     * @method gap
     * @memberof dc.barChart
     * @instance
     * @param {Number} [gap=2]
     * @returns {Number|dc.barChart}
     */
    _chart.gap = function (gap) {
        if (!arguments.length) {
            return _gap;
        }
        _gap = gap;
        return _chart;
    };

    _chart.extendBrush = function () {
        const extent = _chart.brush().extent();
        if (_chart.round() && (!_centerBar || _alwaysUseRounding)) {
            [extent[0], extent[1]] = extent.map(_chart.round());

            _chart.chartBodyG().select('.brush')
                .call(_chart.brush().extent(extent));
        }

        return extent;
    };

    /**
     * Set or get whether rounding is enabled when bars are centered. If false, using
     * rounding with centered bars will result in a warning and rounding will be ignored.  This flag
     * has no effect if bars are not {@link dc.barChart#centerBar centered}.
     * When using standard d3.js rounding methods, the brush often doesn't align correctly with
     * centered bars since the bars are offset.  The rounding function must add an offset to
     * compensate, such as in the following example.
     * @method alwaysUseRounding
     * @memberof dc.barChart
     * @instance
     * @example
     * chart.round(function(n) { return Math.floor(n) + 0.5; });
     * @param {Boolean} [alwaysUseRounding=false]
     * @returns {Boolean|dc.barChart}
     */
    _chart.alwaysUseRounding = function (alwaysUseRounding) {
        if (!arguments.length) {
            return _alwaysUseRounding;
        }
        _alwaysUseRounding = alwaysUseRounding;
        return _chart;
    };

    function colorFilter (color, inv) {
        return function () {
            const item = d3.select(this);
            const match = item.attr('fill') === color;
            return inv ? !match : match;
        };
    }

    _chart.legendHighlight = function (d) {
        if (!_chart.isLegendableHidden(d)) {
            _chart.g().selectAll('rect.bar')
                .classed('highlight', colorFilter(d.color))
                .classed('fadeout', colorFilter(d.color, true));
        }
    };

    _chart.legendReset = function () {
        _chart.g().selectAll('rect.bar')
            .classed('highlight', false)
            .classed('fadeout', false);
    };

    override(_chart, 'xAxisMax', function () {
        let max = this._xAxisMax();
        if ('resolution' in _chart.xUnits()) {
            max += _chart.xUnits().resolution;
        }
        return max;
    });

    return _chart.anchor(parent, chartGroup);
}
