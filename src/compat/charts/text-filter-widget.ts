import {TextFilterWidget as TextFilterWidgetNeo} from '../../charts/text-filter-widget';
import {BaseMixinExt} from '../base/base-mixin';
import {BaseAccessor, ChartGroupType, ChartParentType} from '../../core/types';

export class TextFilterWidget extends BaseMixinExt(TextFilterWidgetNeo) {
    constructor (parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * This function will be called on values before calling the filter function.
     * @example
     * // This is the default
     * chart.normalize(function (s) {
     *   return s.toLowerCase();
     * });
     * @param {function} [normalize]
     * @returns {TextFilterWidget|function}
     */
    public normalize (): (s) => string;
    public normalize (normalize: (s) => string): this;
    public normalize (normalize?) {
        if (!arguments.length) {
            return this._conf.normalize;
        }
        this.configure({normalize: normalize});
        return this;
    }

    /**
     * Placeholder text in the search box.
     * @example
     * // This is the default
     * chart.placeHolder('type to filter');
     * @param {function} [placeHolder='search']
     * @returns {TextFilterWidget|string}
     */
    public placeHolder (): string;
    public placeHolder (placeHolder: string): this;
    public placeHolder (placeHolder?) {
        if (!arguments.length) {
            return this._conf.placeHolder;
        }
        this.configure({placeHolder: placeHolder});
        return this;
    }

    /**
     * This function will be called with the search text, it needs to return a function that will be used to
     * filter the data. The default function checks presence of the search text.
     * @example
     * // This is the default
     * function (query) {
     *     query = _normalize(query);
     *     return function (d) {
     *         return _normalize(d).indexOf(query) !== -1;
     *     };
     * };
     * @param {function} [filterFunctionFactory]
     * @returns {TextFilterWidget|function}
     */
    public filterFunctionFactory (): (query) => BaseAccessor<boolean>;
    public filterFunctionFactory (filterFunctionFactory: (query) => BaseAccessor<boolean>): this;
    public filterFunctionFactory (filterFunctionFactory?) {
        if (!arguments.length) {
            return this._conf.filterFunctionFactory;
        }
        this.configure({filterFunctionFactory: filterFunctionFactory});
        return this;
    }
}

export const textFilterWidget = (parent: ChartParentType, chartGroup: ChartGroupType) => new TextFilterWidget(parent, chartGroup);
