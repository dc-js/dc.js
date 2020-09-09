import { Stack, stack } from 'd3-shape';
import { max, min } from 'd3-array';

import { add, subtract } from '../core/utils';
import { CoordinateGridMixin } from './coordinate-grid-mixin';
import { BaseAccessor, LegendItem, MinimalCFGroup, TitleAccessor } from '../core/types';
import { IStackMixinConf } from './i-stack-mixin-conf';
import { CFMultiAdapter, LayerSpec } from "../data/c-f-multi-adapter";

/**
 * Stack Mixin is an mixin that provides cross-chart support of stackability using d3.stack.
 * @mixin StackMixin
 * @mixes CoordinateGridMixin
 */
export class StackMixin extends CoordinateGridMixin {
    public _conf: IStackMixinConf;

    private _stackLayout: Stack<any, { [p: string]: number }, string>;
    private _titles;
    private _hiddenStacks;

    protected _dataProvider: CFMultiAdapter;

    constructor() {
        super();

        this.configure({
            colorAccessor: d => d.name,
            hidableStacks: false,
            evadeDomainFilter: false,
        });

        this._dataProvider = new CFMultiAdapter();

        this._stackLayout = stack();

        this._titles = {};

        this._hiddenStacks = {};
    }

    public configure(conf: IStackMixinConf): this {
        super.configure(conf);
        return this;
    }

    public conf(): IStackMixinConf {
        return this._conf;
    }

    public data() {
        let layers: any[] = this._dataProvider.data();
        layers = layers.filter(l => this._visibility(l));

        if (!layers.length) {
            return [];
        }

        layers.forEach((l, i) => {
            const allValues = l.rawData.map((d, i) => ({
                x: this._conf.keyAccessor(d, i),
                y: d._value,
                data: d,
                name: l.name,
            }));

            l.domainValues = allValues.filter(l => this._domainFilter()(l));
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

    public _domainFilter() {
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
     * Stack a new crossfilter group onto this chart with an optional custom value accessor. All stacks
     * in the same chart will share the same key accessor and therefore the same set of keys.
     *
     * For example, in a stacked bar chart, the bars of each stack will be positioned using the same set
     * of keys on the x axis, while stacked vertically. If name is specified then it will be used to
     * generate the legend label.
     * @see {@link https://github.com/crossfilter/crossfilter/wiki/API-Reference#group-map-reduce crossfilter.group}
     * @example
     * // stack group using default accessor
     * chart.stack(valueSumGroup)
     * // stack group using custom accessor
     * .stack(avgByDayGroup, function(d){return d.value.avgByDay;});
     * @param {crossfilter.group} group
     * @param {String} [name]
     * @param {Function} [accessor]
     * @returns {Array<{group: crossfilter.group, name: String, accessor: Function}>|StackMixin}
     */
    public stack();
    public stack(group, name?, accessor?): this;
    public stack(group?, name?, accessor?) {
        const stack = this._dataProvider.conf().layers;
        if (!arguments.length) {
            return stack;
        }

        if (arguments.length <= 2) {
            accessor = name;
        }

        name = typeof name === "string" ? name : String(stack.length);
        const layer: LayerSpec = { group, name };
        if (typeof accessor === 'function') {
            layer.valueAccessor = accessor;
        }
        // @ts-ignore
        stack.push(layer);

        return this;
    }

    public group(): MinimalCFGroup;
    public group(g: MinimalCFGroup, n?: string, f?: BaseAccessor<any>): this;
    public group(g?, n?, f?) {
        if (!arguments.length) {
            return super.group();
        }
        this._dataProvider.configure({
            layers: [],
        });
        this._titles = {};
        this.stack(g, n);
        if (f) {
            this._dataProvider.configure({ valueAccessor: f });
        }
        return super.group(g, n);
    }

    public _findLayerByName(n) {
        const stack = this._dataProvider.conf().layers;
        const i = stack.map(d => d.name).indexOf(n);
        return stack[i];
    }

    /**
     * Hide all stacks on the chart with the given name.
     * The chart must be re-rendered for this change to appear.
     * @param {String} stackName
     * @returns {StackMixin}
     */
    public hideStack(stackName) {
        this._hiddenStacks[stackName] = true;
        return this;
    }

    /**
     * Show all stacks on the chart with the given name.
     * The chart must be re-rendered for this change to appear.
     * @param {String} stackName
     * @returns {StackMixin}
     */
    public showStack(stackName) {
        this._hiddenStacks[stackName] = false;
        return this;
    }

    public yAxisMin() {
        const m = min(this._flattenStack(), p => (p.y < 0 ? p.y + p.y0 : p.y0));
        return subtract(m, this._conf.yAxisPadding);
    }

    public yAxisMax() {
        const m = max(this._flattenStack(), p => (p.y > 0 ? p.y + p.y0 : p.y0));
        return add(m, this._conf.yAxisPadding);
    }

    public _flattenStack() {
        // A round about way to achieve flatMap
        // When target browsers support flatMap, just replace map -> flatMap, no concat needed
        const values = this.data().map(layer => layer.domainValues);
        return [].concat(...values);
    }

    public xAxisMin() {
        const m = min(this._flattenStack(), d => d.x);
        return subtract(m, this._conf.xAxisPadding, this._conf.xAxisPaddingUnit);
    }

    public xAxisMax() {
        const m = max(this._flattenStack(), d => d.x);
        return add(m, this._conf.xAxisPadding, this._conf.xAxisPaddingUnit);
    }

    /**
     * Set or get the title function. Chart class will use this function to render svg title (usually interpreted by
     * browser as tooltips) for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart.
     * Almost every chart supports title function however in grid coordinate chart you need to turn off brush in order to
     * use title otherwise the brush layer will block tooltip trigger.
     *
     * If the first argument is a stack name, the title function will get or set the title for that stack. If stackName
     * is not provided, the first stack is implied.
     * @example
     * // set a title function on 'first stack'
     * chart.title('first stack', function(d) { return d.key + ': ' + d.value; });
     * // get a title function from 'second stack'
     * var secondTitleFunction = chart.title('second stack');
     * @param {String} [stackName]
     * @param {Function} [titleAccessor]
     * @returns {String|StackMixin}
     */
    public title(): TitleAccessor;
    public title(stackName); // TODO: actually TitleAccessor, however conflicts with base class signature
    public title(stackName, titleAccessor): this;
    public title(stackName?, titleAccessor?) {
        if (!stackName) {
            return super.title();
        }

        if (typeof stackName === 'function') {
            return super.title(stackName);
        }
        if (stackName === this._groupName && typeof titleAccessor === 'function') {
            return super.title(titleAccessor);
        }

        if (typeof titleAccessor !== 'function') {
            return this._titles[stackName] || super.title();
        }

        this._titles[stackName] = titleAccessor;

        return this;
    }

    /**
     * Gets or sets the stack layout algorithm, which computes a baseline for each stack and
     * propagates it to the next.
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Stack-Layout.md d3.stackD3v3}
     * @param {Function} [_stack=d3.stackD3v3]
     * @returns {Function|StackMixin}
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

    public _visibility(l) {
        return !this._hiddenStacks[l.name];
    }

    public _ordinalXDomain() {
        const flat = this._flattenStack().map(d => d.data);
        const ordered = this._computeOrderedGroups(flat);
        return ordered.map(this._conf.keyAccessor);
    }

    public legendables(): LegendItem[] {
        const stack = this._dataProvider.conf().layers;
        return stack.map((layer, i) => ({
            chart: this,
            name: layer.name,
            hidden: !this._visibility(layer),
            color: this.getColor(layer, i),
        }));
    }

    public isLegendableHidden(d: LegendItem) {
        const layer = this._findLayerByName(d.name);
        return layer ? !this._visibility(layer) : false;
    }

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
