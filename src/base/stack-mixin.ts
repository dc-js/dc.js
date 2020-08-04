import {Stack, stack} from 'd3-shape';
import {max, min} from 'd3-array';

import {add, subtract} from '../core/utils';
import {CoordinateGridMixin} from './coordinate-grid-mixin';
import {BaseAccessor, LegendItem, MinimalCFGroup, TitleAccessor} from '../core/types';
import {IStackMixinConf} from './i-stack-mixin-conf';

/**
 * Stack Mixin is an mixin that provides cross-chart support of stackability using d3.stack.
 * @mixin StackMixin
 * @mixes CoordinateGridMixin
 */
export class StackMixin extends CoordinateGridMixin {
    protected _conf: IStackMixinConf;

    private _stackLayout: Stack<any, { [p: string]: number }, string>;
    private _stack;
    private _titles;
    private _hidableStacks: boolean;
    private _hiddenStacks;
    private _evadeDomainFilter: boolean;

    constructor () {
        super();

        this._stackLayout = stack();

        this._stack = [];
        this._titles = {};

        this._hidableStacks = false;
        this._hiddenStacks = {};
        this._evadeDomainFilter = false;

        this.data(() => {
            const layers = this._stack.filter(l => this._visibility(l));
            if (!layers.length) {
                return [];
            }
            layers.forEach((l, i) => this._prepareValues(l, i));
            const v4data = layers[0].values.map((v, i) => {
                const col = {x: v.x};
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
        });

        this.colorAccessor(d => d.name);
    }

    public _prepareValues (layer, layerIdx) {
        const valAccessor = layer.accessor || this.valueAccessor();
        const allValues = layer.group.all().map((d, i) => ({
            x: this.keyAccessor()(d, i),
            y: valAccessor(d, i),
            data: d,
            name: layer.name
        }));

        layer.domainValues = allValues.filter(l => this._domainFilter()(l));
        layer.values = this.evadeDomainFilter() ? allValues : layer.domainValues;
    }

    public _domainFilter () {
        if (!this.x()) {
            return () => true;
        }
        const xDomain = this.x().domain();
        if (this.isOrdinal()) {
            // TODO #416
            // var domainSet = d3.set(xDomain);
            return () => true // domainSet.has(p.x);
            ;
        }
        if (this.elasticX()) {
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
    public stack ();
    public stack (group, name?, accessor?): this;
    public stack (group?, name?, accessor?) {
        if (!arguments.length) {
            return this._stack;
        }

        if (arguments.length <= 2) {
            accessor = name;
        }

        const layer: {[key: string]: any} = {group};
        if (typeof name === 'string') {
            layer.name = name;
        } else {
            layer.name = String(this._stack.length);
        }
        if (typeof accessor === 'function') {
            layer.accessor = accessor;
        }
        this._stack.push(layer);

        return this;
    }

    public group (): MinimalCFGroup;
    public group (g: MinimalCFGroup, n?: string, f?: BaseAccessor<any>): this;
    public group (g?, n?, f?) {
        if (!arguments.length) {
            return super.group();
        }
        this._stack = [];
        this._titles = {};
        this.stack(g, n);
        if (f) {
            this.valueAccessor(f);
        }
        return super.group(g, n);
    }

    /**
     * Allow named stacks to be hidden or shown by clicking on legend items.
     * This does not affect the behavior of hideStack or showStack.
     * @param {Boolean} [hidableStacks=false]
     * @returns {Boolean|StackMixin}
     */
    public hidableStacks (hidableStacks) {
        if (!arguments.length) {
            return this._hidableStacks;
        }
        this._hidableStacks = hidableStacks;
        return this;
    }

    public _findLayerByName (n) {
        const i = this._stack.map(d => d.name).indexOf(n);
        return this._stack[i];
    }

    /**
     * Hide all stacks on the chart with the given name.
     * The chart must be re-rendered for this change to appear.
     * @param {String} stackName
     * @returns {StackMixin}
     */
    public hideStack (stackName) {
        this._hiddenStacks[stackName] = true;
        return this;
    }

    /**
     * Show all stacks on the chart with the given name.
     * The chart must be re-rendered for this change to appear.
     * @param {String} stackName
     * @returns {StackMixin}
     */
    public showStack (stackName) {
        this._hiddenStacks[stackName] = false;
        return this;
    }

    public getValueAccessorByIndex (index) {
        return this._stack[index].accessor || this.valueAccessor();
    }

    public yAxisMin () {
        const m = min(this._flattenStack(), p => (p.y < 0) ? (p.y + p.y0) : p.y0);
        return subtract(m, this.yAxisPadding());
    }

    public yAxisMax () {
        const m = max(this._flattenStack(), p => (p.y > 0) ? (p.y + p.y0) : p.y0);
        return add(m, this.yAxisPadding());
    }

    public _flattenStack () {
        // A round about way to achieve flatMap
        // When target browsers support flatMap, just replace map -> flatMap, no concat needed
        const values = this.data().map(layer => layer.domainValues);
        return [].concat(...values);
    }

    public xAxisMin () {
        const m = min(this._flattenStack(), d => d.x);
        return subtract(m, this.xAxisPadding(), this.xAxisPaddingUnit());
    }

    public xAxisMax () {
        const m = max(this._flattenStack(), d => d.x);
        return add(m, this.xAxisPadding(), this.xAxisPaddingUnit());
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
    public title (): TitleAccessor;
    public title (stackName); // TODO: actually TitleAccessor, however conflicts with base class signature
    public title (stackName, titleAccessor): this;
    public title (stackName?, titleAccessor?) {
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
    public stackLayout ();
    public stackLayout (_stack): this;
    public stackLayout (_stack?) {
        if (!arguments.length) {
            return this._stackLayout;
        }
        this._stackLayout = _stack;
        return this;
    }

    /**
     * Since dc.js 2.0, there has been {@link https://github.com/dc-js/dc.js/issues/949 an issue}
     * where points are filtered to the current domain. While this is a useful optimization, it is
     * incorrectly implemented: the next point outside the domain is required in order to draw lines
     * that are clipped to the bounds, as well as bars that are partly clipped.
     *
     * A fix will be included in dc.js 2.1.x, but a workaround is needed for dc.js 2.0 and until
     * that fix is published, so set this flag to skip any filtering of points.
     *
     * Once the bug is fixed, this flag will have no effect, and it will be deprecated.
     * @param {Boolean} [evadeDomainFilter=false]
     * @returns {Boolean|StackMixin}
     */
    public evadeDomainFilter ();
    public evadeDomainFilter (evadeDomainFilter): this;
    public evadeDomainFilter (evadeDomainFilter?) {
        if (!arguments.length) {
            return this._evadeDomainFilter;
        }
        this._evadeDomainFilter = evadeDomainFilter;
        return this;
    }

    public _visibility (l) {
        return !this._hiddenStacks[l.name];
    }

    public _ordinalXDomain () {
        const flat = this._flattenStack().map(d => d.data);
        const ordered = this._computeOrderedGroups(flat);
        return ordered.map(this.keyAccessor());
    }

    public legendables (): LegendItem[] {
        return this._stack.map((layer, i) => ({
            chart: this,
            name: layer.name,
            hidden: !this._visibility(layer),
            color: this.getColor(layer, i)
        }));
    }

    public isLegendableHidden (d: LegendItem) {
        const layer = this._findLayerByName(d.name);
        return layer ? !this._visibility(layer) : false;
    }

    public legendToggle (d: LegendItem) {
        if (this._hidableStacks) {
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
