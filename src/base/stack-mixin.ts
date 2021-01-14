import { Stack, stack } from 'd3-shape';
import { max, min } from 'd3-array';

import { add, subtract } from '../core/utils';
import { CoordinateGridMixin } from './coordinate-grid-mixin';
import { ChartGroupType, ChartParentType, LegendItem, TitleAccessor } from '../core/types';
import { IStackMixinConf } from './i-stack-mixin-conf';
import { CFMultiAdapter } from '../data/c-f-multi-adapter';

/**
 * Stack Mixin is an mixin that provides cross-chart support of stackability using d3.stack.
 */
export class StackMixin extends CoordinateGridMixin {
    /**
     * @hidden
     */
    public _conf: IStackMixinConf;

    private _stackLayout: Stack<any, { [p: string]: number }, string>;
    private _hiddenStacks;

    protected _dataProvider: CFMultiAdapter;

    /**
     * Create a new instance.
     *
     * @see {@link BaseMixin.constructor}
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        this.configure({
            colorAccessor: d => d.name,
            hidableStacks: false,
            evadeDomainFilter: false,
        });

        this.dataProvider(new CFMultiAdapter());

        this._stackLayout = stack();

        this._hiddenStacks = {};
    }

    /**
     * @see {@link BaseMixin.configure}
     */
    public configure(conf: IStackMixinConf): this {
        super.configure(conf);
        return this;
    }

    /**
     * @see {@link BaseMixin.conf}
     */
    public conf(): IStackMixinConf {
        return this._conf;
    }

    /**
     * Stack based charts need specialized data provider that can provide more than one series
     *
     * @see {@link BaseMixin.dataProvider}.
     */
    public dataProvider(): CFMultiAdapter;
    public dataProvider(dataProvider): this;
    public dataProvider(dataProvider?) {
        if (!arguments.length) {
            return super.dataProvider();
        }
        return super.dataProvider(dataProvider);
    }

    /**
     * @category Ninja
     * @see {@link BaseMixin.data}
     */
    public data() {
        let layers: any[] = this.dataProvider().data();
        layers = layers.filter(l => this._isLayerVisible(l.name));

        if (!layers.length) {
            return [];
        }

        layers.forEach(l => {
            const allValues = l.rawData.map((d, i) => ({
                x: this._conf.keyAccessor(d, i),
                y: d._value,
                data: d,
                name: l.name,
            }));

            l.domainValues = allValues.filter(layer => this._domainFilter()(layer));
            l.values = this._conf.evadeDomainFilter ? allValues : l.domainValues;
        });

        const v4data = layers[0].values.map((v, i) => {
            const col = { x: v.x };
            layers.forEach(layer => {
                col[layer.name] = layer.values[i].y;
            });
            return col;
        });
        const keys = layers.map(layer => layer.name);
        const v4result = this.stackLayout().keys(keys)(v4data);
        v4result.forEach((series, i) => {
            series.forEach((ys, j) => {
                layers[i].values[j].y0 = ys[0];
                layers[i].values[j].y1 = ys[1];
            });
        });
        return layers;
    }

    private _domainFilter() {
        if (!this.x()) {
            return () => true;
        }
        const xDomain = this.x().domain();
        if (this.isOrdinal()) {
            // TODO #416
            // var domainSet = d3.set(xDomain);
            return () => true; // domainSet.has(p.x);
        }
        if (this._conf.elasticX) {
            return () => true;
        }
        return p => p.x >= xDomain[0] && p.x <= xDomain[xDomain.length - 1];
    }

    /**
     * Hide the stack with the given name.
     * The chart must be re-rendered for this change to appear.
     *
     * @category Intermediate
     */
    public hideStack(stackName) {
        this._hiddenStacks[stackName] = true;
        return this;
    }

    /**
     * Make stack with the given name visible.
     * The chart must be re-rendered for this change to appear.
     *
     * @category Intermediate
     */
    public showStack(stackName) {
        this._hiddenStacks[stackName] = false;
        return this;
    }

    private _isLayerVisible(layerName) {
        return !this._hiddenStacks[layerName];
    }

    /**
     * @see {@link CoordinateGridMixin.yAxisMin}
     *
     * @category Intermediate
     */
    public yAxisMin() {
        const m = min(this._flattenStack(), p => (p.y < 0 ? p.y + p.y0 : p.y0));
        return subtract(m, this._conf.yAxisPadding);
    }

    /**
     * @see {@link CoordinateGridMixin.yAxisMax}
     *
     * @category Intermediate
     */
    public yAxisMax() {
        const m = max(this._flattenStack(), p => (p.y > 0 ? p.y + p.y0 : p.y0));
        return add(m, this._conf.yAxisPadding);
    }

    // TODO: better types
    private _flattenStack(): any[] {
        // @ts-ignore     // TODO: better types
        return this.data().flatMap(layer => layer.domainValues);
    }

    /**
     * @see {@link CoordinateGridMixin.xAxisMin}
     *
     * @category Intermediate
     */
    public xAxisMin() {
        const m = min(this._flattenStack(), d => d.x);
        return subtract(m, this._conf.xAxisPadding, this._conf.xAxisPaddingUnit);
    }

    /**
     * @see {@link CoordinateGridMixin.xAxisMax}
     *
     * @category Intermediate
     */
    public xAxisMax() {
        const m = max(this._flattenStack(), d => d.x);
        return add(m, this._conf.xAxisPadding, this._conf.xAxisPaddingUnit);
    }

    /**
     * @hidden
     */
    protected titleFn(stackName: string): TitleAccessor {
        return (this._conf.titles && this._conf.titles[stackName]) || this._conf.title;
    }

    /**
     * Gets or sets the stack layout algorithm, which computes a baseline for each stack and
     * propagates it to the next.
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Stack-Layout.md | d3.stackD3v3}
     *
     * @category Ninja
     */
    public stackLayout();
    public stackLayout(_stack): this;
    public stackLayout(_stack?) {
        if (!arguments.length) {
            return this._stackLayout;
        }
        this._stackLayout = _stack;
        return this;
    }

    /**
     * @hidden
     */
    protected _ordinalXDomain() {
        const flat = this._flattenStack().map(d => d.data);
        const ordered = this._computeOrderedGroups(flat);
        return ordered.map(this._conf.keyAccessor);
    }

    /**
     * @see {@link BaseMixin.legendables}
     */
    public legendables(): LegendItem[] {
        return this.dataProvider()
            .layers()
            .map((layer, i) => ({
                chart: this,
                name: layer.name,
                hidden: !this._isLayerVisible(layer.name),
                color: this._colorHelper.getColor(layer, i),
            }));
    }

    /**
     * @hidden
     */
    public isLegendableHidden(d: LegendItem) {
        return !this._isLayerVisible(d.name);
    }

    /**
     * @hidden
     */
    public legendToggle(d: LegendItem) {
        if (this._conf.hidableStacks) {
            if (this.isLegendableHidden(d)) {
                this.showStack(d.name);
            } else {
                this.hideStack(d.name);
            }
            // _chart.redraw();
            this.renderGroup();
        }
    }
}
