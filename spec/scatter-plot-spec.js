/* global appendChartID, comparePaths, loadDateFixture, makeDate, simulateChart2DBrushing */
describe('dc.scatterPlot', () => {
    let id, chart;
    let data, group, dimension;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(d => [+d.value, +d.nvalue]);
        group = dimension.group();

        id = 'scatter-plot';
        appendChartID(id);

        chart = new dc.ScatterPlot(`#${id}`);
        chart.dimension(dimension)
            .group(group)
            .width(500).height(180)
            .x(d3.scaleLinear().domain([0, 70]))
            .symbolSize(10)
            .nonemptyOpacity(0.9)
            .excludedSize(2)
            .excludedColor('#ccc')
            .excludedOpacity(0.25)
            .emptySize(4)
            .emptyOpacity(0.5)
            .emptyColor('#DFFF00')
            .transitionDuration(0);
    });

    describe('rendering the scatter plot', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should create an svg', () => {
            expect(chart.svg().empty()).toBeFalsy();
        });

        it('should create the correct number of symbols', () => {
            expect(chart.group().all().length).toBe(chart.selectAll('path.symbol').size());
        });

        it('treats hiddenSize as synonym of emptySize', () => {
            expect(chart.hiddenSize()).toEqual(chart.emptySize());
            const newVal = 5;
            chart.hiddenSize(newVal);
            expect(chart.emptySize()).toEqual(newVal);
        });

        it('should correctly place the symbols', () => {
            expect(nthSymbol(4).attr('transform')).toMatchTranslate(264, 131);
            expect(nthSymbol(5).attr('transform')).toMatchTranslate(264, 75);
            expect(nthSymbol(8).attr('transform')).toMatchTranslate(396, 131);
        });

        it('should generate a default color fill for symbols', () => {
            expect(nthSymbol(4).attr('fill')).toMatch(/#1f77b4/i);
            expect(nthSymbol(5).attr('fill')).toMatch(/#1f77b4/i);
            expect(nthSymbol(8).attr('fill')).toMatch(/#1f77b4/i);
        });

        it('should generate the correct titles', () => {
            const titles = chart.selectAll('path.symbol title');
            const expected = ['22,-2: 1', '22,10: 1', '33,1: 2', '44,-3: 1', '44,-4: 1', '44,2: 1', '55,-3: 1', '55,-5: 1', '66,-4: 1'];
            expect(titles.size()).toBe(expected.length);
            titles.each(function (d) {
                expect(this.textContent).toBe(expected.shift());
            });
        });

        describe('with a custom color', () => {
            beforeEach(() => {
                chart.colors('red').render();
            });

            it('should color the symbols to the provided color', () => {
                expect(nthSymbol(4).attr('fill')).toBe('red');
                expect(nthSymbol(5).attr('fill')).toBe('red');
                expect(nthSymbol(8).attr('fill')).toBe('red');
            });
        });

        function fishSymbol () {
            let size;
            const points = [[2, 0], [1, -1], [-1, 1], [-1, -1], [1, 1]];

            function symbol (d, i) {
                // native size is 3 square pixels, so to get size N, multiply by sqrt(N)/3
                let m = size.call(this, d, i);
                m = Math.sqrt(m) / 3;
                const path = d3.line()
                    .x(_d => _d[0] * m)
                    .y(_d => _d[1] * m);
                return `${path(points)}Z`;
            }

            symbol.type = function () {
                if (arguments.length) {
                    throw new Error('no, you must have fish');
                }
                return 'fish';
            };
            symbol.size = function (_) {
                if (!arguments.length) {
                    return size;
                }
                size = typeof _ === 'function' ? _ : dc.utils.constant(_);
                return symbol;
            };
            return symbol;
        }

        describe('with a fish symbol', () => {
            beforeEach(() => {
                chart.customSymbol(fishSymbol().size(chart.symbolSize()))
                    .render();
            });

            it('should draw fishes', () => {
                expect(symbolsMatching(matchSymbol(fishSymbol(), chart.symbolSize())).length).toBe(9);
            });
        });

        describe('with title rendering disabled', () => {
            beforeEach(() => {
                chart.renderTitle(false).render();
            });

            it('should not generate title elements', () => {
                expect(chart.selectAll('rect.bar title').empty()).toBeTruthy();
            });
        });

        describe('filtering the chart', () => {
            let otherDimension;

            beforeEach(() => {
                otherDimension = data.dimension(d => [+d.value, +d.nvalue]);

                chart.filterAll();
                chart.filter([[22, -3], [44, 2]]);
            });

            it('should filter dimensions based on the same data', () => {
                expect(otherDimension.top(Infinity).length).toBe(3);
            });

            describe('when filtering with null', () => {
                beforeEach(() => {
                    chart.filter(null);
                });

                it('should remove all filtering from the dimensions based on the same data', () => {
                    expect(otherDimension.top(Infinity).length).toBe(10);
                });

            });
        });

        function filteringAnotherDimension () {
            describe('filtering another dimension', () => {
                let otherDimension;

                beforeEach(() => {
                    otherDimension = data.dimension(d => [+d.value, +d.nvalue]);
                    const ff = dc.filters.RangedTwoDimensionalFilter([[22, -3], [44, 2]]).isFiltered;
                    otherDimension.filterFunction(ff);
                    chart.redraw();
                });

                it('should show the included points', () => {
                    const shownPoints = symbolsOfRadius(10); // test symbolSize
                    expect(shownPoints.length).toBe(2);
                    expect(shownPoints[0].key).toEqual([22, -2]);
                    expect(shownPoints[1].key).toEqual([33, 1]);
                });
                it('should hide the excluded points', () => {
                    const emptyPoints = symbolsOfRadius(4); // test emptySize
                    expect(emptyPoints.length).toBe(7);
                });
                it('should use emptyOpacity for excluded points', () => {
                    const translucentPoints = symbolsMatching(function () {
                        return +d3.select(this).attr('opacity') === 0.5; // emptyOpacity
                    });
                    expect(translucentPoints.length).toBe(7);
                });
                it('should use emptyColor for excluded points', () => {
                    const chartreusePoints = symbolsMatching(function () { // don't try this at home
                        return /#DFFF00/i.test(d3.select(this).attr('fill')); // emptyColor
                    });
                    expect(chartreusePoints.length).toBe(7);
                });
                it('should update the titles', () => {
                    const titles = chart.selectAll('path.symbol title');
                    const expected =
                        ['22,-2: 1', '22,10: 0', '33,1: 2', '44,-3: 0', '44,-4: 0', '44,2: 0', '55,-3: 0', '55,-5: 0', '66,-4: 0'];
                    expect(titles.size()).toBe(expected.length);
                    titles.each(function (d) {
                        expect(this.textContent).toBe(expected.shift());
                    });
                });
            });
        }

        filteringAnotherDimension();

        function cloneGroup (grp) {
            return {
                all: function () {
                    return grp.all().map(kv => ({
                        key: kv.key.slice(0),
                        value: kv.value
                    }));
                }
            };
        }

        describe('with cloned data', () => {
            beforeEach(() => {
                chart.group(cloneGroup(group))
                    .render();
            });

            filteringAnotherDimension();
        });

        function removeEmptyBins (sourceGroup) {
            return {
                all: function () {
                    //return Math.abs(d.value) > 0.00001; // if using floating-point numbers
                    return sourceGroup.all().filter(d => d.value !== 0); // if integers only
                }
            };
        }

        describe('with empty bins removed', () => {
            let otherDimension;
            beforeEach(() => {
                chart.group(removeEmptyBins(group))
                    .render();
                otherDimension = data.dimension(d => [+d.value, +d.nvalue]);
                const ff = dc.filters.RangedTwoDimensionalFilter([[22, -3], [44, 2]]).isFiltered;
                otherDimension.filterFunction(ff);
                chart.redraw();
            });

            it('should only contain the included points', () => {
                const emptyPoints = symbolsMatching(() => true);
                expect(emptyPoints.length).toBe(2);
            });
            it('should show the included points', () => {
                const shownPoints = symbolsOfRadius(10); // test symbolSize
                expect(shownPoints.length).toBe(2);
                expect(shownPoints[0].key).toEqual([22, -2]);
                expect(shownPoints[1].key).toEqual([33, 1]);
            });
            it('should update the titles', () => {
                const titles = chart.selectAll('path.symbol title');
                const expected = ['22,-2: 1', '33,1: 2'];
                expect(titles.size()).toBe(expected.length);
                titles.each(function (d) {
                    expect(this.textContent).toBe(expected.shift());
                });
            });
        });

        describe('brushing', () => {
            let otherDimension;

            beforeEach(() => {
                otherDimension = data.dimension(d => [+d.value, +d.nvalue]);

                simulateChart2DBrushing(chart, [[22, -3], [44, 2]]);

                chart.redraw();
            });

            it('should not create brush handles', () => {
                const selectAll = chart.select('g.brush').selectAll('path.custom-brush-handle');
                expect(selectAll.size()).toBe(0);
            });

            it('should filter dimensions based on the same data', () => {
                jasmine.clock().tick(100);
                expect(otherDimension.top(Infinity).length).toBe(3);
            });

            /* D3v4 - no easy replacement, dropping this case
            it('should set the height of the brush to the height implied by the extent', function () {
                expect(chart.select('g.brush rect.extent').attr('height')).toBe('46');
            });
            */

            it('should not add handles to the brush', () => {
                expect(chart.select('.resize path').empty()).toBeTruthy();
            });

            describe('excluded points', () => {
                let selectedPoints;

                beforeEach(() => {
                    jasmine.clock().tick(100);
                });

                const isOpaque = function () {
                    return +d3.select(this).attr('opacity') === 0.9; // test nonemptyOpacity
                };
                const isTranslucent = function () {
                    return +d3.select(this).attr('opacity') === 0.25; // test excludedOpacity
                };
                const isBlue = function () {
                    return d3.select(this).attr('fill') === '#1f77b4';
                };
                const isGrey = function () {
                    return d3.select(this).attr('fill') === '#ccc'; // test excludedColor
                };

                it('should not shrink the included points', () => {
                    selectedPoints = symbolsOfRadius(chart.symbolSize());
                    expect(selectedPoints.length).toBe(2);
                    expect(selectedPoints[0].key).toEqual([22, -2]);
                    expect(selectedPoints[1].key).toEqual([33, 1]);
                });

                it('should shrink the excluded points', () => {
                    selectedPoints = symbolsOfRadius(2); // test excludedSize
                    expect(selectedPoints.length).toBe(7);
                    expect(selectedPoints[0].key).toEqual([22, 10]);
                    expect(selectedPoints[1].key).toEqual([44, -3]);
                });

                it('should keep the included points opaque', () => {
                    selectedPoints = symbolsMatching(isOpaque);
                    expect(selectedPoints.length).toBe(2);
                    expect(selectedPoints[0].key).toEqual([22, -2]);
                    expect(selectedPoints[1].key).toEqual([33, 1]);
                });

                it('should make the excluded points translucent', () => {
                    selectedPoints = symbolsMatching(isTranslucent);
                    expect(selectedPoints.length).toBe(7);
                    expect(selectedPoints[0].key).toEqual([22, 10]);
                    expect(selectedPoints[1].key).toEqual([44, -3]);
                });

                it('should keep the included points blue', () => {
                    selectedPoints = symbolsMatching(isBlue);
                    expect(selectedPoints.length).toBe(2);
                    expect(selectedPoints[0].key).toEqual([22, -2]);
                    expect(selectedPoints[1].key).toEqual([33, 1]);
                });

                it('should make the excluded points grey', () => {
                    selectedPoints = symbolsMatching(isGrey);
                    expect(selectedPoints.length).toBe(7);
                    expect(selectedPoints[0].key).toEqual([22, 10]);
                    expect(selectedPoints[1].key).toEqual([44, -3]);
                });

                it('should restore sizes, colors, and opacity when the brush is empty', () => {
                    simulateChart2DBrushing(chart, [[22, 2], [22, -3]]);

                    jasmine.clock().tick(100);

                    selectedPoints = symbolsOfRadius(chart.symbolSize());
                    expect(selectedPoints.length).toBe(9);

                    selectedPoints = symbolsMatching(isBlue);
                    expect(selectedPoints.length).toBe(9);

                    selectedPoints = symbolsMatching(isOpaque);
                    expect(selectedPoints.length).toBe(9);

                    chart.redraw();

                    selectedPoints = symbolsOfRadius(chart.symbolSize());
                    expect(selectedPoints.length).toBe(9);

                    selectedPoints = symbolsMatching(isBlue);
                    expect(selectedPoints.length).toBe(9);

                    selectedPoints = symbolsMatching(isOpaque);
                    expect(selectedPoints.length).toBe(9);
                });
            });
        });
    });

    function matchSymbolSize (r) {
        return function () {
            const symbol = d3.select(this);
            const size = Math.pow(r, 2);
            const path = d3.symbol().size(size)();
            const result = comparePaths(symbol.attr('d'), path);
            return result.pass;
        };
    }

    function matchSymbol (s, r) {
        return function () {
            const symbol = d3.select(this);
            const size = Math.pow(r, 2);
            const path = s.size(size)();
            const result = comparePaths(symbol.attr('d'), path);
            return result.pass;
        };
    }

    function symbolsMatching (pred) {
        function getData (symbols) {
            return symbols.nodes().map(symbol => d3.select(symbol).datum());
        }

        return getData(chart.selectAll('path.symbol').filter(pred));
    }

    function symbolsOfRadius (r) {
        return symbolsMatching(matchSymbolSize(r));
    }

    describe('legends', () => {
        let compositeChart;
        let subChart1, subChart2;
        let firstItem;

        beforeEach(() => {
            id = 'scatter-plot-composite';
            appendChartID(id);

            compositeChart = new dc.CompositeChart(`#${id}`);
            compositeChart
                .dimension(dimension)
                .x(d3.scaleUtc().domain([makeDate(2012, 0, 1), makeDate(2012, 11, 31)]))
                .transitionDuration(0)
                .legend(new dc.Legend())
                .compose([
                    subChart1 = new dc.ScatterPlot(compositeChart).colors('red').group(group, 'Scatter 1'),
                    subChart2 = new dc.ScatterPlot(compositeChart).colors('blue').group(group, 'Scatter 2')
                ]).render();

            firstItem = compositeChart.select('g.dc-legend g.dc-legend-item');
        });

        it('should provide a composite chart with corresponding legend data', () => {
            expect(compositeChart.legendables()).toEqual([
                {chart: subChart1, name: 'Scatter 1', color: 'red'},
                {chart: subChart2, name: 'Scatter 2', color: 'blue'}
            ]);
        });

        describe('hovering', () => {
            beforeEach(() => {
                firstItem.on('mouseover')(firstItem.datum());
            });

            describe('when a legend item is hovered over', () => {
                it('should highlight corresponding plot', () => {
                    nthChart(0).expectPlotSymbolsToHaveSize(subChart1.highlightedSize());

                });

                it('should fade out non-corresponding lines and areas', () => {
                    nthChart(1).expectPlotSymbolsToHaveClass('fadeout');
                });
            });

            describe('when a legend item is hovered out', () => {
                beforeEach(() => {
                    firstItem.on('mouseout')(firstItem.datum());
                });

                it('should remove highlighting from corresponding lines and areas', () => {
                    nthChart(0).expectPlotSymbolsToHaveSize(subChart1.symbolSize());
                });

                it('should fade in non-corresponding lines and areas', () => {
                    nthChart(1).expectPlotSymbolsNotToHaveClass('fadeout');
                });
            });
        });

        function nthChart (n) {
            const subChart = d3.select(compositeChart.selectAll('g.sub').nodes()[n]);

            subChart.expectPlotSymbolsToHaveClass = function (className) {
                subChart.selectAll('path.symbol').each(function () {
                    expect(d3.select(this).classed(className)).toBeTruthy();
                });
            };

            subChart.expectPlotSymbolsToHaveSize = function (size) {
                const match = matchSymbolSize(size);
                subChart.selectAll('path.symbol').each(function () {
                    expect(match.apply(this)).toBeTruthy();
                });
            };

            subChart.expectPlotSymbolsNotToHaveClass = function (className) {
                subChart.selectAll('path.symbol').each(function () {
                    expect(d3.select(this).classed(className)).toBeFalsy();
                });
            };

            return subChart;
        }
    });
    describe('with ordinal axes', () => {
        beforeEach(() => {
            dimension = data.dimension(d => [d.state, d.region]);
            group = dimension.group();
            chart
                .margins({left: 50, top: 10, right: 0, bottom: 20})
                .dimension(dimension)
                .group(group)
                .x(d3.scaleBand())
                // ordinal axes work but you have to set the padding for both axes & give the y domain
                .y(d3.scaleBand().paddingInner(1).domain(group.all().map(kv => kv.key[1])))
                .xUnits(dc.units.ordinal)
                ._rangeBandPadding(1)
                .render();
        });
        it('should correctly place the symbols', () => {
            expect(nthSymbol(4).attr('transform')).toMatchTranslate(262.5, 75);
            expect(nthSymbol(5).attr('transform')).toMatchTranslate(337.5, 37.5);
            expect(nthSymbol(7).attr('transform')).toMatchTranslate(412.5, 0);
        });
        describe('with grid lines', () => {
            beforeEach(() => {
                chart
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .render();
            });
            it('should draw the correct number of grid lines', () => {
                expect(chart.selectAll('.grid-line.horizontal line').size()).toBe(5);
                expect(chart.selectAll('.grid-line.vertical line').size()).toBe(6);
            });
        });
    });

    function nthSymbol (i) {
        return d3.select(chart.selectAll('path.symbol').nodes()[i]);
    }
});

