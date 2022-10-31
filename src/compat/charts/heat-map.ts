import { HeatMap as HeatMapNeo } from '../../charts/heat-map.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { ColorMixinExt } from '../base/color-mixin.js';
import {
    BaseAccessor,
    ChartGroupType,
    ChartParentType,
    CompareFn,
    HeatMapClickHandler,
} from '../../core/types.js';
import { MarginMixinExt } from '../base/margin-mixin.js';

export class HeatMap extends ColorMixinExt(MarginMixinExt(BaseMixinExt(HeatMapNeo))) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Set or get the column label function. The chart class uses this function to render
     * column labels on the X axis. It is passed the column name.
     * @example
     * // the default label function just returns the name
     * chart.colsLabel(function(d) { return d; });
     * @param [labelFunction=function(d) { return d; }]
     */
    public colsLabel(): BaseAccessor<any>;
    public colsLabel(labelFunction: BaseAccessor<any>): this;
    public colsLabel(labelFunction?) {
        if (!arguments.length) {
            return this._conf.colsLabel;
        }
        this.configure({ colsLabel: labelFunction });
        return this;
    }

    /**
     * Set or get the row label function. The chart class uses this function to render
     * row labels on the Y axis. It is passed the row name.
     * @example
     * // the default label function just returns the name
     * chart.rowsLabel(function(d) { return d; });
     * @param [labelFunction=function(d) { return d; }]
     */
    public rowsLabel(): BaseAccessor<any>;
    public rowsLabel(labelFunction: BaseAccessor<any>): this;
    public rowsLabel(labelFunction?) {
        if (!arguments.length) {
            return this._conf.rowsLabel;
        }
        this.configure({ rowsLabel: labelFunction });
        return this;
    }

    /**
     * Gets or sets the values used to create the rows of the heatmap, as an array. By default, all
     * the values will be fetched from the data using the value accessor.
     */
    public rows();
    public rows(rows): this;
    public rows(rows?) {
        if (!arguments.length) {
            return this._conf.rows;
        }
        this.configure({ rows: rows });
        return this;
    }

    /**
     * Get or set a comparator to order the rows.
     * Default is {@link https://github.com/d3/d3-array#ascending d3.ascending}.
     */
    public rowOrdering(): CompareFn;
    public rowOrdering(rowOrdering: CompareFn): this;
    public rowOrdering(rowOrdering?) {
        if (!arguments.length) {
            return this._conf.rowOrdering;
        }
        this.configure({ rowOrdering: rowOrdering });
        return this;
    }

    /**
     * Gets or sets the keys used to create the columns of the heatmap, as an array. By default, all
     * the values will be fetched from the data using the key accessor.
     */
    public cols();
    public cols(cols): this;
    public cols(cols?) {
        if (!arguments.length) {
            return this._conf.cols;
        }
        this.configure({ cols: cols });
        return this;
    }

    /**
     * Get or set a comparator to order the columns.
     * Default is  {@link https://github.com/d3/d3-array#ascending d3.ascending}.
     */
    public colOrdering(): CompareFn;
    public colOrdering(colOrdering: CompareFn): this;
    public colOrdering(colOrdering?) {
        if (!arguments.length) {
            return this._conf.colOrdering;
        }
        this.configure({ colOrdering: colOrdering });
        return this;
    }

    /**
     * Gets or sets the handler that fires when an individual cell is clicked in the heatmap.
     * By default, filtering of the cell will be toggled.
     * @example
     * // default box on click handler
     * chart.boxOnClick(function (d) {
     *     var filter = d.key;
     *     events.trigger(function () {
     *         _chart.filter(filter);
     *         _chart.redrawGroup();
     *     });
     * });
     */
    public boxOnClick(): HeatMapClickHandler;
    public boxOnClick(handler: HeatMapClickHandler): this;
    public boxOnClick(handler?) {
        if (!arguments.length) {
            return this._conf.boxOnClick;
        }
        this.configure({ boxOnClick: handler });
        return this;
    }

    /**
     * Gets or sets the handler that fires when a column tick is clicked in the x axis.
     * By default, if any cells in the column are unselected, the whole column will be selected,
     * otherwise the whole column will be unselected.
     */
    public xAxisOnClick(): HeatMapClickHandler;
    public xAxisOnClick(handler: HeatMapClickHandler): this;
    public xAxisOnClick(handler?) {
        if (!arguments.length) {
            return this._conf.xAxisOnClick;
        }
        this.configure({ xAxisOnClick: handler });
        return this;
    }

    /**
     * Gets or sets the handler that fires when a row tick is clicked in the y axis.
     * By default, if any cells in the row are unselected, the whole row will be selected,
     * otherwise the whole row will be unselected.
     */
    public yAxisOnClick(): HeatMapClickHandler;
    public yAxisOnClick(handler: HeatMapClickHandler): this;
    public yAxisOnClick(handler?) {
        if (!arguments.length) {
            return this._conf.yAxisOnClick;
        }
        this.configure({ yAxisOnClick: handler });
        return this;
    }

    /**
     * Gets or sets the X border radius.  Set to 0 to get full rectangles.
     * @param [xBorderRadius=6.75]
     */
    public xBorderRadius(): number;
    public xBorderRadius(xBorderRadius: number): this;
    public xBorderRadius(xBorderRadius?) {
        if (!arguments.length) {
            return this._conf.xBorderRadius;
        }
        this.configure({ xBorderRadius: xBorderRadius });
        return this;
    }

    /**
     * Gets or sets the Y border radius.  Set to 0 to get full rectangles.
     * @param [yBorderRadius=6.75]
     */
    public yBorderRadius(): number;
    public yBorderRadius(yBorderRadius: number): this;
    public yBorderRadius(yBorderRadius?) {
        if (!arguments.length) {
            return this._conf.yBorderRadius;
        }
        this.configure({ yBorderRadius: yBorderRadius });
        return this;
    }
}

export const heatMap = (parent: ChartParentType, chartGroup: ChartGroupType) =>
    new HeatMap(parent, chartGroup);
