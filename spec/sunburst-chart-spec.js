/* global appendChartID, loadDateFixture, makeDate, getSunburstDataOneRing3Segments,
   loadSunburstData3CompleteRings, loadSunburstData10CompleteRings */
describe('dc.sunburstChart', () => {
    const width = 200;
    const height = 200;
    const radius = 100;
    const defaultCenter = {x: width / 2, y: height / 2};
    const newCenter = {x: 101, y: 99};
    const innerRadius = 30;
    let data, valueDimension, valueGroup;
    let countryRegionStateDimension, countryRegionStateGroup;
    let statusDimension;
    let dateDimension;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        valueDimension = data.dimension(d => d.value);
        valueGroup = valueDimension.group();

        countryRegionStateDimension = data.dimension(d => [d.countrycode, d.region, d.state]);

        countryRegionStateGroup = countryRegionStateDimension.group();

        statusDimension = data.dimension(d => d.status);

        dateDimension = data.dimension(d => d3.utcDay(d.dd));

    });

    function buildChart (id) {
        const div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        const chart = new dc.SunburstChart(`#${id}`);
        chart.dimension(countryRegionStateDimension).group(countryRegionStateGroup)
            .width(width)
            .height(height)
            .transitionDuration(0);
        chart.render();
        return chart;
    }

    describe('generation', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart-age');
            chart.render();
        });
        it('we get something', () => {
            expect(chart).not.toBeNull();
        });
        it('should be registered', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('dc-chart class should be turned on for parent div', () => {
            expect(d3.select('#pie-chart-age').attr('class')).toEqual('dc-chart');
        });
        it('inner radius can be set', () => {
            chart.innerRadius(innerRadius);
            expect(chart.innerRadius()).toEqual(innerRadius);
        });
        it('svg should be created', () => {
            expect(chart.select('svg').empty()).toBeFalsy();
        });
        it('default color scheme should be created', () => {
            expect(chart.colors().length > 0).toBeTruthy();
        });
        it('dimension should be set', () => {
            expect(chart.dimension()).toBe(countryRegionStateDimension);
        });
        it('group should be set', () => {
            expect(chart.group()).toEqual(countryRegionStateGroup);
        });
        it('width should be set', () => {
            expect(chart.width()).toEqual(width);
        });
        it('height should be set', () => {
            expect(chart.height()).toEqual(height);
        });
        it('radius should not be set', () => {
            expect(chart.radius()).toBeFalsy();
        });
        it('cx should be set', () => {
            expect(chart.cx()).toEqual(defaultCenter.x);
        });
        it('cy should be set', () => {
            expect(chart.cy()).toEqual(defaultCenter.y);
        });
        it('height should be used for svg', () => {
            expect(chart.select('svg').attr('height')).toEqual(String(height));
        });
        it('root g should be created', () => {
            expect(chart.select('svg g').empty()).toBeFalsy();
        });
        it('root g should be translated to center', () => {
            expect(chart.select('svg g').attr('transform')).toMatchTranslate(defaultCenter.x, defaultCenter.y);
        });
        it('slice g should be created with class', () => {
            expect(chart.selectAll('svg g g.pie-slice-level-1').data().length).toEqual(2);
        });
        it('slice path should be created', () => {
            expect(chart.selectAll('svg g g.pie-slice-level-1 path').data().length).toEqual(2);
        });
        it('slice css class should be numbered with index', () => {
            chart.selectAll('g.pie-slice').each(function (p, i) {
                expect(d3.select(this).attr('class')).toContain(`pie-slice _${i}`);
            });
        });
        it('slice path should be filled', () => {
            chart.selectAll('svg g g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('fill') !== '').toBeTruthy();
            });
        });
        it('slice path d should be created', () => {
            chart.selectAll('svg g g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('d') !== '').toBeTruthy();
            });
        });
        it('slice path fill should be set correctly', () => {
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[0]).attr('fill')).toEqual('#3182bd');
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[1]).attr('fill')).toEqual('#6baed6');
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[2]).attr('fill')).toEqual('#9ecae1');
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[3]).attr('fill')).toEqual('#c6dbef');
        });
        it('slice label text should be set', () => {
            chart.selectAll('svg g text.pie-slice').call(p => {
                expect(p.text()).toEqual(p.datum().key);
            });
        });
        it('slice label should be middle anchored', () => {
            chart.selectAll('svg g text.pie-slice').each(function (p) {
                expect(d3.select(this).attr('text-anchor')).toEqual('middle');
            });
        });
        it('reset link hidden after init rendering', () => {
            expect(chart.select('a.reset').style('display')).toEqual('none');
        });
        it('filter info should be hidden after init rendering', () => {
            expect(chart.select('span.filter').style('display')).toEqual('none');
        });
        describe('center positioning', () => {
            beforeEach(() => {
                chart
                    .cx(newCenter.x)
                    .cy(newCenter.y)
                    .render();
                return chart;
            });
            afterEach(() => {
                chart
                    .cx(defaultCenter.x)
                    .cy(defaultCenter.y)
                    .render();
                return chart;
            });
            it(`root g should be translated to ${newCenter.x},${newCenter.y}`, () => {
                expect(chart.select('svg g').attr('transform')).toMatchTranslate(newCenter.x, newCenter.y);
            });
        });

        describe('with radius', () => {
            beforeEach(() => {
                chart.radius(100)
                    .render();
            });
            it('should take', () => {
                expect(chart.radius()).toEqual(radius);
            });
        });

        describe('re-render', () => {
            beforeEach(() => {
                chart.render();
                return chart;
            });
            it('multiple invocation of render should update chart', () => {
                expect(d3.selectAll('#pie-chart-age svg').nodes().length).toEqual(1);
            });
        });

        describe('n/a filter', () => {
            beforeEach(() => {
                statusDimension.filter('E');
                chart.render();
                return chart;
            });
            it('should draw an empty chart', () => {
                expect(chart.select('g').classed('empty-chart')).toBeTruthy();
            });
            it('should have one slice', () => {
                expect(chart.selectAll('svg g text.pie-slice').nodes().length).toBe(1);
            });
            afterEach(() => {
                statusDimension.filterAll();
            });
        });
        describe('slice selection', () => {
            it('on click function should be defined', () => {
                expect(chart.selectAll('svg g g.pie-slice path').on('click') !== undefined).toBeTruthy();
            });
            it('by default no slice should be selected', () => {
                expect(chart.hasFilter()).toBeFalsy();
            });
            it('be able to set selected slice', () => {
                expect(chart.filter(['US', 'East', 'Ontario']).filter()).toEqual(['US', 'East', 'Ontario']);
                expect(chart.hasFilter()).toBeTruthy();
                chart.filterAll();
            });
            it('should filter dimension by single selection', () => {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(valueGroup.all()[0]).toEqual({key: '22', value: 1});
                expect(valueGroup.all()[1].value).toEqual(0);
                chart.filterAll();
            });
            it('should filter dimension by multiple selections', () => {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                chart.filter(dc.filters.HierarchyFilter(['US', 'West', 'Colorado']));
                expect(valueGroup.all()[0]).toEqual({key: '22', value: 2});
                expect(valueGroup.all()[1].value).toEqual(0);
                chart.filterAll();
            });
            it('should filter dimension with deselection', () => {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                chart.filter(dc.filters.HierarchyFilter(['US', 'West', 'Colorado']));
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(valueGroup.all()[0]).toEqual({key: '22', value: 1});
                expect(valueGroup.all()[1].value).toEqual(0);
                chart.filterAll();
            });
            it('should highlight selected slices', () => {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                chart.filter(dc.filters.HierarchyFilter(['US', 'West', 'Colorado']));
                chart.render();
                chart.selectAll('g.pie-slice-level-3').each(function (d) {
                    if (d.path.toString() === ['CA', 'East', 'Ontario'].toString() ||
                        d.path.toString() === ['US', 'West', 'Colorado'].toString()
                    ) {
                        expect(d3.select(this).attr('class').indexOf('selected') >= 0).toBeTruthy();
                    } else {
                        expect(d3.select(this).attr('class').indexOf('deselected') >= 0).toBeTruthy();
                    }
                });
                chart.filterAll();
            });
            it('reset link generated after slice selection', () => {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(chart.select('a.reset').style('display')).not.toEqual('none');
            });
            it('filter info generated after slice selection', () => {
                chart.filter(null);
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(chart.select('span.filter').style('display')).not.toEqual('none');
            });
            it('should remove highlight if no slice selected', () => {
                chart.filterAll();
                chart.redraw();
                chart.selectAll('.pie-slice path').each(function (d) {
                    const cls = d3.select(this).attr('class');
                    expect(cls === null || cls === '').toBeTruthy();
                });
            });
        });
        describe('filter through clicking', () => {
            it('onClick should trigger filtering of according group', () => {
                expect(chart.filters()).toEqual([]);
                const d = chart.select('.pie-slice-level-3').datum();
                chart.onClick(d);
                expect(chart.filter().slice(0)).toEqual(d.path);
            });
            it('onClick should reset filter if clicked twice', () => {
                expect(chart.filters()).toEqual([]);
                const d = chart.select('.pie-slice-level-3').datum();
                chart.onClick(d);
                chart.onClick(d);
                expect(chart.filter()).toEqual(null);
            });
        });
    });

    describe('redraw after empty selection', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart2');
            dateDimension.filter([makeDate(2010, 0, 1), makeDate(2010, 0, 3)]);
            chart.redraw();
            dateDimension.filter([makeDate(2012, 0, 1), makeDate(2012, 11, 30)]);
            chart.redraw();
        });
        it('pie chart should be restored', () => {
            chart.selectAll('g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('d').indexOf('NaN') < 0).toBeTruthy();
            });
        });
        afterEach(() => {
            dateDimension.filterAll();
        });
    });

    describe('sunburst use baseMixin.ordering', () => {
        function buildSunburstChartOneRingThreeSlices (id) {
            data = crossfilter(getSunburstDataOneRing3Segments());
            const _valueDimension = data.dimension(d => [d.x]);
            valueGroup = _valueDimension.group().reduceSum(d => +d.y);
            appendChartID(id);
            const chart = dc.sunburstChart(`#${id}`);
            chart
                .dimension(_valueDimension)
                .group(valueGroup)
                .width(width)
                .height(height)
                .transitionDuration(0);
            return chart;
        }

        function expectTextLabels (strings) {
            strings.forEach((str,i) => {
                expect(d3.select(`text.pie-slice._${i}`).text()).toEqual(str);
            });
        }

        let chart;
        beforeEach(() => {
            chart = buildSunburstChartOneRingThreeSlices('sunburst_ordering_default_ordering');
            chart.render();
        });

        describe('sunburst using default ordering', () => {
            it('slices ordered by key', () => {
                expectTextLabels(['a', 'b', 'c']);
            });
        });

        describe('sunburst using ordering by value ascending', () => {
            it('slices ordered by value', () => {
                chart.ordering(d => -d.value);
                chart.render();
                expectTextLabels(['c', 'b', 'a']);
            });
        });

    });

    describe('sunburst.relativeRingSizes', () => {

        function buildSunburstChart3CompleteRings (id) {
            data = crossfilter(loadSunburstData3CompleteRings());
            const _valueDimension = data.dimension(d => [d.x1, d.x2, d.x3]);
            return buildSunburst(_valueDimension, id);
        }

        function buildSunburstChartNCompleteRings (N, id) {
            data = crossfilter(loadSunburstData10CompleteRings());
            const _valueDimension = data.dimension(d => {
                const ten = [d.x0, d.x1, d.x2, d.x3, d.x4, d.x5, d.x6 , d.x7, d.x8, d.x9 ];
                const key = Array.prototype.concat.apply(ten.slice(0, N%10), new Array(Math.floor(N/10)).fill(ten));
                expect(key.length).toEqual(N);
                return key;
            });
            return buildSunburst(_valueDimension, id);
        }

        const buildSunburst = function (_valueDimension, id) {
            const _valueGroup = _valueDimension.group().reduceSum(d => +d.y);
            appendChartID(id);
            const chart = dc.sunburstChart(`#${id}`);
            chart
                .dimension(_valueDimension)
                .group(_valueGroup)
                .width(width)
                .height(height)
                .transitionDuration(0);
            return chart;
        };

        function getPieSliceBBoxY (chart, sliceNumber) {
            return chart.select(`.pie-slice._${sliceNumber}`).node().getBBox().y;
        }

        function getRingThicknessRounded (chart, ringNumber) {
            if (ringNumber === 0) {
                throw new Error('root ring 0 can not be checked this way.');
            }
            const yInner = getPieSliceBBoxY(chart, ringNumber - 1);
            const yOuter = getPieSliceBBoxY(chart, ringNumber);
            return Math.round(Math.abs(yOuter - yInner));
        }

        describe('sunburst.defaultRingSizes: shrinking', () => {
            let chart;
            beforeEach(() => {
                chart = buildSunburstChart3CompleteRings('sunburst_relativeRingSizes_regression');
                chart.render();
            });

            it('rings should get narrower, farther away from the center', () => {
                expect(getRingThicknessRounded(chart, 2)).toBeGreaterThan(0);
                expect(getRingThicknessRounded(chart, 1)).toBeGreaterThan(getRingThicknessRounded(chart, 2));
            });
        });

        describe('sunburst.relativeRingSizes: equal distribution', () => {
            let chart;
            beforeEach(() => {
                chart = buildSunburstChart3CompleteRings('sunburst_relativeRingSizes_equal_distribution');
                chart.ringSizes(chart.equalRingSizes());
                chart.render();
            });
            it('rings should be equally wide', () => {
                expect(getRingThicknessRounded(chart, 1)).toBeGreaterThan(0);
                expect(getRingThicknessRounded(chart, 1)).toEqual(getRingThicknessRounded(chart, 2));
            });
        });

        function testEqualRings (N) {
            describe(`sunburst.relativeRingSizes: equal distribution - no rounding errors with ${N} rings`, () => {
                let chart;
                beforeEach(() => {
                    chart = buildSunburstChartNCompleteRings(N, 'sunburst_relativeRingSizes_equal_distribution_10rings');
                    chart.ringSizes(chart.equalRingSizes());
                });
                it('chart renders without BadArgumentError caused by rounding issue in chart.relativeRingSizes() ' , () => {
                    expect(() => chart.render()).not.toThrow();
                });
            });
        }
        for(let i=2; i<=27; ++i) {testEqualRings(i);}

        describe('sunburst.relativeRingSizes: specific percentages', () => {
            let chart;
            const specificPercentages = function (ringCount) {
                return [.1, .3, .6];
            };
            beforeEach(() => {
                chart = buildSunburstChart3CompleteRings('sunburst_relativeRingSizes_specific_percentages');
                chart.ringSizes(chart.relativeRingSizes(specificPercentages));
                expect(() => chart.render()).not.toThrow();
            });
            it('2nd ring should be half as wide as the 3rd ', () => {
                expect(getRingThicknessRounded(chart, 1)).toBeGreaterThan(0);
                expect(2 * getRingThicknessRounded(chart, 1)).toEqual(getRingThicknessRounded(chart, 2));
            });
        });

        describe('sunburst.relativeRingSizes: invalid arguments', () => {
            let chart;

            const functionReturnsNonArray = function (ringCount) {
                return {};
            };

            const tooManyPercentageValues = function (ringCount) {
                return [.1, .1, .1, .1];
            };

            const percentagesSumNot1 = function (ringCount) {
                return [.5, .5, .5];
            };

            beforeEach(() => {
                chart = buildSunburstChart3CompleteRings('sunburst_relativeRingSizes_invalid_arguments');
            });

            it('invalid arguments cause dc.errors.BadArgumentException, default function does not', () => {
                chart.ringSizes(chart.relativeRingSizes(functionReturnsNonArray));
                expect(() => {chart.render()}).toThrowError(dc.BadArgumentException);

                chart.ringSizes(chart.relativeRingSizes(tooManyPercentageValues));
                expect(() => {chart.render()}).toThrowError(dc.BadArgumentException);

                chart.ringSizes(chart.relativeRingSizes(percentagesSumNot1));
                expect(() => {chart.render()}).toThrowError(dc.BadArgumentException);

                chart.ringSizes(chart.defaultRingSizes());
                chart.render();
            });
        });

    });

});
