/* global appendChartID, loadDateFixture, loadIrisFixture, makeDate */
describe('dc.bubbleChart', () => {
    let id, chart, data;
    let dateFixture;
    let dimension, group;
    let countryDimension;
    const width = 900, height = 350;

    beforeEach(() => {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(d => d.status);
        group = dimension.group()
            .reduce(
                //add
                (p, v) => {
                    ++p.count;
                    p.value += +v.value;
                    return p;
                },
                //remove
                (p, v) => {
                    --p.count;
                    p.value -= +v.value;
                    return p;
                },
                //init
                () => ({count: 0, value: 0})
            )
            .order(d => d.value);
        countryDimension = data.dimension(d => d.countrycode);

        id = 'bubble-chart';
        appendChartID(id);

        chart = new dc.BubbleChart(`#${id}`);
        chart.dimension(dimension).group(group)
            .width(width).height(height)
            .colors(['#a60000', '#ff0000', '#ff4040', '#ff7373', '#67e667', '#39e639', '#00cc00'])
            .colorDomain([0,220])
            .colorAccessor(p => p.value.value)
            .keyAccessor(p => p.value.value)
            .valueAccessor(p => p.value.count)
            .radiusValueAccessor(p => p.value.count)
            .x(d3.scaleLinear().domain([0, 300]))
            .y(d3.scaleLinear().domain([0, 10]))
            .r(d3.scaleLinear().domain([0, 30]))
            .maxBubbleRelativeSize(0.3)
            .transitionDuration(0)
            .renderLabel(true)
            .renderTitle(true)
            .title(p => `${p.key}: {count:${p.value.count},value:${p.value.value}}`);
    });

    it('assigns colors', () => {
        expect(chart.colors()).not.toBeNull();
    });

    it('sets the radius scale', () => {
        expect(chart.r()).not.toBeNull();
    });

    it('sets the radius value accessor', () => {
        expect(chart.radiusValueAccessor()).not.toBeNull();
    });

    it('sets the x units', () => {
        expect(chart.xUnits()).toBe(dc.units.integers);
    });

    it('creates the x axis', () => {
        expect(chart.xAxis()).not.toBeNull();
    });

    it('creates the y axis', () => {
        expect(chart.yAxis()).not.toBeNull();
    });

    describe('render', () => {
        beforeEach(() => {
            chart.render();
        });

        it('generates right number of bubbles', () => {
            expect(chart.selectAll('circle.bubble').nodes().length).toBe(2);
        });

        it('calculates right cx for each bubble', () => {
            chart.selectAll('g.node').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('transform')).toMatchTranslate(601.3333333333334, 155, 3);
                }
                if (i === 1) {
                    expect(d3.select(this).attr('transform')).toMatchTranslate(541.2, 155);
                }
            });
        });

        it('generates opaque groups and circles for each bubble', () => {
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('opacity')).toBeNull();
                expect(d3.select(this).select('circle').attr('opacity')).toBe('1');
            });
        });

        it('calculates right r for each bubble', () => {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(Number(d3.select(this).attr('r'))).toBeCloseTo(49.33333333333333, 3);
                }
                if (i === 1) {
                    expect(Number(d3.select(this).attr('r'))).toBeCloseTo(49.33333333333333, 3);
                }
            });
        });

        it('attaches each bubble with index based class', () => {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('class')).toBe('bubble _0');
                }
                if (i === 1) {
                    expect(d3.select(this).attr('class')).toBe('bubble _1');
                }
            });
        });

        it('generates right number of labels', () => {
            expect(chart.selectAll('g.node text').nodes().length).toBe(2);
        });

        it('creates correct label for each bubble', () => {
            chart.selectAll('g.node text').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).text()).toBe('F');
                }
                if (i === 1) {
                    expect(d3.select(this).text()).toBe('T');
                }
            });
        });

        it('generates right number of titles', () => {
            expect(chart.selectAll('g.node title').nodes().length).toBe(2);
        });

        it('creates correct title for each bubble', () => {
            chart.selectAll('g.node title').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).text()).toBe('F: {count:5,value:220}');
                }
                if (i === 1) {
                    expect(d3.select(this).text()).toBe('T: {count:5,value:198}');
                }
            });
        });

        it('fills bubbles with correct colors', () => {
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

    describe('bubble chart w/o label & title', () => {
        beforeEach(() => {
            chart.renderLabel(false).renderTitle(false).render();
        });

        it('generates right number of labels', () => {
            expect(chart.selectAll('g.node text').nodes().length).toBe(0);
        });

        it('generates right number of titles', () => {
            expect(chart.selectAll('g.node title').nodes().length).toBe(0);
        });
    });

    describe('with filter', () => {
        beforeEach(() => {
            chart.filter('F').render();
        });

        it('deselects bubble based on filter value', () => {
            chart.selectAll('g.node').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('class')).toBe('node selected');
                }
                if (i === 1) {
                    expect(d3.select(this).attr('class')).toBe('node deselected');
                }
            });
        });

        it('handles multi-selection highlight', () => {
            chart.filter('T');
            chart.redraw();
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('class')).toBe('node selected');
            });
        });
    });

    describe('update', () => {
        beforeEach(() => {
            chart.render();
            countryDimension.filter('CA');
            chart.redraw();
        });

        it('creates correct label for each bubble', () => {
            chart.selectAll('g.node title').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).text()).toBe('F: {count:0,value:0}');
                }
                if (i === 1) {
                    expect(d3.select(this).text()).toBe('T: {count:2,value:77}');
                }
            });
        });

        it('fills bubbles with correct colors', () => {
            chart.selectAll('circle.bubble').each(function (d, i) {
                if (i === 0) {
                    expect(d3.select(this).attr('fill')).toMatch(/#a60000/i);
                }
                if (i === 1) {
                    expect(d3.select(this).attr('fill')).toMatch(/#ff4040/i);
                }
            });
        });

        describe('with bubble sorting', () => {
            beforeEach(() => {
                chart
                    .sortBubbleSize(true)
                    .render();
            });

            it('creates correct label for each bubble', () => {
                chart.selectAll('g.node title').each(function (d, i) {
                    if (i === 0) {
                        expect(d3.select(this).text()).toBe('T: {count:2,value:77}');
                    }
                    if (i === 1) {
                        expect(d3.select(this).text()).toBe('F: {count:0,value:0}');
                    }
                });
            });

            it('fills bubbles with correct colors', () => {
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

        describe('with empty bins removed', () => {
            beforeEach(() => {
                chart.group(removeEmptyBins(group))
                    .redraw();
            });

            it('creates the right number of bubbles', () => {
                expect(chart.selectAll('g.node').size()).toBe(1);
            });

            it('creates correct label for each bubble', () => {
                expect(chart.selectAll('g.node title').text()).toBe('T: {count:2,value:77}');
            });

            it('fills bubbles with correct colors', () => {
                expect(chart.selectAll('circle.bubble').attr('fill')).toMatch(/#ff4040/i);
            });
            function removeEmptyBins (sourceGroup) {
                return {
                    all: function () {
                        return sourceGroup.all().filter(d => d.value.count !== 0);
                    }
                };
            }

        });
    });

    describe('with no filter', () => {
        beforeEach(() => {
            countryDimension.filter('ZZ');
            chart.render();
        });

        it('sets invisible if bubble has 0 r', () => {
            chart.selectAll('g.node text').each(function (d, i) {
                expect(Number(d3.select(this).attr('opacity'))).toBe(0);
            });
        });
    });

    describe('with elastic axises', () => {
        beforeEach(() => {
            chart.elasticY(true)
                .yAxisPadding(3)
                .elasticX(true)
                .xAxisPadding(20)
                .render();
        });

        it('auto calculates x range based on width', () => {
            expect(chart.x().range()[0]).toBe(0);
            expect(chart.x().range()[1]).toBe(820);
        });

        it('sets the x domain', () => {
            expect(chart.x().domain()[0]).toBe(178);
            expect(chart.x().domain()[1]).toBe(240);
        });

        it('auto calculates y range based on height', () => {
            expect(chart.y().range()[0]).toBe(310);
            expect(chart.y().range()[1]).toBe(0);
        });

        it('sets the y domain', () => {
            expect(chart.y().domain()[0]).toBe(2);
            expect(chart.y().domain()[1]).toBe(8);
        });
    });

    describe('renderlet', () => {
        let renderlet;

        beforeEach(() => {
            // spyOn doesn't seem to work with plain functions
            renderlet = jasmine.createSpy('renderlet', _chart => {
                _chart.selectAll('circle').attr('fill', 'red');
            });
            renderlet.and.callThrough();
            chart.on('renderlet', renderlet);
        });

        it('is invoked with render', () => {
            chart.render();
            expect(chart.selectAll('circle').attr('fill')).toBe('red');
            expect(renderlet).toHaveBeenCalled();
        });

        it('is invoked with redraw', () => {
            chart.render().redraw();
            expect(chart.selectAll('circle').attr('fill')).toBe('red');
            expect(renderlet.calls.count()).toEqual(2);
        });
    });

    describe('non-unique keys', () => {
        // plot all rows as (value, nvalue) - a common scatterplot scenario
        beforeEach(() => {
            const rowDimension = data.dimension((d, i) => i);
            const rowGroup = rowDimension.group();

            chart.dimension(rowDimension).group(rowGroup)
                .keyAccessor(kv => +dateFixture[kv.key].value)
                .valueAccessor(kv => +dateFixture[kv.key].nvalue)
                .elasticY(true)
                .yAxisPadding(2)
                .elasticX(true)
                .xAxisPadding(2);

            chart.render();
        });

        it('generates right number of bubbles', () => {
            expect(chart.selectAll('circle.bubble').nodes().length).toBe(10);
        });

        it('auto calculates x range based on width', () => {
            expect(chart.x().range()[0]).toBe(0);
            expect(chart.x().range()[1]).toBe(820);
        });

        it('sets the x domain', () => {
            expect(chart.x().domain()[0]).toBe(20);
            expect(chart.x().domain()[1]).toBe(68);
        });

        it('auto calculates y range based on height', () => {
            expect(chart.y().range()[0]).toBe(310);
            expect(chart.y().range()[1]).toBe(0);
        });

        it('sets the y domain', () => {
            expect(chart.y().domain()[0]).toBe(-7);
            expect(chart.y().domain()[1]).toBe(12);
        });
    });

    describe('with logarithmic scales', () => {
        beforeEach(() => {
            const rowDimension = data.dimension((d, i) => i);
            const rowGroup = rowDimension.group();

            chart
                .dimension(rowDimension)
                .group(rowGroup)
                .keyAccessor(kv => 0)
                .valueAccessor(kv => 0)
                .x(d3.scaleLog().domain([1, 300]))
                .y(d3.scaleLog().domain([1, 10]))
                .elasticX(false)
                .elasticY(false);
            chart.render();
        });

        it('renders without errors', () => {
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('transform')).toMatchTranslate(0, 0);
            });
        });
    });

    describe('with a date-based scale', () => {
        beforeEach(() => {
            dimension = data.dimension(d => d3.utcDay(d.dd));
            group = dimension.group();

            chart
                .dimension(dimension)
                .group(group)
                .x(d3.scaleUtc().domain([makeDate(2012, 0, 1), makeDate(2012, 11, 31)]))
                .elasticX(true)
                .elasticY(true)
                .keyAccessor(kv => kv.key)
                .valueAccessor(kv => kv.value)
                .radiusValueAccessor(kv => kv.value)
                .colors(d3.scaleOrdinal().range(['#a60000', '#ff0000', '#ff4040', '#ff7373', '#67e667', '#39e639', '#00cc00']))
                .colorAccessor(kv => kv.key)
                .render();
        });

        it('draws bubbles in appropriate locations', () => {
            const coords = [
                [0, 310], [149.1, 310], [170.4, 0], [394, 310], [489.9, 155], [820, 155],
            ];
            chart.selectAll('g.node').each(function (d, i) {
                expect(d3.select(this).attr('transform'))
                    .toMatchTranslate(coords[i][0], coords[i][1], 1);
            });
        });
        it('calculates elastic x axis exactly', () => {
            expect(chart.x().domain()).toEqual([makeDate(2012, 4, 25), makeDate(2012, 7, 10)]);
        });

        describe('with 10 day padding', () => {
            beforeEach(() => {
                chart.xAxisPaddingUnit(d3.utcDay)
                    .xAxisPadding(10)
                    .render();
            });
            it('should stretch the domain appropriately', () => {
                expect(chart.x().domain()).toEqual([makeDate(2012, 4, 15), makeDate(2012, 7, 20)]);
            });
        });

        describe('with 2 month padding', () => {
            beforeEach(() => {
                chart.xAxisPaddingUnit(d3.utcMonth)
                    .xAxisPadding(2)
                    .render();
            });
            it('should stretch the domain appropriately', () => {
                expect(chart.x().domain()).toEqual([makeDate(2012, 2, 25), makeDate(2012, 9, 10)]);
            });
        });
    });

    describe('with minimum radius', () => {
        beforeEach(() => {
            chart
                .minRadius(1)
                .render();
        });

        it('shows smaller bubbles', () => {
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

    describe('iris filtering', () => {
        /* eslint camelcase: 0 */
        // 2-chart version of from http://bl.ocks.org/gordonwoodhull/14c623b95993808d69620563508edba6
        let irisData, heatMap, sepalDim, sepalGroup;
        beforeEach(() => {
            irisData = loadIrisFixture();

            const fields = {
                sl: 'sepal_length',
                sw: 'sepal_width',
                pl: 'petal_length',
                pw: 'petal_width'
            };
            const species = ['setosa', 'versicolor', 'virginica'];

            irisData.forEach(d => {
                Object.keys(fields).forEach(ab => {
                    d[fields[ab]] = +d[fields[ab]];
                });
            });
            // autogenerate a key function for an extent
            function key_function (extent) {
                const div = extent[1] - extent[0] < 5 ? 2 : 1;
                return function (k) {
                    return Math.floor(k * div) / div;
                };
            }

            const extents = {};
            const keyfuncs = {};
            Object.keys(fields).forEach(ab => {
                extents[ab] = d3.extent(irisData, d => d[fields[ab]]);
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
            function reduce_species (grp) {
                grp.reduce(
                    (p, v) => {
                        p[v.species]++;
                        p.total++;
                        return p;
                    }, (p, v) => {
                        p[v.species]--;
                        p.total--;
                        return p;
                    }, () => {
                        const init = {total: 0};
                        species.forEach(s => { init[s] = 0; });
                        return init;
                    }
                );
            }
            function max_species (d) {
                let max = 0, i = -1;
                species.forEach((s, j) => {
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
                    .x(d3.scaleLinear()).xAxisPadding(0.5)
                    .y(d3.scaleLinear()).yAxisPadding(0.5)
                    .elasticX(true)
                    .elasticY(true)
                    .keyAccessor(key_part(0))
                    .valueAccessor(key_part(1))
                    .radiusValueAccessor(kv => kv.value.total)
                    .elasticRadius(true)
                    .colors(d3.scaleOrdinal()
                            .domain(species.concat('none'))
                            .range(['#e41a1c','#377eb8','#4daf4a', '#f8f8f8']))
                    .colorAccessor(d => max_species(d) || 'none')
                    .label(d => d.value.total)
                    .title(d => JSON.stringify(d.value, null, 2));
            }
            function initialize_heatmap (htMap) {
                htMap
                    .transitionDuration(0)
                    .width(400)
                    .height(400)
                    .xBorderRadius(15).yBorderRadius(15)
                    .keyAccessor(key_part(0))
                    .valueAccessor(key_part(1))
                    .colors(d3.scaleOrdinal()
                            .domain(species.concat('none'))
                            .range(['#e41a1c','#377eb8','#4daf4a', '#f8f8f8']))
                    .colorAccessor(d => max_species(d) || 'none');
            }

            const heatId = 'heat-map';
            appendChartID(heatId);

            heatMap = new dc.HeatMap(`#${heatId}`);
            sepalDim = data.dimension(duo_key('sl', 'sw')); sepalGroup = sepalDim.group();
            const petalDim = data.dimension(duo_key('pl', 'pw')), petalGroup = petalDim.group();

            reduce_species(sepalGroup);
            reduce_species(petalGroup);
            initialize_bubble(chart.dimension(sepalDim).group(sepalGroup));
            initialize_heatmap(heatMap.dimension(petalDim).group(petalGroup));
            chart.render();
            heatMap.render();
        });
        // return brand-new objects and keys every time
        function clone_group (grp) {
            function clone_kvs (all) {
                return all.map(kv => ({
                    key: kv.key.slice(0),
                    value: Object.assign({}, kv.value)
                }));
            }
            return {
                all: function () {
                    return clone_kvs(grp.all());
                },
                top: function (N) {
                    return clone_kvs(grp.top(N));
                }
            };
        }

        function testBubbleRadiiCol3 (_chart) {
            const bubbles = _chart.selectAll('circle.bubble').nodes();
            const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 34.5, 16.1, 0, 0, 16.1, 59.1, 34.5, 16.1, 96, 0, 22.2, 0, 0, 0, 0];
            bubbles.forEach((b, i) => {
                expect(+d3.select(b).attr('r')).toBeWithinDelta(expected[i], 0.1);
            });
        }
        function testBubbleTitlesCol3 (_chart) {
            const titles = _chart.selectAll('g.node title').nodes();
            const expected = [
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 4, 'setosa': 0, 'versicolor': 0, 'virginica': 4}, {'total': 1, 'setosa': 0, 'versicolor': 0, 'virginica': 1},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 1, 'setosa': 0, 'versicolor': 0, 'virginica': 1}, {'total': 8, 'setosa': 0, 'versicolor': 1, 'virginica': 7},
                {'total': 4, 'setosa': 0, 'versicolor': 0, 'virginica': 4}, {'total': 1, 'setosa': 0, 'versicolor': 0, 'virginica': 1},
                {'total': 14, 'setosa': 0, 'versicolor': 1, 'virginica': 13}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 2, 'setosa': 0, 'versicolor': 0, 'virginica': 2}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}, {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0},
                {'total': 0, 'setosa': 0, 'versicolor': 0, 'virginica': 0}];
            titles.forEach((t, i) => {
                expect(JSON.parse(d3.select(t).text())).toEqual(expected[i]);
            });
        }
        function testBubbleLabelsCol3 (_chart) {
            const labels = _chart.selectAll('g.node text').nodes();
            const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 1, 8, 4, 1, 14, 0, 2, 0, 0, 0, 0];
            labels.forEach((l, i) => {
                expect(+d3.select(l).text()).toBe(expected[i]);
            });
        }
        describe('column filtering with straight crossfilter', () => {
            beforeEach(() => {
                const axisLabel = d3.select(heatMap.selectAll('.cols.axis text').nodes()[3]);
                axisLabel.on('click')(axisLabel.datum());
                d3.timerFlush();
            });
            it('updates bubble radii correctly', () => {
                testBubbleRadiiCol3(chart);
            });
            it('updates bubble titles correctly', () => {
                testBubbleTitlesCol3(chart);
            });
            it('updates bubble labels correctly', () => {
                testBubbleLabelsCol3(chart);
            });
        });
        describe('column filtering with cloned results', () => {
            beforeEach(() => {
                chart.group(clone_group(sepalGroup));
                chart.render();
                const axisLabel = d3.select(heatMap.selectAll('.cols.axis text').nodes()[3]);
                axisLabel.on('click')(axisLabel.datum());
                d3.timerFlush();
            });
            it('updates bubble radii correctly', () => {
                testBubbleRadiiCol3(chart);
            });
            it('updates bubble titles correctly', () => {
                testBubbleTitlesCol3(chart);
            });
            it('updates bubble labels correctly', () => {
                testBubbleLabelsCol3(chart);
            });
        });
    });
});
