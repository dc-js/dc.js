describe('dc.scatterPlot', function() {
    var id, chart;
    var data, group, dimension;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(function(d) { return [+d.value, +d.nvalue]; });
        group = dimension.group();

        id = 'scatter-plot';
        appendChartID(id);

        chart = dc.scatterPlot("#" + id);
        chart.dimension(dimension)
            .group(group)
            .width(500).height(180)
            .x(d3.scale.linear().domain([0, 70]))
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
            expect(nthSymbol(4).attr("transform")).toBe("translate(264,131)");
            expect(nthSymbol(5).attr("transform")).toBe("translate(264,75)");
            expect(nthSymbol(8).attr("transform")).toBe("translate(396,131)");
        });

        it('should generate a default color fill for symbols', function () {
            expect(nthSymbol(4).attr("fill")).toBe('#1f77b4');
            expect(nthSymbol(5).attr("fill")).toBe('#1f77b4');
            expect(nthSymbol(8).attr("fill")).toBe('#1f77b4');
        });

        describe('with a custom color', function () {
            beforeEach(function () {
                chart.colors(["red"]).render();
            });

            it('should color the symbols to the provided color', function () {
                expect(nthSymbol(4).attr("fill")).toBe('red');
                expect(nthSymbol(5).attr("fill")).toBe('red');
                expect(nthSymbol(8).attr("fill")).toBe('red');
            });
        });

        function nthSymbol(i) {
            return d3.select(chart.selectAll('circle.symbol')[0][i]);
        }

        describe('filtering the chart', function () {
            var otherDimension;

            beforeEach(function () {
                otherDimension = data.dimension(function(d) { return [+d.value, +d.nvalue]; });

                chart.filterAll();
                chart.filter([[22, -3], [44, 2]]);
            });

            it('should filter dimensions based on the same data', function () {
                expect(otherDimension.top(Infinity).length).toBe(3);
            });

            describe('when filtering with null', function () {
                beforeEach(function () {
                    chart.filter(null);
                });

                it('should remove all filtering from the dimensions based on the same data', function () {
                    expect(otherDimension.top(Infinity).length).toBe(10);
                });

            });
        });

        describe('brushing', function () {
            var otherDimension;

            beforeEach(function () {
                otherDimension = data.dimension(function(d) { return [+d.value, +d.nvalue]; });

                chart.brush().extent([[22, -3], [44, 2]]);
                chart.brush().on("brush")();
                chart.redraw();
            });

            it('should filter dimensions based on the same data', function () {
                expect(otherDimension.top(Infinity).length).toBe(3);
            });

            it('should set the height of the brush to the height implied by the extent', function () {
                expect(chart.select("g.brush rect.extent").attr("height")).toBe('46');
            });

            it('should not add handles to the brush', function () {
                expect(chart.select(".resize path").empty()).toBeTruthy();
            });


        });
    });

    describe('legend hovering', function () {
        var compositeChart, id;
        var firstItem;

        beforeEach(function () {
            id = 'scatter-plot-composite';
            appendChartID(id);

            compositeChart = dc.compositeChart("#" + id);
            compositeChart
                .dimension(dimension)
                .group(group)
                .x(d3.time.scale().domain([new Date(2012, 0, 1), new Date(2012, 11, 31)]))
                .transitionDuration(0)
                .legend(dc.legend())
                .compose([
                    dc.scatterPlot(compositeChart).colors(['red']),
                    dc.scatterPlot(compositeChart).colors(['blue'])
                ]).render();

            firstItem = compositeChart.select('g.dc-legend g.dc-legend-item');
            firstItem.on("mouseover")(firstItem.datum());
        });

        describe('when a legend item is hovered over', function () {
            it('should highlight corresponding plot', function () {
                nthChart(0).expectPlotSymbolsToHaveRadius("4");

            });

            it('should fade out non-corresponding lines and areas', function () {
                nthChart(1).expectPlotSymbolsToHaveClass("fadeout");
            });
        });

        describe('when a legend item is hovered out', function () {
            beforeEach(function () {
                firstItem.on("mouseout")(firstItem.datum());
            });

            it('should remove highlighting from corresponding lines and areas', function () {
                nthChart(0).expectPlotSymbolsToHaveRadius("3");
            });

            it('should fade in non-corresponding lines and areas', function () {
                nthChart(1).expectPlotSymbolsNotToHaveClass("fadeout");
            });
        });

        function nthChart(n) {
            var subChart = d3.select(compositeChart.selectAll("g.sub")[0][n]);

            subChart.expectPlotSymbolsToHaveClass = function(className) {
                subChart.selectAll("circle.symbol").each(function () {
                    expect(d3.select(this).classed(className)).toBeTruthy();
                });
            };

            subChart.expectPlotSymbolsToHaveRadius = function(radius) {
                subChart.selectAll("circle.symbol").each(function () {
                    expect(d3.select(this).attr("r")).toBe(radius);
                });
            };

            subChart.expectPlotSymbolsNotToHaveClass = function(className){
                subChart.selectAll("circle.symbol").each(function () {
                    expect(d3.select(this).classed(className)).toBeFalsy();
                });
            };

            return subChart;
        }
    });
});

