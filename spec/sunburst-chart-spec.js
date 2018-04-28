/* global appendChartID, loadDateFixture, makeDate */
describe('dc.sunburstChart', function () {
    var width = 200;
    var height = 200;
    var radius = 100;
    var defaultCenter = {x: width / 2, y: height / 2};
    var newCenter = {x: 101, y: 99};
    var innerRadius = 30;
    var data, valueDimension, valueGroup;
    var countryRegionStateDimension, countryRegionStateGroup;
    var statusDimension;
    var dateDimension;
    var statusGroup, statusMultiGroup;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        valueDimension = data.dimension(function (d) {
            return d.value;
        });
        valueGroup = valueDimension.group();

        countryRegionStateDimension = data.dimension(function (d) {
            return [d.countrycode, d.region, d.state];
        });

        countryRegionStateGroup = countryRegionStateDimension.group();

        statusDimension = data.dimension(function (d) {
            return d.status;
        });

        dateDimension = data.dimension(function (d) {
            return d3.utcDay(d.dd);
        });

        statusGroup = statusDimension.group();
        statusMultiGroup = statusGroup.reduce(
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
        );
    });

    function buildChart (id) {
        var div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        var chart = dc.sunburstChart('#' + id);
        chart.dimension(countryRegionStateDimension).group(countryRegionStateGroup)
            .width(width)
            .height(height)
            .transitionDuration(0);
        chart.render();
        return chart;
    }

    describe('generation', function () {
        var chart;
        beforeEach(function () {
            chart = buildChart('pie-chart-age');
            chart.render();
        });
        it('we get something', function () {
            expect(chart).not.toBeNull();
        });
        it('should be registered', function () {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('dc-chart class should be turned on for parent div', function () {
            expect(d3.select('#pie-chart-age').attr('class')).toEqual('dc-chart');
        });
        it('inner radius can be set', function () {
            chart.innerRadius(innerRadius);
            expect(chart.innerRadius()).toEqual(innerRadius);
        });
        it('svg should be created', function () {
            expect(chart.select('svg').empty()).toBeFalsy();
        });
        it('default color scheme should be created', function () {
            expect(chart.colors().length > 0).toBeTruthy();
        });
        it('dimension should be set', function () {
            expect(chart.dimension()).toBe(countryRegionStateDimension);
        });
        it('group should be set', function () {
            expect(chart.group()).toEqual(countryRegionStateGroup);
        });
        it('width should be set', function () {
            expect(chart.width()).toEqual(width);
        });
        it('height should be set', function () {
            expect(chart.height()).toEqual(height);
        });
        it('radius should be set', function () {
            expect(chart.radius()).toEqual(radius);
        });
        it('cx should be set', function () {
            expect(chart.cx()).toEqual(defaultCenter.x);
        });
        it('cy should be set', function () {
            expect(chart.cy()).toEqual(defaultCenter.y);
        });
        it('height should be used for svg', function () {
            expect(chart.select('svg').attr('height')).toEqual(String(height));
        });
        it('root g should be created', function () {
            expect(chart.select('svg g').empty()).toBeFalsy();
        });
        it('root g should be translated to center', function () {
            expect(chart.select('svg g').attr('transform')).toMatchTranslate(defaultCenter.x, defaultCenter.y);
        });
        it('slice g should be created with class', function () {
            expect(chart.selectAll('svg g g.pie-slice-level-1').data().length).toEqual(2);
        });
        it('slice path should be created', function () {
            expect(chart.selectAll('svg g g.pie-slice-level-1 path').data().length).toEqual(2);
        });
        it('slice css class should be numbered with index', function () {
            chart.selectAll('g.pie-slice').each(function (p, i) {
                expect(d3.select(this).attr('class')).toContain('pie-slice _' + i);
            });
        });
        it('slice path should be filled', function () {
            chart.selectAll('svg g g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('fill') !== '').toBeTruthy();
            });
        });
        it('slice path d should be created', function () {
            chart.selectAll('svg g g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('d') !== '').toBeTruthy();
            });
        });
        it('slice path fill should be set correctly', function () {
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[0]).attr('fill')).toEqual('#3182bd');
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[1]).attr('fill')).toEqual('#6baed6');
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[2]).attr('fill')).toEqual('#9ecae1');
            expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[3]).attr('fill')).toEqual('#c6dbef');
        });
        it('slice label text should be set', function () {
            chart.selectAll('svg g text.pie-slice').call(function (p) {
                expect(p.text()).toEqual(p.datum().key);
            });
        });
        it('slice label should be middle anchored', function () {
            chart.selectAll('svg g text.pie-slice').each(function (p) {
                expect(d3.select(this).attr('text-anchor')).toEqual('middle');
            });
        });
        it('reset link hidden after init rendering', function () {
            expect(chart.select('a.reset').style('display')).toEqual('none');
        });
        it('filter info should be hidden after init rendering', function () {
            expect(chart.select('span.filter').style('display')).toEqual('none');
        });
        describe('center positioning', function () {
            beforeEach(function () {
                chart
                    .cx(newCenter.x)
                    .cy(newCenter.y)
                    .render();
                return chart;
            });
            afterEach(function () {
                chart
                    .cx(defaultCenter.x)
                    .cy(defaultCenter.y)
                    .render();
                return chart;
            });
            it('root g should be translated to ' + newCenter.x + ',' + newCenter.y, function () {
                expect(chart.select('svg g').attr('transform')).toMatchTranslate(newCenter.x, newCenter.y);
            });
        });

        describe('re-render', function () {
            beforeEach(function () {
                chart.render();
                return chart;
            });
            it('multiple invocation of render should update chart', function () {
                expect(d3.selectAll('#pie-chart-age svg').nodes().length).toEqual(1);
            });
        });

        describe('n/a filter', function () {
            beforeEach(function () {
                statusDimension.filter('E');
                chart.render();
                return chart;
            });
            it('should draw an empty chart', function () {
                expect(chart.select('g').classed('empty-chart')).toBeTruthy();
            });
            it('should have one slice', function () {
                expect(chart.selectAll('svg g text.pie-slice').nodes().length).toBe(1);
            });
            afterEach(function () {
                statusDimension.filterAll();
            });
        });
        describe('slice selection', function () {
            it('on click function should be defined', function () {
                expect(chart.selectAll('svg g g.pie-slice path').on('click') !== undefined).toBeTruthy();
            });
            it('by default no slice should be selected', function () {
                expect(chart.hasFilter()).toBeFalsy();
            });
            it('be able to set selected slice', function () {
                expect(chart.filter(['US', 'East', 'Ontario']).filter()).toEqual(['US', 'East', 'Ontario']);
                expect(chart.hasFilter()).toBeTruthy();
                chart.filterAll();
            });
            it('should filter dimension by single selection', function () {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(valueGroup.all()[0]).toEqual({key: '22', value: 1});
                expect(valueGroup.all()[1].value).toEqual(0);
                chart.filterAll();
            });
            it('should filter dimension by multiple selections', function () {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                chart.filter(dc.filters.HierarchyFilter(['US', 'West', 'Colorado']));
                expect(valueGroup.all()[0]).toEqual({key: '22', value: 2});
                expect(valueGroup.all()[1].value).toEqual(0);
                chart.filterAll();
            });
            it('should filter dimension with deselection', function () {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                chart.filter(dc.filters.HierarchyFilter(['US', 'West', 'Colorado']));
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(valueGroup.all()[0]).toEqual({key: '22', value: 1});
                expect(valueGroup.all()[1].value).toEqual(0);
                chart.filterAll();
            });
            it('should highlight selected slices', function () {
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
            it('reset link generated after slice selection', function () {
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(chart.select('a.reset').style('display')).not.toEqual('none');
            });
            it('filter info generated after slice selection', function () {
                chart.filter(null);
                chart.filter(dc.filters.HierarchyFilter(['CA', 'East', 'Ontario']));
                expect(chart.select('span.filter').style('display')).not.toEqual('none');
            });
            it('should remove highlight if no slice selected', function () {
                chart.filterAll();
                chart.redraw();
                chart.selectAll('.pie-slice path').each(function (d) {
                    var cls = d3.select(this).attr('class');
                    expect(cls === null || cls === '').toBeTruthy();
                });
            });
        });
        describe('filter through clicking', function () {
            it('onClick should trigger filtering of according group', function () {
                expect(chart.filters()).toEqual([]);
                var d = chart.select('.pie-slice-level-3').datum();
                chart.onClick(d);
                expect(chart.filter().slice(0)).toEqual(d.path);
            });
            it('onClick should reset filter if clicked twice', function () {
                expect(chart.filters()).toEqual([]);
                var d = chart.select('.pie-slice-level-3').datum();
                chart.onClick(d);
                chart.onClick(d);
                expect(chart.filter()).toEqual(null);
            });
        });
    });

    describe('redraw after empty selection', function () {
        var chart;
        beforeEach(function () {
            chart = buildChart('pie-chart2');
            dateDimension.filter([makeDate(2010, 0, 1), makeDate(2010, 0, 3)]);
            chart.redraw();
            dateDimension.filter([makeDate(2012, 0, 1), makeDate(2012, 11, 30)]);
            chart.redraw();
        });
        it('pie chart should be restored', function () {
            chart.selectAll('g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('d').indexOf('NaN') < 0).toBeTruthy();
            });
        });
        afterEach(function () {
            dateDimension.filterAll();
        });
    });

});
