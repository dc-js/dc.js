describe('dc.coordinateGridChart', function() {
    var chart;

    beforeEach(function () {
        chart = dc.coordinateGridChart({}).group({}).dimension({});
    });

    describe('when an x function is not provided', function () {
        it('should trigger a descriptive exception', function () {
            try {
                chart.render();
                expect("exception").toBe("thrown");
            } catch (e) {
                expect(e instanceof dc.errors.InvalidStateException).toBeTruthy();
                expect(e.message).toMatch(/Mandatory attribute chart.x is missing on chart\[#\d+\]/);
            }
        });
    });

    describe('the y-axis', function () {
        var chart;

        beforeEach(function () {
            var data = crossfilter(loadDateFixture());
            var dimension = data.dimension(function(d) { return d3.time.day(d.dd); });
            var group = dimension.group();

            var id = "coordinate-grid-chart";
            appendChartID(id);

            chart = dc.lineChart("#" + id)
                .width(500)
                .height(150)
                .dimension(dimension)
                .group(group)
                .transitionDuration(0)
                .brushOn(false)
                .margins({ top: 20, bottom: 0, right: 10, left: 0 })
                .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]));
        });


        describe('grid lines', function () {
            beforeEach(function () {
                chart
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .render();
            });

            describe('horizontal grid lines', function () {
                it('should draw lines associated with the data shown on the right y-axis', function () {
                    var nthGridLine = function (n) { return d3.select(chart.selectAll('.grid-line.horizontal line')[0][n]); };

                    expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(7);
                    expect(nthGridLine(0).attr('y2')).toBe('130');
                    expect(nthGridLine(0).attr('y1')).toBe('130');
                    expect(nthGridLine(1).attr('y1')).toBe('108');
                    expect(nthGridLine(2).attr('y1')).toBe('87');
                });

                it('should position the lines horizontally on the graph', function () {
                    var firstGridLine = chart.select('.grid-line.horizontal line');
                    expect(firstGridLine.attr('x1')).toBe('1');
                    expect(firstGridLine.attr('x2')).toBe('490');
                    expect(firstGridLine.attr('y1')).toBe(firstGridLine.attr('y2'));
                });

                describe('with custom tick values', function () {
                    beforeEach(function () {
                        chart.yAxis().tickValues([0, 1, 2]);
                        chart.render();
                    });

                    it('should draws lines associated with the data using the custom ticks', function () {
                        var nthGridLine = function (n) { return d3.select(chart.selectAll('.grid-line.horizontal line')[0][n]); };

                        expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(3);
                        expect(nthGridLine(0).attr('y2')).toBe('130');
                        expect(nthGridLine(0).attr('y1')).toBe('130');
                        expect(nthGridLine(1).attr('y1')).toBe('87');
                        expect(nthGridLine(2).attr('y1')).toBe('43');
                    });
                });
            });

            describe('vertical grid lines', function () {
                it('should draw lines associated with the data shown on the x-axis', function () {
                    var nthGridLine = function (n) { return d3.select(chart.selectAll('.grid-line.vertical line')[0][n]); };

                    expect(chart.selectAll('.grid-line.vertical line').size()).toBe(13);
                    expect(nthGridLine(0).attr('x2')).toBe('0');
                    expect(nthGridLine(0).attr('x1')).toBe('0');
                    expect(nthGridLine(1).attr('x1')).toBeWithinDelta(39, 1);
                    expect(nthGridLine(2).attr('x1')).toBeWithinDelta(79, 1);
                });

                it('should position the lines vertically on the graph', function () {
                    var firstGridLine = chart.select('.grid-line.vertical line');
                    expect(firstGridLine.attr('y1')).toBe('130');
                    expect(firstGridLine.attr('y2')).toBe('0');
                    expect(firstGridLine.attr('x1')).toBe(firstGridLine.attr('x2'));
                });

                describe('with custom tick values', function () {
                    beforeEach(function () {
                        chart.xAxis().tickValues([new Date("2012/05/21"), new Date("2012/06/20"), new Date("2012/07/01")]);
                        chart.render();
                    });

                    it('should draw lines associated with the data using the custom ticks', function () {
                        var nthGridLine = function (n) { return d3.select(chart.selectAll('.grid-line.vertical line')[0][n]); };

                        expect(chart.selectAll('.grid-line.vertical line').size()).toBe(3);
                        expect(nthGridLine(0).attr('x2')).toBeWithinDelta(6, 1);
                        expect(nthGridLine(0).attr('x1')).toBeWithinDelta(6, 1);
                        expect(nthGridLine(1).attr('x1')).toBeWithinDelta(175, 1);
                        expect(nthGridLine(2).attr('x1')).toBeWithinDelta(237, 1);
                    });
                });
            });
        });

        describe('a left y-axis', function () {
            beforeEach(function () {
                chart.render();
            });

            it('should orient the y-axis text to the left by default', function () {
                expect(chart.yAxis().orient()).toBe("left");
            });

            describe('y-axis labels', function () {
                beforeEach(function () {
                    chart.yAxisLabel("The Y Axis Label").render();
                });

                it('should display provided label text', function () {
                    expect(chart.selectAll('text.y-axis-label.y-label').text()).toBe("The Y Axis Label");
                });

                it('should position the label to the left of the chart', function () {
                    expect(chart.selectAll('text.y-axis-label.y-label').attr("transform")).toBe("translate(12,85),rotate(-90)");
                });
            });
        });

        describe('a right y-axis', function () {
            beforeEach(function () {
                chart.useRightYAxis(true).render();
            });

            it('should render a y-axis', function () {
                expect(chart.selectAll('.axis.y').size()).toBe(1);
            });

            it('should orient the y-axis text to the right', function () {
                expect(chart.yAxis().orient()).toBe("right");
            });

            it('should position the axis to the right of the chart', function () {
                expect(chart.select('.axis.y').attr('transform')).toBe('translate(490,20)');
            });

            describe('y-axis labels', function () {
                beforeEach(function () {
                    chart.yAxisLabel("Right Y Axis Label").render();
                });

                it('should display provided label text', function () {
                    expect(chart.selectAll('text.y-axis-label.y-label').text()).toBe("Right Y Axis Label");
                });

                it('should position the label to the right of the chart', function () {
                    expect(chart.selectAll('text.y-axis-label.y-label').attr("transform")).toBe("translate(488,85),rotate(90)");
                });
            });
        });
    });

    describe("for a line chart", function() {
        var id, chart, dateDimension, dateValueSumGroup, dateIdSumGroup;

        beforeEach(function () {
            var data = crossfilter(loadDateFixture());
            dateDimension = data.dimension(function(d) { return d3.time.day(d.dd); });
            dateValueSumGroup = dateDimension.group().reduceSum(function(d) { return d.value; });
            dateIdSumGroup = dateDimension.group().reduceSum(function(d) { return d.id; });

            id = "coordinate-grid-chart";
            appendChartID(id);
            chart = dc.lineChart("#" + id);

            chart
                .dimension(dateDimension)
                .group(dateIdSumGroup)
                .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]));

            dc.constants.EVENT_DELAY = 0;
        });

        describe("mandatory attributes", function () {
            it("should include x", function () {
                expect(chart._mandatoryAttributes()).toContain("x");
            });
        });

        describe("rescaling", function () {
            var originalUnitCount;
            beforeEach(function () {
                chart.render();
                originalUnitCount = chart.xUnitCount();
                chart.x().domain([new Date(2012, 4, 20), new Date(2012, 6, 15)]);
                chart.rescale();
            });

            it("should reset x unit count to reflect updated x domain", function () {
                expect(chart.xUnitCount()).not.toEqual(originalUnitCount);
            });
        });

        describe("range chart setup", function () {
            var rangeChart;

            beforeEach(function () {
                rangeChart = buildRangeChart(dateDimension, dateIdSumGroup);
                chart.rangeChart(rangeChart);
                chart.render();
                rangeChart.render();
            });

            it("should set our chart as range chart's focus chart", function () {
                expect(chart.rangeChart().focusChart()).toEqual(chart);
            });
        });

        describe("restricting zoom out", function () {
            beforeEach(function () {
                chart.zoomScale([-1,10]);
                chart.zoomOutRestrict(true);
            });

            it("should set the start of zoom scale extent to 1", function () {
                expect(chart.zoomScale()[0]).toEqual(1);
            });

            it("sohuld leave the end of zoom scale extent unchanged", function () {
                expect(chart.zoomScale()[1]).toEqual(10);
            });
        });

        describe("disabling zoom out restriction", function () {
            beforeEach(function () {
                chart.zoomScale([-1,10]);
                chart.zoomOutRestrict(false);
            });

            it("should set the start of zoom scale extent to 0", function () {
                expect(chart.zoomScale()[0]).toEqual(0);
            });
        });

        describe("setting x", function () {
            var newDomain = [1,10];
            beforeEach(function () {
                chart.x(d3.scale.linear().domain(newDomain));
            });

            it("should reset the original x domain", function () {
                expect(chart.xOriginalDomain()).toEqual(newDomain);
            });
        });

        describe("x unit count", function () {
            it("reflects number of units in chart domain", function () {
                var domain = chart.x().domain();
                expect(chart.xUnitCount()).toEqual(dc.units.integers(domain[0], domain[1], domain));
            });

            describe("with fixed units", function () {
                beforeEach(function () {
                    chart.xUnits(function (start, end, xDomain) { return 10; });
                });

                it("should return the fixed unit count", function () {
                    expect(chart.xUnitCount()).toEqual(10);
                });
            });
        });

        describe("ordinality flag", function () {
            describe("when x units are not ordinal", function () {
                it("should be false", function () {
                    expect(chart.isOrdinal()).toBeFalsy();
                });
            });

            describe("when x units are ordinal", function () {
                beforeEach(function () {
                    chart.xUnits(dc.units.ordinal);
                });

                it("should be true", function () {
                    expect(chart.isOrdinal()).toBeTruthy();
                });
            });
        });

        describe("applying a filter", function () {
            var filter = [new Date(2012, 5, 20), new Date(2012, 6, 15)];
            beforeEach(function () {
                chart.brushOn(true);
                chart.render();
                chart.filter(filter);
            });

            it("should update the brush extent", function () {
                expect(chart.brush().extent()).toEqual(filter);
            });
        });

        describe("removing the filter", function () {
            beforeEach(function () {
                chart.brushOn(true);
                chart.render();
                chart.brush().extent([new Date(2012, 5, 20), new Date(2012, 6, 15)]);
                chart.filter(null);
            });

            it("should clear the brush extent", function () {
                expect(chart.brush().empty()).toBeTruthy();
            });
        });

        describe("rendering for the first time with mouse zoom disabled when it wasn't previously enabled", function () {
            beforeEach(function () {
                chart.mouseZoomable(false);
                spyOn(chart, "_disableMouseZoom");
                chart.render();
            });

            it("should not explicitly disable mouse zooming", function () {
                expect(chart._disableMouseZoom).not.toHaveBeenCalled();
            });
        });

        describe("rendering with mouse zoom disabled after it was previously enabled", function () {
            beforeEach(function () {
                chart.mouseZoomable(true);
                chart.render();
                chart.mouseZoomable(false);
                spyOn(chart, "_disableMouseZoom");
                chart.render();
            });

            it("should explicitly disable mouse zooming", function () {
                expect(chart._disableMouseZoom).toHaveBeenCalled();
            });
        });

        describe("with mouse zoom disabled", function () {
            beforeEach(function () {
                chart.mouseZoomable(false);
                chart.render();
            });

            it("should not respond to double-click by refocusing", function () {
                doubleClick(chart);
                expect(chart.refocused()).toBeFalsy();
            });
        });

        describe("zooming", function () {
            var zoomCallback, context;

            context = function () { return { chart: chart, zoomCallback: zoomCallback }; };

            beforeEach(function () {
                zoomCallback = jasmine.createSpy();
                chart.on("zoomed", zoomCallback);
                chart.mouseZoomable(true);
                rangeChart = buildRangeChart(dateDimension, dateIdSumGroup);
                chart.rangeChart(rangeChart);
                chart.render();
                rangeChart.render();

                spyOn(dc, "redrawAll");
                spyOn(chart, "redraw");
                spyOn(rangeChart, "redraw");
            });

            describe("when chart is zoomed via mouse interaction", function () {
                beforeEach(function () {
                    doubleClick(chart);
                });

                itActsLikeItZoomed(context);
            });

            describe("when chart is zoomed programatically via focus method", function () {
                beforeEach(function () {
                    chart.focus([new Date(2012, 5, 1), new Date(2012, 5, 15)]);
                });

                itActsLikeItZoomed(context);
            });
        });

        describe("when chart is zoomed in, then zoomed back out to original domain", function () {
            beforeEach(function () {
                chart.render();
                doubleClick(chart);
                chart.focus(chart.xOriginalDomain());
            });

            it("should not be flagged as refocused", function () {
                expect(chart.refocused()).toBeFalsy();
            });
        });

        describe("brushing", function () {
            beforeEach(function () {
                chart.brushOn(true);
            });

            describe("with mouse zoom enabled", function () {
                beforeEach(function () {
                    spyOn(chart, '_disableMouseZoom');
                    spyOn(chart, '_enableMouseZoom');
                    chart.mouseZoomable(true);
                    chart.render();
                    chart.brush().extent([new Date(2012, 6, 1), new Date(2012, 6, 15)]);
                    chart.brush().event(chart.root());
                });

                it("should disable mouse zooming on brush start, and re-enables it afterwards", function () {
                    chart.brush().extent([new Date(2012, 6, 1), new Date(2012, 6, 15)]);
                    chart.brush().event(chart.root());
                    expect(chart._disableMouseZoom).toHaveBeenCalled();
                    expect(chart._enableMouseZoom).toHaveBeenCalled();
                });
            });

            describe("with mouse zoom disabled", function () {
                beforeEach(function () {
                    spyOn(chart, "_enableMouseZoom");
                    chart.mouseZoomable(false);
                    chart.render();
                    chart.brush().extent([new Date(2012, 6, 1), new Date(2012, 6, 15)]);
                    chart.brush().event(chart.root());
                });

                it("should not enable mouse zooming", function () {
                    expect(chart._enableMouseZoom).not.toHaveBeenCalled();
                });
            });

            describe("with equal dates", function () {
                beforeEach(function () {
                    spyOn(chart, "filter");
                    chart.brush().clear();
                    chart.render();
                    chart.brush().event(chart.root());
                });

                it("should clear the chart filter", function () {
                    expect(chart.filter()).toEqual(undefined);
                });
            });
        });

        describe("with a range chart", function () {
            var rangeChart;
            var selectedRange = [new Date(2012, 6, 1), new Date(2012, 6, 15)];
            beforeEach(function () {
                rangeChart = buildRangeChart(dateDimension, dateIdSumGroup);
                chart.rangeChart(rangeChart);
                chart.render();
                rangeChart.render();
            });

            it("should zoom the focus chart when range chart is brushed", function () {
                spyOn(chart, "focus");
                rangeChart.brush().extent(selectedRange);
                rangeChart.brush().event(rangeChart.g());
                expect(chart.focus).toHaveBeenCalledWith(selectedRange);
            });

            it("should update the range chart brush to match zoomed domain of focus chart", function () {
                spyOn(rangeChart, "replaceFilter");
                chart.focus(selectedRange);
                expect(rangeChart.replaceFilter).toHaveBeenCalledWith(selectedRange);
            });
        });

        describe("with zoom restriction enabled", function () {
            beforeEach(function () {
                chart.zoomOutRestrict(true);
                chart.render();
                chart.focus([new Date(2012, 8, 20), new Date(2012, 8, 25)]);
            });

            it("should not be able to zoom out past its original x domain", function () {
                chart.focus([new Date(2012, 2, 20), new Date(2012, 9, 15)]);
                expect(chart.x().domain()).toEqual(chart.xOriginalDomain());
            });

            describe("with a range chart", function () {
                beforeEach(function () {
                    var rangeChart = buildRangeChart(dateDimension, dateIdSumGroup);
                    chart.rangeChart(rangeChart);
                    chart.render();
                    rangeChart.render();
                    chart.focus([new Date(2012, 8, 20), new Date(2012, 8, 25)]);
                });

                it("should not be able to zoom out past its range chart origin x domain", function () {
                    chart.focus([new Date(2012, 2, 20), new Date(2012, 9, 15)]);
                    expect(chart.x().domain()).toEqual(chart.rangeChart().xOriginalDomain());
                });
            });
        });

        describe("with zoom restriction disabled", function () {
            beforeEach(function () {
                chart.zoomOutRestrict(false);
                chart.render();
                chart.focus([new Date(2012, 8, 20), new Date(2012, 8, 25)]);
            });

            it("should be able to zoom out past its original x domain", function () {
                chart.focus([new Date(2012, 2, 20), new Date(2012, 9, 15)]);
                chart.render();
                expect(chart.x().domain()).toEqual([new Date(2012, 2, 20), new Date(2012, 9, 15)]);
            });
        });

        describe("focus", function () {
            beforeEach(function () {
                chart.render();
            });
            describe("when called with a range argument", function () {
                var focusDomain = [new Date(2012,5,20), new Date(2012,5,30)];

                beforeEach(function () {
                    chart.focus(focusDomain);
                });

                it("should update the x domain to match specified domain", function () {
                    expect(chart.x().domain()).toEqual(focusDomain);
                });
            });

            describe("when called with no arguments", function () {

                beforeEach(function () {
                    chart.focus([new Date(2012,5,1), new Date(2012,5,2)]);
                    chart.focus();
                });

                it("should revert the x domain to the original domain", function () {
                    expect(chart.x().domain()).toEqual(chart.xOriginalDomain());
                });
            });
        });
    });

    function itActsLikeItZoomed(context) {
        describe('(shared things that happen on zooming)', function () {
            var chart, zoomCallback;
            beforeEach(function() {
                chart = context().chart;
                zoomCallback = context().zoomCallback;
            });

            it("should be flagged as refocused", function () {
                expect(chart.refocused()).toBeTruthy();
            });

            it("should update chart filter to match new x domain", function () {
                expect(chart.filter()).toEqual(chart.x().domain());
            });

            it("should be rescaled", function () {
                var domain = chart.x().domain();
                expect(chart.xUnitCount()).toEqual(dc.units.integers(domain[0], domain[1], domain));
            });

            it("should redraw itself", function () {
                expect(chart.redraw).toHaveBeenCalled();
            });

            it("should update its range chart's filter", function () {
                expect(chart.rangeChart().filter()).toEqual(chart.filter());
            });

            it("should trigger redraw on its range chart", function () {
                expect(chart.rangeChart().redraw).toHaveBeenCalled();
            });

            it("should fire custom zoom listeners", function () {
                expect(zoomCallback).toHaveBeenCalled();
            });

            it("should trigger redraw on other charts in group after a brief pause", function () {
                expect(dc.redrawAll).toHaveBeenCalledWith(chart.chartGroup());
            });
        });
    }

    function buildRangeChart(dimension, group) {
        rangeId = "range-chart";
        appendChartID(rangeId);
        return dc.lineChart("#" + rangeId)
            .dimension(dimension)
            .group(group)
            .x(d3.time.scale().domain([new Date(2012, 5, 20), new Date(2012, 6, 15)]));
    }

    function doubleClick(chart) {
        var centerX = chart.root().node().clientLeft + (chart.width() / 2);
        var centerY = chart.root().node().clientTop + (chart.height() / 2);
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("dblclick", true, true, window, centerX, centerY, centerX, centerY, 0, false, false, false, false, 0, null);
        chart.root().node().dispatchEvent(event);
    }
});
