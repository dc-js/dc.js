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

    describe('brushing the chart with equal dates', function () {
        var filterSpy;

        beforeEach(function () {
            filterSpy = spyOn(chart, 'filter');
            spyOn(dc, 'redrawAll');
            spyOn(chart, 'redrawBrush');
            spyOn(chart, 'extendBrush').and.returnValue([new Date('1/1/2001'), new Date('1/1/2001')]);
        });

        it('should trigger a null filter event', function () {
            chart._brushing();
            expect(filterSpy).toHaveBeenCalledWith(null);
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
                .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
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
                        chart.render()
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
});