describe("a coordinate grid chart", function() {
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

    afterEach(function () {
        dc.chartRegistry.clear();
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
            var originalUnitCount = chart.xUnitCount();
            chart.x().domain([new Date(2012, 4, 20), new Date(2012, 6, 15)]);
            chart.rescale();
        });

        it("resets x unit count to reflect updated x domain", function () {
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

        it("sets our chart as range chart's focus chart", function () {
            expect(chart.rangeChart().focusChart()).toEqual(chart);
        });
    });

    describe("restricting zoom out", function () {
        beforeEach(function () {
            chart.zoomScale([-1,10]);
            chart.zoomOutRestrict(true);
        });

        it("sets start of zoom scale extent to 1", function () {
            expect(chart.zoomScale()[0]).toEqual(1);
        });

        it("leaves end of zoom scale extent unchanged", function () {
            expect(chart.zoomScale()[1]).toEqual(10);
        });
    });

    describe("disabling zoom out restriction", function () {
        beforeEach(function () {
            chart.zoomScale([-1,10]);
            chart.zoomOutRestrict(false);
        });

        it("sets start of zoom scale extent to 0", function () {
            expect(chart.zoomScale()[0]).toEqual(0);
        });
    });

    describe("setting x", function () {
        var newDomain = [1,10];
        beforeEach(function () {
            chart.x(d3.scale.linear().domain(newDomain));
        });

        it("resets original x domain", function () {
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

            it("returns the fixed unit count", function () {
                expect(chart.xUnitCount()).toEqual(10);
            });
        });
    });

    describe("ordinality flag", function () {
        describe("when x units are not ordinal", function () {
            it("is false", function () {
                expect(chart.isOrdinal()).toBeFalsy();
            });
        });
        describe("when x units are ordinal", function () {
            beforeEach(function () {
                chart.xUnits(dc.units.ordinal);
            });
            it("is true", function () {
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

        it("updates the brush extent", function () {
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

        it("clears the brush extent", function () {
            expect(chart.brush().empty()).toBeTruthy();
        });
    });

    describe("with mouse zoom disabled", function () {
        beforeEach(function () {
            chart.mouseZoomable(false);
            chart.render();
        });

        it("does not respond to double-click by refocusing", function () {
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

        it("is not flagged as refocused", function () {
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

            it("disables mouse zooming on brush start, and re-enables it afterwards", function () {
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

            it("does not enable mouse zooming", function () {
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

            it("clears the chart filter", function () {
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

        it("focus chart zooms when range chart is brushed", function () {
            spyOn(chart, "focus");
            rangeChart.brush().extent(selectedRange);
            rangeChart.brush().event(rangeChart.g());
            expect(chart.focus).toHaveBeenCalledWith(selectedRange);
        });

        it("range chart brush updates to match zoomed domain of focus chart", function () {
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

        it("cannot zoom out past its original x domain", function () {
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

            it("cannot zoom out past its range chart origin x domain", function () {
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

        it("can zoom out past its original x domain", function () {
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

            it("updates x domain to match specified domain", function () {
                expect(chart.x().domain()).toEqual(focusDomain);
            });
        });

        describe("when called with no arguments", function () {

            beforeEach(function () {
                chart.focus([new Date(2012,5,1), new Date(2012,5,2)]);
                chart.focus();
            });

            it("reverts the x domain to the original domain", function () {
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

        it("is flagged as refocused", function () {
            expect(chart.refocused()).toBeTruthy();
        });

        it("updates chart filter to match new x domain", function () {
            expect(chart.filter()).toEqual(chart.x().domain());
        });

        it("is rescaled", function () {
            var domain = chart.x().domain();
            expect(chart.xUnitCount()).toEqual(dc.units.integers(domain[0], domain[1], domain));
        });

        it("redraws itself", function () {
            expect(chart.redraw).toHaveBeenCalled();
        });

        it("updates its range chart's filter", function () {
            expect(chart.rangeChart().filter()).toEqual(chart.filter());
        });

        it("triggers redraw on its range chart", function () {
            expect(chart.rangeChart().redraw).toHaveBeenCalled();
        });

        it("fires custom zoom listeners", function () {
            expect(zoomCallback).toHaveBeenCalled();
        });

        it("triggers redraw on other charts in group after a brief pause", function () {
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
