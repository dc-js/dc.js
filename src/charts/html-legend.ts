import {select, Selection} from 'd3-selection';

import {isNumber} from '../core/utils';
import {constants} from '../core/constants';
import {LegendItem, LegendTextAccessor, ParentOfLegend} from '../core/types';

/**
 * htmlLegend is a attachable widget that can be added to other dc charts to render horizontal/vertical legend
 * labels.
 * @example
 * chart.legend(HtmlLegend().container(legendContainerElement).horizontal(false))
 * @returns {HtmlLegend}
 */
export class HtmlLegend {
    private _htmlLegendDivCssClass: string;
    private _legendItemCssClassHorizontal: string;
    private _legendItemCssClassVertical: string;
    private _parent: ParentOfLegend;
    private _container: Selection<HTMLElement, any, any, any>;
    private _legendText: LegendTextAccessor;
    private _maxItems: number;
    private _horizontal: boolean;
    private _legendItemClass: string;
    private _highlightSelected: boolean;

    constructor () {
        this._htmlLegendDivCssClass = 'dc-html-legend';
        this._legendItemCssClassHorizontal = 'dc-legend-item-horizontal';
        this._legendItemCssClassVertical = 'dc-legend-item-vertical';
        this._parent = undefined;
        this._container = undefined;
        this._legendText = d => d.name;
        this._maxItems = undefined;
        this._horizontal = false;
        this._legendItemClass = undefined;
        this._highlightSelected = false;
    }

    public parent (): ParentOfLegend;
    public parent (p: ParentOfLegend): this;
    public parent (p?) {
        if (!arguments.length) {
            return this._parent;
        }
        this._parent = p;
        return this;
    }

    public render () {
        const defaultLegendItemCssClass = this._horizontal ? this._legendItemCssClassHorizontal : this._legendItemCssClassVertical;
        this._container.select(`div.${this._htmlLegendDivCssClass}`).remove();

        const container = this._container.append('div').attr('class', this._htmlLegendDivCssClass);
        container.attr('style', `max-width:${this._container.nodes()[0].style.width}`);

        let legendables: LegendItem[] = this._parent.legendables();
        const filters = this._parent.filters();

        if (this._maxItems !== undefined) {
            legendables = legendables.slice(0, this._maxItems);
        }

        const legendItemClassName = this._legendItemClass ? this._legendItemClass : defaultLegendItemCssClass;

        const itemEnter: Selection<HTMLDivElement, LegendItem, HTMLElement, any> =
            container.selectAll<HTMLDivElement, any>(`div.${legendItemClassName}`)
                .data<LegendItem>(legendables).enter()
                .append('div')
                    .classed(legendItemClassName, true)
                .on('mouseover', d => this._parent.legendHighlight(d))
                .on('mouseout', d => this._parent.legendReset(d))
                .on('click', d => this._parent.legendToggle(d));

        if (this._highlightSelected) {
            // TODO: fragile code - there may be other types of filters
            itemEnter.classed(constants.SELECTED_CLASS, d => filters.indexOf(d.name) !== -1);
        }

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-color')
            .style('background-color', d => d.color);

        itemEnter.append('span')
            .attr('class', 'dc-legend-item-label')
            .attr('title', this._legendText)
            .text(this._legendText);
    }

    /**
     * Set the container selector for the legend widget. Required.
     * @param {String} [container]
     * @return {String|HtmlLegend}
     */
    public container (): Selection<HTMLElement, any, any, any>;
    public container (container: string|Selection<HTMLElement, any, any, any>): this;
    public container (container?) {
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
    public legendItemClass (): string;
    public legendItemClass (legendItemClass: string): this;
    public legendItemClass (legendItemClass?) {
        if (!arguments.length) {
            return this._legendItemClass;
        }
        this._legendItemClass = legendItemClass;
        return this;
    }

    /**
     * This can be optionally used to enable highlighting legends for the selections/filters for the
     * chart.
     * @param {boolean} [highlightSelected]
     * @return {boolean|HtmlLegend}
     */
    public highlightSelected (): boolean;
    public highlightSelected (highlightSelected: boolean): this;
    public highlightSelected (highlightSelected?) {
        if (!arguments.length) {
            return this._highlightSelected;
        }
        this._highlightSelected = highlightSelected;
        return this;
    }

    /**
     * Display the legend horizontally instead of vertically
     * @param {boolean} [horizontal]
     * @return {boolean|HtmlLegend}
     */
    public horizontal (): boolean;
    public horizontal (horizontal: boolean): this;
    public horizontal (horizontal?) {
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
    public legendText (): LegendTextAccessor;
    public legendText (legendText: LegendTextAccessor): this;
    public legendText (legendText?) {
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
    public maxItems (): number;
    public maxItems (maxItems: number): this;
    public maxItems (maxItems?) {
        if (!arguments.length) {
            return this._maxItems;
        }
        this._maxItems = isNumber(maxItems) ? maxItems : undefined;
        return this;
    }
}

export const htmlLegend = () => new HtmlLegend();
