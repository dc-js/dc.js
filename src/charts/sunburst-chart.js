import * as d3 from 'd3';

import {transition} from '../core/core';
import {filters} from '../core/filters';
import {utils} from '../core/utils';
import {events} from '../core/events';
import {ColorMixin} from '../base/color-mixin';
import {BaseMixin} from '../base/base-mixin';

const DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

function _tweenSlice (d, chart) {
    let current = this._current;
    if (chart._isOffCanvas(current)) {
        current = {x0: 0, x1: 0, y0: 0, y1: 0};
    }
    const tweenTarget = {
        x0: d.x0,
        x1: d.x1,
        y0: d.y0,
        y1: d.y1
    };
    const i = d3.interpolate(current, tweenTarget);
    this._current = i(0);
    return t => chart._safeArc(chart._buildArcs(), Object.assign({}, d, i(t)));
}

/**
 * The sunburst chart implementation is usually used to visualize a small tree distribution.  The sunburst
 * chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
 * slice relative to the sum of all values. Slices are ordered by {@link dc.baseMixin#ordering ordering} which defaults to sorting
 * by key.
 *
 * The keys used in the sunburst chart should be arrays, representing paths in the tree.
 *
 * When filtering, the sunburst chart creates instances of {@link dc.filters.HierarchyFilter HierarchyFilter}.
 *
 * @class sunburstChart
 * @memberof dc
 * @mixes dc.capMixin
 * @mixes dc.colorMixin
 * @mixes dc.baseMixin
 * @example
 * // create a sunburst chart under #chart-container1 element using the default global chart group
 * var chart1 = dc.sunburstChart('#chart-container1');
 * // create a sunburst chart under #chart-container2 element using chart group A
 * var chart2 = dc.sunburstChart('#chart-container2', 'chartGroupA');
 *
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.sunburstChart}
 **/
export const sunburstChart = (parent, chartGroup) => new SunburstChart(parent, chartGroup);

class SunburstChart extends ColorMixin(BaseMixin) {
    constructor (parent, chartGroup) {
        super();

        this._sliceCssClass = 'pie-slice';
        this._emptyCssClass = 'empty-chart';
        this._emptyTitle = 'empty';

        this._radius = undefined;
        this._givenRadius = undefined; // given radius, if any
        this._innerRadius = 0;

        this._g = undefined;
        this._cx = undefined;
        this._cy = undefined;
        this._minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;
        this._externalLabelRadius = undefined;

        this.colorAccessor(d => this.keyAccessor()(d));

        this.title(d => this.keyAccessor()(d) + ': ' + this._extendedValueAccessor(d));

        this.label(d => this.keyAccessor()(d));
        this.renderLabel(true);

        this.transitionDuration(350);

        this.filterHandler((dimension, filters) => {
            if (filters.length === 0) {
                dimension.filter(null);
            } else {
                dimension.filterFunction(d => {
                    for (let i = 0; i < filters.length; i++) {
                        const filter = filters[i];
                        if (filter.isFiltered && filter.isFiltered(d)) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            return filters;
        });

        this.anchor(parent, chartGroup);
    }

    // Handle cases if value corresponds to generated parent nodes
    _extendedValueAccessor (d) {
        if (d.path) {
            return d.value;
        }
        return this.valueAccessor()(d);
    }

    _doRender () {
        this.resetSvg();

        this._g = this.svg()
            .append('g')
            .attr('transform', 'translate(' + this.cx() + ',' + this.cy() + ')');

        this._drawChart();

        return this;
    }

    _drawChart () {
        // set radius from chart size if none given, or if given radius is too large
        const maxRadius = d3.min([this.width(), this.height()]) / 2;
        this._radius = this._givenRadius && this._givenRadius < maxRadius ? this._givenRadius : maxRadius;

        const arc = this._buildArcs();

        let sunburstData, cdata;
        // if we have data...
        if (d3.sum(this.data(), this.valueAccessor())) {
            cdata = utils.toHierarchy(this.data(), this.valueAccessor());
            sunburstData = this._partitionNodes(cdata);
            // First one is the root, which is not needed
            sunburstData.shift();
            this._g.classed(this._emptyCssClass, false);
        } else {
            // otherwise we'd be getting NaNs, so override
            // note: abuse others for its ignoring the value accessor
            cdata = utils.toHierarchy([], d => d.value);
            sunburstData = this._partitionNodes(cdata);
            this._g.classed(this._emptyCssClass, true);
        }

        if (this._g) {
            const slices = this._g.selectAll('g.' + this._sliceCssClass)
                .data(sunburstData);
            this._createElements(slices, arc, sunburstData);

            this._updateElements(sunburstData, arc);

            this._removeElements(slices);

            this._highlightFilter();

            transition(this._g, this.transitionDuration(), this.transitionDelay())
                .attr('transform', 'translate(' + this.cx() + ',' + this.cy() + ')');
        }
    }

    _createElements (slices, arc, sunburstData) {
        const slicesEnter = this._createSliceNodes(slices);

        this._createSlicePath(slicesEnter, arc);
        this._createTitles(slicesEnter);
        this._createLabels(sunburstData, arc);
    }

    _createSliceNodes (slices) {
        return slices
            .enter()
            .append('g')
            .attr('class', (d, i) => this._sliceCssClass +
                ' _' + i + ' ' +
                this._sliceCssClass + '-level-' + d.depth);
    }

    _createSlicePath (slicesEnter, arc) {
        const slicePath = slicesEnter.append('path')
            .attr('fill', (d, i) => this._fill(d, i))
            .on('click', (d, i) => this.onClick(d, i))
            .attr('d', d => this._safeArc(arc, d));

        const tranNodes = transition(slicePath, this.transitionDuration());
        if (tranNodes.attrTween) {
            const self = this;
            tranNodes.attrTween('d', function (d) {
                return _tweenSlice.call(this, d, self);
            });
        }
    }

    _createTitles (slicesEnter) {
        if (this.renderTitle()) {
            slicesEnter.append('title').text(d => this.title()(d));
        }
    }

    _positionLabels (labelsEnter, arc) {
        transition(labelsEnter, this.transitionDuration())
            .attr('transform', d => this._labelPosition(d, arc))
            .attr('text-anchor', 'middle')
            .text(d => {
                // position label...
                if (this._sliceHasNoData(d) || this._sliceTooSmall(d)) {
                    return '';
                }
                return this.label()(d);
            });
    }

    _createLabels (sunburstData, arc) {
        if (this.renderLabel()) {
            const labels = this._g.selectAll('text.' + this._sliceCssClass)
                .data(sunburstData);

            labels.exit().remove();

            const labelsEnter = labels
                .enter()
                .append('text')
                .attr('class', (d, i) => {
                    let classes = this._sliceCssClass + ' _' + i;
                    if (this._externalLabelRadius) {
                        classes += ' external';
                    }
                    return classes;
                })
                .on('click', (d, i) => this.onClick(d, i));
            this._positionLabels(labelsEnter, arc);
        }
    }

    _updateElements (sunburstData, arc) {
        this._updateSlicePaths(sunburstData, arc);
        this._updateLabels(sunburstData, arc);
        this._updateTitles(sunburstData);
    }

    _updateSlicePaths (sunburstData, arc) {
        const slicePaths = this._g.selectAll('g.' + this._sliceCssClass)
            .data(sunburstData)
            .select('path')
            .attr('d', (d, i) => this._safeArc(arc, d));
        const tranNodes = transition(slicePaths, this.transitionDuration());
        if (tranNodes.attrTween) {
            const self = this;
            tranNodes.attrTween('d', function (d) {
                return _tweenSlice.call(this, d, self);
            });
        }
        tranNodes.attr('fill', (d, i) => this._fill(d, i));
    }

    _updateLabels (sunburstData, arc) {
        if (this.renderLabel()) {
            const labels = this._g.selectAll('text.' + this._sliceCssClass)
                .data(sunburstData);
            this._positionLabels(labels, arc);
        }
    }

    _updateTitles (sunburstData) {
        if (this.renderTitle()) {
            this._g.selectAll('g.' + this._sliceCssClass)
                .data(sunburstData)
                .select('title')
                .text(d => this.title()(d));
        }
    }

    _removeElements (slices) {
        slices.exit().remove();
    }

    _highlightFilter () {
        const self = this;
        if (self.hasFilter()) {
            self.selectAll('g.' + self._sliceCssClass).each(function (d) {
                if (self._isSelectedSlice(d)) {
                    self.highlightSelected(this);
                } else {
                    self.fadeDeselected(this);
                }
            });
        } else {
            self.selectAll('g.' + self._sliceCssClass).each(function (d) {
                self.resetHighlight(this);
            });
        }
    }

    /**
     * Get or set the inner radius of the sunburst chart. If the inner radius is greater than 0px then the
     * sunburst chart will be rendered as a doughnut chart. Default inner radius is 0px.
     * @method innerRadius
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [innerRadius=0]
     * @returns {Number|dc.sunburstChart}
     */
    innerRadius (innerRadius) {
        const self = this;
        if (!arguments.length) {
            return self._innerRadius;
        }
        self._innerRadius = innerRadius;
        return self;
    }

    /**
     * Get or set the outer radius. If the radius is not set, it will be half of the minimum of the
     * chart width and height.
     * @method radius
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [radius]
     * @returns {Number|dc.sunburstChart}
     */
    radius (radius) {
        const self = this;
        if (!arguments.length) {
            return self._givenRadius;
        }
        self._givenRadius = radius;
        return self;
    }

    /**
     * Get or set center x coordinate position. Default is center of svg.
     * @method cx
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [cx]
     * @returns {Number|dc.sunburstChart}
     */
    cx (cx) {
        const self = this;
        if (!arguments.length) {
            return (self._cx || self.width() / 2);
        }
        self._cx = cx;
        return self;
    }

    /**
     * Get or set center y coordinate position. Default is center of svg.
     * @method cy
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [cy]
     * @returns {Number|dc.sunburstChart}
     */
    cy (cy) {
        const self = this;
        if (!arguments.length) {
            return (self._cy || self.height() / 2);
        }
        self._cy = cy;
        return self;
    }

    /**
     * Get or set the minimal slice angle for label rendering. Any slice with a smaller angle will not
     * display a slice label.
     * @method minAngleForLabel
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [minAngleForLabel=0.5]
     * @returns {Number|dc.sunburstChart}
     */
    minAngleForLabel (minAngleForLabel) {
        const self = this;
        if (!arguments.length) {
            return self._minAngleForLabel;
        }
        self._minAngleForLabel = minAngleForLabel;
        return self;
    }

    /**
     * Title to use for the only slice when there is no data.
     * @method emptyTitle
     * @memberof dc.sunburstChart
     * @instance
     * @param {String} [title]
     * @returns {String|dc.sunburstChart}
     */
    emptyTitle (title) {
        const self = this;
        if (arguments.length === 0) {
            return self._emptyTitle;
        }
        self._emptyTitle = title;
        return self;
    }

    /**
     * Position slice labels offset from the outer edge of the chart.
     *
     * The argument specifies the extra radius to be added for slice labels.
     * @method externalLabels
     * @memberof dc.sunburstChart
     * @instance
     * @param {Number} [externalLabelRadius]
     * @returns {Number|dc.sunburstChart}
     */
    externalLabels (externalLabelRadius) {
        const self = this;
        if (arguments.length === 0) {
            return self._externalLabelRadius;
        } else if (externalLabelRadius) {
            self._externalLabelRadius = externalLabelRadius;
        } else {
            self._externalLabelRadius = undefined;
        }

        return self;
    }

    _buildArcs () {
        const self = this;
        return d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .innerRadius(d => d.data.path && d.data.path.length === 1 ? self._innerRadius : Math.sqrt(d.y0))
            .outerRadius(d => Math.sqrt(d.y1));
    }

    _isSelectedSlice (d) {
        const self = this;
        return self._isPathFiltered(d.path);
    }

    _isPathFiltered (path) {
        const self = this;
        for (let i = 0; i < self.filters().length; i++) {
            const currentFilter = self.filters()[i];
            if (currentFilter.isFiltered(path)) {
                return true;
            }
        }
        return false;
    }

    // returns all filters that are a parent or child of the path
    _filtersForPath (path) {
        const self = this;
        const pathFilter = filters.HierarchyFilter(path);
        const filtersList = [];
        for (let i = 0; i < self.filters().length; i++) {
            const currentFilter = self.filters()[i];
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
        // The changes picked up from https://github.com/d3/d3-hierarchy/issues/50
        const hierarchy = d3.hierarchy(data)
            .sum(d => d.children ? 0 : this._extendedValueAccessor(d))
            .sort((a, b) => d3.ascending(a.data.path, b.data.path));

        const partition = d3.partition()
            .size([2 * Math.PI, this._radius * this._radius]);

        partition(hierarchy);

        // In D3v4 the returned data is slightly different, change it enough to suit our purposes.
        return hierarchy.descendants().map(d => {
            d.key = d.data.key;
            d.path = d.data.path;
            return d;
        });
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

    onClick (d, i) {
        if (this._g.attr('class') === this._emptyCssClass) {
            return;
        }

        // Must be better way to handle this, in legends we need to access `d.key`
        const path = d.path || d.key;
        const filter = filters.HierarchyFilter(path);

        // filters are equal to, parents or children of the path.
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

    _safeArc (arc, d) {
        let path = arc(d);
        if (path.indexOf('NaN') >= 0) {
            path = 'M0,0';
        }
        return path;
    }

    _labelPosition (d, arc) {
        let centroid;
        if (this._externalLabelRadius) {
            centroid = d3.svg.arc()
                .outerRadius(this._radius + this._externalLabelRadius)
                .innerRadius(this._radius + this._externalLabelRadius)
                .centroid(d);
        } else {
            centroid = arc.centroid(d);
        }
        if (isNaN(centroid[0]) || isNaN(centroid[1])) {
            return 'translate(0,0)';
        } else {
            return 'translate(' + centroid + ')';
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
                d3.select(this).classed('highlight', highlighted);
            }
        });
    }
}
