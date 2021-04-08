import {BubbleMixin} from '../base/bubble-mixin';
import {CoordinateGridMixin} from '../base/coordinate-grid-mixin';
import {transition} from '../core/core';
import {d3compat} from '../core/config';

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
    constructor (parent, chartGroup) {
        super();

        this.transitionDuration(750);

        this.transitionDelay(0);

        this.anchor(parent, chartGroup);
    }

    _bubbleLocator (d) {
        return `translate(${this._bubbleX(d)},${this._bubbleY(d)})`;
    }

    plotData () {
        this.calculateRadiusDomain();
        this.r().range([this.MIN_RADIUS, this.xAxisLength() * this.maxBubbleRelativeSize()]);

        const data = this.data();
        let bubbleG = this.chartBodyG().selectAll(`g.${this.BUBBLE_NODE_CLASS}`)
            .data(data, d => d.key);
        if (this.sortBubbleSize() || this.keyboardAccessible()) {
            // update dom order based on sort
            bubbleG.order();
        }

        this._removeNodes(bubbleG);

        bubbleG = this._renderNodes(bubbleG);

        this._updateNodes(bubbleG);

        this.fadeDeselectedArea(this.filter());
    }

    _renderNodes (bubbleG) {
        const bubbleGEnter = bubbleG.enter().append('g');

        bubbleGEnter
            .attr('class', this.BUBBLE_NODE_CLASS)
            .attr('transform', d => this._bubbleLocator(d))
            .append('circle').attr('class', (d, i) => `${this.BUBBLE_CLASS} _${i}`)
            .on('click', d3compat.eventHandler(d => this.onClick(d)))
            .classed('dc-tabbable', this._keyboardAccessible)
            .attr('fill', this.getColor)
            .attr('r', 0);

        bubbleG = bubbleGEnter.merge(bubbleG);

        transition(bubbleG, this.transitionDuration(), this.transitionDelay())
            .select(`circle.${this.BUBBLE_CLASS}`)
            .attr('r', d => this.bubbleR(d))
            .attr('opacity', d => (this.bubbleR(d) > 0) ? 1 : 0);

        if (this._keyboardAccessible) {
            this._makeKeyboardAccessible(this.onClick);
        }

        this._doRenderLabel(bubbleGEnter);

        this._doRenderTitles(bubbleGEnter);

        return bubbleG;
    }

    _updateNodes (bubbleG) {
        transition(bubbleG, this.transitionDuration(), this.transitionDelay())
            .attr('transform', d => this._bubbleLocator(d))
            .select(`circle.${this.BUBBLE_CLASS}`)
            .attr('fill', this.getColor)
            .attr('r', d => this.bubbleR(d))
            .attr('opacity', d => (this.bubbleR(d) > 0) ? 1 : 0);

        this.doUpdateLabels(bubbleG);
        this.doUpdateTitles(bubbleG);
    }

    _removeNodes (bubbleG) {
        bubbleG.exit().remove();
    }

    _bubbleX (d) {
        let x = this.x()(this.keyAccessor()(d));
        if (isNaN(x) || !isFinite(x)) {
            x = 0;
        }
        return x;
    }

    _bubbleY (d) {
        let y = this.y()(this.valueAccessor()(d));
        if (isNaN(y) || !isFinite(y)) {
            y = 0;
        }
        return y;
    }

    renderBrush () {
        // override default x axis brush from parent chart
    }

    redrawBrush (brushSelection, doTransition) {
        // override default x axis brush from parent chart
        this.fadeDeselectedArea(brushSelection);
    }
}

export const bubbleChart = (parent, chartGroup) => new BubbleChart(parent, chartGroup);
