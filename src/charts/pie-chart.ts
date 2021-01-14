import { min, sum } from 'd3-array';
import { Arc, arc, DefaultArcObject, Pie, pie } from 'd3-shape';
import { select, Selection } from 'd3-selection';
import { interpolate } from 'd3-interpolate';

import { ColorMixin } from '../base/color-mixin';
import { BaseMixin } from '../base/base-mixin';
import { transition } from '../core/core';
import { ChartGroupType, ChartParentType, LegendItem, SVGGElementSelection } from '../core/types';
import { IPieChartConf } from './i-pie-chart-conf';
import { adaptHandler } from '../core/d3compat';
import { CFDataCapHelper } from '../data/c-f-data-cap-helper';

const DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

/**
 * The pie chart implementation is usually used to visualize a small categorical distribution.  The pie
 * chart uses keyAccessor to determine the slices, and valueAccessor to calculate the size of each
 * slice relative to the sum of all values. Slices are ordered by {@link ICFSimpleAdapterConf.ordering | ordering}
 * which defaults to sorting by key.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ | Nasdaq 100 Index}
 */

export class PieChart extends ColorMixin(BaseMixin) {
    public _conf: IPieChartConf;

    private _sliceCssClass: string;
    private _labelCssClass: string;
    private _sliceGroupCssClass: string;
    private _labelGroupCssClass: string;
    private _emptyCssClass: string;
    private _computedRadius: number;
    private _g: Selection<SVGGElement, any, any, any>;
    private _cx: number;
    private _cy: number;

    /**
     * Create a Pie Chart
     *
     * TODO update example
     *
     * @example
     * ```
     * // create a pie chart under #chart-container1 element using the default global chart group
     * const chart1 = new PieChart('#chart-container1');
     * // create a pie chart under #chart-container2 element using chart group A
     * const chart2 = new PieChart('#chart-container2', 'chartGroupA');
     * ```
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this.configure({
            colorAccessor: d => this._conf.keyAccessor(d),
            emptyTitle: 'empty',
            label: d => this._conf.keyAccessor(d),
            renderLabel: true,
            title: d => `${this._conf.keyAccessor(d)}: ${d._value}`,
            transitionDuration: 350,
            transitionDelay: 0,
            radius: undefined, // specified radius, if any
            innerRadius: 0,
            externalRadiusPadding: 0,
            minAngleForLabel: DEFAULT_MIN_ANGLE_FOR_LABEL,
            externalLabelRadius: undefined,
            drawPaths: false,
        });

        this.dataProvider(new CFDataCapHelper());

        this._sliceCssClass = 'pie-slice';
        this._labelCssClass = 'pie-label';
        this._sliceGroupCssClass = 'pie-slice-group';
        this._labelGroupCssClass = 'pie-label-group';
        this._emptyCssClass = 'empty-chart';

        this._computedRadius = undefined;

        this._g = undefined;
        this._cx = undefined;
        this._cy = undefined;
    }

    public configure(conf: IPieChartConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IPieChartConf {
        return this._conf;
    }

    protected _doRender(): this {
        this.resetSvg();

        this._g = this.svg().append('g').attr('transform', `translate(${this.cx()},${this.cy()})`);

        this._g.append('g').attr('class', this._sliceGroupCssClass);
        this._g.append('g').attr('class', this._labelGroupCssClass);

        this._drawChart();

        return this;
    }

    private _drawChart(): void {
        // set radius from chart size if none given, or if given radius is too large
        const maxRadius = min([this.width(), this.height()]) / 2;
        this._computedRadius =
            this._conf.radius && this._conf.radius < maxRadius ? this._conf.radius : maxRadius;

        const arcs: Arc<any, DefaultArcObject> = this._buildArcs();

        const pieLayout: Pie<any, any> = this._pieLayout();

        let pieData;
        // if we have data...
        // @ts-ignore // TODO: better typing
        if (sum(this.data(), d => d._value)) {
            pieData = pieLayout(this.data());
            this._g.classed(this._emptyCssClass, false);
        } else {
            // otherwise we'd be getting NaNs, so override
            // note: abuse others for its ignoring the value accessor
            pieData = pieLayout([
                { key: this._conf.emptyTitle, _value: 1, others: [this._conf.emptyTitle] },
            ]);
            this._g.classed(this._emptyCssClass, true);
        }

        if (this._g) {
            const slices: SVGGElementSelection = this._g
                .select<SVGGElement>(`g.${this._sliceGroupCssClass}`)
                .selectAll<SVGGElement, any>(`g.${this._sliceCssClass}`)
                .data(pieData);

            const labels = this._g
                .select<SVGGElement>(`g.${this._labelGroupCssClass}`)
                .selectAll<SVGTextElement, any>(`text.${this._labelCssClass}`)
                .data<any>(pieData);

            this._removeElements(slices, labels);

            this._createElements(slices, labels, arcs, pieData);

            this._updateElements(pieData, arcs);

            this._highlightFilter();

            transition(this._g, this._conf.transitionDuration, this._conf.transitionDelay).attr(
                'transform',
                `translate(${this.cx()},${this.cy()})`
            );
        }
    }

    private _createElements(
        slices: SVGGElementSelection,
        labels: Selection<SVGTextElement, any, SVGGElement, any>,
        arcs: Arc<any, DefaultArcObject>,
        pieData
    ) {
        const slicesEnter = this._createSliceNodes(slices);

        this._createSlicePath(slicesEnter, arcs);

        this._createTitles(slicesEnter);

        this._createLabels(labels, pieData, arcs);
    }

    private _createSliceNodes(slices: SVGGElementSelection): SVGGElementSelection {
        return slices
            .enter()
            .append('g')
            .attr('class', (d, i) => `${this._sliceCssClass} _${i}`);
    }

    private _createSlicePath(
        slicesEnter: SVGGElementSelection,
        arcs: Arc<any, DefaultArcObject>
    ): void {
        const slicePath = slicesEnter
            .append('path')
            .attr('fill', (d, i) => this._fill(d, i))
            .on(
                'click',
                adaptHandler(d => this._onClick(d))
            )
            .attr('d', (d, i) => this._safeArc(d, i, arcs));

        const tranNodes = transition(
            slicePath,
            this._conf.transitionDuration,
            this._conf.transitionDelay
        );
        if (tranNodes.attrTween) {
            const chart = this;
            tranNodes.attrTween('d', function (d) {
                return chart._tweenPie(d, this);
            });
        }
    }

    private _createTitles(slicesEnter: SVGGElementSelection): void {
        if (this._conf.renderTitle) {
            slicesEnter.append('title').text(d => this._conf.title(d.data));
        }
    }

    private _applyLabelText(labels: Selection<SVGTextElement, any, SVGGElement, any>): void {
        labels.text(d => {
            const data = d.data;
            if (
                (this._sliceHasNoData(data) || this._sliceTooSmall(d)) &&
                !this._isSelectedSlice(d)
            ) {
                return '';
            }
            return this._conf.label(d.data);
        });
    }

    private _positionLabels(
        labels: Selection<SVGTextElement, any, SVGGElement, any>,
        arcs: Arc<any, DefaultArcObject>
    ): void {
        this._applyLabelText(labels);
        transition(labels, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('transform', d => this._labelPosition(d, arcs))
            .attr('text-anchor', 'middle');
    }

    private _highlightSlice(i: number, whether): void {
        this.select(`g.pie-slice._${i}`).classed('highlight', whether);
    }

    private _createLabels(
        labels: Selection<SVGTextElement, any, SVGGElement, any>,
        pieData,
        arcs: Arc<any, DefaultArcObject>
    ) {
        if (this._conf.renderLabel) {
            const labelsEnter = labels
                .enter()
                .append('text')
                .attr('class', (d, i) => {
                    let classes = `${this._sliceCssClass} ${this._labelCssClass} _${i}`;
                    if (this._conf.externalLabelRadius) {
                        classes += ' external';
                    }
                    return classes;
                })
                .on(
                    'click',
                    adaptHandler(d => this._onClick(d))
                )
                .on(
                    'mouseover',
                    adaptHandler(d => {
                        this._highlightSlice(d.index, true);
                    })
                )
                .on(
                    'mouseout',
                    adaptHandler(d => {
                        this._highlightSlice(d.index, false);
                    })
                );
            this._positionLabels(labelsEnter, arcs);
            if (this._conf.externalLabelRadius && this._conf.drawPaths) {
                this._updateLabelPaths(pieData, arcs);
            }
        }
    }

    private _updateLabelPaths(pieData, arcs: { centroid: (arg0: any) => any }): void {
        let polyline = this._g
            .selectAll<SVGPolylineElement, any>(`polyline.${this._sliceCssClass}`)
            .data(pieData);

        polyline.exit().remove();

        polyline = polyline
            .enter()
            .append('polyline')
            .attr('class', (d, i) => `pie-path _${i} ${this._sliceCssClass}`)
            .on(
                'click',
                adaptHandler(d => this._onClick(d))
            )
            .on(
                'mouseover',
                adaptHandler(d => {
                    this._highlightSlice(d.index, true);
                })
            )
            .on(
                'mouseout',
                adaptHandler(d => {
                    this._highlightSlice(d.index, false);
                })
            )
            .merge(polyline);

        const arc2 = arc()
            .outerRadius(
                this._computedRadius -
                    this._conf.externalRadiusPadding +
                    this._conf.externalLabelRadius
            )
            .innerRadius(this._computedRadius - this._conf.externalRadiusPadding);
        const tranNodes = transition(
            polyline,
            this._conf.transitionDuration,
            this._conf.transitionDelay
        );
        // this is one rare case where d3.selection differs from d3.transition
        if (tranNodes.attrTween) {
            tranNodes.attrTween('points', function (d) {
                let current = this._current || d;
                current = { startAngle: current.startAngle, endAngle: current.endAngle };
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
        tranNodes.style('visibility', d =>
            d.endAngle - d.startAngle < 0.0001 ? 'hidden' : 'visible'
        );
    }

    private _updateElements(pieData: any, arcs: Arc<any, DefaultArcObject>): void {
        this._updateSlicePaths(pieData, arcs);
        this._updateLabels(pieData, arcs);
        this._updateTitles(pieData);
    }

    private _updateSlicePaths(pieData, arcs: Arc<any, DefaultArcObject>) {
        const slicePaths = this._g
            .selectAll(`g.${this._sliceCssClass}`)
            .data(pieData)
            .select('path')
            .attr('d', (d, i) => this._safeArc(d, i, arcs));
        const tranNodes = transition(
            slicePaths,
            this._conf.transitionDuration,
            this._conf.transitionDelay
        );
        if (tranNodes.attrTween) {
            const chart = this;
            tranNodes.attrTween('d', function (d) {
                return chart._tweenPie(d, this);
            });
        }
        tranNodes.attr('fill', (d, i) => this._fill(d, i));
    }

    private _updateLabels(pieData, arcs: Arc<any, DefaultArcObject>): void {
        if (this._conf.renderLabel) {
            const labels = this._g
                .selectAll<SVGTextElement, any>(`text.${this._labelCssClass}`)
                .data(pieData);
            this._positionLabels(labels, arcs);
            if (this._conf.externalLabelRadius && this._conf.drawPaths) {
                this._updateLabelPaths(pieData, arcs);
            }
        }
    }

    private _updateTitles(pieData) {
        if (this._conf.renderTitle) {
            this._g
                .selectAll<SVGGElement, any>(`g.${this._sliceCssClass}`)
                .data<any>(pieData)
                .select('title')
                .text(d => this._conf.title(d.data));
        }
    }

    private _removeElements(
        slices: SVGGElementSelection,
        labels: Selection<SVGTextElement, any, SVGGElement, any>
    ) {
        slices.exit().remove();
        labels.exit().remove();
    }

    private _highlightFilter(): void {
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
     * Get or set center x coordinate position. Default is center of svg.
     */
    public cx(): number;
    public cx(cx: number): this;
    public cx(cx?) {
        if (!arguments.length) {
            return this._cx || this.width() / 2;
        }
        this._cx = cx;
        return this;
    }

    /**
     * Get or set center y coordinate position. Default is center of svg.
     */
    public cy(): number;
    public cy(cy: number): this;
    public cy(cy?) {
        if (!arguments.length) {
            return this._cy || this.height() / 2;
        }
        this._cy = cy;
        return this;
    }

    private _buildArcs(): Arc<any, DefaultArcObject> {
        return arc()
            .outerRadius(this._computedRadius - this._conf.externalRadiusPadding)
            .innerRadius(this._conf.innerRadius);
    }

    private _isSelectedSlice(d): boolean {
        return this.hasFilter(this._conf.keyAccessor(d.data));
    }

    protected _doRedraw(): this {
        this._drawChart();
        return this;
    }

    private _pieLayout(): Pie<any, any> {
        // The 2nd argument is type of datum that will be used. TODO: revisit after refactoring.
        return (
            pie()
                .sort(null)
                // @ts-ignore // TODO: better typing
                .value(d => d._value) as Pie<any, any>
        );
    }

    private _sliceTooSmall(d): boolean {
        const angle = d.endAngle - d.startAngle;
        return isNaN(angle) || angle < this._conf.minAngleForLabel;
    }

    private _sliceHasNoData(d): boolean {
        return d._value === 0;
    }

    private _isOffCanvas(current): boolean {
        return !current || isNaN(current.startAngle) || isNaN(current.endAngle);
    }

    private _fill(d, i: number): string {
        return this._colorHelper.getColor(d.data, i);
    }

    private _onClick(d): void {
        if (this._g.attr('class') !== this._emptyCssClass) {
            this.onClick(d.data);
        }
    }

    private _safeArc(d, i: number, _arc: Arc<any, DefaultArcObject>): string {
        let path = _arc(d, i);
        if (path.indexOf('NaN') >= 0) {
            path = 'M0,0';
        }
        return path;
    }

    private _labelPosition(d, _arc: Arc<any, DefaultArcObject>) {
        let centroid: number[];
        if (this._conf.externalLabelRadius) {
            centroid = arc()
                .outerRadius(
                    this._computedRadius -
                        this._conf.externalRadiusPadding +
                        this._conf.externalLabelRadius
                )
                .innerRadius(
                    this._computedRadius -
                        this._conf.externalRadiusPadding +
                        this._conf.externalLabelRadius
                )
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

    public legendables(): LegendItem[] {
        return this.data().map((d, i) => {
            // TODO: correct typing
            const legendable: { [key: string]: any } = {
                name: d.key,
                data: d.value,
                others: d.others,
                chart: this,
            };
            legendable.color = this._colorHelper.getColor(d, i);
            return legendable;
        });
    }

    public legendHighlight(d: LegendItem) {
        this._highlightSliceFromLegendable(d, true);
    }

    public legendReset(d: LegendItem) {
        this._highlightSliceFromLegendable(d, false);
    }

    public legendToggle(d: LegendItem) {
        this.onClick({ key: d.name, others: d.others });
    }

    private _highlightSliceFromLegendable(legendable: LegendItem, highlighted: boolean): void {
        this.selectAll<SVGGElement, any>('g.pie-slice').each(function (d) {
            if (legendable.name === d.data.key) {
                select(this).classed('highlight', highlighted);
            }
        });
    }

    private _tweenPie(b, element) {
        b.innerRadius = this._conf.innerRadius;
        let current = element._current;
        if (this._isOffCanvas(current)) {
            current = { startAngle: 0, endAngle: 0 };
        } else {
            // only interpolate startAngle & endAngle, not the whole data object
            current = { startAngle: current.startAngle, endAngle: current.endAngle };
        }
        const i = interpolate(current, b);
        element._current = i(0);
        return t => this._safeArc(i(t), 0, this._buildArcs());
    }
}
