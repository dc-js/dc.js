import {CboxMenu as CboxMenuNeo} from '../../charts/cbox-menu';
import {BaseMixinExt} from '../base/base-mixin';
import {ChartGroupType, ChartParentType, CompareFn} from '../../core/types';

export class CboxMenu extends BaseMixinExt(CboxMenuNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
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
    public order (): CompareFn;
    public order (order: CompareFn): this;
    public order (order?) {
        if (!arguments.length) {
            return this._conf.order;
        }
        this.configure({order: order});
        return this;
    }

    /**
     * Get or set the text displayed in the options used to prompt selection.
     * @param {String} [promptText='Select all']
     * @returns {String|CboxMenu}
     * @example
     * chart.promptText('All states');
     */
    public promptText (): string;
    public promptText (promptText: string): this;
    public promptText (promptText?) {
        if (!arguments.length) {
            return this._conf.promptText;
        }
        this.configure({promptText: promptText});
        return this;
    }

    /**
     * Get or set the function that filters options prior to display. By default only options
     * with a value > 0 are displayed.
     * @param {function} [filterDisplayed]
     * @returns {Function|CboxMenu}
     * @example
     * // display all options override the `filterDisplayed` function:
     * chart.filterDisplayed(function () {
     *     return true;
     * });
     */
    public filterDisplayed (): (d) => boolean;
    public filterDisplayed (filterDisplayed: (d) => boolean): this;
    public filterDisplayed (filterDisplayed?) {
        if (!arguments.length) {
            return this._conf.filterDisplayed;
        }
        this.configure({filterDisplayed: filterDisplayed});
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
    public multiple (): boolean;
    public multiple (multiple: boolean): this;
    public multiple (multiple?) {
        if (!arguments.length) {
            return this._conf.multiple;
        }
        this.configure({multiple: multiple});
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
    public promptValue ();
    public promptValue (promptValue): this;
    public promptValue (promptValue?) {
        if (!arguments.length) {
            return this._conf.promptValue;
        }
        this.configure({promptValue: promptValue});

        return this;
    }
}

export const cboxMenu = (parent: ChartParentType, chartGroup: ChartGroupType) => new CboxMenu(parent, chartGroup);
