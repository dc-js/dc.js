import * as d3 from 'd3';

import {pluck, utils} from '../core/utils';
import {constants} from '../core/constants';

/**
 * htmlLegend is a attachable widget that can be added to other dc charts to render horizontal/vertical legend
 * labels.
 * @class htmlLegend
 * @memberof dc
 * @example
 * chart.legend(dc.htmlLegend().container(legendContainerElement).horizontal(false))
 * @returns {dc.htmlLegend}
 */
export class HtmlLegend {
    constructor () {
        this._htmlLegendDivCssClass = 'dc-html-legend';
        this._legendItemCssClassHorizontal = 'dc-legend-item-horizontal';
        this._legendItemCssClassVertical = 'dc-legend-item-vertical';
        this._parent = undefined;
        this._container = undefined;
        this._legendText = pluck('name');
        this._maxItems = undefined;
        this._horizontal = false;
        this._legendItemClass = undefined;
        this._highlightSelected = false;
    }

    parent (p) {
        if (!arguments.length) {
            return this._parent;
        }
        this._parent = p;
        return this;
    }

    render () {
        this._defaultLegendItemCssClass = this._horizontal ? this._legendItemCssClassHorizontal : this._legendItemCssClassVertical;
        this._container.select(`div.${this._htmlLegendDivCssClass}`).remove();

        const container = this._container.append('div').attr('class', this._htmlLegendDivCssClass);
        container.attr('style', `max-width:${this._container.nodes()[0].style.width}`);

        let legendables = this._parent.legendables();
        const filters = this._parent.filters();

        if (this._maxItems !== undefined) {
            legendables = legendables.slice(0, this._maxItems);
        }

        const legendItemClassName = this._legendItemClass ? this._legendItemClass : this._defaultLegendItemCssClass;

        const itemEnter = container.selectAll(`div.${legendItemClassName}`)
            .data(legendables).enter()
            .append('div')
            .classed(legendItemClassName, true)
            .on('mouseover', d => this._parent.legendHighlight(d))
            .on('mouseout', d => this._parent.legendReset(d))
            .on('click', d => this._parent.legendToggle(d));

        if (this._highlightSelected) {
            itemEnter.classed(constants.SELECTED_CLASS, d => filters.indexOf(d.name) !== -1);
        }

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-color')
            .style('background-color', pluck('color'));

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-label')
            .attr('title', this._legendText)
            .text(this._legendText);
    }

    /**
     * Set the container selector for the legend widget. Required.
     * @method container
     * @memberof dc.htmlLegend
     * @instance
     * @param {String} [container]
     * @return {String|dc.htmlLegend}
     */
    container (container) {
        if (!arguments.length) {
            return this._container;
        }
        this._container = d3.select(container);
        return this;
    }

    /**
     * This can be optionally used to override class for legenditem and just use this class style.
     * This is helpful for overriding the style of a particular chart rather than overriding
     * the style for all charts.
     *
     * Setting this will disable the highlighting of selected items also.
     * @method legendItemClass
     * @memberof dc.htmlLegend
     * @instance
     * @param {String} [legendItemClass]
     * @return {String|dc.htmlLegend}
     */
    legendItemClass (legendItemClass) {
        if (!arguments.length) {
            return this._legendItemClass;
        }
        this._legendItemClass = legendItemClass;
        return this;
    }

    /**
     * This can be optionally used to enable highlighting legends for the selections/filters for the
     * chart.
     * @method highlightSelected
     * @memberof dc.htmlLegend
     * @instance
     * @param {String} [highlightSelected]
     * @return {String|dc.htmlLegend}
     */
    highlightSelected (highlightSelected) {
        if (!arguments.length) {
            return this._highlightSelected;
        }
        this._highlightSelected = highlightSelected;
        return this;
    }

    /**
     * Display the legend horizontally instead of vertically
     * @method horizontal
     * @memberof dc.htmlLegend
     * @instance
     * @param {String} [horizontal]
     * @return {String|dc.htmlLegend}
     */
    horizontal (horizontal) {
        if (!arguments.length) {
            return this._horizontal;
        }
        this._horizontal = horizontal;
        return this;
    }

    /**
     * Set or get the legend text function. The legend widget uses this function to render the legend
     * text for each item. If no function is specified the legend widget will display the names
     * associated with each group.
     * @method legendText
     * @memberof dc.htmlLegend
     * @instance
     * @param  {Function} [legendText]
     * @returns {Function|dc.htmlLegend}
     * @example
     * // default legendText
     * legend.legendText(dc.pluck('name'))
     *
     * // create numbered legend items
     * chart.legend(dc.htmlLegend().legendText(function(d, i) { return i + '. ' + d.name; }))
     *
     * // create legend displaying group counts
     * chart.legend(dc.htmlLegend().legendText(function(d) { return d.name + ': ' d.data; }))
     */
    legendText (legendText) {
        if (!arguments.length) {
            return this._legendText;
        }
        this._legendText = legendText;
        return this;
    }

    /**
     * Maximum number of legend items to display
     * @method maxItems
     * @memberof dc.htmlLegend
     * @instance
     * @param  {Number} [maxItems]
     * @return {dc.htmlLegend}
     */
    maxItems (maxItems) {
        if (!arguments.length) {
            return this._maxItems;
        }
        this._maxItems = utils.isNumber(maxItems) ? maxItems : undefined;
        return this;
    }
}

export const htmlLegend = () => new HtmlLegend();
