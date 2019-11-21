/* global appendChartID, loadDateFixture, loadDateFixture2, makeDate */
describe('Dynamic data addition in crossfilter', function () {
    const width = 200;
    const height = 200;
    const radius = 100;
    let baseData, moreData;

    beforeEach(function () {
        baseData = crossfilter(loadDateFixture());
        moreData = loadDateFixture2();
    });

    function occurrences (str, value) {
        return (str.split(value)).length - 1;
    }

    describe('pie chart slice addition', function () {
        let valueDimension, valueGroup;
        let chart;

        function buildPieChart (id) {
            const div = appendChartID(id);
            div.append('a').attr('class', 'reset').style('display', 'none');
            div.append('span').attr('class', 'filter').style('display', 'none');
            const pieChart = dc.pieChart('#' + id);
            pieChart.dimension(valueDimension).group(valueGroup)
                .width(width)
                .height(height)
                .radius(radius)
                .ordering(function (kv) { return kv.key; })
                .transitionDuration(0);
            pieChart.render();
            baseData.add(moreData);
            pieChart.expireCache();
            return pieChart;
        }
        beforeEach(function () {
            valueDimension = baseData.dimension(function (d) {
                return d.value;
            });
            valueGroup = valueDimension.group();
            chart = buildPieChart('pie-chart');
            chart.redraw();
        });
        it('slice g should be created with class', function () {
            expect(chart.selectAll('svg g g.pie-slice').data().length).toEqual(7);
        });
        it('slice path should be created', function () {
            expect(chart.selectAll('svg g g.pie-slice path').data().length).toEqual(7);
        });
        it('default function should be used to dynamically generate label', function () {
            expect(d3.select(chart.selectAll('text.pie-slice').nodes()[0]).text()).toEqual('11');
        });
        it('pie chart slices should be in numerical order', function () {
            expect(chart.selectAll('text.pie-slice').data().map(function (slice) { return slice.data.key; }))
                .toEqual(['11','22','33','44','55','66','76']);
        });
        it('default function should be used to dynamically generate title', function () {
            expect(d3.select(chart.selectAll('g.pie-slice title').nodes()[0]).text()).toEqual('11: 1');
        });
        afterEach(function () {
            valueDimension.filterAll();
        });
    });
    describe('line chart segment addition', function () {
        let timeDimension, timeGroup;
        let chart;

        function buildLineChart (id) {
            appendChartID(id);
            const lineChart = dc.lineChart('#' + id);
            lineChart.dimension(timeDimension).group(timeGroup)
                .width(width).height(height)
                .x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]))
                .transitionDuration(0)
                .xUnits(d3.utcDays)
                .brushOn(false)
                .renderArea(true)
                .renderTitle(true);
            lineChart.render();
            baseData.add(moreData);
            lineChart.expireCache();
            return lineChart;
        }
        beforeEach(function () {
            timeDimension = baseData.dimension(function (d) {
                return d.dd;
            });
            timeGroup = timeDimension.group();
            chart = buildLineChart('line-chart');
            chart.render();
        });
        it('number of dots should equal the size of the group', function () {
            expect(chart.selectAll('circle.dot').nodes().length).toEqual(timeGroup.size());
        });
        it('number of line segments should equal the size of the group', function () {
            const path = chart.selectAll('path.line').attr('d');
            expect(occurrences(path, 'L') + 1).toEqual(timeGroup.size());
        });
        it('number of area segments should equal twice the size of the group', function () {
            const path = chart.selectAll('path.area').attr('d');
            expect(occurrences(path, 'L') + 1).toEqual(timeGroup.size() * 2);
        });

        describe('resetting line chart with fewer data points', function () {
            beforeEach(function () {
                const lineChart = buildLineChart('stackable-line-chart');
                lineChart.render();

                timeDimension.filterAll();
                baseData.remove();
                baseData.add(moreData);
                lineChart.render();
            });

            it('it should not contain stale data points', function () {
                expect(chart.data()[0].values.length).toEqual(2);
            });
        });

        afterEach(function () {
            timeDimension.filterAll();
        });
    });
});
