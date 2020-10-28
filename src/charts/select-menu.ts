import { Selection } from 'd3-selection';

import { events } from '../core/events';
import { BaseMixin } from '../base/base-mixin';
import { ChartGroupType, ChartParentType } from '../core/types';
import { ascending } from 'd3-array';
import { ISelectMenuConf } from './i-select-menu-conf';
import { adaptHandler } from '../core/d3compat';

const SELECT_CSS_CLASS = 'dc-select-menu';
const OPTION_CSS_CLASS = 'dc-select-option';

/**
 * The select menu is a simple widget designed to filter a dimension by selecting an option from
 * an HTML `<select/>` menu. The menu can be optionally turned into a multiselect.
 * @mixes BaseMixin
 */
export class SelectMenu extends BaseMixin {
    protected _conf: ISelectMenuConf;

    private _select: Selection<HTMLSelectElement, any, any, any>;

    /**
     * Create a Select Menu.
     * @example
     * // create a select menu under #select-container using the default global chart group
     * var select = new SelectMenu('#select-container')
     *                .dimension(states)
     *                .group(stateGroup);
     * // the option text can be set via the title() function
     * // by default the option text is '`key`: `value`'
     * select.title(function (d){
     *     return 'STATE: ' + d.key;
     * })
     * @param {String|node|d3.selection|CompositeChart} parent - Any valid
     * [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this widget should be placed in.
     * Interaction with the widget will only trigger events and redraws within its group.
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(chartGroup);

        this.configure({
            multiple: false,
            promptText: 'Select all',
            promptValue: null,
            filterDisplayed: d => d._value > 0,
            order: (a, b) => ascending(this._conf.keyAccessor(a), this._conf.keyAccessor(b)),
            numberVisible: null,
        });

        this._select = undefined;

        this.anchor(parent);
    }

    public configure(conf: ISelectMenuConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): ISelectMenuConf {
        return this._conf;
    }

    public data() {
        return super.data().filter(this._conf.filterDisplayed);
    }

    public _doRender() {
        this.select('select').remove();
        this._select = this.root().append('select').classed(SELECT_CSS_CLASS, true);
        this._select.append('option').text(this._conf.promptText).attr('value', '');

        this._doRedraw();
        return this;
    }

    public _doRedraw() {
        this._setAttributes();
        this._renderOptions();
        // select the option(s) corresponding to current filter(s)
        if (this.hasFilter() && this._conf.multiple) {
            this._select
                .selectAll('option')
                .property(
                    'selected',
                    d =>
                        typeof d !== 'undefined' &&
                        this.filters().indexOf(String(this._conf.keyAccessor(d))) >= 0
                );
        } else if (this.hasFilter()) {
            this._select.property('value', this.filter());
        } else {
            this._select.property('value', '');
        }
        return this;
    }

    private _renderOptions() {
        const options = this._select
            .selectAll<HTMLOptionElement, any>(`option.${OPTION_CSS_CLASS}`)
            .data<any>(this.data(), d => this._conf.keyAccessor(d));

        options.exit().remove();

        options
            .enter()
            .append('option')
            .classed(OPTION_CSS_CLASS, true)
            .attr('value', d => this._conf.keyAccessor(d))
            .merge(options)
            .text(this._conf.title);

        this._select.selectAll(`option.${OPTION_CSS_CLASS}`).sort(this._conf.order);

        this._select.on(
            'change',
            adaptHandler((d, evt) => this._onChange(d, evt))
        );
    }

    private _onChange(_d, evt): void {
        let values;
        const target = evt.target;
        if (target.selectedOptions) {
            const selectedOptions = Array.prototype.slice.call(target.selectedOptions);
            values = selectedOptions.map(d => d.value);
        } else {
            // IE and other browsers do not support selectedOptions
            // adapted from this polyfill: https://gist.github.com/brettz9/4212217
            const options = [].slice.call(evt.target.options);
            values = options.filter(option => option.selected).map(option => option.value);
        }
        // console.log(values);
        // check if only prompt option is selected
        if (values.length === 1 && values[0] === '') {
            values = this._conf.promptValue || null;
        } else if (!this._conf.multiple && values.length === 1) {
            values = values[0];
        }
        this.onChange(values);
    }

    public onChange(val): void {
        if (val && this._conf.multiple) {
            this.replaceFilter([val]);
        } else if (val) {
            this.replaceFilter(val);
        } else {
            this.filterAll();
        }
        events.trigger(() => {
            this.redrawGroup();
        });
    }

    private _setAttributes(): void {
        if (this._conf.multiple) {
            this._select.attr('multiple', true);
        } else {
            this._select.attr('multiple', null);
        }
        if (this._conf.numberVisible !== null) {
            this._select.attr('size', this._conf.numberVisible);
        } else {
            this._select.attr('size', null);
        }
    }
}
