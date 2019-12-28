/* global appendChartID, coordsFromTranslate, loadDateFixture */
describe('dc.legend', () => {
    let id, chart, dateDimension, dateValueSumGroup, dateIdSumGroup;

    beforeEach(() => {
        const data = crossfilter(loadDateFixture());
        dateDimension = data.dimension(d => d3.utcDay(d.dd));
        dateValueSumGroup = dateDimension.group().reduceSum(d => d.value);
        dateIdSumGroup = dateDimension.group().reduceSum(d => d.id);

        id = 'legend-chart';
        appendChartID(id);
        chart = new dc.LineChart(`#${id}`);

        chart
            .dimension(dateDimension)
            .group(dateIdSumGroup, 'Id Sum')
            .stack(dateValueSumGroup, 'Value Sum')
            .stack(dateValueSumGroup, 'Fixed', () => {})
            .x(d3.scaleUtc().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
            .legend(new dc.Legend().x(400).y(10).itemHeight(13).gap(5));
    });

    describe('rendering the legend', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should generate a legend', () => {
            expect(chart.select('g.dc-legend').empty()).toBeFalsy();
        });

        it('should place the legend using the provided x and y values', () => {
            expect(chart.select('g.dc-legend').attr('transform')).toMatchTranslate(400, 10);
        });

        it('should generate a legend item for each stacked line', () => {
            expect(chart.select('g.dc-legend').selectAll('g.dc-legend-item').size()).toBe(3);
        });

        it('should generate legend item boxes', () => {
            expect(legendIcon(0).attr('width')).toBeWithinDelta(13, 2);
            expect(legendIcon(0).attr('height')).toBeWithinDelta(13, 2);
        });

        it('should color the legend item boxes using the chart line colors', () => {
            expect(legendIcon(0).attr('fill')).toMatch(/#1f77b4/i);
            expect(legendIcon(1).attr('fill')).toMatch(/#ff7f0e/i);
            expect(legendIcon(2).attr('fill')).toMatch(/#2ca02c/i);
        });

        it('should generate a legend label for each chart line', () => {
            expect(chart.selectAll('g.dc-legend g.dc-legend-item text').size()).toBe(3);
        });

        it('should position the legend labels', () => {
            expect(legendLabel(0).attr('x')).toBeWithinDelta(15, 2);
            expect(legendLabel(0).attr('y')).toBeWithinDelta(11.75, 2);
            expect(legendLabel(1).attr('x')).toBeWithinDelta(15, 2);
            expect(legendLabel(1).attr('y')).toBeWithinDelta(11.75, 2);
            expect(legendLabel(2).attr('x')).toBeWithinDelta(15, 2);
            expect(legendLabel(2).attr('y')).toBeWithinDelta(11.75, 2);
        });

        it('should label the legend items with the names of their associated stacks', () => {
            expect(legendLabel(0).text()).toBe('Id Sum');
            expect(legendLabel(1).text()).toBe('Value Sum');
            expect(legendLabel(2).text()).toBe('Fixed');
        });

        it('not allow hiding stacks be default', () => {
            legendItem(0).on('click').call(legendItem(0).nodes()[0], legendItem(0).datum());
            expect(chart.selectAll('path.line').size()).toBe(3);
        });

        describe('without .horizontal(true)', () => {
            it('should place legend items vertically', () => {
                expect(coordsFromTranslate(legendItem(0).attr('transform')).y).toBeWithinDelta(0, 1);
                expect(coordsFromTranslate(legendItem(1).attr('transform')).y).toBeWithinDelta(18, 2);
                expect(coordsFromTranslate(legendItem(2).attr('transform')).y).toBeWithinDelta(36, 4);
            });
        });

        describe('with .horizontal(true)', () => {
            beforeEach(() => {
                chart.legend(new dc.Legend().horizontal(true));
                chart.render();
            });

            it('should place legend items horizontally', () => {
                expect(coordsFromTranslate(legendItem(0).attr('transform')).x).toBeWithinDelta(0, 1);
                expect(coordsFromTranslate(legendItem(1).attr('transform')).x).toBeWithinDelta(65, 5);
                expect(coordsFromTranslate(legendItem(2).attr('transform')).x).toBeWithinDelta(155, 15);
            });
        });

        describe('with .horizontal(true) and defined legendWidth and itemWidth', () => {
            let legendCoords;
            beforeEach(() => {
                chart.legend(new dc.Legend().horizontal(true).legendWidth(60).itemWidth(30));
                chart.render();
                legendCoords = d3.range(3).map(i => coordsFromTranslate(legendItem(i).attr('transform')));
            });

            it('should place legend items in two columns. third item is new row', () => {
                expect(legendCoords[0].x).toBeWithinDelta(0, 1);
                expect(legendCoords[0].y).toBeWithinDelta(0, 1);
                expect(legendCoords[1].x).toBeWithinDelta(30, 5);
                expect(legendCoords[1].y).toBeWithinDelta(0, 1);
                expect(legendCoords[2].x).toBeWithinDelta(0, 1);
                expect(legendCoords[2].y).toBeWithinDelta(13, 5);
            });
        });

        describe('with .autoItemWidth not called', () => {
            beforeEach(() => {
                chart.legend(new dc.Legend());
            });

            it('_autoItemWidth should be false', () => {
                expect(chart.legend().autoItemWidth()).toBe(false);
            });
        });

        describe('with .autoItemWidth(false)', () => {
            beforeEach(() => {
                chart.legend(new dc.Legend().autoItemWidth(false));
            });

            it('_autoItemWidth should be false', () => {
                expect(chart.legend().autoItemWidth()).toBe(false);
            });
        });

        describe('with .autoItemWidth(true)', () => {
            beforeEach(() => {
                chart.legend(new dc.Legend().autoItemWidth(true));
            });
            it('_autoItemWidth should be true', () => {
                expect(chart.legend().autoItemWidth()).toBe(true);
            });
        });

        describe('with .horizontal(true) and .autoItemWidth(true)', () => {

            let fixedWidthOffset1, autoWidthCoords;

            beforeEach(() => {
                chart.legend(new dc.Legend().horizontal(true).itemWidth(30).autoItemWidth(false));
                chart.render();
                fixedWidthOffset1 = coordsFromTranslate(legendItem(1).attr('transform')).x;
                chart.legend(new dc.Legend().horizontal(true).itemWidth(30).autoItemWidth(true).legendWidth(160));
                chart.render();
                autoWidthCoords = d3.range(3).map(i => coordsFromTranslate(legendItem(i).attr('transform')));
            });

            it('autoWidth x offset should be greater than fixedWidth x offset for the second item', () => {
                expect(autoWidthCoords[1].x).toBeGreaterThan(fixedWidthOffset1);
            });
            it('should wrap the third item based on actual widths', () => {
                expect(autoWidthCoords[2].x).toBe(0);
                expect(autoWidthCoords[2].y).toBeWithinDelta(13, 5);
            });
        });

        describe('with .legendText()', () => {
            beforeEach(() => {
                chart.legend(new dc.Legend().legendText((d, i) => {
                    const _i = i + 1;

                    return `${_i}. ${d.name}`;
                }));
                chart.render();
            });

            it('should label the legend items with the names of their associated stacks', () => {
                expect(legendLabel(0).text()).toBe('1. Id Sum');
                expect(legendLabel(1).text()).toBe('2. Value Sum');
                expect(legendLabel(2).text()).toBe('3. Fixed');
            });
        });

        describe('with .maxItems(2)', () => {
            beforeEach(() => {
                chart.legend()
                    .maxItems(2);
                chart.render();
            });
            it('should display two items', () => {
                expect(chart.select('g.dc-legend').selectAll('g.dc-legend-item').size()).toBe(2);
            });
        });

        describe('with invalid .maxItems', () => {
            beforeEach(() => {
                chart.legend()
                    .maxItems('foo');
                chart.render();
            });
            it('should display three items', () => {
                expect(chart.select('g.dc-legend').selectAll('g.dc-legend-item').size()).toBe(3);
            });
        });
    });

    describe('legends with dashed lines', () => {
        beforeEach(() => {
            id = 'legend-chart-dashed';
            appendChartID(id);
            chart = new dc.CompositeChart(`#${id}`);

            const subChart1 = new dc.LineChart(chart);
            subChart1
                .dimension(dateDimension)
                .group(dateIdSumGroup, 'Id Sum')
                .dashStyle([10,1]);

            const subChart2 = new dc.LineChart(chart);
            subChart2
                .dimension(dateDimension)
                .group(dateValueSumGroup, 'Value Sum')
                .dashStyle([2,1]);

            chart
                .x(d3.scaleLinear().domain([0,20]))
                .legend(new dc.Legend().x(400).y(10).itemHeight(13).gap(5))
                .compose([subChart1, subChart2])
                .render();
        });

        it('should style legend line correctly', () => {
            expect(legendLine(0).attr('stroke-dasharray')).toEqualIntOrPixelList('10,1');
            expect(legendLine(1).attr('stroke-dasharray')).toEqualIntOrPixelList('2,1');
        });
    });

    describe('legends with hidable stacks', () => {
        beforeEach(() => {
            chart.hidableStacks(true).render();
        });

        describe('clicking on a legend item', () => {
            beforeEach(() => {
                legendItem(0).on('click').call(legendItem(0).nodes()[0], legendItem(0).datum());
            });

            it('should fade out the legend item', () => {
                expect(legendItem(0).classed('fadeout')).toBeTruthy();
            });

            it('should hide its associated stack', () => {
                expect(chart.selectAll('path.line').size()).toEqual(2);
            });

            it('disable hover highlighting for that legend item', () => {
                legendItem(0).on('mouseover')(legendItem(0).datum());
                expect(d3.select(chart.selectAll('path.line').nodes()[1]).classed('fadeout')).toBeFalsy();
            });

            describe('clicking on a faded out legend item', () => {
                beforeEach(() => {
                    legendItem(0).on('click').call(legendItem(0).nodes()[0], legendItem(0).datum());
                });

                it('should unfade the legend item', () => {
                    expect(legendItem(0).classed('fadeout')).toBeFalsy();
                });

                it('should unfade its associated stack', () => {
                    expect(chart.selectAll('path.line').size()).toEqual(3);
                });
            });
        });
    });

    function legendItem (n) {
        return d3.select(chart.selectAll('g.dc-legend g.dc-legend-item').nodes()[n]);
    }
    function legendLabel (n) {
        return d3.select(chart.selectAll('g.dc-legend g.dc-legend-item text').nodes()[n]);
    }
    function legendIcon (n) {
        return d3.select(chart.selectAll('g.dc-legend g.dc-legend-item rect').nodes()[n]);
    }
    function legendLine (n) {
        return d3.select(chart.selectAll('g.dc-legend g.dc-legend-item line').nodes()[n]);
    }
});

