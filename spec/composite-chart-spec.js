/* global appendChartID, loadDateFixture, makeDate, simulateChartBrushing */
describe('dc.compositeChart', () => {
    let id, chart, data, dateDimension, dateValueSumGroup, dateValueNegativeSumGroup,
        dateIdSumGroup, dateIdNegativeSumGroup, dateGroup;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        dateDimension = data.dimension(d => d3.utcDay(d.dd));
        dateValueSumGroup = dateDimension.group().reduceSum(d => d.value);
        dateValueNegativeSumGroup = dateDimension.group().reduceSum(d => -d.value);
        dateIdSumGroup = dateDimension.group().reduceSum(d => d.id);
        dateIdNegativeSumGroup = dateDimension.group().reduceSum(d => -d.id);
        dateGroup = dateDimension.group();

        id = 'composite-chart';
        appendChartID(id);

        chart = new dc.CompositeChart(`#${id}`);
        chart
            .dimension(dateDimension)
            .group(dateIdSumGroup)
            .width(500)
            .height(150)
            .x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]))
            .transitionDuration(0)
            .xUnits(d3.utcDays)
            .shareColors(true)
            .compose([
                new dc.BarChart(chart)
                    .centerBar(true)
                    .group(dateValueSumGroup, 'Date Value Group Bar')
                    .gap(1),
                new dc.LineChart(chart)
                    .group(dateIdSumGroup, 'Date ID Group')
                    .stack(dateValueSumGroup, 'Date Value Group Line 1')
                    .stack(dateValueSumGroup, 'Date Value Group Line 2')
                    .hidableStacks(true),
                new dc.LineChart(chart)
                    .group(dateGroup, 'Date Group')
            ]);
    });

    it('should registered the chart with DC', () => {
        expect(dc.hasChart(chart)).toBeTruthy();
    });

    it('should set a dimension on the chart', () => {
        expect(chart.dimension()).toBe(dateDimension);
    });

    it('should set a group on the chart', () => {
        expect(chart.group()).toBe(dateIdSumGroup);
    });

    it('should set a width on the chart', () => {
        expect(chart.width()).toBe(500);

        chart.children().forEach(child => {
            expect(child.width()).toBe(500);
        });
    });

    it('should set a height on the chart', () => {
        expect(chart.height()).toBe(150);

        chart.children().forEach(child => {
            expect(child.height()).toBe(150);
        });
    });

    it('should have zero transition duration', () => {
        expect(chart.transitionDuration()).toBe(0);
    });

    it('should set the margins of the chart', () => {
        expect(chart.margins()).not.toBeNull();

        chart.children().forEach(child => {
            expect(child.margins()).toBe(chart.margins());
        });
    });

    it('should set a domain', () => {
        expect(chart.x()).toBeDefined();
    });

    it('should set the x domain to endpoint dates', () => {
        expect(chart.x().domain()[0].getTime()).toBe(makeDate(2012, 4, 20).getTime());
        expect(chart.x().domain()[1].getTime()).toBe(makeDate(2012, 7, 15).getTime());
    });

    it('should set the x units', () => {
        expect(chart.xUnits()).toBe(d3.utcDays);
    });

    it('should create the x axis', () => {
        expect(chart.xAxis()).not.toBeNull();
    });

    it('should create the y axis', () => {
        expect(chart.yAxis()).not.toBeNull();
    });

    it('should create the brush', () => {
        expect(chart.select('g.brush')).not.toBeNull();
    });

    it('does not set round by default', () => {
        expect(chart.round()).not.toBeDefined();
    });

    it('can change round', () => {
        chart.round(d3.utcDay.round);
        expect(chart.round()).not.toBeNull();
    });

    it('has a default value for x', () => {
        expect(chart.keyAccessor()).not.toBeNull();
    });

    it('has a default value for y', () => {
        expect(chart.valueAccessor()).not.toBeNull();
    });

    it('should not allow calling yAxisMin', () => {
        expect(chart.yAxisMin).toThrowError();
    });

    it('should not allow calling yAxisMax', () => {
        expect(chart.yAxisMax).toThrowError();
    });

    describe('rendering the chart', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should create a root SVG element', () => {
            expect(chart.svg().empty()).toBeFalsy();
        });

        it('should create a root SVG group element', () => {
            expect(chart.g().empty()).toBeFalsy();
        });

        it('should size the chart to the full height of the chart', () => {
            expect(chart.select('svg').attr('height')).toBe('150');
        });

        it('should set x range to width', () => {
            expect(chart.x().range()).toEqual([0, 420]);
        });

        it('should set y domain', () => {
            expect(chart.y()).toBeDefined();
        });

        it('should set y range to height by default', () => {
            expect(chart.y().range()).toEqual([110, 0]);
        });

        it('should automatically size the y domain based on height', () => {
            expect(chart.y().domain()).toEqual([0, 281]);
        });

        it('should place the x axis at the bottom', () => {
            expect(chart.select('svg g g.x').attr('transform')).toMatchTranslate(30, 120);
        });

        it('should place the y axis to the left', () => {
            expect(chart.select('svg g g.y').attr('transform')).toMatchTranslate(30, 10);
        });

        it('should create a separate g for each subchart', () => {
            expect(chart.selectAll('g.sub').size()).toBe(3);
        });

        it('should index each subchart g by css class', () => {
            expect(d3.select(chart.selectAll('g.sub').nodes()[0]).attr('class')).toBe('sub _0');
            expect(d3.select(chart.selectAll('g.sub').nodes()[1]).attr('class')).toBe('sub _1');
        });

        it('should generate sub line chart paths', () => {
            expect(chart.selectAll('g.sub path.line').size()).not.toBe(0);
            chart.selectAll('g.sub path.line').each(function (d, i) {
                switch (i) {
                    case 0:
                        expect(d3.select(this).attr('d'))
                            .toMatchPath('M24.137931034482758,110L91.72413793103448,108L101.37931034482757,103L202.75862068965515,' +
                            '108L246.20689655172413,104L395.8620689655172,105');
                        break;
                    case 1:
                        expect(d3.select(this).attr('d'))
                            .toMatchPath('M24.137931034482758,92L91.72413793103448,82L101.37931034482757,52L202.75862068965515,' +
                            '91L246.20689655172413,83L395.8620689655172,75');
                        break;
                }
            });
        });

        it('should generate sub bar charts', () => {
            expect(chart.selectAll('g.sub g._0 rect').size()).toBe(6);
        });

        it('should render sub bar chart', () => {
            expect(chart.selectAll('g.sub rect.bar').size()).not.toBe(0);
            chart.selectAll('g.sub rect.bar').each(function (d, i) {
                switch (i) {
                    case 0:
                        expect(d3.select(this).attr('x')).toBeCloseTo('22.637931034482758', 3);
                        expect(d3.select(this).attr('y')).toBe('93');
                        expect(d3.select(this).attr('width')).toBe('3');
                        expect(d3.select(this).attr('height')).toBe('17');
                        break;
                    case 5:
                        expect(d3.select(this).attr('x')).toBeCloseTo('394.3620689655172', 3);
                        expect(d3.select(this).attr('y')).toBe('80');
                        expect(d3.select(this).attr('width')).toBe('3');
                        expect(d3.select(this).attr('height')).toBe('30');
                        break;
                }
            });
        });

        describe('the chart clip paths', () => {
            it('should create only one defs', () => {
                expect(chart.selectAll('defs').size()).toBe(1);
            });

            it('should create only one clip path', () => {
                expect(chart.selectAll('defs #composite-chart-clip').size()).toBe(1);
            });

            it('should create only one clip rect', () => {
                expect(chart.selectAll('defs #composite-chart-clip rect').size()).toBe(1);
            });

            it('should have the correct size', () => {
                const rect = chart.select('defs #composite-chart-clip rect');
                expect(rect.attr('width')).toBe('420');
                expect(rect.attr('height')).toBe('110');
            });

            it('should have clip path refs', () => {
                expect(chart.selectAll('g.chart-body').size()).not.toBe(0);
                chart.selectAll('g.chart-body').each(function () {
                    expect(d3.select(this).attr('clip-path')).toMatchUrl(`${window.location.href}#composite-chart-clip`);
                });
            });
        });

        describe('the chart brush', () => {

            it('should be positioned with the chart left margin', () => {
                expect(chart.select('g.brush').attr('transform')).toMatchTranslate(chart.margins().left, 10);
            });

            it('should have a resize handle', () => {
                const selectAll = chart.select('g.brush').selectAll('path.custom-brush-handle');
                expect(selectAll.size()).toBe(2);
                selectAll.each(function (d, i) {
                    if (i === 0) {
                        expect(d3.select(this).attr('d'))
                            .toMatchPath('M-0.5,36.666666666666664A6,6 0 0 0 -6.5,42.666666666666664V67.33333333333333A6,' +
                                '6 0 0 0 -0.5,73.33333333333333ZM-2.5,44.666666666666664V65.33333333333333M-4.5,' +
                                '44.666666666666664V65.33333333333333');
                    } else {
                        expect(d3.select(this).attr('d'))
                            .toMatchPath('M0.5,36.666666666666664A6,6 0 0 1 6.5,42.666666666666664V67.33333333333333A6,' +
                                '6 0 0 1 0.5,73.33333333333333ZM2.5,44.666666666666664V65.33333333333333M4.5,' +
                                '44.666666666666664V65.33333333333333');
                    }
                });
            });

            it('should stretch the background', () => {
                expect(chart.select('g.brush rect.overlay').attr('width')).toBe('420');
            });

            it('should set the height of background to height of chart', () => {
                expect(chart.select('g.brush rect.overlay').attr('height')).toBe('110');
            });

            describe('when filtering the chart', () => {
                let filter1, filter2;

                beforeEach(() => {
                    filter1 = [makeDate(2012, 5, 1), makeDate(2012, 5, 30)];
                    filter2 = [makeDate(2012, 6, 10), makeDate(2012, 6, 20)];
                    chart.filter(filter1).redraw();
                });

                it('should set the extent height to chart height', () => {
                    expect(chart.select('g.brush rect.selection').attr('height')).toBe('110');
                });

                it('should set extent width to chart width based on filter set', () => {
                    expect(chart.select('g.brush rect.selection').attr('width')).toBe('140');
                });

                it('should fade filtered bars into the background', () => {
                    expect(chart.selectAll('g.sub rect.deselected').size()).toBe(4);
                });

                it('should set the same filter for each children', () => {
                    for (let i = 0; i < chart.children().length; ++i) {
                        expect(chart.children()[i].filter()).toEqual(filter1);
                    }
                });

                it('should reset filters for each children', () => {
                    chart.filter(null);
                    for (let i = 0; i < chart.children().length; ++i) {
                        expect(chart.children()[i].filter()).toEqual(null);
                    }
                });

                it('should replace filters for each children', () => {
                    chart.replaceFilter(filter2);
                    for (let i = 0; i < chart.children().length; ++i) {
                        expect(chart.children()[i].filter()).toEqual(filter2);
                    }
                });
            });

            describe('after filtering all', () => {
                beforeEach(() => {
                    chart.filterAll();
                    chart.redraw();
                });

                it('should bring all bars to the foreground', () => {
                    chart.selectAll('g rect.bar').each(function (d) {
                        expect(d3.select(this).attr('class')).toBe('bar');
                    });
                });
            });
        });

        describe('legends composed of subchart groups', () => {
            beforeEach(() => {
                chart.legend(new dc.Legend().x(200).y(10).itemHeight(13).gap(5)).render();
            });

            it('should generate a legend item for each subchart', () => {
                expect(chart.selectAll('g.dc-legend g.dc-legend-item').size()).toBe(5);
            });

            it('should generate legend labels for each sub-chart', () => {
                expect(chart.selectAll('g.dc-legend-item text').size()).toBe(5);
            });

            it('should be placed according to its own legend option, ignoring the sub-charts', () => {
                expect(chart.select('g.dc-legend').attr('transform')).toMatchTranslate(200, 10);
            });

            it('should generate legend labels with their associated group text', () => {
                function legendText (n) {
                    return d3.select(chart.selectAll('g.dc-legend g.dc-legend-item text').nodes()[n]).text();
                }
                expect(legendText(0)).toBe('Date Value Group Bar');
                expect(legendText(1)).toBe('Date ID Group');
                expect(legendText(2)).toBe('Date Value Group Line 1');
                expect(legendText(3)).toBe('Date Value Group Line 2');
                expect(legendText(4)).toBe('Date Group');
            });

            it('should properly delegate highlighting to its children', () => {
                const firstItem = chart.select('g.dc-legend g.dc-legend-item');

                firstItem.on('mouseover')(firstItem.datum());
                expect(chart.selectAll('rect.highlight').size()).toBe(6);
                expect(chart.selectAll('path.fadeout').size()).toBe(4);
                firstItem.on('mouseout')(firstItem.datum());
                expect(chart.selectAll('rect.highlight').size()).toBe(0);
                expect(chart.selectAll('path.fadeout').size()).toBe(0);
            });

            it('should hide hidable child stacks', () => {
                const dateValueGroupLine2 = d3.select(chart.selectAll('g.dc-legend g.dc-legend-item').nodes()[3]);

                dateValueGroupLine2.on('click')(dateValueGroupLine2.datum());
                expect(dateValueGroupLine2.text()).toBe('Date Value Group Line 2');
                expect(d3.select(chart.selectAll('g.dc-legend g.dc-legend-item').nodes()[3]).classed('fadeout')).toBeTruthy();
                expect(chart.selectAll('path.line').size()).toEqual(3);
            });
        });
    });

    describe('no elastic', () => {
        beforeEach(() => {
            chart.y(d3.scaleLinear().domain([-200, 200]));
            chart.render();
        });

        it('should respect manually applied domain', () => {
            expect(chart.y().domain()[0]).toBe(-200);
            expect(chart.y().domain()[1]).toBe(200);
        });
    });

    describe('elastic chart axes', () => {
        beforeEach(() => {
            data.dimension(d => d.countrycode).filter('CA');

            chart.elasticY(true).elasticX(true).render();
        });

        it('should adjust the y axis, combining all child charts maxs & mins', () => {
            expect(chart.y().domain()[1]).toBe(115);
        });

        it('should set the x domain', () => {
            expect(chart.x().domain()[0].getTime() >= 1337904000000).toBeTruthy();
            expect(chart.x().domain()[1].getTime() >= 1344556800000).toBeTruthy();
        });
    });

    describe('subchart renderlets', () => {
        beforeEach(() => {
            chart.children()[0].on('renderlet', _chart => {
                _chart.selectAll('rect.bar').attr('width', d => 10);
            });
            chart.render();
        });

        it('should trigger the sub-chart renderlet', () => {
            expect(d3.select(chart.selectAll('rect').nodes()[0]).attr('width')).toBe('10');
        });
    });

    describe('when two subcharts share the same group', () => {
        beforeEach(() => {
            const dimension = data.dimension(d => d.status);
            const group = dimension.group().reduce(
                (p, v) => {
                    ++p.count;
                    p.value += +v.value;
                    return p;
                },
                (p, v) => {
                    --p.count;
                    p.value -= +v.value;
                    return p;
                },
                () => ({count: 0, value: 0})
            );
            chart
                .brushOn(false)
                .dimension(dimension)
                .shareTitle(false)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .compose([
                    new dc.LineChart(chart)
                        .group(group, 'Series 1')
                        .valueAccessor(d => d.value.count)
                        .title(d => {
                            let value = d.value.count;
                            if (isNaN(value)) {
                                value = 0;
                            }
                            return `Count: ${d3.format('d')(value)}`;
                        }),
                    new dc.LineChart(chart)
                        .group(group, 'Series 2')
                        .valueAccessor(d => d.value.value)
                        .title(d => {
                            let value = d.value.value;
                            if (isNaN(value)) {
                                value = 0;
                            }
                            return `Value: ${d3.format('d')(value)}`;

                        })
                ]).render();
        });

        it('should set a tooltip based on the shared group', () => {
            expect(chart.select('.sub._0 .dc-tooltip._0 .dot title').text()).toBe('Count: 5');
            expect(chart.select('.sub._1 .dc-tooltip._0 .dot title').text()).toBe('Value: 220');
        });
    });

    describe('subchart title rendering', () => {
        beforeEach(() => {
            chart.renderTitle(false);
            chart.render();
        });

        it('should respect boolean flag when title not set', () => {
            expect(chart.select('.sub._0 .dc-tooltip._0 .dot').empty()).toBeTruthy();
            expect(chart.select('.sub._1 .dc-tooltip._0 .dot').empty()).toBeTruthy();
        });
    });

    describe('the y-axes', () => {
        describe('when composing charts with both left and right y-axes', () => {
            let rightChart;

            beforeEach(() => {
                chart
                    .compose([
                        new dc.BarChart(chart)
                            .group(dateValueSumGroup, 'Date Value Group'),
                        rightChart = new dc.LineChart(chart)
                            .group(dateIdSumGroup, 'Date ID Group')
                            .stack(dateValueSumGroup, 'Date Value Group')
                            .stack(dateValueSumGroup, 'Date Value Group')
                            .useRightYAxis(true)
                    ])
                    .render();
            });

            it('should render two y-axes', () => {
                expect(chart.selectAll('.axis').size()).toBe(3);
            });

            it('should render a right and a left label', () => {
                chart.yAxisLabel('Left Label').rightYAxisLabel('Right Label').render();

                expect(chart.selectAll('.y-axis-label').size()).toBe(2);
                expect(chart.selectAll('.y-axis-label.y-label').empty()).toBeFalsy();
                expect(chart.selectAll('.y-axis-label.yr-label').empty()).toBeFalsy();
            });

            it('should scale "right" charts according to the right y-axis' , () => {
                expect(rightChart.y()).toBe(chart.rightY());
            });

            it('should set the domain of the right axis', () => {
                expect(rightChart.yAxisMin()).toBe(0);
                expect(rightChart.yAxisMax()).toBe(281);
            });

            it('domain', () => {
                expect(chart.rightY().domain()).toEqual([0, 281]);
                expect(chart.y().domain()).toEqual([0, 132]);
            });

            it('should set "right" chart y-axes to the composite chart right y-axis', () => {
                expect(rightChart.yAxis()).toBe(chart.rightYAxis());
            });

            describe('horizontal gridlines', () => {
                beforeEach(() => {
                    chart.yAxis().ticks(3);
                    chart.rightYAxis().ticks(6);
                    chart.renderHorizontalGridLines(true).render();
                });

                it('should draw left horizontal gridlines by default', () => {
                    expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(3);
                });

                it('should allow right horizontal gridlines to be used', () => {
                    chart.useRightAxisGridLines(true).render();
                    expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(6);
                });
            });
        });

        describe('when composing charts with just a left axis', () => {
            beforeEach(() => {
                chart.yAxis().ticks(4);
                chart.compose([
                    new dc.LineChart(chart).group(dateGroup)
                ]).renderHorizontalGridLines(true).render();
            });

            it('should only render a left y axis', () => {
                expect(chart.selectAll('.axis.y').empty()).toBeFalsy();
                expect(chart.selectAll('.axis.yr').empty()).toBeTruthy();
            });

            it('should only draw left horizontal gridlines', () => {
                expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(4);
            });
        });

        describe('when composing charts with just a right axis', () => {
            beforeEach(() => {
                chart.compose([
                    new dc.LineChart(chart).group(dateGroup).useRightYAxis(true)
                ]).renderHorizontalGridLines(true);
                chart.rightYAxis().ticks(7);
                chart.render();
            });

            it('should only render a right y axis', () => {
                expect(chart.selectAll('.axis.y').empty()).toBeTruthy();
                expect(chart.selectAll('.axis.yr').empty()).toBeFalsy();
            });

            it('should only draw the right horizontal gridlines', () => {
                expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(7);
            });
        });

        describe('when composing a left axis chart with negative values', () => {
            let leftChart, rightChart;
            beforeEach(() => {
                chart
                    .compose([
                        leftChart = new dc.BarChart(chart)
                            .group(dateValueNegativeSumGroup, 'Date Value Group'),
                        rightChart = new dc.LineChart(chart)
                            .group(dateIdSumGroup, 'Date ID Group')
                            .useRightYAxis(true)
                    ])
                    .render();
            });

            it('the axis baselines shouldn\'t match', () => {
                expect(leftChart.y()(0)).not.toEqual(rightChart.y()(0));
            });

            describe('with alignYAxes', () => {
                beforeEach(() => {
                    chart.alignYAxes(true)
                        .elasticY(true)
                        .render();
                });
                it('the axis baselines should match', () => {
                    expect(leftChart.y()(0)).toEqual(rightChart.y()(0));
                });
                it('the series heights should be equal', () => {
                    expect(plotHeight(leftChart)).toEqual(plotHeight(rightChart));
                });
            });
        });

        describe('when composing a right axis chart with negative values', () => {
            let leftChart, rightChart;
            beforeEach(() => {
                chart
                    .compose([
                        leftChart = new dc.BarChart(chart)
                            .group(dateIdSumGroup, 'Date ID Group'),
                        rightChart = new dc.LineChart(chart)
                            .group(dateValueNegativeSumGroup, 'Date Value Group')
                            .useRightYAxis(true)
                    ])
                    .render();
            });

            it('the axis baselines shouldn\'t match', () => {
                expect(leftChart.y()(0)).not.toEqual(rightChart.y()(0));
            });

            describe('with alignYAxes', () => {
                beforeEach(() => {
                    chart.alignYAxes(true)
                        .elasticY(true)
                        .render();
                });
                it('the axis baselines should match', () => {
                    expect(leftChart.y()(0)).toEqual(rightChart.y()(0));
                });
                it('the series heights should be equal', () => {
                    expect(plotHeight(leftChart)).toEqual(plotHeight(rightChart));
                });
            });
        });

        describe('when composing left and right axes charts with negative values', () => {
            let leftChart, rightChart;
            beforeEach(() => {
                chart
                    .compose([
                        leftChart = new dc.BarChart(chart)
                            .group(dateIdNegativeSumGroup, 'Date ID Group'),
                        rightChart = new dc.LineChart(chart)
                            .group(dateValueNegativeSumGroup, 'Date Value Group')
                            .useRightYAxis(true)
                    ])
                    .render();
            });

            it('the axis baselines should match', () => {
                /* because elasticY ensures zero is included for all-negatives, due to PR #1156 */
                expect(leftChart.y()(0)).toEqual(rightChart.y()(0));
            });

            describe('with alignYAxes', () => {
                beforeEach(() => {
                    chart.alignYAxes(true)
                        .elasticY(true)
                        .render();
                });
                it('the axis baselines should match', () => {
                    expect(leftChart.y()(0)).toEqual(rightChart.y()(0));
                });
                it('the series heights should be equal', () => {
                    expect(plotHeight(leftChart)).toEqual(plotHeight(rightChart));
                });
            });
        });
        function plotHeight (_chart) {
            return _chart.y()(_chart.yAxisMax()) - _chart.y()(_chart.yAxisMin());
        }
    });

    describe('sub-charts with different filter types', () => {
        let scatterGroup, scatterDimension;
        let lineGroup, lineDimension;

        beforeEach(() => {
            data = crossfilter(loadDateFixture());

            scatterDimension = data.dimension(d => [+d.value, +d.nvalue]);
            scatterGroup = scatterDimension.group();

            lineDimension = data.dimension(d => +d.value);
            lineGroup = lineDimension.group();

            chart
                .dimension(scatterDimension)
                .group(scatterGroup)
                .x(d3.scaleLinear().domain([0,70]))
                .brushOn(true)
                .compose([
                    new dc.ScatterPlot(chart),
                    new dc.ScatterPlot(chart),
                    new dc.LineChart(chart).dimension(lineDimension).group(lineGroup)
                ]).render();
        });

        describe('brushing', () => {
            let otherDimension;

            beforeEach(() => {
                otherDimension = data.dimension(d => [+d.value, +d.nvalue]);
                simulateChartBrushing(chart, [22, 35]);
                chart.redraw();
            });

            it('should filter the child charts', () => {
                jasmine.clock().tick(100);
                expect(otherDimension.top(Infinity).length).toBe(4);
            });

            it('should set correct filters in scatter plots', () => {
                jasmine.clock().tick(100);
                for (let i = 0; i < 2; ++i) {
                    const filter = chart.children()[i].filter();
                    expect(filter.filterType).toEqual('RangedTwoDimensionalFilter');
                    expect(dc.utils.arraysEqual(filter, [22, 35])).toEqual(true);
                }
            });

            describe('brush decreases in size', () => {
                beforeEach(() => {
                    simulateChartBrushing(chart, [22, 33]);
                    chart.redraw();
                });

                it('should filter down to fewer points', () => {
                    jasmine.clock().tick(100);
                    expect(otherDimension.top(Infinity).length).toBe(2);
                });

                it('should set correct filters in scatter plots', () => {
                    jasmine.clock().tick(100);
                    for (let i = 0; i < 2; ++i) {
                        const filter = chart.children()[i].filter();
                        expect(filter.filterType).toEqual('RangedTwoDimensionalFilter');
                        expect(dc.utils.arraysEqual(filter, [22, 33])).toEqual(true);
                    }
                });
            });

            describe('brush disappears', () => {
                beforeEach(() => {
                    simulateChartBrushing(chart, [22, 22]);
                    chart.redraw();
                });

                it('should clear all filters', () => {
                    expect(otherDimension.top(Infinity).length).toBe(10);
                });
            });

            it('should set clear filters in all children', () => {
                for (let i = 0; i < chart.children().length; ++i) {
                    expect(chart.children()[i].filter()).toEqual(null);
                }
            });
        });
    });

    describe('composite property', () => {
        let originalMargins;
        beforeEach(() => {
            originalMargins = chart.margins();

            chart.width(1000);
            chart.height(500);
            chart.margins({top: 100, right: 100, bottom: 100, left: 100});
        });

        it('should set width on child charts', () => {
            expect(chart.width()).toBe(1000);

            chart.children().forEach(child => {
                expect(child.width()).toBe(1000);
            });
        });

        it('should set height on child charts', () => {
            expect(chart.height()).toBe(500);

            chart.children().forEach(child => {
                expect(child.height()).toBe(500);
            });
        });

        it('should set margins of child charts', () => {
            expect(chart.margins()).not.toBeNull();
            expect(chart.margins()).not.toBe(originalMargins);

            chart.children().forEach(child => {
                expect(child.margins()).toBe(chart.margins());
            });
        });
    });

    describe('rescale', () => {
        beforeEach(() => {
            expect(chart.resizing()).toBe(true);
            chart.children().forEach(child => {
                expect(child.resizing()).toBe(true);
            });

            chart.render();

            expect(chart.resizing()).toBe(false);
            chart.children().forEach(child => {
                expect(child.resizing()).toBe(false);
            });

            chart.rescale();
        });

        it('should rescale child charts', () => {
            expect(chart.resizing()).toBe(true);

            chart.children().forEach(child => {
                expect(child.resizing()).toBe(true);
            });
        });
    });

    describe('re-compose rendered chart', () => {
        beforeEach(() => {
            chart.render();
            expect(chart.resizing()).toBe(false);

            chart.compose([
                new dc.LineChart(chart).group(dateGroup)
            ]);
        });

        it('should rescale child charts', () => {
            expect(chart.resizing()).toBe(true);

            chart.children().forEach(child => {
                expect(child.resizing()).toBe(true);
            });
        });
    });
});
