import { ascending } from 'd3-array';

import { CompositeChart } from './composite-chart';
import { LineChart } from './line-chart';
import { ChartGroupType, ChartParentType } from '../core/types';
import { ISeriesChartConf } from './i-series-chart-conf';
import { compatNestHelper } from '../core/d3compat';
import { ICFMultiAdapterConf } from '../data/c-f-multi-adapter';

/**
 * A series chart is a chart that shows multiple series of data overlaid on one chart, where the
 * series is specified in the data. It is a specialization of Composite Chart and inherits all
 * composite features other than recomposing the chart.
 *
 * Examples:
 * - {@link http://dc-js.github.io/dc.js/examples/series.html Series Chart}
 * @mixes CompositeChart
 */
export class SeriesChart extends CompositeChart {
    public _conf: ISeriesChartConf;

    private _charts: { [key: string]: LineChart };

    /**
     * Create a Series Chart.
     * @example
     * // create a series chart under #chart-container1 element using the default global chart group
     * var seriesChart1 = new SeriesChart("#chart-container1");
     * // create a series chart under #chart-container2 element using chart group A
     * var seriesChart2 = new SeriesChart("#chart-container2", "chartGroupA");
     * @param {String|node|d3.selection} parent - Any valid
     * {@link https://github.com/d3/d3-selection/blob/master/README.md#select d3 single selector} specifying
     * a dom block element such as a div; or a dom element or d3 selection.
     * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
     * Interaction with a chart will only trigger events and redraws within the chart's group.
     */
    constructor(parent: ChartParentType, chartGroup: ChartGroupType) {
        super(parent, chartGroup);

        // This must precede the call to configure as that trigger _resetChildren which needs _charts to be a hash
        this._charts = {};

        this.configure({
            shareColors: true,
            chartFunction: (p, cg) => new LineChart(p, cg),
            seriesAccessor: undefined,
            seriesSort: ascending,
            valueSort: (a, b) => ascending(this._conf.keyAccessor(a), this._conf.keyAccessor(b)),
        });

        this._mandatoryAttributes().push('seriesAccessor', 'chart');
    }

    public configure(conf: ISeriesChartConf): this {
        super.configure(conf);

        // TODO: This is defensive, looking at the code - 'seriesAccessor', 'seriesSort', 'valueSort' do not need it
        if (
            ['chartFunction', 'seriesAccessor', 'seriesSort', 'valueSort'].some(opt => opt in conf)
        ) {
            this._resetChildren();
        }

        return this;
    }

    public conf(): ISeriesChartConf {
        return this._conf;
    }

    private _compose(subChartArray: LineChart[]): void {
        super.compose(subChartArray);
    }

    public compose(subChartArray): this {
        throw new Error('Not supported for this chart type');
    }

    public _preprocessData() {
        const keep: string[] = [];
        let childrenChanged: boolean;

        const nesting = compatNestHelper({
            key: this._conf.seriesAccessor,
            sortKeys: this._conf.seriesSort,
            sortValues: this._conf.valueSort,
            entries: this.data(),
        });

        const children = nesting.map((sub, i) => {
            const subChart =
                this._charts[sub.key] || this._conf.chartFunction(this, this.chartGroup());
            if (!this._charts[sub.key]) {
                childrenChanged = true;
            }
            this._charts[sub.key] = subChart;
            keep.push(sub.key);
            subChart.dataProvider().configure({
                dimension: this.dataProvider().conf().dimension,
                valueAccessor: this.dataProvider().conf().valueAccessor,
                groupName: sub.key,
                group: {
                    all: typeof sub.values === 'function' ? sub.values : () => sub.values,
                },
            });
            subChart.configure({
                keyAccessor: this._conf.keyAccessor,
            });
            return subChart.brushOn(false);
        });
        // this works around the fact compositeChart doesn't really
        // have a removal interface
        Object.keys(this._charts)
            .filter(c => keep.indexOf(c) === -1)
            .forEach(c => {
                this._clearChart(c);
                childrenChanged = true;
            });
        this._compose(children);
        if (childrenChanged && this.legend()) {
            this.legend().render();
        }
    }

    private _clearChart(c: string): void {
        if (this._charts[c].g()) {
            this._charts[c].g().remove();
        }
        delete this._charts[c];
    }

    private _resetChildren(): void {
        Object.keys(this._charts).map(this._clearChart);
        this._charts = {};
    }
}
