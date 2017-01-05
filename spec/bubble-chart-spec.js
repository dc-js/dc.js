/* global appendChartID, loadDateFixture, loadIrisFixture, makeDate */
describe('dc.bubbleChart', function () {
    var id, chart, data;
    var dateFixture;
    var dimension, group;
    var countryDimension;
    var width = 900, height = 350;

    beforeEach(function () {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(function (d) {
            return d.status;
        });
        group = dimension.group()
            .reduce(
                //add
                function (p, v) {
                    ++p.count;
                    p.value += +v.value;
                    return p;
                },
                //remove
                function (p, v) {
                    --p.count;
                    p.value -= +v.value;
                    return p;
                },
                //init
                function () {
                    return {count: 0, value: 0};
                }
            )
            .order(function (d) {return d.value;});
        countryDimension = data.dimension(function (d) {
            return d.countrycode;
        });

        id = 'bubble-chart';
        appendChartID(id);

        chart = dc.bubbleChart('#' + id);
        chart.dimension(dimension).group(group)
            .width(width).height(height)
            .colors(['#a60000', '#ff0000', '#ff4040', '#ff7373', '#67e667', '#39e639', '#00cc00'])
            .colorDomain([0,220])
            .colorAccessor(function (p) {
                return p.value.value;
            })
            .keyAccessor(function (p) {
                return p.value.value;
            })
            .valueAccessor(function (p) {
                return p.value.count;
            })
            .radiusValueAccessor(function (p) {
                return p.value.count;
            })
            .x(d3.scale.linear().domain([0, 300]))
            .y(d3.scale.linear().domain([0, 10]))
            .r(d3.scale.linear().domain([0, 30]))
            .maxBubbleRelativeSize(0.3)
            .transitionDuration(0)
            .renderLabel(true)
            .renderTitle(true)
            .title(function (p) {
                return p.key + ': {count:' + p.value.count + ',value:' + p.value.value + '}';
            });
    });

    it('assigns colors', function () {
        expect(chart.colors()).not.toBeNull();
    });

    it('sets the radius scale', function () {
        expect(chart.r()).not.toBeNull();
    });

    it('sets the radius value accessor', function () {
        expect(chart.radiusValueAccessor()).not.toBeNull();
    });

    it('sets the x units', function () {
        expect(chart.xUnits()).toBe(dc.units.integers);
    });

    it('creates the x axis', function () {
        expect(chart.xAxis()).not.toBeNull();
    });

    it('creates the y axis', function () {
        expect(chart.yAxis()).not.toBeNull();
    });

    describe('render', function () {
        beforeEach(function () {
            chart.render();
        });

        it('generates right number of bubbles', function () {
            expect(chart.selectAll('circle.bubble')[0].length).toBe(2);
        });

        it('calculates right cx for each bubble', function () {
            chart.selectAll('g.node').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('transform')).toMatchTranslate(601.3333333333334, 155, 3);
                }
                if (i === 1) {
                    expect(d3.select(this).attr('transform')).toMatchTranslate(541.2, 155);
                }
            });
        });

        it('generates opaque groups and circles for each bubble', function () {
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('opacity')).toBeNull();
                expect(d3.select(this).select('circle').attr('opacity')).toBe('1');
            });
        });

        it('calculates right r for each bubble', function () {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(Number(d3.select(this).attr('r'))).toBeCloseTo(49.33333333333333, 3);
                }
                if (i === 1) {
                    expect(Number(d3.select(this).attr('r'))).toBeCloseTo(49.33333333333333, 3);
                }
            });
        });

        it('attaches each bubble with index based class', function () {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('class')).toBe('bubble _0');
                }
                if (i === 1) {
                    expect(d3.select(this).attr('class')).toBe('bubble _1');
                }
            });
        });

        it('generates right number of labels', function () {
            expect(chart.selectAll('g.node text')[0].length).toBe(2);
        });

        it('creates correct label for each bubble', function () {
            chart.selectAll('g.node text').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).text()).toBe('F');
                }
                if (i === 1) {
                    expect(d3.select(this).text()).toBe('T');
                }
            });
        });

        it('generates right number of titles', function () {
            expect(chart.selectAll('g.node title')[0].length).toBe(2);
        });

        it('creates correct title for each bubble', function () {
            chart.selectAll('g.node title').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).text()).toBe('F: {count:5,value:220}');
                }
                if (i === 1) {
                    expect(d3.select(this).text()).toBe('T: {count:5,value:198}');
                }
            });
        });

        it('fills bubbles with correct colors', function () {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('fill')).toMatch(/#00cc00/i);
                }
                if (i === 1) {
                    expect(d3.select(this).attr('fill')).toMatch(/#00cc00/i);
                }
            });
        });
    });

    describe('bubble chart w/o label & title', function () {
        beforeEach(function () {
            chart.renderLabel(false).renderTitle(false).render();
        });

        it('generates right number of labels', function () {
            expect(chart.selectAll('g.node text')[0].length).toBe(0);
        });

        it('generates right number of titles', function () {
            expect(chart.selectAll('g.node title')[0].length).toBe(0);
        });
    });

    describe('with filter', function () {
        beforeEach(function () {
            chart.filter('F').render();
        });

        it('deselects bubble based on filter value', function () {
            chart.selectAll('g.node').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('class')).toBe('node selected');
                }
                if (i === 1) {
                    expect(d3.select(this).attr('class')).toBe('node deselected');
                }
            });
        });

        it('handles multi-selection highlight', function () {
            chart.filter('T');
            chart.redraw();
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('class')).toBe('node selected');
            });
        });
    });

    describe('update', function () {
        beforeEach(function () {
            chart.render();
            countryDimension.filter('CA');
            chart.redraw();
        });

        it('creates correct label for each bubble', function () {
            chart.selectAll('g.node title').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).text()).toBe('F: {count:0,value:0}');
                }
                if (i === 1) {
                    expect(d3.select(this).text()).toBe('T: {count:2,value:77}');
                }
            });
        });

        it('fills bubbles with correct colors', function () {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('fill')).toMatch(/#a60000/i);
                }
                if (i === 1) {
                    expect(d3.select(this).attr('fill')).toMatch(/#ff4040/i);
                }
            });
        });

        describe('with bubble sorting', function () {
            beforeEach(function () {
                chart
                    .sortBubbleSize(true)
                    .render();
            });

            it('creates correct label for each bubble', function () {
                chart.selectAll('g.node title').each(function (d, i) {
                    if (i === 0) {
                        expect(d3.select(this).text()).toBe('T: {count:2,value:77}');
                    }
                    if (i === 1) {
                        expect(d3.select(this).text()).toBe('F: {count:0,value:0}');
                    }
                });
            });

            it('fills bubbles with correct colors', function () {
                chart.selectAll('circle.bubble').each(function (d, i) {
                    if (i === 0) {
                        expect(d3.select(this).attr('fill')).toMatch(/#ff4040/i);
                    }
                    if (i === 1) {
                        expect(d3.select(this).attr('fill')).toMatch(/#a60000/i);
                    }
                });
            });
        });

    });

    describe('with no filter', function () {
        beforeEach(function () {
            countryDimension.filter('ZZ');
            chart.render();
        });

        it('sets invisible if bubble has 0 r', function () {
            chart.selectAll('g.node text').each(function (d, i) {
                expect(Number(d3.select(this).attr('opacity'))).toBe(0);
            });
        });
    });

    describe('with elastic axises', function () {
        beforeEach(function () {
            chart.elasticY(true)
                .yAxisPadding(3)
                .elasticX(true)
                .xAxisPadding(20)
                .render();
        });

        it('auto calculates x range based on width', function () {
            expect(chart.x().range()[0]).toBe(0);
            expect(chart.x().range()[1]).toBe(820);
        });

        it('sets the x domain', function () {
            expect(chart.x().domain()[0]).toBe(178);
            expect(chart.x().domain()[1]).toBe(240);
        });

        it('auto calculates y range based on height', function () {
            expect(chart.y().range()[0]).toBe(310);
            expect(chart.y().range()[1]).toBe(0);
        });

        it('sets the y domain', function () {
            expect(chart.y().domain()[0]).toBe(2);
            expect(chart.y().domain()[1]).toBe(8);
        });
    });

    describe('renderlet', function () {
        var renderlet;

        beforeEach(function () {
            // spyOn doesn't seem to work with plain functions
            renderlet = jasmine.createSpy('renderlet', function (chart) {
                chart.selectAll('circle').attr('fill', 'red');
            });
            renderlet.and.callThrough();
            chart.on('renderlet', renderlet);
        });

        it('is invoked with render', function () {
            chart.render();
            expect(chart.selectAll('circle').attr('fill')).toBe('red');
            expect(renderlet).toHaveBeenCalled();
        });

        it('is invoked with redraw', function () {
            chart.render().redraw();
            expect(chart.selectAll('circle').attr('fill')).toBe('red');
            expect(renderlet.calls.count()).toEqual(2);
        });
    });

    describe('non-unique keys', function () {
        // plot all rows as (value, nvalue) - a common scatterplot scenario
        beforeEach(function () {
            var rowDimension = data.dimension(function (d, i) {
                return i;
            });
            var rowGroup = rowDimension.group();

            chart.dimension(rowDimension).group(rowGroup)
                .keyAccessor(function (kv) {
                    return +dateFixture[kv.key].value;
                })
                .valueAccessor(function (kv) {
                    return +dateFixture[kv.key].nvalue;
                })
                .elasticY(true)
                .yAxisPadding(2)
                .elasticX(true)
                .xAxisPadding(2);

            chart.render();
        });

        it('generates right number of bubbles', function () {
            expect(chart.selectAll('circle.bubble')[0].length).toBe(10);
        });

        it('auto calculates x range based on width', function () {
            expect(chart.x().range()[0]).toBe(0);
            expect(chart.x().range()[1]).toBe(820);
        });

        it('sets the x domain', function () {
            expect(chart.x().domain()[0]).toBe(20);
            expect(chart.x().domain()[1]).toBe(68);
        });

        it('auto calculates y range based on height', function () {
            expect(chart.y().range()[0]).toBe(310);
            expect(chart.y().range()[1]).toBe(0);
        });

        it('sets the y domain', function () {
            expect(chart.y().domain()[0]).toBe(-7);
            expect(chart.y().domain()[1]).toBe(12);
        });
    });

    describe('with logarithmic scales', function () {
        beforeEach(function () {
            var rowDimension = data.dimension(function (d, i) {
                return i;
            });
            var rowGroup = rowDimension.group();

            chart
                .dimension(rowDimension)
                .group(rowGroup)
                .keyAccessor(function (kv) {
                    return 0;
                })
                .valueAccessor(function (kv) {
                    return 0;
                })
                .x(d3.scale.log().domain([1, 300]))
                .y(d3.scale.log().domain([1, 10]))
                .elasticX(false)
                .elasticY(false);
            chart.render();
        });

        it('renders without errors', function () {
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('transform')).toMatchTranslate(0, 0);
            });
        });
    });

    describe('with a date-based scale', function () {
        beforeEach(function () {
            dimension = data.dimension(function (d) { return d3.time.day.utc(d.dd); });
            group = dimension.group();

            chart
                .dimension(dimension)
                .group(group)
                .x(d3.time.scale.utc().domain([makeDate(2012, 0, 1), makeDate(2012, 11, 31)]))
                .elasticX(true)
                .elasticY(true)
                .keyAccessor(function (kv) {
                    return kv.key;
                })
                .valueAccessor(function (kv) {
                    return kv.value;
                })
                .radiusValueAccessor(function (kv) {
                    return kv.value;
                })
                .colors(d3.scale.ordinal().range(['#a60000', '#ff0000', '#ff4040', '#ff7373', '#67e667', '#39e639', '#00cc00']))
                .colorAccessor(function (kv) {
                    return kv.key;
                })
                .render();
        });

        it('draws bubbles in appropriate locations', function () {
            var coords = [
                [170.4,0], [820,155], [489.9,155], [394,310], [149.1,310], [0,310]
            ];
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('transform'))
                    .toMatchTranslate(coords[i][0], coords[i][1], 1);
            });
        });
        it('calculates elastic x axis exactly', function () {
            expect(chart.x().domain()).toEqual([makeDate(2012, 4, 25), makeDate(2012, 7, 10)]);
        });

        describe('with 10 day padding', function () {
            beforeEach(function () {
                chart.xAxisPadding(10)
                    .render();
            });
            it('should stretch the domain appropriately', function () {
                expect(chart.x().domain()).toEqual([makeDate(2012, 4, 15), makeDate(2012, 7, 20)]);
            });
        });

        describe('with 2 month padding', function () {
            beforeEach(function () {
                chart.xAxisPaddingUnit('month')
                    .xAxisPadding(2)
                    .render();
            });
            it('should stretch the domain appropriately', function () {
                expect(chart.x().domain()).toEqual([makeDate(2012, 2, 25), makeDate(2012, 9, 10)]);
            });
        });
    });

    describe('with minimum radius', function () {
        beforeEach(function () {
            chart
                .minRadius(1)
                .render();
        });

        it('shows smaller bubbles', function () {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(Number(d3.select(this).attr('r'))).toBeCloseTo(41.83333333333333, 3);
                }
                if (i === 1) {
                    expect(Number(d3.select(this).attr('r'))).toBeCloseTo(41.83333333333333, 3);
                }
            });
        });
    });

    describe('iris filtering', function () {
        /* jshint camelcase: false */
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        // 2-chart version of from http://bl.ocks.org/gordonwoodhull/14c623b95993808d69620563508edba6
        var irisData, heatMap, sepalDim, sepalGroup;
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
                    .transitionDuration(0)
                    .width(400)
                    .height(400)
                    .x(d3.scale.linear()).xAxisPadding(0.5)
                    .y(d3.scale.linear()).yAxisPadding(0.5)
                    .elasticX(true)
                    .elasticY(true)
                    .keyAccessor(key_part(0))
                    .valueAccessor(key_part(1))
                    .radiusValueAccessor(function (kv) { return kv.value.total; })
                    .colors(d3.scale.ordinal()
                            .domain(species.concat('none'))
                            .range(['#e41a1c','#377eb8','#4daf4a', '#f8f8f8']))
                    .colorAccessor(function (d) {
                        return max_species(d) || 'none';
                    })
                    .label(function (d) {
                        return d.value.total;
                    })
                    .title(function (d) {
                        return JSON.stringify(d.value, null, 2);
                    });
            }
            function initialize_heatmap (heatMap) {
                heatMap
                    .transitionDuration(0)
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
                    });
            }

            var heatId = 'heat-map';
            appendChartID(heatId);

            heatMap = dc.heatMap('#' + heatId);
            sepalDim = data.dimension(duo_key('sl', 'sw')); sepalGroup = sepalDim.group();
            var petalDim = data.dimension(duo_key('pl', 'pw')), petalGroup = petalDim.group();

            reduce_species(sepalGroup);
            reduce_species(petalGroup);
            initialize_bubble(chart.dimension(sepalDim).group(sepalGroup));
            initialize_heatmap(heatMap.dimension(petalDim).group(petalGroup));
            chart.render();
            heatMap.render();
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

        function testBubbleRadiiCol3 (chart) {
            var bubbles = chart.selectAll('circle.bubble')[0];
            expect(d3.select(bubbles[0]).attr('r')).toBe('0');
            expect(d3.select(bubbles[3]).attr('r')).toBe('0');
            expect(d3.select(bubbles[6]).attr('r')).toBe('0');
            expect(+d3.select(bubbles[11]).attr('r')).toBeWithinDelta(21.5, 0.5);
            expect(d3.select(bubbles[14]).attr('r')).toBe('0');
            expect(+d3.select(bubbles[16]).attr('r')).toBeWithinDelta(33, 0.5);
            expect(+d3.select(bubbles[19]).attr('r')).toBeWithinDelta(50, 0.5);
            expect(d3.select(bubbles[24]).attr('r')).toBe('0');
        }
        function testBubbleTitlesCol3 (chart) {
            var titles = chart.selectAll('g.node title')[0];
            expect(JSON.parse(d3.select(titles[4]).text()).total).toBe(0);
            expect(JSON.parse(d3.select(titles[11]).text()).virginica).toBe(4);
            expect(JSON.parse(d3.select(titles[12]).text()).virginica).toBe(1);
            expect(JSON.parse(d3.select(titles[16]).text()).virginica).toBe(7);
            expect(JSON.parse(d3.select(titles[16]).text()).versicolor).toBe(1);
            expect(JSON.parse(d3.select(titles[19]).text()).virginica).toBe(13);
            expect(JSON.parse(d3.select(titles[19]).text()).versicolor).toBe(1);
        }
        function testBubbleLabelsCol3 (chart) {
            var labels = chart.selectAll('g.node text')[0];
            expect(d3.select(labels[0]).text()).toBe('0');
            expect(d3.select(labels[2]).text()).toBe('0');
            expect(d3.select(labels[4]).text()).toBe('0');
            expect(d3.select(labels[5]).text()).toBe('0');
            expect(d3.select(labels[11]).text()).toBe('4');
            expect(d3.select(labels[12]).text()).toBe('1');
            expect(d3.select(labels[16]).text()).toBe('8');
            expect(d3.select(labels[19]).text()).toBe('14');
        }
        describe('column filtering with straight crossfilter', function () {
            beforeEach(function () {
                var axisLabel = d3.select(heatMap.selectAll('.cols.axis text')[0][3]);
                axisLabel.on('click')(axisLabel.datum());
                d3.timer.flush();
            });
            it('updates bubble radii correctly', function () {
                testBubbleRadiiCol3(chart);
            });
            it('updates bubble titles correctly', function () {
                testBubbleTitlesCol3(chart);
            });
            it('updates bubble labels correctly', function () {
                testBubbleLabelsCol3(chart);
            });
        });
        describe('column filtering with cloned results', function () {
            beforeEach(function () {
                chart.group(clone_group(sepalGroup));
                chart.render();
                var axisLabel = d3.select(heatMap.selectAll('.cols.axis text')[0][3]);
                axisLabel.on('click')(axisLabel.datum());
                d3.timer.flush();
            });
            it('updates bubble radii correctly', function () {
                testBubbleRadiiCol3(chart);
            });
            it('updates bubble titles correctly', function () {
                testBubbleTitlesCol3(chart);
            });
            it('updates bubble labels correctly', function () {
                testBubbleLabelsCol3(chart);
            });
        });
        /* jshint camelcase: true */
        // jscs enable: requireCamelCaseOrUpperCaseIdentifiers
    });
});
