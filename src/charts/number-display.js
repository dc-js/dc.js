import {format} from 'd3-format';
import {easeQuad} from 'd3-ease';
import {interpolateNumber} from 'd3-interpolate';

import {BaseMixin} from '../base/base-mixin';

const SPAN_CLASS = 'number-display';

/**
 * A display of a single numeric value.
 *
 * Unlike other charts, you do not need to set a dimension. Instead a group object must be provided and
 * a valueAccessor that returns a single value.
 *
 * If the group is a {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#crossfilter_groupAll groupAll}
 * then its `.value()` will be displayed. This is the recommended usage.
 *
 * However, if it is given an ordinary group, the `numberDisplay` will show the last bin's value, after
 * sorting with the {@link https://dc-js.github.io/dc.js/docs/html/dc.baseMixin.html#ordering__anchor ordering}
 * function. `numberDisplay` defaults the `ordering` function to sorting by value, so this will display
 * the largest value if the values are numeric.
 * @mixes BaseMixin
 */
export class NumberDisplay extends BaseMixin {
    /**
     * Create a Number Display widget.
     *
     * @example
     * // create a number display under #chart-container1 element using the default global chart group
     * var display1 = new NumberDisplay('#chart-container1');
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor (parent, chartGroup) {
        super();

        this._formatNumber = format('.2s');
        this._html = {one: '', some: '', none: ''};
        this._lastValue = undefined;
        this._ariaLiveRegion = false;

        // dimension not required
        this._mandatoryAttributes(['group']);

        // default to ordering by value, to emulate old group.top(1) behavior when multiple groups
        this.ordering(kv => kv.value);

        this.data(group => {
            const valObj = group.value ? group.value() : this._maxBin(group.all());
            return this.valueAccessor()(valObj);
        });

        this.transitionDuration(250); // good default
        this.transitionDelay(0);

        this.anchor(parent, chartGroup);
    }

    /**
     * Gets or sets an optional object specifying HTML templates to use depending on the number
     * displayed.  The text `%number` will be replaced with the current value.
     * - one: HTML template to use if the number is 1
     * - zero: HTML template to use if the number is 0
     * - some: HTML template to use otherwise
     * @example
     * numberWidget.html({
     *      one:'%number record',
     *      some:'%number records',
     *      none:'no records'})
     * @param {{one:String, some:String, none:String}} [html={one: '', some: '', none: ''}]
     * @returns {{one:String, some:String, none:String}|NumberDisplay}
     */
    html (html) {
        if (!arguments.length) {
            return this._html;
        }
        if (html.none) {
            this._html.none = html.none;//if none available
        } else if (html.one) {
            this._html.none = html.one;//if none not available use one
        } else if (html.some) {
            this._html.none = html.some;//if none and one not available use some
        }
        if (html.one) {
            this._html.one = html.one;//if one available
        } else if (html.some) {
            this._html.one = html.some;//if one not available use some
        }
        if (html.some) {
            this._html.some = html.some;//if some available
        } else if (html.one) {
            this._html.some = html.one;//if some not available use one
        }
        return this;
    }

    /**
     * Calculate and return the underlying value of the display.
     * @returns {Number}
     */
    value () {
        return this.data();
    }

    _maxBin (all) {
        if (!all.length) {
            return null;
        }
        const sorted = this._computeOrderedGroups(all);
        return sorted[sorted.length - 1];
    }

    _doRender () {
        const newValue = this.value();
        let span = this.selectAll(`.${SPAN_CLASS}`);

        if (span.empty()) {
            span = span.data([0])
                .enter()
                .append('span')
                .attr('class', SPAN_CLASS)
                .classed('dc-tabbable', this._keyboardAccessible)
                .merge(span);

            if (this._keyboardAccessible) {
                span.attr('tabindex', '0');
            }

            if (this._ariaLiveRegion) {
                this.transitionDuration(0);
                span.attr('aria-live', 'polite');
            }
        }

        {
            const chart = this;
            span.transition()
                .duration(chart.transitionDuration())
                .delay(chart.transitionDelay())
                .ease(easeQuad)
                .tween('text', function () {
                    // [XA] don't try and interpolate from Infinity, else this breaks.
                    const interpStart = isFinite(chart._lastValue) ? chart._lastValue : 0;
                    const interp = interpolateNumber(interpStart || 0, newValue);
                    chart._lastValue = newValue;

                    // need to save it in D3v4
                    const node = this;
                    return t => {
                        let html = null;
                        const num = chart.formatNumber()(interp(t));
                        if (newValue === 0 && (chart._html.none !== '')) {
                            html = chart._html.none;
                        } else if (newValue === 1 && (chart._html.one !== '')) {
                            html = chart._html.one;
                        } else if (chart._html.some !== '') {
                            html = chart._html.some;
                        }
                        node.innerHTML = html ? html.replace('%number', num) : num;
                    };
                });
        }
    }

    _doRedraw () {
        return this._doRender();
    }

    /**
     * Get or set a function to format the value for the display.
     * @see {@link https://github.com/d3/d3-format/blob/master/README.md#format d3.format}
     * @param {Function} [formatter=d3.format('.2s')]
     * @returns {Function|NumberDisplay}
     */
    formatNumber (formatter) {
        if (!arguments.length) {
            return this._formatNumber;
        }
        this._formatNumber = formatter;
        return this;
    }

    /**
     * If set, the Number Display widget will have its aria-live attribute set to 'polite' which will
     * notify screen readers when the widget changes its value. Note that setting this method will also
     * disable the default transition between the old and the new values. This is to avoid change
     * notifications spoken out before the new value finishes re-drawing. It is also advisable to check
     * if the widget has appropriately set accessibility description or label. 
     * @param {Boolean} [ariaLiveRegion=false]
     * @returns {Boolean|NumberDisplay}
     */
    ariaLiveRegion (ariaLiveRegion) {
        if (!arguments.length) {
            return this._ariaLiveRegion;
        }
        this._ariaLiveRegion = ariaLiveRegion;
        return this;
    }

}

export const numberDisplay = (parent, chartGroup) => new NumberDisplay(parent, chartGroup);
