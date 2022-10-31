import { ScatterPlot as ScatterPlotNeo } from '../../charts/scatter-plot.js';
import { BaseMixinExt } from '../base/base-mixin.js';
import { ColorMixinExt } from '../base/color-mixin.js';
import { BaseAccessor, ChartGroupType, ChartParentType } from '../../core/types.js';
import { MarginMixinExt } from '../base/margin-mixin.js';
import { CoordinateGridMixinExt } from '../base/coordinate-grid-mixin.js';

export class ScatterPlot extends CoordinateGridMixinExt(
    ColorMixinExt(MarginMixinExt(BaseMixinExt(ScatterPlotNeo)))
) {
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);
    }

    /**
     * Set or get whether to use canvas backend for plotting scatterPlot. Note that the
     * canvas backend does not currently support
     * {@link ScatterPlot.customSymbol customSymbol} or
     * {@link ScatterPlot.symbol symbol} methods and is limited to always plotting
     * with filled circles. Symbols are drawn with
     * {@link ScatterPlot.symbolSize symbolSize} radius. By default, the SVG backend
     * is used when `useCanvas` is set to `false`.
     * @param [useCanvas=false]
     */
    public useCanvas(): boolean;
    public useCanvas(useCanvas: boolean): this;
    public useCanvas(useCanvas?) {
        if (!arguments.length) {
            return this._conf.useCanvas;
        }
        this.configure({ useCanvas: useCanvas });
        return this;
    }

    /**
     * Get or set the existence accessor.  If a point exists, it is drawn with
     * {@link ScatterPlot.symbolSize symbolSize} radius and
     * opacity 1; if it does not exist, it is drawn with
     * {@link ScatterPlot.emptySize emptySize} radius and opacity 0. By default,
     * the existence accessor checks if the reduced value is truthy.
     * @see {@link ScatterPlot.symbolSize symbolSize}
     * @see {@link ScatterPlot.emptySize emptySize}
     * @example
     * // default accessor
     * chart.existenceAccessor(function (d) { return d.value; });
     */
    public existenceAccessor(): BaseAccessor<any>;
    public existenceAccessor(accessor: BaseAccessor<any>): this;
    public existenceAccessor(accessor?) {
        if (!arguments.length) {
            return this._conf.existenceAccessor;
        }
        this.configure({ existenceAccessor: accessor });
        return this;
    }

    /**
     * Set or get radius for highlighted symbols.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param [highlightedSize=5]
     */
    public highlightedSize(): number;
    public highlightedSize(highlightedSize: number): this;
    public highlightedSize(highlightedSize?) {
        if (!arguments.length) {
            return this._conf.highlightedSize;
        }
        this.configure({ highlightedSize: highlightedSize });
        return this;
    }

    /**
     * Set or get size for symbols excluded from this chart's filter. If null, no
     * special size is applied for symbols based on their filter status.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param [excludedSize=null]
     */
    public excludedSize(): number;
    public excludedSize(excludedSize: number): this;
    public excludedSize(excludedSize?) {
        if (!arguments.length) {
            return this._conf.excludedSize;
        }
        this.configure({ excludedSize: excludedSize });
        return this;
    }

    /**
     * Set or get color for symbols excluded from this chart's filter. If null, no
     * special color is applied for symbols based on their filter status.
     * @param [excludedColor=null]
     */
    public excludedColor(): string;
    public excludedColor(excludedColor: string): this;
    public excludedColor(excludedColor?) {
        if (!arguments.length) {
            return this._conf.excludedColor;
        }
        this.configure({ excludedColor: excludedColor });
        return this;
    }

    /**
     * Set or get opacity for symbols excluded from this chart's filter.
     * @param [excludedOpacity=1.0]
     */
    public excludedOpacity(): number;
    public excludedOpacity(excludedOpacity: number): this;
    public excludedOpacity(excludedOpacity?) {
        if (!arguments.length) {
            return this._conf.excludedOpacity;
        }
        this.configure({ excludedOpacity: excludedOpacity });
        return this;
    }

    /**
     * Set or get radius for symbols when the group is empty.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param [emptySize=0]
     */
    public emptySize(): number;
    public emptySize(emptySize: number): this;
    public emptySize(emptySize?) {
        if (!arguments.length) {
            return this._conf.emptySize;
        }
        this.configure({ emptySize: emptySize });
        return this;
    }

    public hiddenSize(): number;
    public hiddenSize(emptySize: number): this;
    public hiddenSize(emptySize?) {
        if (!arguments.length) {
            return this.emptySize();
        }
        return this.emptySize(emptySize);
    }

    /**
     * Set or get color for symbols when the group is empty. If null, just use the
     * {@link ColorMixin.colors colorMixin.colors} color scale zero value.
     * @param [emptyColor=null]
     */
    public emptyColor(): string;
    public emptyColor(emptyColor: string): this;
    public emptyColor(emptyColor?) {
        if (!arguments.length) {
            return this._conf.emptyColor;
        }
        this.configure({ emptyColor: emptyColor });
        return this;
    }

    /**
     * Set or get opacity for symbols when the group is empty.
     * @param [emptyOpacity=0]
     */
    public emptyOpacity(): number;
    public emptyOpacity(emptyOpacity: number): this;
    public emptyOpacity(emptyOpacity?) {
        if (!arguments.length) {
            return this._conf.emptyOpacity;
        }
        this.configure({ emptyOpacity: emptyOpacity });
        return this;
    }

    /**
     * Set or get opacity for symbols when the group is not empty.
     * @param [nonemptyOpacity=1]
     */
    public nonemptyOpacity(): number;
    public nonemptyOpacity(nonemptyOpacity: number): this;
    public nonemptyOpacity(nonemptyOpacity?) {
        if (!arguments.length) {
            return this._conf.emptyOpacity;
        }
        this.configure({ nonemptyOpacity: nonemptyOpacity });
        return this;
    }

    /**
     * Set or get radius for symbols.
     * @see {@link https://github.com/d3/d3-shape/blob/master/README.md#symbol_size d3.symbol.size}
     * @param [symbolSize=3]
     */
    public symbolSize(): number;
    public symbolSize(symbolSize: number): this;
    public symbolSize(symbolSize?) {
        if (!arguments.length) {
            return this._conf.symbolSize;
        }
        this.configure({ symbolSize: symbolSize });
        return this;
    }
}

export const scatterPlot = (parent, chartGroup) => new ScatterPlot(parent, chartGroup);
