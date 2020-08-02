import {BubbleMixin} from '../base/bubble-mixin';
import {CoordinateGridMixin} from '../base/coordinate-grid-mixin';
import {transition} from '../core/core';
import {ChartGroupType, ChartParentType, DCBrushSelection, SVGGElementSelection} from '../core/types';

/**
 * A concrete implementation of a general purpose bubble chart that allows data visualization using the
 * following dimensions:
 * - x axis position
 * - y axis position
 * - bubble radius
 * - color
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/vc/index.html US Venture Capital Landscape 2011}
 * @mixes BubbleMixin
 * @mixes CoordinateGridMixin
 */
export class BubbleChart extends BubbleMixin(CoordinateGridMixin) {
    private _bubbleLocator: (d) => string;

    /**
     * Create a Bubble Chart.
     *
     * @example
     * // create a bubble chart under #chart-container1 element using the default global chart group
     * var bubbleChart1 = new BubbleChart('#chart-container1');
     * // create a bubble chart under #chart-container2 element using chart group A
     * var bubbleChart2 = new BubbleChart('#chart-container2', 'chartGroupA');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super();

        this.transitionDuration(750);

        this.transitionDelay(0);

        this._bubbleLocator = d => `translate(${this._bubbleX(d)},${this._bubbleY(d)})`;

        this.anchor(parent, chartGroup);
    }

    public plotData (): void {
        this.calculateRadiusDomain();
        this.r().range([this.MIN_RADIUS, this.xAxisLength() * this.maxBubbleRelativeSize()]);

        const data = this.data();
        let bubbleG: SVGGElementSelection = this.chartBodyG().selectAll(`g.${this.BUBBLE_NODE_CLASS}`)
            .data(data, d => d.key);
        if (this.sortBubbleSize()) {
            // update dom order based on sort
            bubbleG.order();
        }

        this._removeNodes(bubbleG);

        bubbleG = this._renderNodes(bubbleG);

        this._updateNodes(bubbleG);

        this.fadeDeselectedArea(this.filter());
    }

    public _renderNodes (bubbleG: SVGGElementSelection): SVGGElementSelection {
        const bubbleGEnter = bubbleG.enter().append('g');

        bubbleGEnter
            .attr('class', this.BUBBLE_NODE_CLASS)
            .attr('transform', d => this._bubbleLocator(d))
            .append('circle').attr('class', (d, i) => `${this.BUBBLE_CLASS} _${i}`)
            .on('click', d => this.onClick(d))
            .attr('fill', (d, i) => this.getColor(d, i))
            .attr('r', 0);

        bubbleG = bubbleGEnter.merge(bubbleG);

        transition(bubbleG, this.transitionDuration(), this.transitionDelay())
            .select(`circle.${this.BUBBLE_CLASS}`)
            .attr('r', d => this.bubbleR(d))
            .attr('opacity', d => (this.bubbleR(d) > 0) ? 1 : 0);

        this._doRenderLabel(bubbleGEnter);

        this._doRenderTitles(bubbleGEnter);

        return bubbleG;
    }

    public _updateNodes (bubbleG: SVGGElementSelection): void {
        transition(bubbleG, this.transitionDuration(), this.transitionDelay())
            .attr('transform', d => this._bubbleLocator(d))
            .select(`circle.${this.BUBBLE_CLASS}`)
            .attr('fill', (d, i) => this.getColor(d, i))
            .attr('r', d => this.bubbleR(d))
            .attr('opacity', d => (this.bubbleR(d) > 0) ? 1 : 0);

        this.doUpdateLabels(bubbleG);
        this.doUpdateTitles(bubbleG);
    }

    public _removeNodes (bubbleG: SVGGElementSelection): void {
        bubbleG.exit().remove();
    }

    public _bubbleX (d): number {
        let x = this.x()(this.keyAccessor()(d));
        if (isNaN(x) || !isFinite(x)) {
            x = 0;
        }
        return x;
    }

    public _bubbleY (d): number {
        let y = this.y()(this.valueAccessor()(d));
        if (isNaN(y) || !isFinite(y)) {
            y = 0;
        }
        return y;
    }

    public renderBrush (): void {
        // override default x axis brush from parent chart
    }

    public redrawBrush (brushSelection: DCBrushSelection, doTransition: boolean): void {
        // override default x axis brush from parent chart
        this.fadeDeselectedArea(brushSelection);
    }
}

export const bubbleChart = (parent, chartGroup) => new BubbleChart(parent, chartGroup);
