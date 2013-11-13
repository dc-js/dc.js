describe('dc.scatterPlot', function() {
    var id, chart, data;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        var dimension = data.dimension(function(d) {
            return d3.time.day(d.dd);
        });
        var group = dimension.group().reduceSum(function(d){return d.id;});

        id = 'scatter-plot';
        appendChartID(id);

        d3.select("body").append("div").attr("id", id);
        chart = dc.scatterPlot("#" + id);
        chart.dimension(dimension)
            .group(group)
            .width(500).height(180)
            .x(d3.time.scale().domain([new Date(2012, 0, 1), new Date(2012, 11, 31)]))
            .transitionDuration(0);

    });

    describe('rendering the scatter plot', function () {
        beforeEach(function () {
            chart.render();
        });

        it('should create an svg', function () {
            expect(chart.svg().empty()).toBeFalsy();
        });

        it('should create the correct number of symbols', function () {
            expect(chart.group().all().length).toBe(chart.selectAll('circle.symbol').size());
        });

        it('should correctly place the symbols', function () {
            expect(nthSymbol(0).attr("transform")).toBe("translate(166.8013698630137,140)");
            expect(nthSymbol(3).attr("transform")).toBe("translate(209.37671232876713,114)");
            expect(nthSymbol(5).attr("transform")).toBe("translate(255.40410958904107,44)");
        });

        it('should generate a default color fill for symbols', function () {
            expect(nthSymbol(0).attr("fill")).toBe('#1f77b4');
            expect(nthSymbol(3).attr("fill")).toBe('#1f77b4');
            expect(nthSymbol(5).attr("fill")).toBe('#1f77b4');
        });

        describe('with a custom color', function () {
            beforeEach(function () {
                chart.colors(["red"]).render();
            });

            it('should color the symbols to the provided color', function () {
                expect(nthSymbol(0).attr("fill")).toBe('red');
                expect(nthSymbol(3).attr("fill")).toBe('red');
                expect(nthSymbol(5).attr("fill")).toBe('red');
            });
        });

        describe('filtering a dimension', function () {
            beforeEach(function () {
                data.dimension(function(d) {
                    return d.value;
                }).filter(66);

                chart.redraw();
            });

            it('should remove unfiltered data points', function () {
                expect(chart.selectAll('circle.symbol').size()).toBe(1);
            });

            it('should place the remaining data point by its value', function () {
                expect(nthSymbol(0).attr("transform")).toBe("translate(182.91095890410958,96)");
            });
        });

        function nthSymbol(i) {
            return d3.select(chart.selectAll('circle.symbol')[0][i]);
        }

    });
});

