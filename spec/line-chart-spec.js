describe('dc.lineChart', function() {
    var id, chart, data;
    var dimension, group;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(function(d) { return d3.time.day(d.dd); });
        group = dimension.group();

        id = 'line-chart';
        appendChartID(id);

        chart = dc.lineChart('#' + id);
        chart.dimension(dimension).group(group)
            .width(1100).height(200)
            .x(d3.time.scale().domain([new Date("2012/01/01"), new Date("2012/12/31")]))
            .transitionDuration(0);
    });

    describe('rendering', function () {
        beforeEach(function () {
            chart.render();
        });

        describe('with a specified dash style', function () {
            beforeEach(function () {
                chart.dashStyle([3, 1, 1, 1]).render();
            });

            it('should be dash-dot-dot-dot to match the specified style', function () {
                expect(chart.selectAll("path.line").attr("stroke-dasharray")).toBe("3,1,1,1");
            });
        });

        describe('render data markers', function () {
            beforeEach(function () {
                chart.dotRadius(5)
                    .renderDataPoints({}).render();

            });

            it('should use default options', function () {
                chart.selectAll("circle.dot").each(function () {
                    var dot = d3.select(this);
                    expect(dot.style("fill-opacity")).toBeWithinDelta(0.8);
                    expect(dot.style("stroke-opacity")).toBeWithinDelta(0.8);
                    expect(dot.attr("r")).toBe(2);
                });
            });


            it('should use supplied options', function () {
                chart.renderDataPoints({radius: 3, fillOpacity: 1, strokeOpacity: 1})
                    .render();
                chart.selectAll("circle.dot").each(function () {
                    var dot = d3.select(this);
                    expect(dot.attr("fill-opacity")).toBe(1);
                    expect(dot.attr("stroke-opacity")).toBe(1);
                    expect(dot.attr("r")).toBe(3);
                });
            });

            it('should change the radius on mousemove', function () {
                chart.selectAll("circle.dot").each(function () {
                    var dot = d3.select(this);
                    dot.on("mousemove").call(this);
                    expect(dot.attr("r")).toBe(5);
                });
            });

            it('should revert to original radius on mouseout', function () {
                chart.selectAll("circle.dot").each(function () {
                    var dot = d3.select(this);
                    dot.on("mousemove").call(this);
                    dot.on("mouseout").call(this);
                    expect(dot.attr("r")).toBe(3);
                });
            });

            describe('hiding all data markers', function () {
                beforeEach(function () {
                    chart.renderDataPoints(false).render();
                });

                it('should not change the default opacity and radius', function () {
                    chart.selectAll("circle.dot").each(function () {
                        expect(d3.select(this).style("fill-opacity")).toBeWithinDelta(1e-6);
                        expect(d3.select(this).style("stroke-opacity")).toBeWithinDelta(1e-6);
                    });
                });

                it('should not change showing the data point on mousemove', function () {
                    chart.selectAll("circle.dot").each(function() {
                        var dot = d3.select(this);
                        dot.on("mousemove").call(this);
                        expect(dot.style("fill-opacity")).toBeWithinDelta(0.8);
                        expect(dot.style("stroke-opacity")).toBeWithinDelta(0.8);
                    });
                });

                it('should not change returning to extremely low opacity on hover out', function () {
                    chart.selectAll("circle.dot").each(function() {
                        var dot = d3.select(this);
                        dot.on("mousemove").call(this);
                        dot.on("mouseout").call(this);
                        expect(dot.style("fill-opacity")).toBeWithinDelta(1e-6);
                        expect(dot.style("stroke-opacity")).toBeWithinDelta(1e-6);
                    });
                });
            });
        });

        describe('data point highlights', function () {
            beforeEach(function () {
                chart.title(function (d) { return d.value; });
                chart.brushOn(false).dotRadius(10).render();
            });
            it('should not generate a chart brush', function () {
                expect(chart.selectAll("g.brush").empty()).toBeTruthy();
            });

            it('should be generated per data point', function () {
                expect(chart.selectAll("circle.dot").size()).toBe(6);
            });

            it('should have configurable radius', function () {
                chart.selectAll("circle.dot").each(function () {
                    expect(d3.select(this).attr("r")).toBe('10');
                });
            });

            it('should be have extremely low opacity by default', function () {
                chart.selectAll("circle.dot").each(function () {
                    expect(d3.select(this).style("fill-opacity")).toBeWithinDelta(1e-6);
                    expect(d3.select(this).style("stroke-opacity")).toBeWithinDelta(1e-6);
                });
            });

            it('should become visible when hovered over', function () {
                chart.selectAll("circle.dot").each(function() {
                    var dot = d3.select(this);
                    dot.on("mousemove").call(this);
                    expect(dot.style("fill-opacity")).toBeWithinDelta(0.8);
                    expect(dot.style("stroke-opacity")).toBeWithinDelta(0.8);
                });
            });

            it('should return to extremely low opacity on hover out', function () {
                chart.selectAll("circle.dot").each(function() {
                    var dot = d3.select(this);
                    dot.on("mousemove").call(this);
                    dot.on("mouseout").call(this);
                    expect(dot.style("fill-opacity")).toBeWithinDelta(1e-6);
                    expect(dot.style("stroke-opacity")).toBeWithinDelta(1e-6);
                });
            });

            it('should render titles on to each circle', function () {
                chart.selectAll('g._0 circle.dot').each(function (d) {
                    expect(+d3.select(this).select("title").text()).toBe(d.data.value);
                });
            });

            describe('ref lines', function () {
                it('should generate lines that are hidden by default', function () {
                    expect(chart.select("path.xRef").style("display")).toBe("none");
                    expect(chart.select("path.yRef").style("display")).toBe("none");
                });

                it('should have a stroke dash', function () {
                    expect(chart.selectAll("path.xRef").attr("stroke-dasharray")).toBe("5,5");
                    expect(chart.selectAll("path.yRef").attr("stroke-dasharray")).toBe("5,5");
                });

                describe('when dot is hovered over', function () {
                    describe('for vertical ref lines', function () {
                        beforeEach(function () {
                            var dot = chart.select('circle.dot');
                            dot.on("mousemove").call(dot[0][0]);
                        });

                        it('shows the ref line from the bottom of the graph', function () {
                            expect(chart.select('path.xRef').attr('d')).toMatch(/M405\.\d+ 160L405\.\d+ 107/);
                            expect(chart.select('path.xRef').attr("display")).not.toBe("none");
                        });
                    });

                    describe('for horizontal ref lines', function () {
                        describe('for a left y-axis chart', function () {
                            beforeEach(function () {
                                var dot = chart.select('circle.dot');
                                dot.on("mousemove").call(dot[0][0]);
                            });

                            it('shows the ref line on the left', function () {
                                expect(chart.select('path.yRef').attr("d")).toMatch(/M0 107L405\.\d+ 107/);
                                expect(chart.select('path.yRef').attr("display")).not.toBe("none");
                            });
                        });

                        describe('for a right y-axis chart', function () {
                            beforeEach(function () {
                                chart.useRightYAxis(true).render();
                                var dot = chart.select('circle.dot');
                                dot.on("mousemove").call(dot[0][0]);
                            });

                            it('shows the ref line on the right', function () {
                                expect(chart.select('path.yRef').attr("d")).toMatch(/M1020 107L405\.\d+ 107/);
                                expect(chart.select('path.yRef').attr("display")).not.toBe("none");
                            });
                        });
                    });
                });
            });
        });

        describe('undefined points', function () {
            beforeEach(function () {
                chart.defined(function(d) { return d.x.valueOf() != new Date("2012/06/10").getTime(); });
                chart.brushOn(false).render();
            });

            it('should not show line where not defined', function () {
                expect(chart.select("path.line").attr("d").indexOf("M", 1)).not.toBe(-1);
            });

            it('should not draw dots on undefined points', function () {
                expect(chart.selectAll(".dot").size()).toBe(5);
            });
        });

        describe('with chart area enabled', function () {
            beforeEach(function () {
                chart.renderArea(true).render();
            });

            it('should draw the chart line', function () {
                expect(chart.select("path.line").attr("d")).toMatch(/M405\.\d+,107L444\.\d+,107L449\.\d+,0L508\.\d+,107L533\.\d+,53L620\.\d+,53/);
            });

            it('should draw the chart area', function () {
                expect(chart.select("path.area").attr("d")).toMatch(/M405\.\d+,107L444\.\d+,107L449\.\d+,0L508\.\d+,107L533\.\d+,53L620\.\d+,53L620\.\d+,160L533\.\d+,160L508\.\d+,160L449\.\d+,160L444\.\d+,160L405\.\d+,160Z/);
            });
        });

        describe('with an ordinal x domain', function () {
            beforeEach(function () {
                var stateDimension = data.dimension(function(d){ return d.state; });
                var stateGroup = stateDimension.group();

                chart.dimension(stateDimension)
                    .group(stateGroup)
                    .xUnits(dc.units.ordinal)
                    .x(d3.scale.ordinal().domain(["California", "Colorado", "Delaware", "Mississippi", "Oklahoma", "Ontario"]))
                    .render();
            });

            it('should automatically disable the brush', function () {
                expect(chart.brushOn()).toBeFalsy();
            });

            it('should generate an ordinal path', function () {
                expect(chart.select("path.line").attr("d")).toMatch(/M85,0L255,107L425,107L595,53L765,107L935,53/);
            });
        });

        describe('with stacked data', function () {
            describe('with positive data', function () {
                beforeEach(function () {
                    var idGroup = dimension.group().reduceSum(function(d) { return d.id; });
                    var valueGroup = dimension.group().reduceSum(function(d) { return d.value; });

                    chart.dimension(dimension)
                        .brushOn(false)
                        .x(d3.time.scale().domain([new Date("2012/5/20"), new Date("2012/8/15")]))
                        .group(idGroup, "stack 0")
                        .title("stack 0", function (d) { return "stack 0: " + d.value; })
                        .stack(valueGroup, "stack 1")
                        .title("stack 1", function (d) { return "stack 1: " + d.value; })
                        .stack(valueGroup, "stack 2")
                        .elasticY(true)
                        .render();
                });

                it('should render the correct number of lines', function () {
                    expect(chart.selectAll('path.line').size()).toBe(3);
                });

                it('should set the path for stack 0 line', function () {
                    expect(chart.select('g._0 path.line').attr("d")).toMatch(/M58\.\d+,159L222\.\d+,157L246\.\d+,150L492\.\d+,158L597\.\d+,151L961\.\d+,153/);
                });

                it('should set the path for stack 1 line', function () {
                    expect(chart.select('g._1 path.line').attr("d")).toMatch(/M58\.\d+,134L222\.\d+,119L246\.\d+,75L492\.\d+,133L597\.\d+,120L961\.\d+,109/);
                });

                it('should set the path for stack 2 line', function () {
                    expect(chart.select('g._2 path.line').attr("d")).toMatch(/M58\.\d+,109L222\.\d+,81L246\.\d+,0L492\.\d+,108L597\.\d+,89L961\.\d+,65/);
                });

                it('should have its own title accessor', function () {
                    expect(chart.title()({value: 1})).toBe("stack 0: 1");
                    expect(chart.title("stack 0")({value: 2})).toBe("stack 0: 2");
                    expect(chart.title("stack 1")({value: 3})).toBe("stack 1: 3");
                });

                it('should have titles rendered for extra stacks', function () {
                    chart.selectAll('g._1 circle.dot').each(function (d) {
                        expect(d3.select(this).select("title").text()).toBe("stack 1: " + d.data.value);
                    });
                });

                it('should default to first stack title for untitled stacks', function () {
                    chart.selectAll('g._2 circle.dot').each(function (d) {
                        expect(d3.select(this).select("title").text()).toBe("stack 0: " + d.data.value);
                    });
                });

                describe('with chart area enabled', function () {
                    beforeEach(function () {
                        chart.renderArea(true).render();
                    });

                    it('should render the correct number of areas', function () {
                        expect(chart.selectAll('path.area').size()).toBe(3);
                    });

                    it('should set the area for stack 0', function () {
                        expect(chart.select('g._0 path.area').attr("d")).toMatch(/M58\.\d+,159L222\.\d+,157L246\.\d+,150L492\.\d+,158L597\.\d+,151L961\.\d+,153L961\.\d+,160L597\.\d+,160L492\.\d+,160L246\.\d+,160L222\.\d+,160L58\.\d+,160Z/);
                    });

                    it('should set the area for stack 1', function () {
                        expect(chart.select('g._1 path.area').attr("d")).toMatch(/M58\.\d+,134L222\.\d+,119L246\.\d+,75L492\.\d+,133L597\.\d+,120L961\.\d+,109L961\.\d+,153L597\.\d+,151L492\.\d+,158L246\.\d+,150L222\.\d+,157L58\.\d+,159Z/);
                    });

                    it('should set the area for stack 2', function () {
                        expect(chart.select('g._2 path.area').attr("d")).toMatch(/M58\.\d+,109L222\.\d+,81L246\.\d+,0L492\.\d+,108L597\.\d+,89L961\.\d+,65L961\.\d+,109L597\.\d+,120L492\.\d+,133L246\.\d+,75L222\.\d+,119L58\.\d+,134Z/);
                    });

                    it('should draw tooltip dots on top of paths and areas', function () {
                        var list = chart.selectAll("circle.dot, path.line, path.area");

                        var indexOfLastLine = list[0].indexOf(list.filter("path.line")[0][2]);
                        var indexOfLastArea = list[0].indexOf(list.filter("path.area")[0][2]);
                        var indexOfDot = list[0].indexOf(list.filter("circle.dot")[0][0]);

                        expect(indexOfDot).toBeGreaterThan(indexOfLastArea);
                        expect(indexOfDot).toBeGreaterThan(indexOfLastLine);
                    });

                    it('should draw tooltip ref lines on top of paths', function () {
                        var list = chart.selectAll("path.yRef, path.xRef, path.line, path.area");

                        var indexOfLastLine = list[0].indexOf(list.filter("path.line")[0][2]);
                        var indexOfLastArea = list[0].indexOf(list.filter("path.area")[0][2]);

                        var indexOfFirstYRef = list[0].indexOf(list.filter("path.yRef")[0][0]);
                        var indexOfFirstXRef = list[0].indexOf(list.filter("path.xRef")[0][0]);

                        expect(indexOfLastLine).toBeLessThan(indexOfFirstXRef);
                        expect(indexOfLastLine).toBeLessThan(indexOfFirstYRef);

                        expect(indexOfLastArea).toBeLessThan(indexOfFirstXRef);
                        expect(indexOfLastArea).toBeLessThan(indexOfFirstYRef);
                    });

                });

                describe('stack hiding', function () {
                    describe('first stack', function () {
                        beforeEach(function () {
                            chart.hideStack("stack 0").render();
                        });

                        it('should hide the stack', function () {
                            expect(chart.select('g._0 path.line').attr("d")).toMatch(/M58\.\d+,133L222\.\d+,120L246\.\d+,80L492\.\d+,133L597\.\d+,127L961\.\d+,113/);
                        });

                        it('should show the stack', function () {
                            chart.showStack("stack 0").render();
                            expect(chart.select('g._0 path.line').attr("d")).toMatch(/M58\.\d+,159L222\.\d+,157L246\.\d+,150L492\.\d+,158L597\.\d+,151L961\.\d+,153/);
                        });
                    });

                    describe('any other stack', function () {
                        beforeEach(function () {
                            chart.title("stack 2", function (d) { return "stack 2: " + d.value; });
                            chart.hideStack("stack 1").render();
                        });

                        it('should hide the stack', function () {
                            expect(chart.select('g._1 path.line').attr("d")).toMatch(/M58\.\d+,112L222\.\d+,83L246\.\d+,0L492\.\d+,108L597\.\d+,85L961\.\d+,64/);
                        });

                        it('should show the stack', function () {
                            chart.showStack("stack 1").render();
                            expect(chart.select('g._1 path.line').attr("d")).toMatch(/M58\.\d+,134L222\.\d+,119L246\.\d+,75L492\.\d+,133L597\.\d+,120L961\.\d+,109/);
                        });

                        it('should color chart dots the same as line paths', function () {
                            var lineColor = chart.select('g._1 path.line').attr("stroke");
                            var circleColor = chart.select('g._1 circle.dot').attr("fill");
                            expect(lineColor).toEqual(circleColor);
                        });

                        it('should still show the title for a visible stack', function () {
                            chart.selectAll("g._1 circle.dot").each(function (d) {
                                expect(d3.select(this).select("title").text()).toBe("stack 2: " + d.data.value);
                            });
                        });
                    });

                    describe('hiding all the stacks', function () {
                        beforeEach(function () {
                            chart.hideStack("stack 0")
                                .hideStack("stack 1")
                                .hideStack("stack 2")
                                .render();
                        });

                        it('should show a blank graph', function () {
                            expect(chart.selectAll('path.line').size()).toBe(0);
                        });
                    });
                });
            });

            describe('with negative data', function () {
                beforeEach(function () {
                    var negativeGroup = dimension.group().reduceSum(function(d){ return d.nvalue; });

                    chart.group(negativeGroup).stack(negativeGroup).stack(negativeGroup);
                    chart.x(d3.time.scale().domain([new Date("2012/5/20"), new Date("2012/8/15")]));

                    chart.margins({top: 30, right: 50, bottom: 30, left: 30})
                        .renderArea(true)
                        .yAxisPadding(5)
                        .elasticY(true)
                        .yAxis().ticks(5);

                    chart.render();
                });

                it('should generate a line and area for each stack', function () {
                    expect(chart.selectAll('path.line').size()).toBe(3);
                    expect(chart.selectAll('path.area').size()).toBe(3);
                });

                it('should generate negative lines and area for stack 0', function () {
                    expect(chart.select('g._0 path.line').attr('d')).toMatch(/M58.\d+,81L222.\d+,81L246.\d+,92L492.\d+,79L597.\d+,52L961.\d+,67/);
                    expect(chart.select('g._0 path.area').attr('d')).toMatch(/M58.\d+,81L222.\d+,81L246.\d+,92L492.\d+,79L597.\d+,52L961.\d+,67L961.\d+,73L597.\d+,73L492.\d+,73L246.\d+,73L222.\d+,73L58.\d+,73Z/);
                });

                it('should generate negative lines and area for stack 1', function () {
                    expect(chart.select('g._1 path.line').attr('d')).toMatch(/M58.\d+,88L222.\d+,88L246.\d+,111L492.\d+,84L597.\d+,31L961.\d+,61/);
                    expect(chart.select('g._1 path.area').attr('d')).toMatch(/M58.\d+,88L222.\d+,88L246.\d+,111L492.\d+,84L597.\d+,31L961.\d+,61L961.\d+,67L597.\d+,52L492.\d+,79L246.\d+,92L222.\d+,81L58.\d+,81Z/);
                });

                it('should generate y axis domain dynamically', function () {
                    var nthText = function(n) { return d3.select(chart.selectAll("g.y text")[0][n]); };

                    expect(nthText(0).text()).toBe("-20");
                    expect(nthText(1).text()).toBe("0");
                    expect(nthText(2).text()).toBe("20");
                });
            });
        });

        describe('legend hovering', function () {
            var firstItem;

            beforeEach(function () {
                chart.stack(group)
                    .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
                    .renderArea(true)
                    .render();

                firstItem = chart.select('g.dc-legend g.dc-legend-item');
                firstItem.on("mouseover")(firstItem.datum());
            });

            describe('when a legend item is hovered over', function () {
                it('should highlight corresponding lines and areas', function () {
                    expect(nthLine(0).classed("highlight")).toBeTruthy();
                    expect(nthArea(0).classed("highlight")).toBeTruthy();
                });

                it('should fade out non-corresponding lines and areas', function () {
                    expect(nthLine(1).classed("fadeout")).toBeTruthy();
                    expect(nthArea(1).classed("fadeout")).toBeTruthy();
                });
            });

            describe('when a legend item is hovered out', function () {
                it('should remove highlighting from corresponding lines and areas', function () {
                    firstItem.on("mouseout")(firstItem.datum());
                    expect(nthLine(0).classed("highlight")).toBeFalsy();
                    expect(nthArea(0).classed("highlight")).toBeFalsy();
                });

                it('should fade in non-corresponding lines and areas', function () {
                    firstItem.on("mouseout")(firstItem.datum());
                    expect(nthLine(1).classed("fadeout")).toBeFalsy();
                    expect(nthArea(1).classed("fadeout")).toBeFalsy();
                });
            });

            function nthLine(n) {
                return d3.select(chart.selectAll("path.line")[0][n]);
            }

            function nthArea(n) {
                return d3.select(chart.selectAll("path.area")[0][n]);
            }
        });

        describe('filtering', function () {
            beforeEach(function () {
                chart.filter([new Date("2012/6/1"), new Date("2012/6/30")]).redraw();
            });

            it('should set the chart filter', function () {
                expect(chart.filter()).toEqual([new Date("2012/6/1"), new Date("2012/6/30")]);
            });

            it('should set the filter printer', function () {
                expect(chart.filterPrinter()).not.toBeNull();
            });

            it('should not generate tooltip circles with the default brush', function () {
                expect(chart.selectAll("circle.dot").empty()).toBeTruthy();
            });

            describe('when a brush is defined', function () {
                it('should position the brush with an offset', function () {
                    expect(chart.select("g.brush").attr("transform")).toBe("translate(" + chart.margins().left + ",10)");
                });

                it('should create a fancy brush resize handle', function () {
                    chart.select("g.brush").selectAll(".resize path").each(function (d, i) {
                        if (i === 0) {
                            expect(d3.select(this).attr("d"))
                                .toMatch(/M0.5,53.\d+A6,6 0 0 1 6.5,59.\d+V100.\d+A6,6 0 0 1 0.5,106.\d+ZM2.5,61.\d+V98.\d+M4.5,61.\d+V98.\d+/);
                        }
                        else{
                            expect(d3.select(this).attr("d"))
                                .toMatch(/M-0.5,53.\d+A6,6 0 0 0 -6.5,59.\d+V100.\d+A6,6 0 0 0 -0.5,106.\d+ZM-2.5,61.\d+V98.\d+M-4.5,61.\d+V98.\d+/);
                        }
                    });
                });

                it('should stretch the background', function () {
                    expect(chart.select("g.brush rect.background").attr("width")).toBe('1020');
                });

                it('should set the background height to the chart height', function () {
                    expect(chart.select("g.brush rect.background").attr("height")).toBe('160');
                });

                it('should set extent height to the chart height', function () {
                    expect(chart.select("g.brush rect.extent").attr("height")).toBe('160');
                });

                it('should set extent width based on filter set', function () {
                    expect(chart.select("g.brush rect.extent").attr("width")).toBeWithinDelta(81, 1);
                });

                it('should not have an area path', function () {
                    expect(chart.selectAll("path.area").empty()).toBeTruthy();
                });

                it('should set the dash style to solid', function () {
                    expect(chart.selectAll("path.line").attr("stroke-dasharray")).toBeNull();
                });
            });
        });
    });
});
