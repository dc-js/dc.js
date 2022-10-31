import { SelectMenu as SelectMenuNeo } from '../../charts/select-menu.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { BaseAccessor, ChartGroupType, ChartParentType, CompareFn } from '../../core/types.js';
import { logger } from '../core/logger.js';

export class SelectMenu extends BaseMixinExt(SelectMenuNeo) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Get or set the function that controls the ordering of option tags in the
     * select menu. By default options are ordered by the group key in ascending
     * order.
     * @example
     * // order by the group's value
     * chart.order(function (a,b) {
     *     return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
     * });
     */
    public order(): CompareFn;
    public order(order: CompareFn): this;
    public order(order?) {
        if (!arguments.length) {
            return this._conf.order;
        }
        this.configure({ order: order });
        return this;
    }

    /**
     * Get or set the text displayed in the options used to prompt selection.
     * @param [promptText='Select all']
     * @example
     * chart.promptText('All states');
     */
    public promptText(): string;
    public promptText(promptText: string): this;
    public promptText(promptText?) {
        if (!arguments.length) {
            return this._conf.promptText;
        }
        this.configure({ promptText: promptText });
        return this;
    }

    /**
     * Get or set the function that filters option tags prior to display. By default options
     * with a value of < 1 are not displayed.
     * @example
     * // display all options override the `filterDisplayed` function:
     * chart.filterDisplayed(function () {
     *     return true;
     * });
     */
    public filterDisplayed(): BaseAccessor<boolean>;
    public filterDisplayed(filterDisplayed: BaseAccessor<boolean>): this;
    public filterDisplayed(filterDisplayed?) {
        if (!arguments.length) {
            return this._conf.filterDisplayed;
        }
        this.configure({ filterDisplayed: filterDisplayed });
        return this;
    }

    /**
     * Controls the type of select menu. Setting it to true converts the underlying
     * HTML tag into a multiple select.
     * @param [multiple=false]
     * @example
     * chart.multiple(true);
     */
    public multiple(): boolean;
    public multiple(multiple: boolean): this;
    public multiple(multiple?) {
        if (!arguments.length) {
            return this._conf.multiple;
        }
        this.configure({ multiple: multiple });

        return this;
    }

    /**
     * Controls the default value to be used for
     * [dimension.filter](https://github.com/crossfilter/crossfilter/wiki/API-Reference#dimension_filter)
     * when only the prompt value is selected. If `null` (the default), no filtering will occur when
     * just the prompt is selected.
     */
    public promptValue(): string;
    public promptValue(promptValue: string): this;
    public promptValue(promptValue?) {
        if (!arguments.length) {
            return this._conf.promptValue;
        }
        this.configure({ promptValue: promptValue });

        return this;
    }

    /**
     * Controls the number of items to show in the select menu, when `.multiple()` is true. This
     * controls the [`size` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#Attributes) of
     * the `select` element. If `null` (the default), uses the browser's default height.
     * @example
     * chart.numberVisible(10);
     */
    public numberVisible(): number;
    public numberVisible(numberVisible: number): this;
    public numberVisible(numberVisible?) {
        if (!arguments.length) {
            return this._conf.numberVisible;
        }
        this.configure({ numberVisible: numberVisible });

        return this;
    }

    public size(): number;
    public size(numberVisible: number): this;
    public size(numberVisible?) {
        logger.warnOnce('selectMenu.size is ambiguous - use selectMenu.numberVisible instead');
        if (!arguments.length) {
            return this.numberVisible();
        }
        return this.numberVisible(numberVisible);
    }
}

export const selectMenu = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new SelectMenu(parent, chartGroup);
