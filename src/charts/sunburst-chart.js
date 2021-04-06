import {hierarchy, partition} from 'd3-hierarchy';
import {ascending, min, sum} from 'd3-array';
import {arc} from 'd3-shape';
import {select} from 'd3-selection';
import {interpolate} from 'd3-interpolate';

import {transition} from '../core/core';
import {filters} from '../core/filters';
import {utils, pluck} from '../core/utils';
import {d3compat} from '../core/config';
import {events} from '../core/events';
import {ColorMixin} from '../base/color-mixin';
import {BaseMixin} from '../base/base-mixin';
import {constants} from '../core/constants';
import {BadArgumentException} from '../core/bad-argument-exception';

const DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

/**
 * The sunburst chart implementation is usually used to visualize a small tree distribution.  The sunburst
 * chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
 * slice relative to the sum of all values. Slices are ordered by {@link BaseMixin#ordering ordering} which defaults to sorting
 * by key.
 *
 * The keys used in the sunburst chart should be arrays, representing paths in the tree.
 *
 * When filtering, the sunburst chart creates instances of {@link Filters.HierarchyFilter HierarchyFilter}.
 *
 * @mixes CapMixin
 * @mixes ColorMixin
 * @mixes BaseMixin
 */
export class SunburstChart extends ColorMixin(BaseMixin) {
    /**
     * Create a Sunburst Chart
     * @example
     * // create a sunburst chart under #chart-container1 element using the default global chart group
     * var chart1 = new SunburstChart('#chart-container1');
     * // create a sunburst chart under #chart-container2 element using chart group A
     * var chart2 = new SunburstChart('#chart-container2', 'chartGroupA');
     *
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._sliceCssClass = 'pie-slice';
        this._emptyCssClass = 'empty-chart';
        this._emptyTitle = 'empty';

        this._radius = undefined;
        this._givenRadius = undefined; // given radius, if any
        this._innerRadius = 0;
        this._ringSizes = null;

        this._g = undefined;
        this._cx = undefined;
        this._cy = undefined;
        this._minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;
        this._externalLabelRadius = undefined;

        this.colorAccessor(d => this.keyAccessor()(d));

        // override cap mixin
        this.ordering(pluck('key'));

        this.title(d => `${this.keyAccessor()(d)}: ${this._extendedValueAccessor(d)}`);

        this.label(d => this.keyAccessor()(d));
        this.renderLabel(true);

        this.transitionDuration(350);

        this.anchor(parent, chartGroup);
    }

    // Handle cases if value corresponds to generated parent nodes
    _extendedValueAccessor (d) {
        if (d.path) {
            return d.value;
        }
        return this.valueAccessor()(d);
    }

    _scaleRadius (ringIndex, y) {
        if (ringIndex === 0) {
            return this._innerRadius;
        } else {
            const customRelativeRadius = sum(this.ringSizes().relativeRingSizes.slice(0, ringIndex));
            const scaleFactor = (ringIndex * (1 / this.ringSizes().relativeRingSizes.length)) /
                  customRelativeRadius;
            const standardRadius = (y - this.ringSizes().rootOffset) /
                  (1 - this.ringSizes().rootOffset) * (this._radius - this._innerRadius);
            return this._innerRadius + standardRadius / scaleFactor;
        }
    }

    _doRender () {
        this.resetSvg();

        this._g = this.svg()
            .append('g')
            .attr('transform', `translate(${this.cx()},${this.cy()})`);

        this._drawChart();

        return this;
    }

    _drawChart () {
        // set radius from chart size if none given, or if given radius is too large
        const maxRadius = min([this.width(), this.height()]) / 2;
        this._radius = this._givenRadius && this._givenRadius < maxRadius ? this._givenRadius : maxRadius;

        const arcs = this._buildArcs();

        let partitionedNodes, cdata;
        // if we have data...
        if (sum(this.data(), this.valueAccessor())) {
            cdata = utils.toHierarchy(this.data(), this.valueAccessor());
            partitionedNodes = this._partitionNodes(cdata);
            // First one is the root, which is not needed
            partitionedNodes.nodes.shift();
            this._g.classed(this._emptyCssClass, false);
        } else {
            // otherwise we'd be getting NaNs, so override
            // note: abuse others for its ignoring the value accessor
            cdata = utils.toHierarchy([], d => d.value);
            partitionedNodes = this._partitionNodes(cdata);
            this._g.classed(this._emptyCssClass, true);
        }
        this.ringSizes().rootOffset = partitionedNodes.rootOffset;
        this.ringSizes().relativeRingSizes = partitionedNodes.relativeRingSizes;

        if (this._g) {
            const slices = this._g.selectAll(`g.${this._sliceCssClass}`)
                .data(partitionedNodes.nodes);
            this._createElements(slices, arcs, partitionedNodes.nodes);

            this._updateElements(partitionedNodes.nodes, arcs);

            this._removeElements(slices);

            this._highlightFilter();

            transition(this._g, this.transitionDuration(), this.transitionDelay())
                .attr('transform', `translate(${this.cx()},${this.cy()})`);
        }
    }

    _createElements (slices, arcs, sunburstData) {
        const slicesEnter = this._createSliceNodes(slices);

        this._createSlicePath(slicesEnter, arcs);
        this._createTitles(slicesEnter);
        this._createLabels(sunburstData, arcs);
    }

    _createSliceNodes (slices) {
        return slices
            .enter()
            .append('g')
            .attr('class', (d, i) => `${this._sliceCssClass
            } _${i} ${
                this._sliceCssClass}-level-${d.depth}`);
    }

    _createSlicePath (slicesEnter, arcs) {
        const slicePath = slicesEnter.append('path')
            .attr('fill', (d, i) => this._fill(d, i))
            .on('click', d3compat.eventHandler(d => this.onClick(d)))
            .classed('dc-tabbable', this._keyboardAccessible)
            .attr('d', d => this._safeArc(arcs, d));

        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible(this.onClick);
        }

        const tranNodes = transition(slicePath, this.transitionDuration());
        if (tranNodes.attrTween) {
            const chart = this;
            tranNodes.attrTween('d', function (d) {
                return chart._tweenSlice(d, this);
            });
        }
    }

    _createTitles (slicesEnter) {
        if (this.renderTitle()) {
            slicesEnter.append('title').text(d => this.title()(d));
        }
    }

    _positionLabels (labelsEnter, arcs) {
        transition(labelsEnter, this.transitionDuration())
            .attr('transform', d => this._labelPosition(d, arcs))
            .attr('text-anchor', 'middle')
            .text(d => {
                // position label...
                if (this._sliceHasNoData(d) || this._sliceTooSmall(d)) {
                    return '';
                }
                return this.label()(d);
            });
    }

    _createLabels (sunburstData, arcs) {
        if (this.renderLabel()) {
            const labels = this._g.selectAll(`text.${this._sliceCssClass}`)
                .data(sunburstData);

            labels.exit().remove();

            const labelsEnter = labels
                .enter()
                .append('text')
                .attr('class', (d, i) => {
                    let classes = `${this._sliceCssClass} _${i}`;
                    if (this._externalLabelRadius) {
                        classes += ' external';
                    }
                    return classes;
                })
                .on('click', d3compat.eventHandler(d => this.onClick(d)));
            this._positionLabels(labelsEnter, arcs);
        }
    }

    _updateElements (sunburstData, arcs) {
        this._updateSlicePaths(sunburstData, arcs);
        this._updateLabels(sunburstData, arcs);
        this._updateTitles(sunburstData);
    }

    _updateSlicePaths (sunburstData, arcs) {
        const slicePaths = this._g.selectAll(`g.${this._sliceCssClass}`)
            .data(sunburstData)
            .select('path')
            .attr('d', (d, i) => this._safeArc(arcs, d));
        const tranNodes = transition(slicePaths, this.transitionDuration());
        if (tranNodes.attrTween) {
            const chart = this;
            tranNodes.attrTween('d', function (d) {
                return chart._tweenSlice(d, this);
            });
        }
        tranNodes.attr('fill', (d, i) => this._fill(d, i));
    }

    _updateLabels (sunburstData, arcs) {
        if (this.renderLabel()) {
            const labels = this._g.selectAll(`text.${this._sliceCssClass}`)
                .data(sunburstData);
            this._positionLabels(labels, arcs);
        }
    }

    _updateTitles (sunburstData) {
        if (this.renderTitle()) {
            this._g.selectAll(`g.${this._sliceCssClass}`)
                .data(sunburstData)
                .select('title')
                .text(d => this.title()(d));
        }
    }

    _removeElements (slices) {
        slices.exit().remove();
    }

    _highlightFilter () {
        const chart = this;
        if (chart.hasFilter()) {
            chart.selectAll(`g.${chart._sliceCssClass}`).each(function (d) {
                if (chart._isSelectedSlice(d)) {
                    chart.highlightSelected(this);
                } else {
                    chart.fadeDeselected(this);
                }
            });
        } else {
            chart.selectAll(`g.${chart._sliceCssClass}`).each(function (d) {
                chart.resetHighlight(this);
            });
        }
    }

    /**
     * Get or set the inner radius of the sunburst chart. If the inner radius is greater than 0px then the
     * sunburst chart will be rendered as a doughnut chart. Default inner radius is 0px.
     * @param {Number} [innerRadius=0]
     * @returns {Number|SunburstChart}
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
     * @returns {Number|SunburstChart}
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
     * @returns {Number|SunburstChart}
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
     * @returns {Number|SunburstChart}
     */
    cy (cy) {
        if (!arguments.length) {
            return (this._cy || this.height() / 2);
        }
        this._cy = cy;
        return this;
    }

    /**
     * Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
     * display a slice label.
     * @param {Number} [minAngleForLabel=0.5]
     * @returns {Number|SunburstChart}
     */
    minAngleForLabel (minAngleForLabel) {
        if (!arguments.length) {
            return this._minAngleForLabel;
        }
        this._minAngleForLabel = minAngleForLabel;
        return this;
    }

    /**
     * Title to use for the only slice when there is no data.
     * @param {String} [title]
     * @returns {String|SunburstChart}
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
     * @returns {Number|SunburstChart}
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
     * Constructs the default RingSizes parameter for {@link SunburstChart#ringSizes ringSizes()},
     * which makes the rings narrower as they get farther away from the center.
     *
     * Can be used as a parameter to ringSizes() to reset the default behavior, or modified for custom ring sizes.
     *
     * @example
     *   var chart = new dc.SunburstChart(...);
     *   chart.ringSizes(chart.defaultRingSizes())
     * @returns {RingSizes}
     */
    defaultRingSizes () {
        return {
            partitionDy: () => this._radius * this._radius,
            scaleInnerRadius: d => d.data.path && d.data.path.length === 1 ?
                this._innerRadius :
                Math.sqrt(d.y0),
            scaleOuterRadius: d => Math.sqrt(d.y1),
            relativeRingSizesFunction: () => []
        };
    }

    /**
     * Constructs a RingSizes parameter for {@link SunburstChart#ringSizes ringSizes()}
     * that will make the chart rings equally wide.
     *
     * @example
     *   var chart = new dc.SunburstChart(...);
     *   chart.ringSizes(chart.equalRingSizes())
     * @returns {RingSizes}
     */
    equalRingSizes () {
        return this.relativeRingSizes(
            ringCount => {
                const result = [];
                for (let i = 0; i < ringCount; i++) {
                    result.push(1 / ringCount);
                }
                return result;
            }
        );
    }

    /**
     * Constructs a RingSizes parameter for {@link SunburstChart#ringSizes ringSizes()} using the given function
     * to determine each rings width.
     *
     * * The function must return an array containing portion values for each ring/level of the chart.
     * * The length of the array must match the number of rings of the chart at runtime, which is provided as the only
     *   argument.
     * * The sum of all portions from the array must be 1 (100%).
     *
     * @example
     * // specific relative portions (the number of rings (3) is known in this case)
     * chart.ringSizes(chart.relativeRingSizes(function (ringCount) {
     *     return [.1, .3, .6];
     * });
     * @param {Function} [relativeRingSizesFunction]
     * @returns {RingSizes}
     */
    relativeRingSizes (relativeRingSizesFunction) {
        function assertPortionsArray (relativeSizes, numberOfRings) {
            if (!Array.isArray(relativeSizes)) {
                throw new BadArgumentException('relativeRingSizes function must return an array');
            }

            const portionsSum = sum(relativeSizes);
            if (Math.abs(portionsSum - 1) > constants.NEGLIGIBLE_NUMBER) {
                throw new BadArgumentException(
                    `relativeRingSizes : portions must add up to 1, but sum was ${portionsSum}`);
            }

            if (relativeSizes.length !== numberOfRings) {
                throw new BadArgumentException(
                    `relativeRingSizes : number of values must match number of rings (${
                        numberOfRings}) but was ${relativeSizes.length}`);
            }
        }
        return {
            partitionDy: () => 1,
            scaleInnerRadius: d => this._scaleRadius(d.data.path.length - 1, d.y0),
            scaleOuterRadius: d => this._scaleRadius(d.data.path.length, d.y1),
            relativeRingSizesFunction: ringCount => {
                const result = relativeRingSizesFunction(ringCount);
                assertPortionsArray(result, ringCount);
                return result;
            }
        };
    }

    /**
     * Get or set the strategy to use for sizing the charts rings.
     *
     * There are three strategies available
     * * {@link SunburstChart#defaultRingSizes `defaultRingSizes`}: the rings get narrower farther away from the center
     * * {@link SunburstChart#relativeRingSizes `relativeRingSizes`}: set the ring sizes as portions of 1
     * * {@link SunburstChart#equalRingSizes `equalRingSizes`}: the rings are equally wide
     *
     * You can modify the returned strategy, or create your own, for custom ring sizing.
     *
     * RingSizes is a duck-typed interface that must support the following methods:
     * * `partitionDy()`: used for
     *   {@link https://github.com/d3/d3-hierarchy/blob/v1.1.9/README.md#partition_size `d3.partition.size`}
     * * `scaleInnerRadius(d)`: takes datum and returns radius for
     *    {@link https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_innerRadius `d3.arc.innerRadius`}
     * * `scaleOuterRadius(d)`: takes datum and returns radius for
     *    {@link https://github.com/d3/d3-shape/blob/v1.3.7/README.md#arc_outerRadius `d3.arc.outerRadius`}
     * * `relativeRingSizesFunction(ringCount)`: takes ring count and returns an array of portions that
     *   must add up to 1
     *
     * @example
     * // make rings equally wide
     * chart.ringSizes(chart.equalRingSizes())
     * // reset to default behavior
     * chart.ringSizes(chart.defaultRingSizes()))
     * @param {RingSizes} ringSizes
     * @returns {Object|SunburstChart}
     */
    ringSizes (ringSizes) {
        if (!arguments.length) {
            if (!this._ringSizes) {
                this._ringSizes = this.defaultRingSizes();
            }
            return this._ringSizes;
        }
        this._ringSizes = ringSizes;
        return this;
    }

    _buildArcs () {
        return arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => this.ringSizes().scaleInnerRadius(d))
            .outerRadius(d => this.ringSizes().scaleOuterRadius(d));
    }

    _isSelectedSlice (d) {
        return this._isPathFiltered(d.path);
    }

    _isPathFiltered (path) {
        for (let i = 0; i < this.filters().length; i++) {
            const currentFilter = this.filters()[i];
            if (currentFilter.isFiltered(path)) {
                return true;
            }
        }
        return false;
    }

    // returns all filters that are a parent or child of the path
    _filtersForPath (path) {
        const pathFilter = filters.HierarchyFilter(path);
        const filtersList = [];
        for (let i = 0; i < this.filters().length; i++) {
            const currentFilter = this.filters()[i];
            if (currentFilter.isFiltered(path) || pathFilter.isFiltered(currentFilter)) {
                filtersList.push(currentFilter);
            }
        }
        return filtersList;
    }

    _doRedraw () {
        this._drawChart();
        return this;
    }

    _partitionNodes (data) {
        const getSortable = function (d) {
            return {'key': d.data.key, 'value': d.value};
        };
        const _hierarchy = hierarchy(data)
            .sum(d => d.children ? 0 : this._extendedValueAccessor(d))
            .sort((a, b) => ascending(this.ordering()(getSortable(a)), this.ordering()(getSortable(b))));

        const _partition = partition()
              .size([2 * Math.PI, this.ringSizes().partitionDy()]);

        _partition(_hierarchy);

        // In D3v4 the returned data is slightly different, change it enough to suit our purposes.
        const nodes = _hierarchy.descendants().map(d => {
            d.key = d.data.key;
            d.path = d.data.path;
            return d;
        });

        const relativeSizes = this.ringSizes().relativeRingSizesFunction(_hierarchy.height);

        return {
            nodes,
            rootOffset: _hierarchy.y1,
            relativeRingSizes: relativeSizes
        };
    }

    _sliceTooSmall (d) {
        const angle = d.x1 - d.x0;
        return isNaN(angle) || angle < this._minAngleForLabel;
    }

    _sliceHasNoData (d) {
        return this._extendedValueAccessor(d) === 0;
    }

    _isOffCanvas (d) {
        return !d || isNaN(d.x0) || isNaN(d.y0);
    }

    _fill (d, i) {
        return this.getColor(d.data, i);
    }

    onClick (d) {
        if (this._g.attr('class') === this._emptyCssClass) {
            return;
        }

        // Must be better way to handle this, in legends we need to access `d.key`
        const path = d.path || d.key;
        const filter = filters.HierarchyFilter(path);

        // filters are equal to parents or children of the path.
        const filtersList = this._filtersForPath(path);
        let exactMatch = false;
        // clear out any filters that cover the path filtered.
        for (let j = filtersList.length - 1; j >= 0; j--) {
            const currentFilter = filtersList[j];
            if (utils.arraysIdentical(currentFilter, path)) {
                exactMatch = true;
            }
            this.filter(filtersList[j]);
        }
        events.trigger(() => {
            // if it is a new filter - put it in.
            if (!exactMatch) {
                this.filter(filter);
            }
            this.redrawGroup();
        });
    }

    _safeArc (_arc, d) {
        let path = _arc(d);
        if (path.indexOf('NaN') >= 0) {
            path = 'M0,0';
        }
        return path;
    }

    _labelPosition (d, _arc) {
        let centroid;
        if (this._externalLabelRadius) {
            centroid = arc()
                .outerRadius(this._radius + this._externalLabelRadius)
                .innerRadius(this._radius + this._externalLabelRadius)
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
            if (legendable.name === d.key) {
                select(this).classed('highlight', highlighted);
            }
        });
    }

    _tweenSlice (d, element) {
        let current = element._current;
        if (this._isOffCanvas(current)) {
            current = {x0: 0, x1: 0, y0: 0, y1: 0};
        }
        const tweenTarget = {
            x0: d.x0,
            x1: d.x1,
            y0: d.y0,
            y1: d.y1
        };
        const i = interpolate(current, tweenTarget);
        element._current = i(0);
        return t => this._safeArc(this._buildArcs(), Object.assign({}, d, i(t)));
    }
}

export const sunburstChart = (parent, chartGroup) => new SunburstChart(parent, chartGroup);
