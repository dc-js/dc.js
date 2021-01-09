import { format } from 'd3-format';
import { easeQuad } from 'd3-ease';
import { interpolateNumber } from 'd3-interpolate';

import { BaseMixin } from '../base/base-mixin';
import { ChartGroupType, ChartParentType, MinimalCFGroup } from '../core/types';
import { INumberDisplayConf } from './i-number-display-conf';

const SPAN_CLASS = 'number-display';

type HTMLSpec = { some: string; one: string; none: string };

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
 */
export class NumberDisplay extends BaseMixin {
    protected _conf: INumberDisplayConf;

    private _html: HTMLSpec;
    private _lastValue: number;

    /**
     * Create a Number Display widget.
     *
     * @example
     * ```
     * // create a number display under #chart-container1 element using the default global chart group
     * const display1 = new NumberDisplay('#chart-container1');
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this.configure({
            transitionDuration: 250, // good default
            transitionDelay: 0,
            formatNumber: format('.2s'),
        });

        this.dataProvider().configure({
            ordering: kv => kv.value, // default to ordering by value, to emulate old group.top(1) behavior when multiple groups
        });

        this._html = { one: '', some: '', none: '' };
        this._lastValue = undefined;

        // dimension not required
        this._mandatoryAttributes(['group']);
    }

    public configure(conf: INumberDisplayConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): INumberDisplayConf {
        return this._conf;
    }

    // TODO: chart specific DataProvider
    public data() {
        const group: MinimalCFGroup & { value? } = this.dataProvider().conf().group;

        const valObj = group.value ? group.value() : this._maxBin(group.all());

        return this.dataProvider().conf().valueAccessor(valObj);
    }

    /**
     * Gets or sets an optional object specifying HTML templates to use depending on the number
     * displayed.  The text `%number` will be replaced with the current value.
     * - one: HTML template to use if the number is 1
     * - zero: HTML template to use if the number is 0
     * - some: HTML template to use otherwise
     *
     * by default is uses `{one: '', some: '', none: ''}`
     *
     * @example
     * ```
     * numberWidget.html({
     *      one:'%number record',
     *      some:'%number records',
     *      none:'no records'})
     * ```
     */
    public html(): HTMLSpec;
    public html(html): this;
    public html(html?) {
        if (!arguments.length) {
            return this._html;
        }
        if (html.none) {
            this._html.none = html.none; // if none available
        } else if (html.one) {
            this._html.none = html.one; // if none not available use one
        } else if (html.some) {
            this._html.none = html.some; // if none and one not available use some
        }
        if (html.one) {
            this._html.one = html.one; // if one available
        } else if (html.some) {
            this._html.one = html.some; // if one not available use some
        }
        if (html.some) {
            this._html.some = html.some; // if some available
        } else if (html.one) {
            this._html.some = html.one; // if some not available use one
        }
        return this;
    }

    /**
     * Calculate and return the underlying value of the display.
     */
    public value(): number {
        return this.data();
    }

    private _maxBin(all) {
        if (!all.length) {
            return null;
        }
        const sorted = this._computeOrderedGroups(all);
        return sorted[sorted.length - 1];
    }

    protected _doRender(): this {
        const newValue: number = this.value();
        let span = this.selectAll<HTMLSpanElement, any>(`.${SPAN_CLASS}`);

        if (span.empty()) {
            span = span.data([0]).enter().append('span').attr('class', SPAN_CLASS).merge(span);
        }

        {
            const chart = this;
            span.transition()
                .duration(chart._conf.transitionDuration)
                .delay(chart._conf.transitionDelay)
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
                        const num = chart._conf.formatNumber(interp(t));
                        if (newValue === 0 && chart._html.none !== '') {
                            html = chart._html.none;
                        } else if (newValue === 1 && chart._html.one !== '') {
                            html = chart._html.one;
                        } else if (chart._html.some !== '') {
                            html = chart._html.some;
                        }
                        node.innerHTML = html ? html.replace('%number', num) : num;
                    };
                });
        }
        return this;
    }

    protected _doRedraw(): this {
        return this._doRender();
    }
}
