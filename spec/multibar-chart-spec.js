/* global appendChartID, loadDateFixture, makeDate */
describe('dc.multiBarChart', function () {
    var id, chart, data;
    var linearDimension, linearValueSumGroup, linearIdSumGroup, linearGroup;
    var ordinalDimension, ordinalValueSumGroup, ordinalIdSumGroup, ordinalGroup;
    var dateDimension, dateValueSumGroup, dateIdSumGroup, dateGroup;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        linearDimension = data.dimension(function (d) { return d.id; });
        ordinalDimension = data.dimension(function (d) { return d.state; });
        dateDimension = data.dimension(function (d) { return d3.time.day.utc(d.dd); });

        linearValueSumGroup = linearDimension.group().reduceSum(function (d) { return d.value; });
        linearIdSumGroup = linearDimension.group().reduceSum(function (d) { return d.id; });
        linearGroup = linearDimension.group();

        ordinalValueSumGroup = ordinalDimension.group().reduceSum(function (d) { return d.value; });
        ordinalIdSumGroup = ordinalDimension.group().reduceSum(function (d) { return d.id; });
        ordinalGroup = ordinalDimension.group();

        dateValueSumGroup = dateDimension.group().reduceSum(function (d) { return d.value; });
        dateIdSumGroup = dateDimension.group().reduceSum(function (d) { return d.id; });
        dateGroup = dateDimension.group();

        id = 'multibar-chart';
        appendChartID(id);

        chart = dc.multiBarChart('#' + id);
        chart
            .width(800)
            .height(200)
            .transitionDuration(0);
    });

    var barSpacing = function (n) {
        return function () {
            var i = 0, dx = [];
            var barWidth = +chart.g().select('.stack._0 .bar').attr('width');
            for (i; i < n; i += 1) {
                dx[i] = +chart.g().select('.stack._' + i + ' .bar').attr('x');

                if (i > 0) {
                    expect(dx[i] - dx[i - 1]).toBeCloseTo(barWidth + chart.gap());
                }
            }
        };
    };

    describe('with linear x domain', function () {
        beforeEach(function () {
            chart
                .dimension(linearDimension)
                .x(d3.scale.linear().domain([1, 10]));
        });

        describe('with even number of bar charts', function () {
            beforeEach(function () {
                chart
                    .group(linearValueSumGroup)
                    .stack(linearIdSumGroup)
                    .render();
            });

            it('bars should come one after the other', barSpacing(2));
        });

        describe('with odd number of bar charts', function () {
            beforeEach(function () {
                chart
                    .group(linearValueSumGroup)
                    .stack(linearIdSumGroup)
                    .stack(linearGroup)
                    .render();
            });

            it('bars should come one after the other', barSpacing(3));
        });
    });

    describe('with ordinal x domain', function () {
        beforeEach(function () {
            chart
                .dimension(ordinalDimension)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal);
        });

        describe('with even number of bar charts', function () {
            beforeEach(function () {
                chart
                    .group(ordinalValueSumGroup)
                    .stack(ordinalIdSumGroup)
                    .render();
            });

            it('bars should come one after the other', barSpacing(2));
        });

        describe('with odd number of bar charts', function () {
            beforeEach(function () {
                chart
                    .group(ordinalValueSumGroup)
                    .stack(ordinalIdSumGroup)
                    .stack(ordinalGroup)
                    .render();
            });

            it('bars should come one after the other', barSpacing(3));
        });
    });

    describe('with date x domain', function () {
        beforeEach(function () {
            chart
                .dimension(dateDimension)
                .x(d3.time.scale.utc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]))
                .xUnits(d3.time.days.utc);
        });

        describe('with even number of bar charts', function () {
            beforeEach(function () {
                chart
                    .group(dateValueSumGroup)
                    .stack(dateIdSumGroup)
                    .render();
            });

            it('bars should come one after the other', barSpacing(2));
        });

        describe('with odd number of bar charts', function () {
            beforeEach(function () {
                chart
                    .group(dateValueSumGroup)
                    .stack(dateIdSumGroup)
                    .stack(dateGroup)
                    .render();
            });

            it('bars should come one after the other', barSpacing(3));
        });
    });
});
