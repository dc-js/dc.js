/* global appendChartID, loadColorFixture, loadColorFixture2, loadIrisFixture */
describe('dc.heatmap', function () {
    var id, data, dimension, group, chart, chartHeight, chartWidth;

    beforeEach(function () {
        data = crossfilter(loadColorFixture());
        dimension = data.dimension(function (d) { return [+d.colData, +d.rowData]; });
        group = dimension.group().reduceSum(function (d) { return +d.colorData; });

        chartHeight = 210;
        chartWidth = 210;

        id = 'heatmap-chart';
        appendChartID(id);
        chart = dc.heatMap('#' + id);

        chart
            .dimension(dimension)
            .group(group)
            .keyAccessor(function (d) { return d.key[0]; })
            .valueAccessor(function (d) { return d.key[1]; })
            .colorAccessor(function (d) { return d.value; })
            .colors(['#000001', '#000002', '#000003', '#000004'])
            .title(function (d) {return d.key + ': ' + d.value; })
            .height(chartHeight)
            .width(chartWidth)
            .transitionDuration(0)
            .margins({top: 5, right: 5, bottom: 5, left: 5})
            .calculateColorDomain();

    });

    describe('rendering the heatmap', function () {
        beforeEach(function () {
            chart.render();
        });

        it('should create svg', function () {
            expect(chart.svg()).not.toBeNull();
        });

        it('should transform the graph position using the graph margins', function () {
            expect(chart.select('g.heatmap').attr('transform')).toMatchTranslate(5, 5);
        });

        it('should position the heatboxes in a matrix', function () {
            var heatBoxes = chart.selectAll('rect.heat-box');

            expect(+heatBoxes[0][0].getAttribute('x')).toEqual(0);
            expect(+heatBoxes[0][0].getAttribute('y')).toEqual(100);

            expect(+heatBoxes[0][1].getAttribute('x')).toEqual(0);
            expect(+heatBoxes[0][1].getAttribute('y')).toEqual(0);

            expect(+heatBoxes[0][2].getAttribute('x')).toEqual(100);
            expect(+heatBoxes[0][2].getAttribute('y')).toEqual(100);

            expect(+heatBoxes[0][3].getAttribute('x')).toEqual(100);
            expect(+heatBoxes[0][3].getAttribute('y')).toEqual(0);
        });

        it('should color heatboxes using the provided color option', function () {
            var heatBoxes = chart.selectAll('rect.heat-box');

            expect(heatBoxes[0][0].getAttribute('fill')).toMatch(/#000001/i);
            expect(heatBoxes[0][1].getAttribute('fill')).toMatch(/#000002/i);
            expect(heatBoxes[0][2].getAttribute('fill')).toMatch(/#000003/i);
            expect(heatBoxes[0][3].getAttribute('fill')).toMatch(/#000004/i);
        });

        it('should size heatboxes based on the size of the matrix', function () {
            chart.selectAll('rect.heat-box').each(function () {
                expect(+this.getAttribute('height')).toEqual(100);
                expect(+this.getAttribute('width')).toEqual(100);
            });
        });

        it('should position the y-axis labels with their associated rows', function () {
            var yaxisTexts = chart.selectAll('.rows.axis text');
            expect(+yaxisTexts[0][0].getAttribute('y')).toEqual(150);
            expect(+yaxisTexts[0][0].getAttribute('x')).toEqual(0);
            expect(+yaxisTexts[0][1].getAttribute('y')).toEqual(50);
            expect(+yaxisTexts[0][1].getAttribute('x')).toEqual(0);
        });

        it('should have labels on the y-axis corresponding to the row values', function () {
            var yaxisTexts = chart.selectAll('.rows.axis text');
            expect(yaxisTexts[0][0].textContent).toEqual('1');
            expect(yaxisTexts[0][1].textContent).toEqual('2');
        });

        it('should position the x-axis labels with their associated columns', function () {
            var xaxisTexts = chart.selectAll('.cols.axis text');
            expect(+xaxisTexts[0][0].getAttribute('y')).toEqual(200);
            expect(+xaxisTexts[0][0].getAttribute('x')).toEqual(50);
            expect(+xaxisTexts[0][1].getAttribute('y')).toEqual(200);
            expect(+xaxisTexts[0][1].getAttribute('x')).toEqual(150);
        });

        it('should have labels on the x-axis corresponding to the row values', function () {
            var xaxisTexts = chart.selectAll('.cols.axis text');
            expect(xaxisTexts[0][0].textContent).toEqual('1');
            expect(xaxisTexts[0][1].textContent).toEqual('2');
        });

        describe('with custom labels', function () {
            beforeEach(function () {
                chart.colsLabel(function (x) { return 'col ' + x;})
                    .rowsLabel(function (x) { return 'row ' + x;})
                    .redraw();
            });
            it('should display the custom labels on the x axis', function () {
                var xaxisTexts = chart.selectAll('.cols.axis text');
                expect(xaxisTexts[0][0].textContent).toEqual('col 1');
                expect(xaxisTexts[0][1].textContent).toEqual('col 2');
            });
            it('should display the custom labels on the y axis', function () {
                var yaxisTexts = chart.selectAll('.rows.axis text');
                expect(yaxisTexts[0][0].textContent).toEqual('row 1');
                expect(yaxisTexts[0][1].textContent).toEqual('row 2');
            });
        });

        describe('box radius', function () {
            it('should default the x', function () {
                chart.select('rect.heat-box').each(function () {
                    expect(this.getAttribute('rx')).toBe('6.75');
                });
            });

            it('should default the y', function () {
                chart.select('rect.heat-box').each(function () {
                    expect(this.getAttribute('ry')).toBe('6.75');
                });
            });

            it('should set the radius to an overridden x', function () {
                chart.xBorderRadius(7);
                chart.render();

                chart.select('rect.heat-box').each(function () {
                    expect(this.getAttribute('rx')).toBe('7');
                });
            });

            it('should set the radius to an overridden y', function () {
                chart.yBorderRadius(7);
                chart.render();

                chart.select('rect.heat-box').each(function () {
                    expect(this.getAttribute('ry')).toBe('7');
                });
            });
        });

    });

    describe('change crossfilter', function () {
        var data2, dimension2, group2, originalDomain, newDomain;

        var reduceDimensionValues = function (dimension) {
            return dimension.top(Infinity).reduce(function (p, d) {
                p.cols.add(d.colData);
                p.rows.add(d.rowData);
                return p;
            }, {cols: d3.set(), rows: d3.set()});
        };

        beforeEach(function () {
            data2 = crossfilter(loadColorFixture2());
            dimension2 = data2.dimension(function (d) { return [+d.colData, +d.rowData]; });
            group2 = dimension2.group().reduceSum(function (d) { return +d.colorData; });
            originalDomain = reduceDimensionValues(dimension);
            newDomain = reduceDimensionValues(dimension2);

            chart.dimension(dimension2).group(group2);
            chart.render();
            chart.dimension(dimension).group(group);
            chart.redraw();
        });

        it('should have the correct number of columns', function () {
            chart.selectAll('.box-group').each(function (d) {
                expect(originalDomain.cols.has(d.key[0])).toBeTruthy();
            });

            chart.selectAll('.cols.axis text').each(function (d) {
                expect(originalDomain.cols.has(d)).toBeTruthy();
            });
        });

        it('should have the correct number of rows', function () {
            chart.selectAll('.box-group').each(function (d) {
                expect(originalDomain.rows.has(d.key[1])).toBeTruthy();
            });

            chart.selectAll('.rows.axis text').each(function (d) {
                expect(originalDomain.rows.has(d)).toBeTruthy();
            });
        });
    });

    describe('indirect filtering', function () {
        var dimension2, group2;
        beforeEach(function () {
            dimension2 = data.dimension(function (d) { return +d.colorData; });
            group2 = dimension2.group().reduceSum(function (d) { return +d.colorData; });

            chart.dimension(dimension).group(group);
            chart.render();
            dimension2.filter('3');
            chart.redraw();
        });

        it('should update the title of the boxes', function () {
            var titles = chart.selectAll('.box-group title');
            var expected = ['1,1: 0', '1,2: 0', '2,1: 6', '2,2: 0'];
            titles.each(function (d) {
                expect(this.textContent).toBe(expected.shift());
            });
        });
    });

    describe('filtering', function () {
        var filterX, filterY;
        var otherDimension;

        beforeEach(function () {
            filterX = Math.ceil(Math.random() * 2);
            filterY = Math.ceil(Math.random() * 2);
            otherDimension = data.dimension(function (d) { return +d.colData; });
            chart.render();
        });

        function clickCellOnChart (chart, x, y) {
            var oneCell = chart.selectAll('.box-group').filter(function (d) {
                return d.key[0] === x && d.key[1] === y;
            });
            oneCell.select('rect').on('click')(oneCell.datum());
            return oneCell;
        }

        it('cells should have the appropriate class', function () {
            clickCellOnChart(chart, filterX, filterY);
            chart.selectAll('.box-group').each(function (d) {
                var cell = d3.select(this);
                if (d.key[0] === filterX && d.key[1] === filterY) {
                    expect(cell.classed('selected')).toBeTruthy();
                    expect(chart.hasFilter(d.key)).toBeTruthy();
                } else {
                    expect(cell.classed('deselected')).toBeTruthy();
                    expect(chart.hasFilter(d.key)).toBeFalsy();
                }
            });
        });

        it('should keep all data points for that cell', function () {
            var otherGroup = otherDimension.group().reduceSum(function (d) { return +d.colorData; });
            var otherChart = dc.baseChart({}).dimension(otherDimension).group(otherGroup);

            otherChart.render();
            var clickedCell = clickCellOnChart(chart, filterX, filterY);
            expect(otherChart.data()[filterX - 1].value).toEqual(clickedCell.datum().value);
        });

        it('should be able to clear filters by filtering with null', function () {
            clickCellOnChart(chart, filterX, filterY);
            expect(otherDimension.top(Infinity).length).toBe(2);
            chart.filter(null);
            expect(otherDimension.top(Infinity).length).toBe(8);
        });
    });

    describe('click events', function () {
        beforeEach(function () {
            chart.render();
        });
        it('should toggle a filter for the clicked box', function () {
            chart.selectAll('.box-group').each(function (d) {
                var cell = d3.select(this).select('rect');
                cell.on('click')(d);
                expect(chart.hasFilter(d.key)).toBeTruthy();
                cell.on('click')(d);
                expect(chart.hasFilter(d.key)).toBeFalsy();
            });
        });
        describe('on axis labels', function () {
            function assertOnlyThisAxisIsFiltered (chart, axis, value) {
                chart.selectAll('.box-group').each(function (d) {
                    if (d.key[axis] === value) {
                        expect(chart.hasFilter(d.key)).toBeTruthy();
                    } else {
                        expect(chart.hasFilter(d.key)).toBeFalsy();
                    }
                });
            }

            describe('with nothing previously filtered', function () {
                it('should filter all cells on that axis', function () {
                    chart.selectAll('.cols.axis text').each(function (d) {
                        var axisLabel = d3.select(this);
                        axisLabel.on('click')(d);
                        assertOnlyThisAxisIsFiltered(chart, 0, d);
                        axisLabel.on('click')(d);
                    });
                    chart.selectAll('.rows.axis text').each(function (d) {
                        var axisLabel = d3.select(this);
                        axisLabel.on('click')(d);
                        assertOnlyThisAxisIsFiltered(chart, 1, d);
                        axisLabel.on('click')(d);
                    });
                });
            });
            describe('with one cell on that axis already filtered', function () {
                it('should filter all cells on that axis (and the original cell should remain filtered)', function () {
                    var boxes = chart.selectAll('.box-group');
                    var box = d3.select(boxes[0][Math.floor(Math.random() * boxes.length)]);

                    box.select('rect').on('click')(box.datum());

                    expect(chart.hasFilter(box.datum().key)).toBeTruthy();

                    var xVal = box.datum().key[0];

                    var columns = chart.selectAll('.cols.axis text');
                    var column = columns.filter(function (columnData) {
                        return columnData === xVal;
                    });

                    column.on('click')(column.datum());

                    assertOnlyThisAxisIsFiltered(chart, 0, xVal);

                    column.on('click')(column.datum());
                });
            });
            describe('with all cells on that axis already filtered', function () {
                it('should remove all filters on that axis', function () {
                    var xVal = 1;
                    chart.selectAll('.box-group').each(function (d) {
                        var box = d3.select(this);
                        if (d.key[0] === xVal) {
                            box.select('rect').on('click')(box.datum());
                        }
                    });

                    assertOnlyThisAxisIsFiltered(chart, 0, xVal);

                    var columns = chart.selectAll('.cols.axis text');
                    var column = columns.filter(function (columnData) {
                        return columnData === xVal;
                    });

                    column.on('click')(column.datum());

                    chart.select('.box-group').each(function (d) {
                        expect(chart.hasFilter(d.key)).toBeFalsy();
                    });
                });
            });
        });
    });
    describe('iris filtering', function () {
        /* jshint camelcase: false */
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        // 2-chart version of from http://bl.ocks.org/gordonwoodhull/14c623b95993808d69620563508edba6
        var irisData, bubbleChart, petalDim, petalGroup;
        beforeEach(function () {
            irisData = loadIrisFixture();

            var fields = {
                sl: 'sepal_length',
                sw: 'sepal_width',
                pl: 'petal_length',
                pw: 'petal_width'
            };
            var species = ['setosa', 'versicolor', 'virginica'];

            irisData.forEach(function (d) {
                Object.keys(fields).forEach(function (ab) {
                    d[fields[ab]] = +d[fields[ab]];
                });
            });
            // autogenerate a key function for an extent
            function key_function (extent) {
                var div = extent[1] - extent[0] < 5 ? 2 : 1;
                return function (k) {
                    return Math.floor(k * div) / div;
                };
            }
            var extents = {};
            var keyfuncs = {};
            Object.keys(fields).forEach(function (ab) {
                extents[ab] = d3.extent(irisData, function (d) { return d[fields[ab]]; });
                keyfuncs[ab] = key_function(extents[ab]);
            });
            data = crossfilter(irisData);
            function duo_key (ab1, ab2) {
                return function (d) {
                    return [keyfuncs[ab1](d[fields[ab1]]), keyfuncs[ab2](d[fields[ab2]])];
                };
            }
            function key_part (i) {
                return function (kv) {
                    return kv.key[i];
                };
            }
            function reduce_species (group) {
                group.reduce(
                    function (p, v) {
                        p[v.species]++;
                        p.total++;
                        return p;
                    }, function (p, v) {
                        p[v.species]--;
                        p.total--;
                        return p;
                    }, function () {
                        var init = {total: 0};
                        species.forEach(function (s) { init[s] = 0; });
                        return init;
                    }
                );
            }
            function max_species (d) {
                var max = 0, i = -1;
                species.forEach(function (s, j) {
                    if (d.value[s] > max) {
                        max = d.value[s];
                        i = j;
                    }
                });
                return i >= 0 ? species[i] : null;
            }
            function initialize_bubble (bubbleChart) {
                bubbleChart
                    .width(400)
                    .height(400)
                    .x(d3.scale.linear()).xAxisPadding(0.5)
                    .y(d3.scale.linear()).yAxisPadding(0.5)
                    .elasticX(true)
                    .elasticY(true)
                    .label(d3.functor(''))
                    .keyAccessor(key_part(0))
                    .valueAccessor(key_part(1))
                    .radiusValueAccessor(function (kv) { return kv.value.total; })
                    .colors(d3.scale.ordinal()
                            .domain(species.concat('none'))
                            .range(['#e41a1c','#377eb8','#4daf4a', '#f8f8f8']))
                    .colorAccessor(function (d) {
                        return max_species(d) || 'none';
                    });
            }
            function initialize_heatmap (heatMap) {
                heatMap
                    .width(400)
                    .height(400)
                    .xBorderRadius(15).yBorderRadius(15)
                    .keyAccessor(key_part(0))
                    .valueAccessor(key_part(1))
                    .colors(d3.scale.ordinal()
                            .domain(species.concat('none'))
                            .range(['#e41a1c','#377eb8','#4daf4a', '#f8f8f8']))
                    .colorAccessor(function (d) {
                        return max_species(d) || 'none';
                    })
                    .renderTitle(true)
                    .title(function (d) {
                        return JSON.stringify(d.value, null, 2);
                    });
            }

            var bubbleId = 'bubble-chart';
            appendChartID(bubbleId);

            bubbleChart = dc.bubbleChart('#' + bubbleId);
            var sepalDim = data.dimension(duo_key('sl', 'sw')), sepalGroup = sepalDim.group();
            petalDim = data.dimension(duo_key('pl', 'pw')); petalGroup = petalDim.group();

            reduce_species(sepalGroup);
            reduce_species(petalGroup);
            initialize_bubble(bubbleChart.dimension(sepalDim).group(sepalGroup));
            initialize_heatmap(chart.dimension(petalDim).group(petalGroup));
            bubbleChart.render();
            chart.render();
        });
        // return brand-new objects and keys every time
        function clone_group (group) {
            function clone_kvs (all) {
                return all.map(function (kv) {
                    return {
                        key: kv.key.slice(0),
                        value: Object.assign({}, kv.value)
                    };
                });
            }
            return {
                all: function () {
                    return clone_kvs(group.all());
                },
                top: function (N) {
                    return clone_kvs(group.top(N));
                }
            };
        }

        function testRectFillsBubble12 (chart) {
            var rects = chart.selectAll('rect')[0];
            expect(d3.select(rects[0]).attr('fill')).toMatch(/#f8f8f8/i);
            expect(d3.select(rects[3]).attr('fill')).toMatch(/#377eb8/i);
            expect(d3.select(rects[4]).attr('fill')).toMatch(/#377eb8/i);
            expect(d3.select(rects[7]).attr('fill')).toMatch(/#4daf4a/i);
            expect(d3.select(rects[8]).attr('fill')).toMatch(/#f8f8f8/i);
            expect(d3.select(rects[10]).attr('fill')).toMatch(/#f8f8f8/i);
            expect(d3.select(rects[11]).attr('fill')).toMatch(/#f8f8f8/i);
            expect(d3.select(rects[12]).attr('fill')).toMatch(/#f8f8f8/i);
        }
        function testRectTitlesBubble12 (chart) {
            var titles = chart.selectAll('g.box-group title')[0];
            expect(JSON.parse(d3.select(titles[0]).text()).total).toBe(0);
            expect(JSON.parse(d3.select(titles[2]).text()).total).toBe(0);
            expect(JSON.parse(d3.select(titles[3]).text()).total).toBe(2);
            expect(JSON.parse(d3.select(titles[4]).text()).total).toBe(3);
            expect(JSON.parse(d3.select(titles[5]).text()).total).toBe(0);
            expect(JSON.parse(d3.select(titles[7]).text()).total).toBe(1);
            expect(JSON.parse(d3.select(titles[9]).text()).total).toBe(0);
            expect(JSON.parse(d3.select(titles[10]).text()).total).toBe(0);
            expect(JSON.parse(d3.select(titles[12]).text()).total).toBe(0);
        }

        describe('bubble filtering with straight crossfilter', function () {
            beforeEach(function () {
                var aBubble = d3.select(bubbleChart.selectAll('circle.bubble')[0][12]);
                aBubble.on('click')(aBubble.datum());
                d3.timer.flush();
            });
            it('updates rect fills correctly', function () {
                testRectFillsBubble12(chart);
            });
            it('updates rect titles correctly', function () {
                testRectTitlesBubble12(chart);
            });
        });
        describe('column filtering with cloned results', function () {
            beforeEach(function () {
                chart.group(clone_group(petalGroup));
                chart.render();
                var aBubble = d3.select(bubbleChart.selectAll('circle.bubble')[0][12]);
                aBubble.on('click')(aBubble.datum());
                d3.timer.flush();
            });
            it('updates rect fills correctly', function () {
                testRectFillsBubble12(chart);
            });
            it('updates rect titles correctly', function () {
                testRectTitlesBubble12(chart);
            });
        });
        /* jshint camelcase: true */
        // jscs enable: requireCamelCaseOrUpperCaseIdentifiers
    });
});
