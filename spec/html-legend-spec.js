/* global appendChartID, loadDateFixture */
describe('dc.htmlLegend', function () {
    var id, chart, dateDimension, dateValueSumGroup, dateIdSumGroup, legend, legendId;

    beforeEach(function () {
        var data = crossfilter(loadDateFixture());
        dateDimension = data.dimension(function (d) {
            return d3.time.day(d.dd);
        });
        dateValueSumGroup = dateDimension.group().reduceSum(function (d) {
            return d.value;
        });
        dateIdSumGroup = dateDimension.group().reduceSum(function (d) {
            return d.id;
        });

        id = 'html-legend-chart';
        legendId = 'html-legend-chart-legend';
        appendChartID(id);
        appendChartID(legendId);

        chart = dc.lineChart('#' + id);
        chart
            .dimension(dateDimension)
            .group(dateIdSumGroup, 'Id Sum')
            .stack(dateValueSumGroup, 'Value Sum')
            .stack(dateValueSumGroup, 'Fixed', function () {
            })
            .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
            .legend(dc.htmlLegend().container('#' + legendId));
        legend = d3.select('#' + legendId);
    });

    describe('rendering the legend', function () {
        beforeEach(function () {
            chart.render();
        });

        it('generates a legend', function () {
            expect(legend.select('div.dc-legend').empty()).toBeFalsy();
        });

        it('generates a legend item for each stacked line', function () {
            expect(legend.select('div.dc-legend').selectAll('.dc-legend-item-vertical').size()).toBe(3);
        });

        it('generates legend item boxes', function () {
            expect(legendIcon(0).style('background-color')).toBe('rgb(31, 119, 180)');
            expect(legendIcon(1).style('background-color')).toBe('rgb(255, 127, 14)');
            expect(legendIcon(2).style('background-color')).toBe('rgb(44, 160, 44)');
        });

        it('generates legend labels', function () {
            expect(legendLabel(0).text()).toBe('Id Sum');
            expect(legendLabel(1).text()).toBe('Value Sum');
            expect(legendLabel(2).text()).toBe('Fixed');
        });

        it('not allow hiding stacks be default', function () {
            legendItem(0).on('click').call(legendItem(0)[0][0], legendItem(0).datum());
            expect(chart.selectAll('path.line').size()).toBe(3);
        });
    });

    function legendItem (n) {
        return d3.select(legend.selectAll('div.dc-legend div.dc-legend-item-vertical')[0][n]);
    }

    function legendLabel (n) {
        return d3.select(legend.selectAll('div.dc-legend div.dc-legend-item-vertical span.dc-legend-item-label')[0][n]);
    }

    function legendIcon (n) {
        return d3.select(legend.selectAll('div.dc-legend div.dc-legend-item-vertical span.dc-legend-item-color')[0][n]);
    }

    describe('with .horizontal(true)', function () {
        beforeEach(function () {
            chart.legend(dc.htmlLegend().container('#' + legendId).horizontal(true));
            chart.render();
        });

        it('generates a legend', function () {
            expect(legend.select('div.dc-legend').empty()).toBeFalsy();
        });

        it('generates a legend item for each stacked line', function () {
            expect(legend.select('div.dc-legend').selectAll('div.dc-legend-item-horizontal').size()).toBe(3);
        });

        it('generates legend item boxes', function () {
            expect(legendIcon(0).style('background-color')).toBe('rgb(31, 119, 180)');
            expect(legendIcon(1).style('background-color')).toBe('rgb(255, 127, 14)');
            expect(legendIcon(2).style('background-color')).toBe('rgb(44, 160, 44)');
        });

        it('generates legend labels', function () {
            expect(legendLabel(0).text()).toBe('Id Sum');
            expect(legendLabel(1).text()).toBe('Value Sum');
            expect(legendLabel(2).text()).toBe('Fixed');
        });

        it('not allow hiding stacks be default', function () {
            legendItem(0).on('click').call(legendItem(0)[0][0], legendItem(0).datum());
            expect(chart.selectAll('path.line').size()).toBe(3);
        });

        function legendItem (n) {
            return d3.select(legend.selectAll('div.dc-legend div.dc-legend-item-horizontal')[0][n]);
        }

        function legendLabel (n) {
            return d3.select(legend.selectAll('div.dc-legend div.dc-legend-item-horizontal span.dc-legend-item-label')[0][n]);
        }

        function legendIcon (n) {
            return d3.select(legend.selectAll('div.dc-legend div.dc-legend-item-horizontal span.dc-legend-item-color')[0][n]);
        }
    });
});
