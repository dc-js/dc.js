describe('dc.seriesChart', function() {

    var chart;
    var colorRows = [
        {colData:1, rowData: 1, colorData: 1},
        {colData:1, rowData: 2, colorData: 2},
        {colData:2, rowData: 1, colorData: 3},
        {colData:2, rowData: 2, colorData: 4}
    ];
    var colorData;

    beforeEach(function() {
        colorData = crossfilter(colorRows);
        var dimensionColorData = colorData.dimension(function (d) { return [+d.colData, +d.rowData]; });
        var groupColorData = dimensionColorData.group().reduceSum(function(d) { return +d.colorData; });


        id = "series-chart";
        appendChartID(id);
        chart = dc.seriesChart("#" + id);

        chart
            .width(210)
            .height(210)
            .x(d3.scale.linear().domain([1,2]))
            .dimension(dimensionColorData)
            .group(groupColorData)
            .ordinalColors(["#000001", "#000002"])
            .seriesAccessor(function(d) { return +d.key[0];})
            .keyAccessor(function(d) { return +d.key[1];})
            .valueAccessor(function(d) { return +d.value ;})
            .childOptions({renderArea: true, dashStyle: [3, 1, 1]})
            .transitionDuration(0);
    });

    describe('#render', function() {
        beforeEach(function() {
            chart.render();
        });

        it('should create the svg', function() {
            expect(chart.svg()).not.toBeNull();
        });

        it('should position generated lineCharts using the data', function() {
            var lines = chart.selectAll("path.line");

            expect(d3.select(lines[0][0]).attr("d")).toMatchPath("M0,128L130,85");
            expect(d3.select(lines[0][1]).attr("d")).toMatchPath("M0,43L130,0");
        });


        it('should color lines using the colors in the data', function() {
            var lines = chart.selectAll("path.line");

            expect(d3.select(lines[0][0]).attr("stroke")).toBe("#000001");
            expect(d3.select(lines[0][1]).attr("stroke")).toBe("#000002");
        });

        describe('with brush off', function () {
            it('should create line chart dots', function () {
                chart.brushOn(false).render();
                var dots = chart.selectAll('circle.dot');
                expect(dots[0].length).toEqual(4);
                chart.brushOn(true);
            });
        });
    });


    describe('series sorting', function() {
        beforeEach(function() {
            chart
                .seriesSort(d3.descending)
                .render();
        });

        it('should order lineCharts in the order specified', function() {
            var lines = chart.selectAll("path.line");

            expect(d3.select(lines[0][1]).attr("d")).toMatchPath("M0,128L130,85");
            expect(d3.select(lines[0][0]).attr("d")).toMatchPath("M0,43L130,0");
        });
    });

    describe('chart options', function () {
        beforeEach(function() {
            chart.render();
        });

        it('should apply options to all lines in the chart', function () {
            var lines = chart.selectAll("path.line");
            var areas = chart.selectAll("path.area");

            expect(d3.select(lines[0][0]).attr("stroke-dasharray")).toBe("3,1,1");
            expect(d3.select(lines[0][1]).attr("stroke-dasharray")).toBe("3,1,1");

            expect(d3.select(areas[0][0]).attr("fill")).toBe("#000001");
            expect(d3.select(areas[0][1]).attr("fill")).toBe("#000002");
        });
    });

    describe('#redraw', function () {
        var colorRows2 = [
            {colData:1, rowData: 1, colorData: 1},
            {colData:1, rowData: 2, colorData: 2},
            {colData:2, rowData: 1, colorData: 3},
            {colData:2, rowData: 2, colorData: 4},
            {colData:3, rowData: 1, colorData: 5},
            {colData:3, rowData: 2, colorData: 6}
        ];
        var colorData2;
        beforeEach(function () {
            colorData2 = crossfilter(colorRows2);
            chart.brushOn(false);
            chart.render();

            var dimensionData = colorData2.dimension(function (d) { return [+d.colData, +d.rowData]; });
            var groupData = dimensionData.group().reduceSum(function(d) { return +d.colorData; });

            chart.dimension(dimensionData).group(groupData);


            chart.redraw();
        });

        afterEach(function () {
            chart.brushOn(true);
        });

        it ('is redrawn with dots', function () {
            var dots = chart.selectAll('circle.dot');
            expect(dots[0].length).toEqual(6);
        });
    });

    describe('legends with hidable stacks', function () {
        beforeEach(function () {
            chart
                .chart(function(c) { return dc.lineChart(c).hidableStacks(true); })
                .legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))
                .render();
        });

        describe('clicking on a legend item', function () {
            beforeEach(function () {
                legendItem(0).on('click').call(legendItem(0)[0][0], legendItem(0).datum());
            });

            it('should fade out the legend item', function() {
                expect(legendItem(0).classed('fadeout')).toBeTruthy();
            });

            it('should hide its associated stack', function() {
                expect(chart.selectAll('path.line').size()).toEqual(1);
            });

            it('disable hover highlighting for that legend item', function() {
                legendItem(0).on('mouseover')(legendItem(0).datum());
                expect(chart.selectAll('path.line').classed('fadeout')).toBeFalsy();
            });

            describe('clicking on a faded out legend item', function () {
                beforeEach(function () {
                    legendItem(0).on('click').call(legendItem(0)[0][0], legendItem(0).datum());
                });

                it('should unfade the legend item', function() {
                    expect(legendItem(0).classed('fadeout')).toBeFalsy();
                });

                it('should unfade its associated stack', function() {
                    expect(chart.selectAll('path.line').size()).toEqual(2);
                });
            });
        });
    });

    function legendItem(n) {
        return d3.select(chart.selectAll('g.dc-legend g.dc-legend-item')[0][n]);
    }
});
