import { BubbleMixin } from '../base/bubble-mixin';
import { CoordinateGridMixin } from '../base/coordinate-grid-mixin';
import { transition } from '../core/core';
import {
    BaseAccessor,
    ChartGroupType,
    ChartParentType,
    DCBrushSelection,
    SVGGElementSelection,
} from '../core/types';
import { adaptHandler } from '../core/d3compat';

/**
 * A concrete implementation of a general purpose bubble chart that allows data visualization using the
 * following dimensions:
 * - x axis position
 * - y axis position
 * - bubble radius
 * - color
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/ | Nasdaq 100 Index}
 * - {@link http://dc-js.github.com/dc.js/vc/index.html | US Venture Capital Landscape 2011}
 */
export class BubbleChart extends BubbleMixin(CoordinateGridMixin) {
    private _bubbleLocator: BaseAccessor<string>;

    /**
     * Create a Bubble Chart.
     *
     * TODO update example
     *
     * @example
     * ```
     * // create a bubble chart under #chart-container1 element using the default global chart group
     * var bubbleChart1 = new BubbleChart('#chart-container1');
     * // create a bubble chart under #chart-container2 element using chart group A
     * var bubbleChart2 = new BubbleChart('#chart-container2', 'chartGroupA');
     * ```
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this.configure({
            // TODO: move following two to Mixin, BubbleOverlay has exactly same setup
            transitionDuration: 750,
            transitionDelay: 0,
        });

        this._bubbleLocator = d => `translate(${this._bubbleX(d)},${this._bubbleY(d)})`;
    }

    public plotData(): void {
        this.calculateRadiusDomain();
        this.r().range([this.MIN_RADIUS, this.xAxisLength() * this._conf.maxBubbleRelativeSize]);

        const data = this.data();
        let bubbleG: SVGGElementSelection = this.chartBodyG()
            .selectAll(`g.${this.BUBBLE_NODE_CLASS}`)
            .data(data, d => d.key);
        if (this._conf.sortBubbleSize) {
            // update dom order based on sort
            bubbleG.order();
        }

        this._removeNodes(bubbleG);

        bubbleG = this._renderNodes(bubbleG);

        this._updateNodes(bubbleG);

        this.fadeDeselectedArea(this.filter());
    }

    private _renderNodes(bubbleG: SVGGElementSelection): SVGGElementSelection {
        const bubbleGEnter = bubbleG.enter().append('g');

        bubbleGEnter
            .attr('class', this.BUBBLE_NODE_CLASS)
            .attr('transform', d => this._bubbleLocator(d))
            .append('circle')
            .attr('class', (d, i) => `${this.BUBBLE_CLASS} _${i}`)
            .on(
                'click',
                adaptHandler(d => this.onClick(d))
            )
            .attr('fill', (d, i) => this.getColor(d, i))
            .attr('r', 0);

        bubbleG = bubbleGEnter.merge(bubbleG);

        transition(bubbleG, this._conf.transitionDuration, this._conf.transitionDelay)
            .select(`circle.${this.BUBBLE_CLASS}`)
            .attr('r', d => this.bubbleR(d))
            .attr('opacity', d => (this.bubbleR(d) > 0 ? 1 : 0));

        this._doRenderLabel(bubbleGEnter);

        this._doRenderTitles(bubbleGEnter);

        return bubbleG;
    }

    private _updateNodes(bubbleG: SVGGElementSelection): void {
        transition(bubbleG, this._conf.transitionDuration, this._conf.transitionDelay)
            .attr('transform', d => this._bubbleLocator(d))
            .select(`circle.${this.BUBBLE_CLASS}`)
            .attr('fill', (d, i) => this.getColor(d, i))
            .attr('r', d => this.bubbleR(d))
            .attr('opacity', d => (this.bubbleR(d) > 0 ? 1 : 0));

        this.doUpdateLabels(bubbleG);
        this.doUpdateTitles(bubbleG);
    }

    private _removeNodes(bubbleG: SVGGElementSelection): void {
        bubbleG.exit().remove();
    }

    private _bubbleX(d): number {
        let x = this.x()(this._conf.keyAccessor(d));
        if (isNaN(x) || !isFinite(x)) {
            x = 0;
        }
        return x;
    }

    private _bubbleY(d): number {
        let y = this.y()(d._value);
        if (isNaN(y) || !isFinite(y)) {
            y = 0;
        }
        return y;
    }

    public renderBrush(): void {
        // override default x axis brush from parent chart
    }

    public redrawBrush(brushSelection: DCBrushSelection, doTransition: boolean): void {
        // override default x axis brush from parent chart
        this.fadeDeselectedArea(brushSelection);
    }
}
