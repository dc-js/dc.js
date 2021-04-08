import {select} from 'd3-selection';

import {events} from '../core/events';
import {BaseMixin} from '../base/base-mixin';
import {utils} from '../core/utils'
import {d3compat} from '../core/config';

const GROUP_CSS_CLASS = 'dc-cbox-group';
const ITEM_CSS_CLASS = 'dc-cbox-item';

/**
 * The CboxMenu is a simple widget designed to filter a dimension by
 * selecting option(s) from a set of HTML `<input />` elements. The menu can be
 * made into a set of radio buttons (single select) or checkboxes (multiple).
 * @mixes BaseMixin
 */
export class CboxMenu extends BaseMixin {
    /**
     * Create a Cbox Menu.
     *
     * @example
     * // create a cboxMenu under #cbox-container using the default global chart group
     * var cbox = new CboxMenu('#cbox-container')
     *                .dimension(states)
     *                .group(stateGroup);
     * // the option text can be set via the title() function
     * // by default the option text is '`key`: `value`'
     * cbox.title(function (d){
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

        this._cbox = undefined;
        this._promptText = 'Select all';
        this._multiple = false;
        this._inputType = 'radio';
        this._promptValue = null;

        this._uniqueId = utils.uniqueId();

        this.data(group => group.all().filter(this._filterDisplayed));

        // There is an accessor for this attribute, initialized with default value
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
        return this._doRedraw();
    }

    _doRedraw () {
        this.select('ul').remove();
        this._cbox = this.root()
            .append('ul')
            .classed(GROUP_CSS_CLASS, true);
        this._renderOptions();

        if (this.hasFilter() && this._multiple) {
            this._cbox.selectAll('input')
            // adding `false` avoids failing test cases in phantomjs
                .property('checked', d => d && this.filters().indexOf(String(this.keyAccessor()(d))) >= 0 || false);
        } else if (this.hasFilter()) {
            this._cbox.selectAll('input')
                .property('checked', d => {
                    if (!d) {
                        return false;
                    }
                    return this.keyAccessor()(d) === this.filter();
                });
        }
        return this;
    }

    _renderOptions () {
        let options = this._cbox
            .selectAll(`li.${ITEM_CSS_CLASS}`)
            .data(this.data(), d => this.keyAccessor()(d));

        options.exit().remove();

        options = options.enter()
            .append('li')
            .classed(ITEM_CSS_CLASS, true)
            .merge(options);

        options
            .append('input')
            .attr('type', this._inputType)
            .attr('value', d => this.keyAccessor()(d))
            .attr('name', `domain_${this._uniqueId}`)
            .attr('id', (d, i) => `input_${this._uniqueId}_${i}`);
        options
            .append('label')
            .attr('for', (d, i) => `input_${this._uniqueId}_${i}`)
            .text(this.title());

        const chart = this;
        // 'all' option
        if (this._multiple) {
            this._cbox
                .append('li')
                .append('input')
                .attr('type', 'reset')
                .text(this._promptText)
                .on('click', d3compat.eventHandler(function (d, evt) {
                    return chart._onChange(d, evt, this);
                }));
        } else {
            const li = this._cbox.append('li');
            li.append('input')
                .attr('type', this._inputType)
                .attr('value', this._promptValue)
                .attr('name', `domain_${this._uniqueId}`)
                .attr('id', (d, i) => `input_${this._uniqueId}_all`)
                .property('checked', true);
            li.append('label')
                .attr('for', (d, i) => `input_${this._uniqueId}_all`)
                .text(this._promptText);
        }

        this._cbox
            .selectAll(`li.${ITEM_CSS_CLASS}`)
            .sort(this._order);

        this._cbox.on('change', d3compat.eventHandler(function (d, evt) {
            return chart._onChange(d, evt, this);
        }));
        return options;
    }

    _onChange (d, evt, element) {
        let values;

        const target = select(evt.target);
        let options;

        if (!target.datum()) {
            values = this._promptValue || null;
        } else {
            options = select(element).selectAll('input')
                .filter(function (o) {
                    if (o) {
                        return this.checked;
                    }
                });
            values = options.nodes().map(option => option.value);
            // check if only prompt option is selected
            if (!this._multiple && values.length === 1) {
                values = values[0];
            }
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

    /**
     * Get or set the function that controls the ordering of option tags in the
     * cbox menu. By default options are ordered by the group key in ascending
     * order.
     * @param {Function} [order]
     * @returns {Function|CboxMenu}
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
     * @returns {String|CboxMenu}
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
     * Get or set the function that filters options prior to display. By default options
     * with a value of < 1 are not displayed.
     * @param {function} [filterDisplayed]
     * @returns {Function|CboxMenu}
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
     * Controls the type of input element. Setting it to true converts
     * the HTML `input` tags from radio buttons to checkboxes.
     * @param {boolean} [multiple=false]
     * @returns {Boolean|CboxMenu}
     * @example
     * chart.multiple(true);
     */
    multiple (multiple) {
        if (!arguments.length) {
            return this._multiple;
        }
        this._multiple = multiple;
        if (this._multiple) {
            this._inputType = 'checkbox';
        } else {
            this._inputType = 'radio';
        }
        return this;
    }

    /**
     * Controls the default value to be used for
     * [dimension.filter](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter)
     * when only the prompt value is selected. If `null` (the default), no filtering will occur when
     * just the prompt is selected.
     * @param {?*} [promptValue=null]
     * @returns {*|CboxMenu}
     */
    promptValue (promptValue) {
        if (!arguments.length) {
            return this._promptValue;
        }
        this._promptValue = promptValue;

        return this;
    }
}

export const cboxMenu = (parent, chartGroup) => new CboxMenu(parent, chartGroup);
