import {select} from 'd3-selection';

import {pluck, utils} from '../core/utils';
import {d3compat} from '../core/config';
import {constants} from '../core/constants';

/**
 * htmlLegend is a attachable widget that can be added to other dc charts to render horizontal/vertical legend
 * labels.
 * @example
 * chart.legend(HtmlLegend().container(legendContainerElement).horizontal(false))
 * @returns {HtmlLegend}
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
        this._keyboardAccessible = false;
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
            .on('mouseover', d3compat.eventHandler(d => this._parent.legendHighlight(d)))
            .on('mouseout', d3compat.eventHandler(d => this._parent.legendReset(d)))
            .on('click', d3compat.eventHandler(d => this._parent.legendToggle(d)));

        if (this._highlightSelected) {
            itemEnter.classed(constants.SELECTED_CLASS, d => filters.indexOf(d.name) !== -1);
        }

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-color')
            .style('background-color', pluck('color'));

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-label')
            .classed('dc-tabbable', this._keyboardAccessible)
            .attr('title', this._legendText)
            .text(this._legendText);

        if (this._keyboardAccessible) {
            this._makeLegendKeyboardAccessible();
        }
    }

    /**
     * Set the container selector for the legend widget. Required.
     * @param {String} [container]
     * @return {String|HtmlLegend}
     */
    container (container) {
        if (!arguments.length) {
            return this._container;
        }
        this._container = select(container);
        return this;
    }

    /**
     * This can be optionally used to override class for legenditem and just use this class style.
     * This is helpful for overriding the style of a particular chart rather than overriding
     * the style for all charts.
     *
     * Setting this will disable the highlighting of selected items also.
     * @param {String} [legendItemClass]
     * @return {String|HtmlLegend}
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
     * @param {String} [highlightSelected]
     * @return {String|HtmlLegend}
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
     * @param {String} [horizontal]
     * @return {String|HtmlLegend}
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
     * @param  {Function} [legendText]
     * @returns {Function|HtmlLegend}
     * @example
     * // default legendText
     * legend.legendText(pluck('name'))
     *
     * // create numbered legend items
     * chart.legend(new HtmlLegend().legendText(function(d, i) { return i + '. ' + d.name; }))
     *
     * // create legend displaying group counts
     * chart.legend(new HtmlLegend().legendText(function(d) { return d.name + ': ' d.data; }))
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
     * @param  {Number} [maxItems]
     * @return {HtmlLegend}
     */
    maxItems (maxItems) {
        if (!arguments.length) {
            return this._maxItems;
        }
        this._maxItems = utils.isNumber(maxItems) ? maxItems : undefined;
        return this;
    }

    /**
     * If set, individual legend items will be focusable from keyboard and on pressing Enter or Space
     * will behave as if clicked on.
     * 
     * If `svgDescription` on the parent chart has not been explicitly set, will also set the default 
     * SVG description text to the class constructor name, like BarChart or HeatMap, and make the entire
     * SVG focusable.
     * @param {Boolean} [keyboardAccessible=false]
     * @returns {Boolean|HtmlLegend}
     */
    keyboardAccessible (keyboardAccessible) {
        if (!arguments.length) {
            return this._keyboardAccessible;
        }
        this._keyboardAccessible = keyboardAccessible;
        return this;
    }

    _makeLegendKeyboardAccessible () {

        if (!this._parent._svgDescription) {

            this._parent.svg().append('desc')
                .attr('id', `desc-id-${this._parent.__dcFlag__}`)
                .html(`${this._parent.svgDescription()}`);

            this._parent.svg()
                .attr('tabindex', '0')
                .attr('role', 'img')
                .attr('aria-labelledby', `desc-id-${this._parent.__dcFlag__}`);
        }

        const tabElements = this.container()
            .selectAll('.dc-legend-item-label.dc-tabbable')
            .attr('tabindex', 0);

        tabElements
            .on('keydown', d3compat.eventHandler((d, event) => {
                // trigger only if d is an object
                if (event.keyCode === 13 && typeof d === 'object') {
                    d.chart.legendToggle(d)
                } 
                // special case for space key press - prevent scrolling
                if (event.keyCode === 32 && typeof d === 'object') {
                    d.chart.legendToggle(d)
                    event.preventDefault();            
                }
            }))
            .on('focus', d3compat.eventHandler(d => {
                this._parent.legendHighlight(d);
            }))
            .on('blur', d3compat.eventHandler(d => {
                this._parent.legendReset(d);
            }));
    }
}

export const htmlLegend = () => new HtmlLegend();
