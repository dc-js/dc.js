/* global appendChartID, loadDateFixture */
describe('dc.htmlLegend', () => {
    let id, chart, dateDimension, dateValueSumGroup, dateIdSumGroup, legend, legendId;

    function legendItem (n, orientation) {
        return d3.select(legend.selectAll(`div.dc-html-legend div.dc-legend-item-${orientation}`).nodes()[n]);
    }

    function legendLabel (n, orientation) {
        return d3.select(legend.selectAll(`div.dc-html-legend div.dc-legend-item-${ 
            orientation} span.dc-legend-item-label`).nodes()[n]);
    }

    function legendIcon (n, orientation) {
        return d3.select(legend.selectAll(`div.dc-html-legend div.dc-legend-item-${ 
            orientation} span.dc-legend-item-color`).nodes()[n]);
    }

    describe('htmlLegend for lineChart', () => {
        beforeEach(() => {
            const data = crossfilter(loadDateFixture());
            dateDimension = data.dimension(d => d3.timeDay(d.dd));
            dateValueSumGroup = dateDimension.group().reduceSum(d => d.value);
            dateIdSumGroup = dateDimension.group().reduceSum(d => d.id);

            id = 'html-legend-chart';
            legendId = 'html-legend-chart-legend';
            appendChartID(id);
            appendChartID(legendId);

            chart = new dc.LineChart(`#${id}`);
            chart
                .dimension(dateDimension)
                .group(dateIdSumGroup, 'Id Sum')
                .stack(dateValueSumGroup, 'Value Sum')
                .stack(dateValueSumGroup, 'Fixed', () => {
                })
                .x(d3.scaleTime().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
                .legend(new dc.HtmlLegend().container(`#${legendId}`));
            legend = d3.select(`#${legendId}`);
        });

        describe('rendering the legend', () => {
            beforeEach(() => {
                chart.render();
            });

            it('should generate a legend', () => {
                expect(legend.select('div.dc-html-legend').empty()).toBeFalsy();
            });

            it('should generate a legend item for each stacked line', () => {
                expect(legend.select('div.dc-html-legend').selectAll('.dc-legend-item-vertical').size()).toBe(3);
            });

            it('should generate legend item boxes', () => {
                expect(legendIcon(0, 'vertical').style('background-color')).toBe('rgb(31, 119, 180)');
                expect(legendIcon(1, 'vertical').style('background-color')).toBe('rgb(255, 127, 14)');
                expect(legendIcon(2, 'vertical').style('background-color')).toBe('rgb(44, 160, 44)');
            });

            it('should generate legend labels', () => {
                expect(legendLabel(0, 'vertical').text()).toBe('Id Sum');
                expect(legendLabel(1, 'vertical').text()).toBe('Value Sum');
                expect(legendLabel(2, 'vertical').text()).toBe('Fixed');
            });

            it('not allow hiding stacks be default', () => {
                legendItem(0, 'vertical').on('click').call(legendItem(0).nodes()[0], legendItem(0, 'vertical').datum());
                expect(chart.selectAll('path.line').size()).toBe(3);
            });

        });

        describe('with .horizontal(true)', () => {
            beforeEach(() => {
                chart.legend(new dc.HtmlLegend().container(`#${legendId}`).horizontal(true));
                chart.render();
            });

            it('should generate a legend', () => {
                expect(legend.select('div.dc-html-legend').empty()).toBeFalsy();
            });

            it('should generate a legend item for each stacked line', () => {
                expect(legend.select('div.dc-html-legend').selectAll('div.dc-legend-item-horizontal').size()).toBe(3);
            });

            it('should generate legend item boxes', () => {
                expect(legendIcon(0, 'horizontal').style('background-color')).toBe('rgb(31, 119, 180)');
                expect(legendIcon(1, 'horizontal').style('background-color')).toBe('rgb(255, 127, 14)');
                expect(legendIcon(2, 'horizontal').style('background-color')).toBe('rgb(44, 160, 44)');
            });

            it('should generate legend labels', () => {
                expect(legendLabel(0, 'horizontal').text()).toBe('Id Sum');
                expect(legendLabel(1, 'horizontal').text()).toBe('Value Sum');
                expect(legendLabel(2, 'horizontal').text()).toBe('Fixed');
            });

            it('not allow hiding stacks be default', () => {
                const firstLegendItem = legendItem(0, 'horizontal');
                firstLegendItem.on('click').call(firstLegendItem.nodes()[0], firstLegendItem.datum());
                expect(chart.selectAll('path.line').size()).toBe(3);
            });
        });

        describe('with .maxItems(2)', () => {
            beforeEach(() => {
                chart.legend(new dc.HtmlLegend().container(`#${legendId}`).horizontal(true).maxItems(2));
                chart.render();
            });
            it('should display two items', () => {
                expect(legend.select('div.dc-html-legend').selectAll('div.dc-legend-item-horizontal').size()).toBe(2);
            });
        });

        describe('with invalid .maxItems', () => {
            beforeEach(() => {
                chart.legend(new dc.HtmlLegend().container(`#${legendId}`).horizontal(true).maxItems('foo'));
                chart.render();
            });
            it('should display three items', () => {
                expect(legend.select('div.dc-html-legend').selectAll('div.dc-legend-item-horizontal').size()).toBe(3);
            });
        });

        describe('with .legendText()', () => {
            beforeEach(() => {
                chart.legend(new dc.HtmlLegend().container(`#${legendId}`).legendText((d, i) => {
                    const _i = i + 1;
                    return `${_i}. ${d.name}`;
                }));
                chart.render();
            });

            it('should label the legend items with the names of their associated stacks', () => {
                expect(legendLabel(0, 'vertical').text()).toBe('1. Id Sum');
                expect(legendLabel(1, 'vertical').text()).toBe('2. Value Sum');
                expect(legendLabel(2, 'vertical').text()).toBe('3. Fixed');
            });
        });
    });
});
