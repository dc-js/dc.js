/* global appendChartID, loadDateFixture, makeDate */
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

});
