import { ICompositeChartConf } from './i-composite-chart-conf';
import { LineChart } from './line-chart';
import { BaseAccessor, CompareFn } from '../core/types';

export type LineChartFunction = (parent, chartGroup) => LineChart;

export interface ISeriesChartConf extends ICompositeChartConf {
    readonly valueSort?: CompareFn;
    readonly seriesSort?: CompareFn;
    readonly seriesAccessor?: BaseAccessor<string>;
    readonly chartFunction?: LineChartFunction;
}
