/* global appendChartID, loadDateFixture, makeDate, cleanDateRange, simulateChartBrushing */
describe('dc.coordinateGridChart', () => {
    let chart, id;
    let data, dimension, group;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(d => d3.utcDay(d.dd));
        group = dimension.group();

        id = 'coordinate-grid-chart';
        appendChartID(id);

        chart = new dc.LineChart(`#${id}`)
            .width(500)
            .height(150)
            .dimension(dimension)
            .group(group)
            .transitionDuration(0)
            .transitionDelay(0)
            .brushOn(false)
            .margins({top: 20, bottom: 0, right: 10, left: 0})
            .x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]));
    });

    describe('rendering', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should create the svg', () => {
            expect(chart.svg().empty()).toBeFalsy();
        });

        it('should create a root g', () => {
            expect(chart.g().empty()).toBeFalsy();
        });

        it('should register the chart', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });

        it('should set a dimension on the chart', () => {
            expect(chart.dimension()).toBe(dimension);
        });

        it('should set a group on the chart', () => {
            expect(chart.group()).toBe(group);
        });

        it('should set a width on the chart', () => {
            expect(chart.width()).toBe(500);
        });

        it('should set a height on the chart', () => {
            expect(chart.height()).toBe(150);
        });

        it('should use the height for the svg', () => {
            expect(chart.select('svg').attr('height')).toBe('150');
        });

        it('should have zero transition duration', () => {
            expect(chart.transitionDuration()).toBe(0);
        });

        it('should have zero transition delay', () => {
            expect(chart.transitionDelay()).toBe(0);
        });

        it('should set the margins of the chart', () => {
            expect(chart.margins()).not.toBeNull();
        });

        it('should set an x domain', () => {
            expect(chart.x()).toBeDefined();
        });

        it('should set a y domain', () => {
            expect(chart.y()).toBeDefined();
        });

        it('should set the x domain to endpoint dates', () => {
            expect(chart.x().domain()).toEqual([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]);
        });

        it('should create the brush', () => {
            expect(chart.select('g.brush')).not.toBeNull();
        });

        it('should not set round by default', () => {
            expect(chart.round()).not.toBeDefined();
        });

        it('should auto-calculate x range round based on width', () => {
            expect(chart.x().range()[0]).toBe(0);
            expect(chart.x().range()[1]).toBe(490);
        });

        it('should auto-calculate y range round based on height', () => {
            expect(chart.y().range()[0]).toBe(130);
            expect(chart.y().range()[1]).toBe(0);
        });

        it('should auto-calculate y domain based on height', () => {
            expect(chart.y().domain()[0]).toBe(0);
            expect(chart.y().domain()[1]).toBe(3);
        });

        it('should be able to change round', () => {
            chart.round(d3.utcDay.round);
            expect(chart.round()).not.toBeNull();
        });

        it('should have a default value for x', () => {
            expect(chart.keyAccessor()).not.toBeNull();
        });

        it('should have a default value for y', () => {
            expect(chart.valueAccessor()).not.toBeNull();
        });

        describe('renderlets', () => {
            beforeEach(() => {
                chart.on('renderlet', _chart => {
                    _chart.selectAll('path').attr('fill', 'red');
                });
            });

            it('should not run immediately', () => {
                expect(chart.selectAll('path').attr('fill')).not.toBe('red');
            });

            it('should run when render is invoked', () => {
                chart.render();
                expect(chart.selectAll('path').attr('fill')).toBe('red');
            });

            it('should run when redraw is invoked', () => {
                chart.redraw();
                expect(chart.selectAll('path').attr('fill')).toBe('red');
            });
        });

        describe('clip paths', () => {
            it('should only create one def', () => {
                expect(chart.selectAll('defs').size()).toBe(1);
            });

            it('should only create one clip path', () => {
                // selecting on ID due to webkit bug #83438
                expect(chart.selectAll('defs #coordinate-grid-chart-clip').size()).toBe(1);
            });

            it('should only create one clip rect', () => {
                expect(chart.selectAll('defs #coordinate-grid-chart-clip rect').size()).toBe(1);
            });

            it('should create a clip rect based on the graph size', () => {
                const rect = chart.select('defs #coordinate-grid-chart-clip rect');
                expect(rect.attr('width')).toBe('490');
                expect(rect.attr('height')).toBe('130');
            });

            it('should translate the clip rect to 0,0', () => {
                const rect = chart.select('defs #coordinate-grid-chart-clip rect');
                expect(rect.attr('transform')).toMatchTranslate(0, 0);
            });

            it('should add clip path refs to the chart body', () => {
                chart.selectAll('g.chart-body').each(function () {
                    expect(d3.select(this).attr('clip-path')).toMatchUrl(`${window.location.href}#coordinate-grid-chart-clip`);
                });
            });

            describe('setting clipPadding(20)', () => {

                beforeEach(() => {
                    chart.clipPadding(20);
                    chart.render();
                });

                it('should update the clip rect based on the graph size and clipPadding', () => {
                    const rect = chart.select('defs #coordinate-grid-chart-clip rect');
                    expect(rect.attr('width')).toBe('530');
                    expect(rect.attr('height')).toBe('170');
                });

                it('should translate the clip rect to -20,-20', () => {
                    const rect = chart.select('defs #coordinate-grid-chart-clip rect');
                    expect(rect.attr('transform')).toMatchTranslate(-20, -20);
                });

            });

            describe('with a complex selector', () => {
                beforeEach(() => {
                    appendChartID('coordinate-grid').append('div').attr('class', 'chart');
                    chart = new dc.LineChart('#coordinate-grid .chart')
                        .width(500)
                        .height(150)
                        .dimension(dimension)
                        .group(group)
                        .transitionDuration(0)
                        .transitionDelay(0)
                        .brushOn(false)
                        .margins({top: 20, bottom: 0, right: 10, left: 0})
                        .x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]));
                    chart.render();
                });
                it('should generate a valid clippath id', () => {
                    const rect = chart.select('defs #coordinate-grid--chart-clip rect');
                    expect(rect.empty()).toBeFalsy();
                });
            });

            describe('with a selector containing brackets', () => {
                beforeEach(() => {
                    appendChartID('coordinate-grid').append('div').attr('class', 'chart').attr('foo', '5bar');
                    chart = new dc.LineChart('#coordinate-grid .chart[foo="5bar"]')
                        .width(500)
                        .height(150)
                        .dimension(dimension)
                        .group(group)
                        .transitionDuration(0)
                        .transitionDelay(0)
                        .brushOn(false)
                        .margins({top: 20, bottom: 0, right: 10, left: 0})
                        .x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]));
                    chart.render();
                });
                it('should generate a valid clippath id', () => {
                    const rect = chart.select('defs #coordinate-grid--chart-foo--5bar---clip rect');
                    expect(rect.empty()).toBeFalsy();
                });
            });

            describe('redrawing at a different size', () => {
                beforeEach(() => {
                    chart.width(300).height(400).redraw();
                });
                it('should change the clippath to the new size', () => {
                    const rect = chart.select('defs #coordinate-grid-chart-clip rect');
                    expect(rect.attr('width')).toBe('290');
                    expect(rect.attr('height')).toBe('380');
                });
            });
        });

        describe('when an x function is not provided', () => {
            it('should trigger a descriptive exception', () => {
                try {
                    new dc.CoordinateGridMixin().group({}).dimension({}).render();
                    expect('exception').toBe('thrown');
                } catch (e) {
                    expect(e instanceof dc.InvalidStateException).toBeTruthy();
                    expect(e.message).toMatch(/Mandatory attribute chart.x is missing on chart\[#.+\]/);
                }
            });
        });

        describe('x-axis', () => {
            it('should place an x axis at the bottom', () => {
                expect(chart.select('g.x').attr('transform')).toMatchTranslate(0, 150);
            });

            it('should update x axis position when the chart height is changed', () => {
                chart.elasticX(true).height(400).redraw();
                expect(chart.select('g.x').attr('transform')).toMatchTranslate(0, 400);
            });

            describe('labels', () => {
                beforeEach(() => {
                    expect(chart.effectiveHeight()).toBe(130);
                    chart.xAxisLabel('X Label').render();
                });

                it('should set the x-axis label', () => {
                    expect(chart.selectAll('text.x-axis-label').text()).toBe('X Label');
                });

                it('should adjust the chart height accordingly due to label padding', () => {
                    expect(chart.effectiveHeight()).toBe(118);
                });

                describe('with custom padding', () => {
                    beforeEach(() => {
                        chart.xAxisLabel('Custom X Label', 50).render();
                    });

                    it('should adjust the chart height with respect to the custom padding', () => {
                        expect(chart.effectiveHeight()).toBe(80);
                    });
                });

                describe('reset axis label', () => {
                    beforeEach(() => {
                        chart.elasticX(true).xAxisLabel('New X Label').redraw();
                    });
                    it('should change the x-axis label', () => {
                        expect(chart.selectAll('text.x-axis-label').text()).toBe('New X Label');
                    });
                });
            });
        });

        describe('y-axes', () => {
            describe('grid lines', () => {
                beforeEach(() => {
                    // The calculations have changed internally for tick count from D3v3 to D3v4
                    // By default it guesses 10 ticks and computes from there. In v3 it ends up with 7 in v4
                    // it is 16. For 9 as well as 11 both the versions agree.
                    chart.yAxis().ticks(9);
                    chart
                        .renderHorizontalGridLines(true)
                        .renderVerticalGridLines(true)
                        .transitionDuration(300)
                        .render();
                });

                describe('horizontal grid lines', () => {
                    it('should draw lines associated with the data shown on the y-axis', () => {
                        const nthGridLine = function (n) {
                            return d3.select(chart.selectAll('.grid-line.horizontal line').nodes()[n]);
                        };

                        expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(7);
                        expect(nthGridLine(0).attr('y2')).toBe('130');
                        expect(nthGridLine(0).attr('y1')).toBe('130');
                        expect(nthGridLine(1).attr('y1')).toBe('108');
                        expect(nthGridLine(2).attr('y1')).toBe('87');
                    });

                    it('should position the lines horizontally on the graph', () => {
                        const firstGridLine = chart.select('.grid-line.horizontal line');
                        expect(firstGridLine.attr('x1')).toBe('1');
                        expect(firstGridLine.attr('x2')).toBe('490');
                        expect(firstGridLine.attr('y1')).toBe(firstGridLine.attr('y2'));
                    });

                    describe('with custom tick values', () => {
                        beforeEach(() => {
                            chart.yAxis().tickValues([0, 1, 2]);
                            chart.render();
                        });

                        it('should draws lines associated with the data using the custom ticks', () => {
                            const nthGridLine = function (n) {
                                return d3.select(chart.selectAll('.grid-line.horizontal line').nodes()[n]);
                            };

                            expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(3);
                            expect(nthGridLine(0).attr('y2')).toBe('130');
                            expect(nthGridLine(0).attr('y1')).toBe('130');
                            expect(nthGridLine(1).attr('y1')).toBe('87');
                            expect(nthGridLine(2).attr('y1')).toBe('43');
                        });
                    });

                    describe('after renderlet', () => {
                        let opacityValue;
                        beforeEach(done => {
                            chart.on('renderlet', _chart => {
                                opacityValue = _chart.select('.grid-line.horizontal line').attr('opacity');

                                done();
                            });
                        });

                        it('should have 0.5 opacity', () => {
                            expect(opacityValue).toBe('0.5');
                        });
                    });

                });

                describe('vertical grid lines', () => {
                    it('should draw lines associated with the data shown on the x-axis', () => {
                        const nthGridLine = function (n) {
                            return d3.select(chart.selectAll('.grid-line.vertical line').nodes()[n]);
                        };

                        expect(chart.selectAll('.grid-line.vertical line').size()).toBe(13);
                        expect(nthGridLine(0).attr('x2')).toBe('0');
                        expect(nthGridLine(0).attr('x1')).toBe('0');
                        expect(nthGridLine(1).attr('x1')).toBeWithinDelta(39, 1);
                        expect(nthGridLine(2).attr('x1')).toBeWithinDelta(79, 1);
                    });

                    it('should position the lines vertically on the graph', () => {
                        const firstGridLine = chart.select('.grid-line.vertical line');
                        expect(firstGridLine.attr('y1')).toBe('130');
                        expect(firstGridLine.attr('y2')).toBe('0');
                        expect(firstGridLine.attr('x1')).toBe(firstGridLine.attr('x2'));
                    });

                    describe('with custom tick values', () => {
                        beforeEach(() => {
                            chart.xAxis().tickValues([makeDate(2012, 4, 21), makeDate(2012, 5, 20), makeDate(2012, 6, 1)]);
                            chart.render();
                        });

                        it('should draw lines associated with the data using the custom ticks', () => {
                            const nthGridLine = function (n) {
                                return d3.select(chart.selectAll('.grid-line.vertical line').nodes()[n]);
                            };

                            expect(chart.selectAll('.grid-line.vertical line').size()).toBe(3);
                            expect(nthGridLine(0).attr('x2')).toBeWithinDelta(6, 1);
                            expect(nthGridLine(0).attr('x1')).toBeWithinDelta(6, 1);
                            expect(nthGridLine(1).attr('x1')).toBeWithinDelta(175, 1);
                            expect(nthGridLine(2).attr('x1')).toBeWithinDelta(237, 1);
                        });
                    });

                    describe('with an ordinal x axis', () => {
                        beforeEach(() => {
                            chart.x(d3.scaleBand())
                                .xUnits(dc.units.ordinal)
                                .render();
                        });
                        it('should render without errors', () => {
                            expect(chart.selectAll('.grid-line.vertical line').size()).toBe(6);
                        });
                    });

                    describe('after renderlet', () => {
                        let opacityValue;
                        beforeEach(done => {
                            chart.on('renderlet', _chart => {
                                opacityValue = _chart.select('.grid-line.vertical line').attr('opacity');

                                done();
                            });
                        });

                        it('should have 0.5 opacity', () => {
                            expect(opacityValue).toBe('0.5');
                        });
                    });
                });
            });

            describe('a left y-axis', () => {
                beforeEach(() => {
                    chart.render();
                });

                it('should render a y-axis', () => {
                    expect(chart.selectAll('.axis.y').size()).toBe(1);
                });

                // can't determine axis orientation in D3v4+, see d3/d3-axis#16
                /*it('should orient the y-axis text to the left by default', function () {
                    expect(chart.yAxis().orient()).toBe('left');
                });*/

                it('should place the y axis to the left', () => {
                    expect(chart.select('g.y').attr('transform')).toMatchTranslate(0, 20);
                });

                describe('y-axis labels', () => {
                    beforeEach(() => {
                        expect(chart.effectiveWidth()).toBe(490);
                        chart.yAxisLabel('The Y Axis Label').render();
                    });

                    it('should display provided label text', () => {
                        expect(chart.selectAll('text.y-axis-label.y-label').text()).toBe('The Y Axis Label');
                    });

                    it('should change the effective width of the chart due to padding', () => {
                        expect(chart.effectiveWidth()).toBe(478);
                    });

                    it('should position the label to the left of the chart', () => {
                        expect(chart.selectAll('text.y-axis-label.y-label').attr('transform')).toMatchTransRot(12, 85, -90);
                    });

                    describe('with custom padding', () => {
                        beforeEach(() => {
                            chart.yAxisLabel('Custom Y Label', 50).render();
                        });

                        it('should adjust the chart height with respect to the custom padding', () => {
                            expect(chart.effectiveWidth()).toBe(440);
                        });
                    });
                });
            });

            describe('a right y-axis', () => {
                beforeEach(() => {
                    chart.useRightYAxis(true).render();
                });

                it('should render a y-axis', () => {
                    expect(chart.selectAll('.axis.y').size()).toBe(1);
                });

                // can't determine axis orientation in D3v4+, see d3/d3-axis#16
                /*it('should orient the y-axis text to the right', function () {
                    expect(chart.yAxis().orient()).toBe('right');
                });*/

                it('should position the axis to the right of the chart', () => {
                    expect(chart.select('.axis.y').attr('transform')).toMatchTranslate(490, 20);
                });

                describe('y-axis labels', () => {
                    beforeEach(() => {
                        expect(chart.effectiveWidth()).toBe(490);
                        chart.yAxisLabel('Right Y Axis Label').render();
                    });

                    it('should display provided label text', () => {
                        expect(chart.selectAll('text.y-axis-label.y-label').text()).toBe('Right Y Axis Label');
                    });

                    it('should change the effective width of the chart due to padding', () => {
                        expect(chart.effectiveWidth()).toBe(478);
                    });

                    it('should position the label to the right of the chart', () => {
                        expect(chart.selectAll('text.y-axis-label.y-label').attr('transform')).toMatchTransRot(488, 85, 90);
                    });

                    describe('with custom padding', () => {
                        beforeEach(() => {
                            chart.yAxisLabel('Custom Y Label', 50).render();
                        });

                        it('should adjust the chart height with respect to the custom padding', () => {
                            expect(chart.effectiveWidth()).toBe(440);
                        });
                    });
                });
            });
        });
    });

    describe('elastic axis', () => {
        describe('with data', () => {
            beforeEach(() => {
                data.dimension(d => d.countrycode).filter('CA');

                chart.elasticX(true).elasticY(true).render();
            });

            it('should shrink the y axis', () => {
                expect(chart.y().domain()[1]).toBe(1);
            });

            it('should shrink the x domain', () => {
                expect(chart.x().domain()).toEqual([makeDate(2012, 4, 25), makeDate(2012, 7, 10)]);
            });
        });

        describe('with no data', () => {
            beforeEach(() => {
                data.dimension(d => d.countrycode).filter('INVALID CODE');

                chart.elasticX(true).elasticY(true).render();
            });

            it('should set y-axis to be empty', () => {
                expect(chart.y().domain()[0]).toBe(0);
                expect(chart.y().domain()[1]).toBe(0);
            });

        });
    });

    describe('rescaling', () => {
        let originalUnitCount;
        beforeEach(() => {
            expect(chart.resizing()).toBe(true);
            chart.render();
            expect(chart.resizing()).toBe(false);

            originalUnitCount = chart.xUnitCount();
            chart.x().domain([makeDate(2012, 4, 20), makeDate(2012, 6, 15)]);
            chart.rescale();
        });

        it('should reset x unit count to reflect updated x domain', () => {
            expect(chart.xUnitCount()).not.toEqual(originalUnitCount);
        });

        it('should be resizing until render', () => {
            expect(chart.resizing()).toBe(true);
            chart.render();
            expect(chart.resizing()).toBe(false);
        });
    });

    describe('range chart setup', () => {
        let rangeChart;

        beforeEach(() => {
            rangeChart = buildRangeChart();
            chart.rangeChart(rangeChart);
            chart.render();
            rangeChart.render();
        });

        it('should set our chart as range chart\'s focus chart', () => {
            expect(chart.rangeChart().focusChart()).toEqual(chart);
        });
    });

    describe('setting x', () => {
        const newDomain = [1, 10];
        beforeEach(() => {
            chart.x(d3.scaleLinear().domain(newDomain));
        });

        it('should reset the original x domain', () => {
            expect(chart.xOriginalDomain()).toEqual(newDomain);
        });
    });

    describe('x unit count', () => {
        it('reflects number of units in chart domain', () => {
            const domain = chart.x().domain();
            expect(chart.xUnitCount()).toEqual(dc.units.integers(domain[0], domain[1], domain));
        });

        describe('with fixed units', () => {
            beforeEach(() => {
                chart.xUnits((start, end, xDomain) => 10);
            });

            it('should return the fixed unit count', () => {
                expect(chart.xUnitCount()).toEqual(10);
            });
        });
    });

    describe('ordinality flag', () => {
        describe('when x units are not ordinal', () => {
            it('should be false', () => {
                expect(chart.isOrdinal()).toBeFalsy();
            });
        });

        describe('when x units are ordinal', () => {
            beforeEach(() => {
                chart.xUnits(dc.units.ordinal);
            });

            it('should be true', () => {
                expect(chart.isOrdinal()).toBeTruthy();
            });
        });
    });

    describe('applying a filter', () => {
        const filter = [makeDate(2012, 5, 20), makeDate(2012, 6, 15)];
        beforeEach(() => {
            chart.brushOn(true);
            chart.render();
            chart.filter(filter);
        });

        it('should update the brush selection', () => {
            // expect(chart.getBrushSelection()).toEqual(filter);
            const brushSelectionRect = chart.select('g.brush rect.selection');
            expect(brushSelectionRect.attr('x')).toBeCloseTo(chart.x()(filter[0]), 1);
            expect((+brushSelectionRect.attr('x')) + (+brushSelectionRect.attr('width')))
                .toBeCloseTo(chart.x()(filter[1]), 1);
        });
    });

    describe('removing the filter', () => {
        beforeEach(() => {
            chart.brushOn(true);
            chart.render();
            simulateChartBrushing(chart, [makeDate(2012, 5, 20), makeDate(2012, 6, 15)]);
            chart.filter(null);
        });

        it('should clear the brush selection', () => {
            const brushSelectionRect = chart.select('g.brush rect.selection');
            expect(+brushSelectionRect.attr('width')).toEqual(0);
        });
    });

    describe('rendering for the first time with mouse zoom disabled when it wasn\'t previously enabled', () => {
        beforeEach(() => {
            chart.mouseZoomable(false);
            spyOn(chart, '_disableMouseZoom');
            chart.render();
        });

        it('should not explicitly disable mouse zooming', () => {
            expect(chart._disableMouseZoom).not.toHaveBeenCalled();
        });
    });

    describe('rendering with mouse zoom disabled after it was previously enabled', () => {
        beforeEach(() => {
            chart.mouseZoomable(true);
            chart.render();
            chart.mouseZoomable(false);
            spyOn(chart, '_disableMouseZoom');
            chart.render();
        });

        it('should explicitly disable mouse zooming', () => {
            expect(chart._disableMouseZoom).toHaveBeenCalled();
        });
    });

    describe('with mouse zoom disabled', () => {
        beforeEach(() => {
            chart.mouseZoomable(false);
            chart.render();
        });

        it('should not respond to double-click by refocusing', () => {
            doubleClick(chart);
            expect(chart.refocused()).toBeFalsy();
        });
    });

    describe('zooming', () => {
        let rangeChart, zoomCallback;

        const context = function () { return {chart: chart, zoomCallback: zoomCallback}; };

        beforeEach(() => {
            zoomCallback = jasmine.createSpy();
            chart.on('zoomed', zoomCallback);
            chart.mouseZoomable(true);
            rangeChart = buildRangeChart();
            chart.rangeChart(rangeChart);
            chart.render();
            rangeChart.render();

            spyOn(chart, 'redraw');
            spyOn(rangeChart, 'redraw');
        });

        describe('when chart is zoomed via mouse interaction', () => {
            beforeEach(() => {
                doubleClick(chart);
            });

            itActsLikeItZoomed(context);
        });

        describe('when chart is zoomed programatically via focus method', () => {
            beforeEach(() => {
                chart.focus([makeDate(2012, 5, 1), makeDate(2012, 5, 15)]);
            });

            itActsLikeItZoomed(context);
        });

        function itActsLikeItZoomed (ctx) {
            describe('(shared things that happen on zooming)', () => {
                let _chart, _zoomCallback;
                beforeEach(() => {
                    _chart = ctx().chart;
                    _zoomCallback = ctx().zoomCallback;
                });

                it('should be flagged as refocused', () => {
                    expect(_chart.refocused()).toBeTruthy();
                });

                it('should update chart filter to match new x domain', () => {
                    const filter = cleanDateRange(_chart.filter());
                    expect(filter).toEqual(_chart.x().domain());
                });

                it('should be rescaled', () => {
                    const domain = _chart.x().domain();
                    expect(_chart.xUnitCount()).toEqual(dc.units.integers(domain[0], domain[1], domain));
                });

                it('should redraw itself', () => {
                    expect(_chart.redraw).toHaveBeenCalled();
                });

                it('should update its range chart\'s filter', () => {
                    expect(dc.utils.arraysEqual(_chart.rangeChart().filter(), _chart.filter())).toEqual(true);
                });

                it('should trigger redraw on its range chart', () => {
                    expect(_chart.rangeChart().redraw).toHaveBeenCalled();
                });

                it('should fire custom zoom listeners', () => {
                    expect(_zoomCallback).toHaveBeenCalled();
                });

            });
        }
    });

    describe('when chart is zoomed in, then zoomed back out to original domain', () => {
        beforeEach(() => {
            chart.render();
            doubleClick(chart);
            chart.focus(chart.xOriginalDomain());
        });

        it('should not be flagged as refocused', () => {
            expect(chart.refocused()).toBeFalsy();
        });
    });

    describe('brushing', () => {
        beforeEach(() => {
            chart.brushOn(true);
            chart.render();
        });

        describe('with equal dates', () => {
            beforeEach(() => {
                simulateChartBrushing(chart, [22, 22]);
            });

            it('should clear the chart filter', () => {
                expect(chart.filter()).toBeFalsy();
            });
        });
    });

    describe('with a range chart', () => {
        let rangeChart;
        const selectedRange = [makeDate(2012, 6, 1), makeDate(2012, 6, 15)];

        beforeEach(() => {
            rangeChart = buildRangeChart();
            chart.rangeChart(rangeChart);
            chart.render();
            rangeChart.render();
        });

        it('range filter should execute filtered listener and zoom focus chart', () => {
            spyOn(chart, 'focus').and.callThrough();
            const expectedCallbackSignature = function (callbackChart, callbackFilter) {
                expect(callbackChart).toBe(rangeChart);
                expect(callbackFilter).toEqual(selectedRange);
            };
            const filteredCallback = jasmine.createSpy().and.callFake(expectedCallbackSignature);
            rangeChart.on('filtered', filteredCallback);
            expect(filteredCallback).not.toHaveBeenCalled();

            rangeChart.filter(selectedRange);
            expect(filteredCallback).toHaveBeenCalled();

            expect(chart.focus).toHaveBeenCalled();
            const focus = cleanDateRange(chart.focus.calls.argsFor(0)[0]);
            expect(focus).toEqual(selectedRange);
        });

        it('should zoom the focus chart when range chart is brushed', () => {
            spyOn(chart, 'focus').and.callThrough();
            simulateChartBrushing(rangeChart, selectedRange);
            jasmine.clock().tick(100);
            const focus = cleanDateRange(chart.focus.calls.argsFor(0)[0]);
            expect(focus).toEqual(selectedRange);
        });

        it('should zoom the focus chart back out when range chart is un-brushed', () => {
            simulateChartBrushing(rangeChart, selectedRange);
            jasmine.clock().tick(100);

            expect(chart.x().domain()).toEqual(selectedRange);
            rangeChart.filter(null);
            jasmine.clock().tick(100);
            expect(rangeChart.x().domain()).toEqual(rangeChart.xOriginalDomain());
        });

        it('should update the range chart brush to match zoomed domain of focus chart', () => {
            spyOn(rangeChart, 'replaceFilter');
            chart.focus(selectedRange);
            const replaceFilter = cleanDateRange(rangeChart.replaceFilter.calls.argsFor(0)[0]);
            expect(replaceFilter).toEqual(selectedRange);
        });
    });

    describe('with zoom restriction enabled', () => {
        beforeEach(() => {
            chart.zoomOutRestrict(true);
            chart.render();
            chart.focus([makeDate(2012, 8, 20), makeDate(2012, 8, 25)]);
        });

        it('should not be able to zoom out past its original x domain', () => {
            chart.focus([makeDate(2012, 2, 20), makeDate(2012, 9, 15)]);
            expect(chart.x().domain()).toEqual(chart.xOriginalDomain());
        });

        describe('with a range chart', () => {
            beforeEach(() => {
                const rangeChart = buildRangeChart();
                chart.rangeChart(rangeChart);
                chart.render();
                rangeChart.render();
                chart.focus([makeDate(2012, 8, 20), makeDate(2012, 8, 25)]);
            });

            it('should not be able to zoom out past its range chart origin x domain', () => {
                chart.focus([makeDate(2012, 2, 20), makeDate(2012, 9, 15)]);
                expect(chart.x().domain()).toEqual(chart.rangeChart().xOriginalDomain());
            });
        });
    });

    describe('with zoom restriction disabled', () => {
        beforeEach(() => {
            chart.zoomOutRestrict(false);
            chart.render();
            chart.focus([makeDate(2012, 8, 20), makeDate(2012, 8, 25)]);
        });

        it('should be able to zoom out past its original x domain', () => {
            chart.focus([makeDate(2012, 2, 20), makeDate(2012, 9, 15)]);
            chart.render();
            expect(chart.x().domain()).toEqual([makeDate(2012, 2, 20), makeDate(2012, 9, 15)]);
        });
    });

    describe('focus', () => {
        beforeEach(() => {
            chart.render();
        });

        describe('when called with a range argument', () => {
            const focusDomain = [makeDate(2012, 5, 20), makeDate(2012, 5, 30)];

            beforeEach(() => {
                chart.focus(focusDomain);
            });

            it('should update the x domain to match specified domain', () => {
                expect(chart.x().domain()).toEqual(focusDomain);
            });
        });

        describe('when called with no arguments', () => {
            beforeEach(() => {
                chart.focus([makeDate(2012, 5, 1), makeDate(2012, 5, 2)]);
                chart.focus();
            });

            it('should revert the x domain to the original domain', () => {
                expect(chart.x().domain()).toEqual(chart.xOriginalDomain());
            });
        });
    });

    function buildRangeChart () {
        const rangeId = 'range-chart';
        appendChartID(rangeId);
        return new dc.LineChart(`#${rangeId}`)
            .dimension(dimension)
            .group(dimension.group().reduceSum(d => d.id))
            .x(d3.scaleUtc().domain([makeDate(2012, 5, 20), makeDate(2012, 6, 15)]));
    }

    function doubleClick (_chart) {
        const centerX = _chart.root().node().clientLeft + (_chart.width() / 2);
        const centerY = _chart.root().node().clientTop + (_chart.height() / 2);
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('dblclick', true, true, window, centerX, centerY, centerX, centerY, 0, false, false, false, false, 0, null);
        _chart.root().node().dispatchEvent(event);
    }
});
