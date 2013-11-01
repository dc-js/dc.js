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
            .group(dateIdSumGroup, "Id Sum")
            .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
    });

    describe("with mouse zoom disabled", function () {
        beforeEach(function () {
            chart.mouseZoomable(true);
            chart.render();
        });

        xit("does not respond to double-click by zooming in", function () {
        })
    });

    describe("with mouse zoom enabled", function () {
        beforeEach(function () {
            chart.mouseZoomable(true);
            chart.render();
        });

        xit("responds to double-click by zooming in", function () {
        });

        xit("fires custom zoom listeners", function () {
        });
    });

    describe("with mouse zoom and brushing enabled", function () {
        beforeEach(function () {
            chart.mouseZoomable(true);
            chart.brushOn(true);
            chart.render();
        });

        xit("responds to dragging by brushing, but not panning", function () {
        });
    });

    describe("with a range chart", function () {
        beforeEach(function () {
            // setup range chart
        });

        xit("zooms its focus chart when brushed", function () {
        });

        xit("zooms its focus chart relative to focus chart's current x domain", function () {
        });
    });

    describe("with zoom restriction enabled", function () {
        beforeEach(function () {
            chart.mouseZoomable(true);
            chart.zoomOutRestrict(true);
            chart.render();
        });

        xit("cannot zoom out past its original x domain", function () {
        });

        xit("cannot zoom out past its range chart origin x domain", functio () {
            // setup range chart
        });
    });
});
