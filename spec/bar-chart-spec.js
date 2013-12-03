describe('dc.barChart', function() {
    var chart, id;
    var data, dimension, group;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(function(d) { return d3.time.day(d.dd); });
        group = dimension.group();

        id = "bar-chart";
        appendChartID(id);

        chart = dc.barChart("#" + id)
            .width(500)
            .height(150)
            .dimension(dimension)
            .group(group)
            .transitionDuration(0)
            .brushOn(false)
            .margins({ top: 20, bottom: 0, right: 10, left: 0 })
            .x(d3.time.scale().domain([new Date("2012/5/20"), new Date("2012/8/15")]));
    });

    describe("brushing with bars centered and rounding enabled", function () {
        beforeEach(function () {
            chart
                .brushOn(true)
                .round(d3.time.month.round)
                .centerBar(true);
        });

        describe("with alwaysUseRounding disabled", function() {
            beforeEach(function() {
                chart.alwaysUseRounding(false);
                spyOn(console, "warn");
                chart.render();
                chart.brush().extent([new Date(2012, 6, 1), new Date(2012, 7, 15)]);
                chart.brush().event(chart.root());
            });

            it("should log a warning indicating that brush rounding was disabled", function () {
                expect(console.warn.calls.mostRecent().args[0]).toMatch(/brush rounding is disabled/);
            });

            it("should not round the brush", function () {
                expect(chart.filter()).toEqual([new Date(2012, 6, 1), new Date(2012, 7, 15)]);
            });
        });

        describe("with alwaysUseRounding enabled", function() {
            beforeEach(function() {
                chart.alwaysUseRounding(true);
                chart.render();
                chart.brush().extent([new Date(2012, 6, 1), new Date(2012, 7, 15)]);
                chart.brush().event(chart.root());
            });

            it("should round the brush", function () {
                expect(chart.brush().extent()).toEqual([new Date(2012, 6, 1), new Date(2012, 7, 1)]);
            });
        });
    });
});
