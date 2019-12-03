/* global appendChartID, loadBoxPlotFixture */
describe('dc.BoxPlot', () => {
    let id, chart;
    let data, dimension, group;

    beforeEach(() => {
        data = crossfilter(loadBoxPlotFixture());

        dimension = data.dimension(d => d.countrycode);
        group = dimension.group().reduce(
            (p, v) => { p.push(+v.value); return p; },
            (p, v) => { p.splice(p.indexOf(+v.value), 1); return p; },
            () => []
        );

        id = 'boxplot';
        appendChartID(id);

        chart = new dc.BoxPlot(`#${id}`);
        chart
            .dimension(dimension)
            .group(group)
            .width(300)
            .height(144)
            .margins({top: 0, right: 0, bottom: 0, left: 0})
            .boxPadding(0)
            .transitionDuration(0)
            .transitionDelay(0)
            .y(d3.scaleLinear().domain([0, 144]))
            .ordinalColors(['#01','#02']);
    });

    describe('rendering the box plot', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should create a non-empty SVG node', () => {
            expect(chart.svg().empty()).toBeFalsy();
        });

        it('should create normal outlier circles (by default)', () => {
            expect(chart.selectAll('circle.outlier').size()).toBe(2);
        });

        it('should not create bold outlier circles (by default)', () => {
            expect(chart.selectAll('circle.outlierBold').size()).toBe(0);
        });

        it('should not create data points (by default)', () => {
            expect(chart.selectAll('circle.data').size()).toBe(0);
        });

        it('should not create tooltips (by default)', () => {
            expect(chart.selectAll('circle.data').select('title').size()).toBe(0);
        });

        it('should create an offset box for each dimension in the group', () => {
            expect(box(0).attr('transform')).toMatchTranslate(50, 0);
            expect(box(1).attr('transform')).toMatchTranslate(150, 0);
        });

        it('should correctly place median line', () => {
            expect(box(1).selectAll('line.median').attr('y1')).toBe('100');
            expect(box(1).selectAll('line.median').attr('y2')).toBe('100');
        });

        it('should set the median value correctly', () => {
            expect(box(1).boxText(1).text()).toBe('44');
        });

        it('should place the left box line at the x origin', () => {
            expect(box(1).select('rect.box').attr('x')).toBe('0');
        });

        describe('with showOutliers disabled', () => {
            beforeEach(() => {
                chart.showOutliers(false).render();
            });

            it('should not create any outlier circles ', () => {
                expect(chart.selectAll('circle.outlier').size()).toBe(0);
                expect(chart.selectAll('circle.outlierBold').size()).toBe(0);
            });
        });

        describe('with renderDataPoints enabled', () => {
            beforeEach(() => {
                chart
                    .renderDataPoints(true)
                    .renderTitle(true)
                    .boxWidth(100)
                    .render();
            });

            it('should create one data point per data value (non-outlier)', () => {
                expect(chart.selectAll('circle.data').size()).toBe(12);
            });
            it('should create a tooltip for each data value (non-outlier)', () => {
                expect(chart.selectAll('circle.data').select('title').size()).toBe(12);
            });
            it('should display the data between 10 to 90 of the box (by default)', () => {
                const w = box(1).select('rect.box').attr('width');
                const min = (w / 2) - (w * chart.dataWidthPortion() / 2);
                const max = (w / 2) + (w * chart.dataWidthPortion() / 2);
                chart.selectAll('circle.data').each(function () {
                    expect(d3.select(this).attr('cx')).toBeGreaterThan(min - 0.1);
                    expect(d3.select(this).attr('cx')).toBeLessThan(max + 0.1);
                });
            });

            describe('and dataWidthPortion set to 50%', () => {
                beforeEach(() => {
                    chart
                        .dataWidthPortion(0.5)
                        .render();
                });

                it('should display the data between 25 to 75 of the box', () => {
                    const w = box(1).select('rect.box').attr('width');
                    const min = (w / 2) - (w * chart.dataWidthPortion() / 2);
                    const max = (w / 2) + (w * chart.dataWidthPortion() / 2);
                    chart.selectAll('circle.data').each(function () {
                        expect(d3.select(this).attr('cx')).toBeGreaterThan(min - 0.1);
                        expect(d3.select(this).attr('cx')).toBeLessThan(max + 0.1);
                    });
                });
            });

            describe('and dataWidthPortion set to 10%', () => {
                beforeEach(() => {
                    chart
                        .dataWidthPortion(0.1)
                        .render();
                });

                it('should display the data between 45 to 55 of the box', () => {
                    const w = box(1).select('rect.box').attr('width');
                    const min = (w / 2) - (w * chart.dataWidthPortion() / 2);
                    const max = (w / 2) + (w * chart.dataWidthPortion() / 2);
                    chart.selectAll('circle.data').each(function () {
                        expect(d3.select(this).attr('cx')).toBeGreaterThan(min - 0.1);
                        expect(d3.select(this).attr('cx')).toBeLessThan(max + 0.1);
                    });
                });
            });
        });

        describe('with boldOutlier enabled', () => {
            beforeEach(() => {
                chart.boldOutlier(true).render();
            });

            it('should create bold outlier circles', () => {
                expect(chart.selectAll('circle.outlierBold').size()).toBe(2);
            });
            it('should not create normal outlier circles ', () => {
                expect(chart.selectAll('circle.outlier').size()).toBe(0);
            });
        });

        describe('the width of the box plot', () => {
            it('should default to being based on the rangeBand', () => {
                expect(box(1).select('rect.box').attr('width')).toBe('100');
            });

            it('should be settable to a number', () => {
                chart.boxWidth(150).render();
                expect(box(1).select('rect.box').attr('width')).toBe('150');
            });

            it('should be settable to a function', () => {
                chart.boxWidth((innerChartWidth, xUnits) => innerChartWidth / (xUnits + 2)).render();
                expect(box(1).select('rect.box').attr('width')).toBe('75');
            });
        });

        describe('the tickFormat of the box plot', () => {
            it('should default to whole number', () => {
                expect(box(1).boxText(1).text()).toBe('44');
                expect(box(1).whiskerText(0).text()).toBe('22');
                expect(box(1).whiskerText(1).text()).toBe('66');
            });

            it('should be settable to a d3.format', () => {
                chart.tickFormat(d3.format('.2f')).render();
                expect(box(1).boxText(1).text()).toBe('44.00');
                expect(box(1).whiskerText(0).text()).toBe('22.00');
                expect(box(1).whiskerText(1).text()).toBe('66.00');
            });
        });

        it('should place interquartile range lines after the first and before the fourth quartile', () => {
            expect(box(1).select('rect.box').attr('y')).toBe('94.5');
            expect(box(1).select('rect.box').attr('height')).toBe('16.5');
        });

        it('should label the interquartile range lines using their calculated values', () => {
            expect(box(1).boxText(0).text()).toBe('33');
            expect(box(1).boxText(2).text()).toBe('50');
        });

        it('should place the whiskers at 1.5x the interquartile range', () => {
            expect(box(1).whiskerLine(0).attr('y1')).toBe('122');
            expect(box(1).whiskerLine(0).attr('y2')).toBe('122');
            expect(box(1).whiskerLine(1).attr('y1')).toBeWithinDelta(78);
            expect(box(1).whiskerLine(1).attr('y2')).toBeWithinDelta(78);
        });

        it('should label the whiskers using their calculated values', () => {
            expect(box(1).whiskerText(0).text()).toBe('22');
            expect(box(1).whiskerText(1).text()).toBe('66');
        });

        it('should assign a fill color to the boxes', () => {
            expect(box(0).select('rect.box').attr('fill')).toBe('#01');
            expect(box(1).select('rect.box').attr('fill')).toBe('#02');
        });

        describe('when a box has no data', () => {
            let firstBox;

            beforeEach(() => {
                firstBox = chart.select('g.box').node();
                const otherDimension = data.dimension(d => d.countrycode);
                otherDimension.filter('US');
                chart.redraw();
            });

            it('should not attempt to render that box', () => {
                expect(chart.selectAll('g.box').size()).toBe(1);
            });

            it('should not animate the removed box into another box', () => {
                expect(chart.select('g.box').node()).not.toBe(firstBox);
            });

            describe('with elasticX enabled', () => {
                beforeEach(() => {
                    chart.elasticX(true).render();
                });

                it('should not represent the box in the chart domain', () => {
                    expect(chart.selectAll('.axis.x .tick').size()).toBe(1);
                });
            });

            describe('when elasticX is disabled', () => {
                beforeEach(() => {
                    chart.elasticX(false).render();
                });

                it('should represent the box in the chart domain', () => {
                    expect(chart.selectAll('.axis.x .tick').size()).toBe(2);
                });
            });
        });
    });

    describe('events', () => {
        beforeEach(() => {
            chart.render();
        });

        describe('filtering the box plot', () => {
            beforeEach(() => {
                chart.filter('CA').redraw();
            });

            it('should select the boxes corresponding to the filtered value', () => {
                box(0).each(function (d) {
                    expect(d3.select(this).classed('selected')).toBeTruthy();
                });
            });

            it('should deselect the boxes not corresponding to the filtered value', () => {
                box(1).each(function (d) {
                    expect(d3.select(this).classed('deselected')).toBeTruthy();
                });
            });
        });

        describe('clicking on a box', () => {
            beforeEach(() => {
                box(0).on('click').call(chart, box(0).datum());
            });

            it('should apply a filter to the chart', () => {
                expect(chart.hasFilter('CA')).toBeTruthy();
            });
        });
    });

    function box (n) {
        const nthBox = d3.select(chart.selectAll('g.box').nodes()[n]);
        nthBox.boxText = function (i) {
            return d3.select(this.selectAll('text.box').nodes()[i]);
        };
        nthBox.whiskerLine = function (i) {
            return d3.select(this.selectAll('line.whisker').nodes()[i]);
        };
        nthBox.whiskerText = function (i) {
            return d3.select(this.selectAll('text.whisker').nodes()[i]);
        };
        return nthBox;
    }
});

