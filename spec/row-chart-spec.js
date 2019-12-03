/* global appendChartID, loadDateFixture, makeDate */
describe('dc.rowChart', () => {
    let id, chart;
    let data, dimension, nvdimension;
    const positiveGroupHolder = {groupType: 'positive signed'};
    const negativeGroupHolder = {groupType: 'negative signed'};
    const mixedGroupHolder = {groupType: 'mixed signed'};
    const largerGroupHolder = {groupType: 'larger'};
    let statusDimension, statusMultiGroup;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(d => +d.value);

        positiveGroupHolder.group = dimension.group().reduceSum(d => Math.abs(+d.nvalue));
        positiveGroupHolder.dimension = dimension;
        negativeGroupHolder.group = dimension.group().reduceSum(d => -Math.abs(+d.nvalue));
        negativeGroupHolder.dimension = dimension;
        mixedGroupHolder.group = dimension.group().reduceSum(d => +d.nvalue);
        mixedGroupHolder.dimension = dimension;

        nvdimension = data.dimension(d => +d.nvalue);
        largerGroupHolder.group = nvdimension.group().reduceSum(d => +d.value);
        largerGroupHolder.dimension = nvdimension;

        statusDimension = data.dimension(d => d.status);
        statusMultiGroup = statusDimension.group().reduce(
            //add
            (p, v) => {
                ++p.count;
                p.total += +v.value;
                return p;
            },
            //remove
            (p, v) => {
                --p.count;
                p.total -= +v.value;
                return p;
            },
            //init
            () => ({count: 0, total: 0, getTotal: function () { return this.total; }})
        );

        id = 'row-chart';
        appendChartID(id);

        chart = new dc.RowChart(`#${id}`);
        chart.dimension(dimension)
            .width(600).height(200).gap(10)
            .transitionDuration(0);
    });

    describe('enabling the chart title and label with a value accessor', () => {
        beforeEach(() => {
            chart.group(mixedGroupHolder.group);
            chart.valueAccessor(d => d.value + 100).renderLabel(true).renderTitle(true).render();
        });

        it('should use the default function to dynamically generate the label', () => {
            expect(chart.select('text.row').text()).toBe('22');
        });

        it('should use the default function to dynamically generate the title', () => {
            expect(chart.select('g.row title').text()).toBe('22: 108');
        });
    });

    describe('with a logarithmic X axis and positive data', () => {
        beforeEach(() => {
            chart.group(positiveGroupHolder.group);
            chart.elasticX(false);
            chart.x(d3.scaleLog());
            chart.render();
        });

        it('should render valid rect widths', () => {
            expect(chart.select('g.row rect').attr('width')).toBeWithinDelta(1, 0.5);
        });
    });

    describe('with a fixedBarHeight', () => {
        beforeEach(() => {
            chart.group(positiveGroupHolder.group);
            chart.elasticX(false);
            chart.x(d3.scaleLog());
            chart.fixedBarHeight(10);
            chart.render();
        });

        it('should render fixed rect height', () => {
            expect(chart.select('g.row rect').attr('height')).toBeWithinDelta(10, 0.0);
        });
    });

    describe('with renderTitleLabel', () => {
        beforeEach(() => {
            chart.group(positiveGroupHolder.group);
            chart.x(d3.scaleLinear());
            chart.title(() => 'test title');
            chart.renderTitleLabel(true);
            chart.render();
        });

        it('should render title label centered', () => {
            expect(chart.select('g.row .titlerow').attr('dy')).toBeDefined();
        });
    });

    describe('row chart cap', () => {
        beforeEach(() => {
            chart.dimension(statusDimension)
                .group(statusMultiGroup)
                .othersLabel('small');
            return chart;
        });
        describe('with custom valueAccessor', () => {
            // statusMultiGroup has
            // [{"key":"F","value":{"count":5,"total":220}},{"key":"T","value":{"count":5,"total":198}}]
            beforeEach(() => {
                chart.dimension(statusDimension).group(statusMultiGroup)
                    .valueAccessor(d => d.value.total)
                    .ordering(d => -d.value.total)
                    .render();
                return chart;
            });
            it('correct values, no others row', () => {
                expect(chart.selectAll('title').nodes().map(t => d3.select(t).text()))
                    .toEqual(['F: 220', 'T: 198']);
            });
            describe('with cap(1)', () => {
                beforeEach(() => {
                    chart.cap(1).render();
                });
                it('correct values, others row', () => {
                    expect(chart.selectAll('title').nodes().map(t => d3.select(t).text()))
                        .toEqual(['F: 220', 'small: 198']);
                });
            });
        });
        describe('with custom valueAccessor calling function', () => {
            // statusMultiGroup has
            // [{"key":"F","value":{"count":5,"total":220}},{"key":"T","value":{"count":5,"total":198}}]
            beforeEach(() => {
                chart.dimension(statusDimension).group(statusMultiGroup)
                    .valueAccessor(d => d.value.getTotal())
                    .ordering(d => -d.value.getTotal())
                    .render();
                return chart;
            });
            it('correct values, no others row', () => {
                expect(chart.selectAll('title').nodes().map(t => d3.select(t).text()))
                    .toEqual(['F: 220', 'T: 198']);
            });
            describe('with cap(1)', () => {
                beforeEach(() => {
                    chart.cap(1).render();
                });
                it('correct values, others row', () => {
                    expect(chart.selectAll('title').nodes().map(t => d3.select(t).text()))
                        .toEqual(['F: 220', 'small: 198']);
                });
            });
        });
    });

    function itShouldBehaveLikeARowChartWithGroup (groupHolder, N, xAxisTicks) {
        describe(`for ${groupHolder.groupType} data`, () => {
            beforeEach(() => {
                chart.group(groupHolder.group);
            });

            describe('rendering the row chart', () => {
                beforeEach(() => {
                    chart.render();
                });

                it('should create a root svg node', () => {
                    expect(chart.select('svg').size()).toBe(1);
                });

                it('should create a row group for each datum', () => {
                    expect(chart.selectAll('svg g g.row').size()).toBe(N);
                });

                it('should number each row sequentially with classes', () => {
                    chart.selectAll('svg g g.row').each(function (r, i) {
                        expect(d3.select(this).attr('class')).toBe(`row _${i}`);
                    });
                });

                it('should fill each row rect with pre-defined colors', () => {
                    for (let i = 0; i < N; i++) {
                        expect(d3.select(chart.selectAll('g.row rect').nodes()[i]).attr('fill'))
                            .toMatchColor(dc.config.defaultColors()[i]);
                    }
                });

                it('should create a row label from the data for each row', () => {
                    expect(chart.selectAll('svg text.row').size()).toBe(N);

                    chart.selectAll('svg g text.row').call(t => {
                        expect(+t.text()).toBe(t.datum().key);
                    });
                });

                describe('row label vertical position', () => {
                    let labels, rows;
                    beforeEach(() => {
                        labels = chart.selectAll('svg text.row');
                        rows = chart.selectAll('g.row rect');
                    });

                    function itShouldVerticallyCenterLabelWithinRow (i) {
                        it(`should place label ${i} within row ${i}`, () => {
                            const rowpos = rows.nodes()[i].getBoundingClientRect(),
                                textpos = labels.nodes()[i].getBoundingClientRect();
                            expect((textpos.top + textpos.bottom) / 2)
                                .toBeWithinDelta((rowpos.top + rowpos.bottom) / 2, 2);
                        });
                    }
                    for (let i = 0; i < N ; ++i) {
                        itShouldVerticallyCenterLabelWithinRow(i);
                    }
                });

                describe('re-rendering the chart', () => {
                    beforeEach(() => {
                        chart.render();
                    });

                    it('should leave a single instance of the chart', () => {
                        expect(d3.selectAll('#row-chart svg').size()).toBe(1);
                    });
                });
            });

            describe('chart filters', () => {
                beforeEach(() => {
                    chart.render();
                    d3.select(`#${id}`).append('span').classed('filter', true);
                });

                it('should not have filter by default', () => {
                    expect(chart.hasFilter()).toBeFalsy();
                });

                it('should not modify the underlying crossfilter group', () => {
                    const oldGroupData = chart.group().all().slice(0);
                    chart.ordering(dc.pluck('value'));
                    chart.filter('66').render();

                    expect(chart.group().all().length).toBe(oldGroupData.length);
                    for (let i = 0; i < oldGroupData.length; i++) {
                        expect(chart.group().all()[i]).toBe(oldGroupData[i]);
                    }
                });

                describe('filtering a row', () => {
                    beforeEach(() => {
                        chart.filter('66');
                        chart.render();
                    });

                    it('should apply a filter to the chart', () => {
                        expect(chart.filter()).toBe('66');
                        expect(chart.hasFilter()).toBeTruthy();
                    });

                    it('should highlight any selected rows', () => {
                        chart.filter('22');
                        chart.render();
                        chart.selectAll('g.row rect').each(function (d) {
                            if (d.key === 66 || d.key === 22) {
                                expect(d3.select(this).classed('selected')).toBeTruthy();
                                expect(d3.select(this).classed('deselected')).toBeFalsy();
                            } else {
                                expect(d3.select(this).classed('deselected')).toBeTruthy();
                                expect(d3.select(this).classed('selected')).toBeFalsy();
                            }
                        });
                    });

                    it('should generate filter info in a filter-classed element', () => {
                        expect(chart.select('span.filter').style('display')).not.toBe('none');
                        expect(chart.select('span.filter').text()).toBe('66');
                    });

                    describe('removing filters', () => {
                        beforeEach(() => {
                            chart.filterAll();
                            chart.render();
                        });

                        it('should remove highlighting', () => {
                            chart.selectAll('g.row rect').each(function (d) {
                                expect(d3.select(this).classed('deselected')).toBeFalsy();
                                expect(d3.select(this).classed('selected')).toBeFalsy();
                            });
                        });
                    });
                });
            });

            describe('filtering related dimensions', () => {
                beforeEach(() => {
                    chart.render();
                    data.dimension(d => d.status).filter('E');
                });

                it('should preserve the labels', () => {
                    chart.selectAll('svg g text.row').each(function () {
                        expect(d3.select(this).text()).not.toBe('');
                    });
                });
            });

            describe('clicking on a row', () => {
                beforeEach(() => {
                    chart.render();
                    chart.onClick(chart.group().all()[0]);
                });

                it('should filter the corresponding group', () => {
                    expect(chart.filter()).toBe(chart.group().all()[0].key);
                });

                describe('clicking again', () => {
                    beforeEach(() => {
                        chart.onClick(chart.group().all()[0]);
                    });

                    it('should reset the filter', () => {
                        expect(chart.filter()).toBe(null);
                    });
                });
            });

            describe('specifying a group ordering', () => {
                beforeEach(() => {
                    chart.render();
                });

                it('should order values when by value', () => {
                    chart.ordering(dc.pluck('value'));
                    expect(chart.data().map(dc.pluck('value')).sort(d3.ascending)).toEqual(chart.data().map(dc.pluck('value')));
                });

                it('should order keys when by keys', () => {
                    chart.ordering(dc.pluck('key'));
                    expect(chart.data().map(dc.pluck('key')).sort(d3.ascending)).toEqual(chart.data().map(dc.pluck('key')));
                });
            });

            describe('redrawing after an empty selection', () => {
                beforeEach(() => {
                    chart.render();
                    // fixme: huh?  this isn't even the right data type
                    groupHolder.dimension.filter([makeDate(2010, 0, 1), makeDate(2010, 0, 3)]);
                    chart.redraw();
                    groupHolder.dimension.filter([makeDate(2012, 0, 1), makeDate(2012, 11, 30)]);
                    chart.redraw();
                });

                it('should restore the row chart', () => {
                    chart.selectAll('g.row rect').each(function (p) {
                        expect(d3.select(this).attr('width').indexOf('NaN') < 0).toBeTruthy();
                    });
                });
            });

            describe('removing all the data and restoring the data', () => {
                // this test mainly exists to produce console errors for #1008;
                // I can't seem to find any way to detect invalid setAttribute calls
                beforeEach(() => {
                    chart.render();
                    chart.group({all: function () { return []; }});
                    chart.redraw();
                    chart.group(groupHolder.group);
                    chart.redraw();
                });

                it('should restore the row chart', () => {
                    chart.selectAll('g.row rect').each(function (p) {
                        expect(d3.select(this).attr('width').indexOf('NaN') < 0).toBeTruthy();
                    });
                });
            });

            describe('custom labels', () => {
                beforeEach(() => {
                    chart.label(() => 'custom label').render();
                });

                it('should render a label for each datum', () => {
                    expect(chart.selectAll('text.row').size()).toBe(N);
                });

                it('should use the custom function for each label', () => {
                    chart.selectAll('text.row').each(function () {
                        expect(d3.select(this).text()).toBe('custom label');
                    });
                });

                describe('with labels disabled', () => {
                    beforeEach(() => {
                        chart.renderLabel(false).render();
                    });

                    it('should not display labels', () => {
                        expect(chart.selectAll('text.row').size()).toBe(0);
                    });
                });
            });

            describe('custom titles', () => {
                beforeEach(() => {
                    chart.title(() => 'custom title').render();
                });

                it('should render a title for each datum', () => {
                    expect(chart.selectAll('g.row title').size()).toBe(N);
                });

                it('should use the custom function for each title', () => {
                    chart.selectAll('g.row title').each(function () {
                        expect(d3.select(this).text()).toBe('custom title');
                    });
                });

                describe('with titles disabled', () => {
                    beforeEach(() => {
                        chart.renderTitle(false).render();
                    });

                    it('should not display labels', () => {
                        expect(chart.selectAll('g.row title').size()).toBe(0);
                    });
                });
            });

            if (xAxisTicks) {
                describe('with elasticX', () => {
                    beforeEach(() => {
                        chart.elasticX(true)
                            .xAxis().ticks(3);

                        chart.render();
                    });

                    it('should generate x axis domain dynamically', () => {
                        const nthText = function (n) { return d3.select(chart.selectAll('g.axis .tick text').nodes()[n]); };

                        for (let i = 0; i < xAxisTicks.length; i++) {
                            expect(nthText(i).text()).toBe(xAxisTicks[i]);
                        }
                    });
                });
            }
        });
    }

    itShouldBehaveLikeARowChartWithGroup(positiveGroupHolder, 5, ['0', '5', '10']);
    itShouldBehaveLikeARowChartWithGroup(negativeGroupHolder, 5, ['-10', '-5', '0']);
    itShouldBehaveLikeARowChartWithGroup(mixedGroupHolder, 5, ['-5', '0', '5']);
    itShouldBehaveLikeARowChartWithGroup(largerGroupHolder, 7);
});
