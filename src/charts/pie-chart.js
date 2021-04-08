import {min, sum} from 'd3-array';
import {arc, pie} from 'd3-shape';
import {select} from 'd3-selection';
import {interpolate} from 'd3-interpolate';

import {CapMixin} from '../base/cap-mixin';
import {ColorMixin} from '../base/color-mixin';
import {BaseMixin} from '../base/base-mixin';
import {transition} from '../core/core';
import {d3compat} from '../core/config';

const DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

/**
 * The pie chart implementation is usually used to visualize a small categorical distribution.  The pie
 * chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
 * slice relative to the sum of all values. Slices are ordered by {@link BaseMixin#ordering ordering}
 * which defaults to sorting by key.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * @mixes CapMixin
 * @mixes ColorMixin
 * @mixes BaseMixin
 */
export class PieChart extends CapMixin(ColorMixin(BaseMixin)) {
    /**
     * Create a Pie Chart
     *
     * @example
     * // create a pie chart under #chart-container1 element using the default global chart group
     * var chart1 = new PieChart('#chart-container1');
     * // create a pie chart under #chart-container2 element using chart group A
     * var chart2 = new PieChart('#chart-container2', 'chartGroupA');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._sliceCssClass = 'pie-slice';
        this._labelCssClass = 'pie-label';
        this._sliceGroupCssClass = 'pie-slice-group';
        this._labelGroupCssClass = 'pie-label-group';
        this._emptyCssClass = 'empty-chart';
        this._emptyTitle = 'empty';

        this._radius = undefined;
        this._givenRadius = undefined; // specified radius, if any
        this._innerRadius = 0;
        this._externalRadiusPadding = 0;


        this._g = undefined;
        this._cx = undefined;
        this._cy = undefined;
        this._minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;
        this._externalLabelRadius = undefined;
        this._drawPaths = false;

        this.colorAccessor(d => this.cappedKeyAccessor(d));

        this.title(d => `${this.cappedKeyAccessor(d)}: ${this.cappedValueAccessor(d)}`);

        this.label(d => this.cappedKeyAccessor(d));
        this.renderLabel(true);

        this.transitionDuration(350);
        this.transitionDelay(0);

        this.anchor(parent, chartGroup);
    }

    /**
     * Get or set the maximum number of slices the pie chart will generate. The top slices are determined by
     * value from high to low. Other slices exceeding the cap will be rolled up into one single *Others* slice.
     * @param {Number} [cap]
     * @returns {Number|PieChart}
     */
    slicesCap (cap) {
        return this.cap(cap)
    }

    _doRender () {
        this.resetSvg();

        this._g = this.svg()
            .append('g')
            .attr('transform', `translate(${this.cx()},${this.cy()})`);

        this._g.append('g').attr('class', this._sliceGroupCssClass);
        this._g.append('g').attr('class', this._labelGroupCssClass);

        this._drawChart();

        return this;
    }

    _drawChart () {
        // set radius from chart size if none given, or if given radius is too large
        const maxRadius = min([this.width(), this.height()]) / 2;
        this._radius = this._givenRadius && this._givenRadius < maxRadius ? this._givenRadius : maxRadius;

        const arcs = this._buildArcs();

        const pieLayout = this._pieLayout();
        let pieData;
        // if we have data...
        if (sum(this.data(), d => this.cappedValueAccessor(d))) {
            pieData = pieLayout(this.data());
            this._g.classed(this._emptyCssClass, false);
        } else {
            // otherwise we'd be getting NaNs, so override
            // note: abuse others for its ignoring the value accessor
            pieData = pieLayout([{key: this._emptyTitle, value: 1, others: [this._emptyTitle]}]);
            this._g.classed(this._emptyCssClass, true);
        }

        if (this._g) {
            const slices = this._g.select(`g.${this._sliceGroupCssClass}`)
                .selectAll(`g.${this._sliceCssClass}`)
                .data(pieData);

            const labels = this._g.select(`g.${this._labelGroupCssClass}`)
                .selectAll(`text.${this._labelCssClass}`)
                .data(pieData);

            this._removeElements(slices, labels);

            this._createElements(slices, labels, arcs, pieData);

            this._updateElements(pieData, arcs);

            this._highlightFilter();

            transition(this._g, this.transitionDuration(), this.transitionDelay())
                .attr('transform', `translate(${this.cx()},${this.cy()})`);
        }
    }

    _createElements (slices, labels, arcs, pieData) {
        const slicesEnter = this._createSliceNodes(slices);

        this._createSlicePath(slicesEnter, arcs);

        this._createTitles(slicesEnter);

        this._createLabels(labels, pieData, arcs);
    }

    _createSliceNodes (slices) {
        return slices
            .enter()
            .append('g')
            .attr('class', (d, i) => `${this._sliceCssClass} _${i}`)
            .classed('dc-tabbable', this._keyboardAccessible);
    }

    _createSlicePath (slicesEnter, arcs) {
        const slicePath = slicesEnter.append('path')
            .attr('fill', (d, i) => this._fill(d, i))
            .on('click', d3compat.eventHandler(d => this._onClick(d)))
            .attr('d', (d, i) => this._safeArc(d, i, arcs));

        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible(this._onClick);
        }

        const tranNodes = transition(slicePath, this.transitionDuration(), this.transitionDelay());
        if (tranNodes.attrTween) {
            const chart = this;
            tranNodes.attrTween('d', function (d) {
                return chart._tweenPie(d, this);
            });
        }
    }

    _createTitles (slicesEnter) {
        if (this.renderTitle()) {
            slicesEnter.append('title').text(d => this.title()(d.data));
        }
    }

    _applyLabelText (labels) {
        labels
            .text(d => {
                const data = d.data;
                if ((this._sliceHasNoData(data) || this._sliceTooSmall(d)) && !this._isSelectedSlice(d)) {
                    return '';
                }
                return this.label()(d.data);
            });
    }

    _positionLabels (labels, arcs) {
        this._applyLabelText(labels);
        transition(labels, this.transitionDuration(), this.transitionDelay())
            .attr('transform', d => this._labelPosition(d, arcs))
            .attr('text-anchor', 'middle');
    }

    _highlightSlice (i, whether) {
        this.select(`g.pie-slice._${i}`)
            .classed('highlight', whether);
    }

    _createLabels (labels, pieData, arcs) {
        if (this.renderLabel()) {
            const labelsEnter = labels
                .enter()
                .append('text')
                .attr('class', (d, i) => {
                    let classes = `${this._sliceCssClass} ${this._labelCssClass} _${i}`;
                    if (this._externalLabelRadius) {
                        classes += ' external';
                    }
                    return classes;
                })
                .on('click', d3compat.eventHandler(d => this._onClick(d)))
                .on('mouseover', d3compat.eventHandler(d => {
                    this._highlightSlice(d.index, true);
                }))
                .on('mouseout', d3compat.eventHandler(d => {
                    this._highlightSlice(d.index, false);
                }));
            this._positionLabels(labelsEnter, arcs);
            if (this._externalLabelRadius && this._drawPaths) {
                this._updateLabelPaths(pieData, arcs);
            }
        }
    }

    _updateLabelPaths (pieData, arcs) {
        let polyline = this._g.selectAll(`polyline.${this._sliceCssClass}`)
            .data(pieData);

        polyline.exit().remove();

        polyline = polyline
            .enter()
            .append('polyline')
            .attr('class', (d, i) => `pie-path _${i} ${this._sliceCssClass}`)
            .on('click', d3compat.eventHandler(d => this._onClick(d)))
            .on('mouseover', d3compat.eventHandler(d => {
                this._highlightSlice(d.index, true);
            }))
            .on('mouseout', d3compat.eventHandler(d => {
                this._highlightSlice(d.index, false);
            }))
            .merge(polyline);

        const arc2 = arc()
            .outerRadius(this._radius - this._externalRadiusPadding + this._externalLabelRadius)
            .innerRadius(this._radius - this._externalRadiusPadding);
        const tranNodes = transition(polyline, this.transitionDuration(), this.transitionDelay());
        // this is one rare case where d3.selection differs from d3.transition
        if (tranNodes.attrTween) {
            tranNodes
                .attrTween('points', function (d) {
                    let current = this._current || d;
                    current = {startAngle: current.startAngle, endAngle: current.endAngle};
                    const _interpolate = interpolate(current, d);
                    this._current = _interpolate(0);
                    return t => {
                        const d2 = _interpolate(t);
                        return [arcs.centroid(d2), arc2.centroid(d2)];
                    };
                });
        } else {
            tranNodes.attr('points', d => [arcs.centroid(d), arc2.centroid(d)]);
        }
        tranNodes.style('visibility', d => d.endAngle - d.startAngle < 0.0001 ? 'hidden' : 'visible');

    }

    _updateElements (pieData, arcs) {
        this._updateSlicePaths(pieData, arcs);
        this._updateLabels(pieData, arcs);
        this._updateTitles(pieData);
    }

    _updateSlicePaths (pieData, arcs) {
        const slicePaths = this._g.selectAll(`g.${this._sliceCssClass}`)
            .data(pieData)
            .select('path')
            .attr('d', (d, i) => this._safeArc(d, i, arcs));
        const tranNodes = transition(slicePaths, this.transitionDuration(), this.transitionDelay());
        if (tranNodes.attrTween) {
            const chart = this;
            tranNodes.attrTween('d', function (d) {
                return chart._tweenPie(d, this);
            });
        }
        tranNodes.attr('fill', (d, i) => this._fill(d, i));
    }

    _updateLabels (pieData, arcs) {
        if (this.renderLabel()) {
            const labels = this._g.selectAll(`text.${this._labelCssClass}`)
                .data(pieData);
            this._positionLabels(labels, arcs);
            if (this._externalLabelRadius && this._drawPaths) {
                this._updateLabelPaths(pieData, arcs);
            }
        }
    }

    _updateTitles (pieData) {
        if (this.renderTitle()) {
            this._g.selectAll(`g.${this._sliceCssClass}`)
                .data(pieData)
                .select('title')
                .text(d => this.title()(d.data));
        }
    }

    _removeElements (slices, labels) {
        slices.exit().remove();
        labels.exit().remove();
    }

    _highlightFilter () {
        const chart = this;
        if (this.hasFilter()) {
            this.selectAll(`g.${this._sliceCssClass}`).each(function (d) {
                if (chart._isSelectedSlice(d)) {
                    chart.highlightSelected(this);
                } else {
                    chart.fadeDeselected(this);
                }
            });
        } else {
            this.selectAll(`g.${this._sliceCssClass}`).each(function () {
                chart.resetHighlight(this);
            });
        }
    }

    /**
     * Get or set the external radius padding of the pie chart. This will force the radius of the
     * pie chart to become smaller or larger depending on the value.
     * @param {Number} [externalRadiusPadding=0]
     * @returns {Number|PieChart}
     */
    externalRadiusPadding (externalRadiusPadding) {
        if (!arguments.length) {
            return this._externalRadiusPadding;
        }
        this._externalRadiusPadding = externalRadiusPadding;
        return this;
    }

    /**
     * Get or set the inner radius of the pie chart. If the inner radius is greater than 0px then the
     * pie chart will be rendered as a doughnut chart.
     * @param {Number} [innerRadius=0]
     * @returns {Number|PieChart}
     */
    innerRadius (innerRadius) {
        if (!arguments.length) {
            return this._innerRadius;
        }
        this._innerRadius = innerRadius;
        return this;
    }

    /**
     * Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
     * chart width and height.
     * @param {Number} [radius]
     * @returns {Number|PieChart}
     */
    radius (radius) {
        if (!arguments.length) {
            return this._givenRadius;
        }
        this._givenRadius = radius;
        return this;
    }

    /**
     * Get or set center x coordinate position. Default is center of svg.
     * @param {Number} [cx]
     * @returns {Number|PieChart}
     */
    cx (cx) {
        if (!arguments.length) {
            return (this._cx || this.width() / 2);
        }
        this._cx = cx;
        return this;
    }

    /**
     * Get or set center y coordinate position. Default is center of svg.
     * @param {Number} [cy]
     * @returns {Number|PieChart}
     */
    cy (cy) {
        if (!arguments.length) {
            return (this._cy || this.height() / 2);
        }
        this._cy = cy;
        return this;
    }

    _buildArcs () {
        return arc()
            .outerRadius(this._radius - this._externalRadiusPadding)
            .innerRadius(this._innerRadius);
    }

    _isSelectedSlice (d) {
        return this.hasFilter(this.cappedKeyAccessor(d.data));
    }

    _doRedraw () {
        this._drawChart();
        return this;
    }

    /**
     * Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
     * display a slice label.
     * @param {Number} [minAngleForLabel=0.5]
     * @returns {Number|PieChart}
     */
    minAngleForLabel (minAngleForLabel) {
        if (!arguments.length) {
            return this._minAngleForLabel;
        }
        this._minAngleForLabel = minAngleForLabel;
        return this;
    }

    _pieLayout () {
        return pie().sort(null).value(d => this.cappedValueAccessor(d));
    }

    _sliceTooSmall (d) {
        const angle = (d.endAngle - d.startAngle);
        return isNaN(angle) || angle < this._minAngleForLabel;
    }

    _sliceHasNoData (d) {
        return this.cappedValueAccessor(d) === 0;
    }

    _isOffCanvas (current) {
        return !current || isNaN(current.startAngle) || isNaN(current.endAngle);
    }

    _fill (d, i) {
        return this.getColor(d.data, i);
    }

    _onClick (d) {
        if (this._g.attr('class') !== this._emptyCssClass) {
            this.onClick(d.data);
        }
    }

    _safeArc (d, i, _arc) {
        let path = _arc(d, i);
        if (path.indexOf('NaN') >= 0) {
            path = 'M0,0';
        }
        return path;
    }

    /**
     * Title to use for the only slice when there is no data.
     * @param {String} [title]
     * @returns {String|PieChart}
     */
    emptyTitle (title) {
        if (arguments.length === 0) {
            return this._emptyTitle;
        }
        this._emptyTitle = title;
        return this;
    }

    /**
     * Position slice labels offset from the outer edge of the chart.
     *
     * The argument specifies the extra radius to be added for slice labels.
     * @param {Number} [externalLabelRadius]
     * @returns {Number|PieChart}
     */
    externalLabels (externalLabelRadius) {
        if (arguments.length === 0) {
            return this._externalLabelRadius;
        } else if (externalLabelRadius) {
            this._externalLabelRadius = externalLabelRadius;
        } else {
            this._externalLabelRadius = undefined;
        }

        return this;
    }

    /**
     * Get or set whether to draw lines from pie slices to their labels.
     *
     * @param {Boolean} [drawPaths]
     * @returns {Boolean|PieChart}
     */
    drawPaths (drawPaths) {
        if (arguments.length === 0) {
            return this._drawPaths;
        }
        this._drawPaths = drawPaths;
        return this;
    }

    _labelPosition (d, _arc) {
        let centroid;
        if (this._externalLabelRadius) {
            centroid = arc()
                .outerRadius(this._radius - this._externalRadiusPadding + this._externalLabelRadius)
                .innerRadius(this._radius - this._externalRadiusPadding + this._externalLabelRadius)
                .centroid(d);
        } else {
            centroid = _arc.centroid(d);
        }
        if (isNaN(centroid[0]) || isNaN(centroid[1])) {
            return 'translate(0,0)';
        } else {
            return `translate(${centroid})`;
        }
    }

    legendables () {
        return this.data().map((d, i) => {
            const legendable = {name: d.key, data: d.value, others: d.others, chart: this};
            legendable.color = this.getColor(d, i);
            return legendable;
        });
    }

    legendHighlight (d) {
        this._highlightSliceFromLegendable(d, true);
    }

    legendReset (d) {
        this._highlightSliceFromLegendable(d, false);
    }

    legendToggle (d) {
        this.onClick({key: d.name, others: d.others});
    }

    _highlightSliceFromLegendable (legendable, highlighted) {
        this.selectAll('g.pie-slice').each(function (d) {
            if (legendable.name === d.data.key) {
                select(this).classed('highlight', highlighted);
            }
        });
    }

    _tweenPie (b, element) {
        b.innerRadius = this._innerRadius;
        let current = element._current;
        if (this._isOffCanvas(current)) {
            current = {startAngle: 0, endAngle: 0};
        } else {
            // only interpolate startAngle & endAngle, not the whole data object
            current = {startAngle: current.startAngle, endAngle: current.endAngle};
        }
        const i = interpolate(current, b);
        element._current = i(0);
        return t => this._safeArc(i(t), 0, this._buildArcs());
    }


}

export const pieChart = (parent, chartGroup) => new PieChart(parent, chartGroup);
