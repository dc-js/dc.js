import crossfilter from 'crossfilter2';
import fs from 'fs';
import * as d3 from 'd3';
import { CFDataCapHelper, CFMultiAdapter, CFSimpleAdapter } from '../../index.js';
import { FilterStorage } from '../../index.js';

interface DataElement {
    volume: number;
    open: number;
    close: number;
    month: Date;
    date: string;
    dd: Date;
}

export function loadAndProcessData(dataFilePath) {
    const csvBuffer = fs.readFileSync(dataFilePath, 'utf8');
    // @ts-ignore
    const data: DataElement[] = d3.csvParse(csvBuffer);

    // Since its a csv file we need to format the data a bit.
    const dateFormatSpecifier = '%m/%d/%Y';
    const dateFormatParser = d3.timeParse(dateFormatSpecifier);

    data.forEach(d => {
        d.dd = dateFormatParser(d.date);
        d.month = d3.timeMonth(d.dd); // pre-calculate month for better performance
        d.close = +d.close; // coerce to number
        d.open = +d.open;
    });
    return data;
}

export function creatAdapter(data: DataElement[]) {
    //### Create Crossfilter Dimensions and Groups

    //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
    const ndx = crossfilter(data);
    const all = ndx.groupAll();

    // Dimension by year
    const yearlyDimension = ndx.dimension(d => d3.timeYear(d.dd).getFullYear());

    interface YearlyPerformanceGroupItem {
        fluctuationPercentage: number;
        percentageGain: number;
        avgIndex: number;
        sumIndex: number;
        fluctuation: number;
        absGain: number;
        count: number;
    }
    // Maintain running tallies by year as filters are applied or removed
    const yearlyPerformanceGroup = yearlyDimension.group().reduce(
        /* callback for when data is added to the current filter results */
        (p: YearlyPerformanceGroupItem, v) => {
            ++p.count;
            p.absGain += v.close - v.open;
            p.fluctuation += Math.abs(v.close - v.open);
            p.sumIndex += (v.open + v.close) / 2;
            p.avgIndex = p.sumIndex / p.count;
            p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
            p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
            return p;
        },
        /* callback for when data is removed from the current filter results */
        (p: YearlyPerformanceGroupItem, v) => {
            --p.count;
            p.absGain -= v.close - v.open;
            p.fluctuation -= Math.abs(v.close - v.open);
            p.sumIndex -= (v.open + v.close) / 2;
            p.avgIndex = p.count ? p.sumIndex / p.count : 0;
            p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
            p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
            return p;
        },
        /* initialize p */
        () => ({
            count: 0,
            absGain: 0,
            fluctuation: 0,
            fluctuationPercentage: 0,
            sumIndex: 0,
            avgIndex: 0,
            percentageGain: 0,
        })
    );

    // Dimension by full date
    const dateDimension = ndx.dimension(d => d.dd);

    // Dimension by month
    const moveMonths = ndx.dimension(d => d.month);
    // Group by total movement within month
    const monthlyMoveGroup = moveMonths.group().reduceSum(d => Math.abs(d.close - d.open));
    // Group by total volume within move, and scale down result
    const volumeByMonthGroup = moveMonths.group().reduceSum(d => d.volume / 500000);

    interface IndexAvgByMonthGroupItem {
        avg: number;
        total: number;
        days: number;
    }
    const indexAvgByMonthGroup = moveMonths.group().reduce(
        (p: IndexAvgByMonthGroupItem, v) => {
            ++p.days;
            p.total += (v.open + v.close) / 2;
            p.avg = Math.round(p.total / p.days);
            return p;
        },
        (p: IndexAvgByMonthGroupItem, v) => {
            --p.days;
            p.total -= (v.open + v.close) / 2;
            p.avg = p.days ? Math.round(p.total / p.days) : 0;
            return p;
        },
        () => ({ days: 0, total: 0, avg: 0 })
    );

    // Create categorical dimension
    const gainOrLoss = ndx.dimension(d => (d.open > d.close ? 'Loss' : 'Gain'));
    // Produce counts records in the dimension
    const gainOrLossGroup = gainOrLoss.group();

    // Determine a histogram of percent changes
    const fluctuation = ndx.dimension(d => Math.round(((d.close - d.open) / d.open) * 100));
    const fluctuationGroup = fluctuation.group();

    // Summarize volume by quarter
    const quarter = ndx.dimension(d => {
        const month = d.dd.getMonth();
        if (month <= 2) {
            return 'Q1';
        } else if (month > 2 && month <= 5) {
            return 'Q2';
        } else if (month > 5 && month <= 8) {
            return 'Q3';
        } else {
            return 'Q4';
        }
    });
    const quarterGroup = quarter.group().reduceSum(d => d.volume);

    // Counts per weekday
    const dayOfWeek = ndx.dimension(d => {
        const day = d.dd.getDay();
        const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${day}.${name[day]}`;
    });
    const dayOfWeekGroup = dayOfWeek.group();

    //### Data providers
    const yearlyBubbleDataProvider = new CFSimpleAdapter({
        dimension: yearlyDimension,
        //The bubble chart expects the groups are reduced to multiple values which are used
        //to generate x, y, and radius for each key (bubble) in the group
        group: yearlyPerformanceGroup,
        // `.valueAccessor` - the `Y` value will be passed to the `.y()` scale to determine pixel location
        valueAccessor: p => p.value.percentageGain,
    });

    const gainOrLossDataProvider = new CFDataCapHelper({
        dimension: gainOrLoss,
        group: gainOrLossGroup,
    });

    const quarterDataProvider = new CFSimpleAdapter({
        dimension: quarter,
        group: quarterGroup,
    });

    const dayOfWeekDataProvider = new CFSimpleAdapter({
        group: dayOfWeekGroup,
        dimension: dayOfWeek,
    });

    const fluctuationDataProvider = new CFMultiAdapter({
        dimension: fluctuation,
        layers: [{ group: fluctuationGroup }],
    });

    const moveDataProvider = new CFMultiAdapter({
        dimension: moveMonths,
        // Stack layers
        layers: [
            {
                name: 'Monthly Index Average',
                group: indexAvgByMonthGroup,
                valueAccessor: d => d.value.avg,
            },
            {
                name: 'Monthly Index Move',
                group: monthlyMoveGroup,
                valueAccessor: d => d.value,
            },
        ],
    });

    const volumeDataProvider = new CFMultiAdapter({
        dimension: moveMonths,
        layers: [
            {
                group: volumeByMonthGroup,
            },
        ],
    });

    const filterStorage = new FilterStorage();

    const dataProviders = [
        {
            chartId: 'yearly-bubble-chart',
            dataProvider: yearlyBubbleDataProvider,
        },
        {
            chartId: 'gain-loss-chart',
            dataProvider: gainOrLossDataProvider,
        },
        {
            chartId: 'quarter-chart',
            dataProvider: quarterDataProvider,
        },
        {
            chartId: 'day-of-week-chart',
            dataProvider: dayOfWeekDataProvider,
        },
        {
            chartId: 'fluctuation-chart',
            dataProvider: fluctuationDataProvider,
        },
        {
            chartId: 'monthly-move-chart',
            dataProvider: moveDataProvider,
        },
        {
            chartId: 'monthly-volume-chart',
            dataProvider: volumeDataProvider,
        },
    ];

    dataProviders.forEach(e => {
        e.dataProvider.configure({
            chartId: e.chartId,
            filterStorage,
        });
    });

    const adaptor = {
        cf: ndx,
        groupAll: all,
        dataProviders,
        filterStorage,
        computeChartData: () => {
            const chartData = adaptor.dataProviders.map(e => ({
                chartId: e.chartId,
                values: e.dataProvider.data(),
            }));

            return {
                selectedRecords: adaptor.groupAll.value(),
                totalRecords: adaptor.cf.size(),
                chartData,
            };
        },
    };

    return adaptor;
}
