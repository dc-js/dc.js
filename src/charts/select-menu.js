import {events} from '../core/events';
import {BaseMixin} from '../base/base-mixin';
import {logger} from '../core/logger';
import {d3compat} from '../core/config';

const SELECT_CSS_CLASS = 'dc-select-menu';
const OPTION_CSS_CLASS = 'dc-select-option';

/**
 * The select menu is a simple widget designed to filter a dimension by selecting an option from
 * an HTML `<select/>` menu. The menu can be optionally turned into a multiselect.
 * @mixes BaseMixin
 */
export class SelectMenu extends BaseMixin {
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
    constructor (parent, chartGroup) {
        super();

        this._select = undefined;
        this._promptText = 'Select all';
        this._multiple = false;
        this._promptValue = null;
        this._numberVisible = null;

        this.data(group => group.all().filter(this._filterDisplayed));

        this._filterDisplayed = d => this.valueAccessor()(d) > 0;

        this._order = (a, b) => {
            if (this.keyAccessor()(a) > this.keyAccessor()(b)) {
                return 1;
            }
            if (this.keyAccessor()(a) < this.keyAccessor()(b)) {
                return -1;
            }
            return 0;
        };

        this.anchor(parent, chartGroup);
    }

    _doRender () {
        this.select('select').remove();
        this._select = this.root().append('select')
            .classed(SELECT_CSS_CLASS, true);
        this._select.append('option').text(this._promptText).attr('value', '');

        this._doRedraw();
        return this;
    }

    _doRedraw () {
        this._setAttributes();
        this._renderOptions();
        // select the option(s) corresponding to current filter(s)
        if (this.hasFilter() && this._multiple) {
            this._select.selectAll('option')
                .property('selected', d => typeof d !== 'undefined' && this.filters().indexOf(String(this.keyAccessor()(d))) >= 0);
        } else if (this.hasFilter()) {
            this._select.property('value', this.filter());
        } else {
            this._select.property('value', '');
        }
        return this;
    }

    _renderOptions () {
        const options = this._select.selectAll(`option.${OPTION_CSS_CLASS}`)
            .data(this.data(), d => this.keyAccessor()(d));

        options.exit().remove();

        options.enter()
            .append('option')
            .classed(OPTION_CSS_CLASS, true)
            .attr('value', d => this.keyAccessor()(d))
            .merge(options)
            .text(this.title());

        this._select.selectAll(`option.${OPTION_CSS_CLASS}`).sort(this._order);

        this._select.on('change', d3compat.eventHandler((d, evt) => this._onChange(d, evt)));
    }

    _onChange (_d, evt) {
        let values;

        const target = evt.target;

        if (target.selectedOptions) {
            const selectedOptions = Array.prototype.slice.call(target.selectedOptions);
            values = selectedOptions.map(d => d.value);
        } else { // IE and other browsers do not support selectedOptions
            // adapted from this polyfill: https://gist.github.com/brettz9/4212217
            const options = [].slice.call(evt.target.options);
            values = options.filter(option => option.selected).map(option => option.value);
        }
        // console.log(values);
        // check if only prompt option is selected
        if (values.length === 1 && values[0] === '') {
            values = this._promptValue || null;
        } else if (!this._multiple && values.length === 1) {
            values = values[0];
        }
        this.onChange(values);
    }

    onChange (val) {
        if (val && this._multiple) {
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

    _setAttributes () {
        if (this._multiple) {
            this._select.attr('multiple', true);
        } else {
            this._select.attr('multiple', null);
        }
        if (this._numberVisible !== null) {
            this._select.attr('size', this._numberVisible);
        } else {
            this._select.attr('size', null);
        }
    }

    /**
     * Get or set the function that controls the ordering of option tags in the
     * select menu. By default options are ordered by the group key in ascending
     * order.
     * @param {Function} [order]
     * @returns {Function|SelectMenu}
     * @example
     * // order by the group's value
     * chart.order(function (a,b) {
     *     return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
     * });
     */
    order (order) {
        if (!arguments.length) {
            return this._order;
        }
        this._order = order;
        return this;
    }

    /**
     * Get or set the text displayed in the options used to prompt selection.
     * @param {String} [promptText='Select all']
     * @returns {String|SelectMenu}
     * @example
     * chart.promptText('All states');
     */
    promptText (promptText) {
        if (!arguments.length) {
            return this._promptText;
        }
        this._promptText = promptText;
        return this;
    }

    /**
     * Get or set the function that filters option tags prior to display. By default options
     * with a value of < 1 are not displayed.
     * @param {function} [filterDisplayed]
     * @returns {Function|SelectMenu}
     * @example
     * // display all options override the `filterDisplayed` function:
     * chart.filterDisplayed(function () {
     *     return true;
     * });
     */
    filterDisplayed (filterDisplayed) {
        if (!arguments.length) {
            return this._filterDisplayed;
        }
        this._filterDisplayed = filterDisplayed;
        return this;
    }

    /**
     * Controls the type of select menu. Setting it to true converts the underlying
     * HTML tag into a multiple select.
     * @param {boolean} [multiple=false]
     * @returns {boolean|SelectMenu}
     * @example
     * chart.multiple(true);
     */
    multiple (multiple) {
        if (!arguments.length) {
            return this._multiple;
        }
        this._multiple = multiple;

        return this;
    }

    /**
     * Controls the default value to be used for
     * [dimension.filter](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter)
     * when only the prompt value is selected. If `null` (the default), no filtering will occur when
     * just the prompt is selected.
     * @param {?*} [promptValue=null]
     * @returns {*|SelectMenu}
     */
    promptValue (promptValue) {
        if (!arguments.length) {
            return this._promptValue;
        }
        this._promptValue = promptValue;

        return this;
    }

    /**
     * Controls the number of items to show in the select menu, when `.multiple()` is true. This
     * controls the [`size` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#Attributes) of
     * the `select` element. If `null` (the default), uses the browser's default height.
     * @param {?number} [numberVisible=null]
     * @returns {number|SelectMenu}
     * @example
     * chart.numberVisible(10);
     */
    numberVisible (numberVisible) {
        if (!arguments.length) {
            return this._numberVisible;
        }
        this._numberVisible = numberVisible;

        return this;
    }

    size (numberVisible) {
        logger.warnOnce('selectMenu.size is ambiguous - use selectMenu.numberVisible instead');
        if (!arguments.length) {
            return this.numberVisible();
        }
        return this.numberVisible(numberVisible);
    }
}

export const selectMenu = (parent, chartGroup) => new SelectMenu(parent, chartGroup);
