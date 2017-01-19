/* global appendChartID, loadDateFixture, loadGeoFixture, loadGeoFixture2, loadGeoFixture3 */
describe('dc.geoChoropleth', function () {
    var data;
    var stateDimension, stateValueSumGroup, districtDimension, districtValueEnrollGroup;
    var geoJson, geoJson2, geoJson3;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        stateDimension = data.dimension(function (d) {return d.state;});
        stateValueSumGroup = stateDimension.group().reduceSum(function (d) {return d.value;});
        districtDimension = data.dimension(function (d) {return d.district;});
        districtValueEnrollGroup = districtDimension.group().reduceSum(function (d) {return d.value;});

        if (!geoJson) {
            geoJson = loadGeoFixture();
        }
        if (!geoJson2) {
            geoJson2 = loadGeoFixture2();
        }
        if (!geoJson3) {
            geoJson3 = loadGeoFixture3();
        }
    });

    function buildChart (id) {
        var div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        var chart = dc.geoChoroplethChart('#' + id);
        chart.dimension(stateDimension)
            .group(stateValueSumGroup)
            .width(990)
            .height(600)
            .colors(['#ccc', '#e2f2ff', '#c4e4ff', '#9ed2ff', '#81c5ff', '#6bbaff', '#51aeff', '#36a2ff', '#1e96ff', '#0089ff'])
            .colorDomain([0, 155])
            .addLayer(geoJson.features, 'state', function (d) {
                return d.properties.name;
            })
            .addLayer(geoJson2.features, 'county')
            .transitionDuration(0)
            .title(function (d) {
                return d.key + ' : ' + (d.value ? d.value : 0);
            });
        chart.render();
        return chart;
    }

    function buildChartWithCustomProjection (id) {
        var div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        var chart = dc.geoChoroplethChart('#' + id);
        chart.dimension(districtDimension)
            .group(districtValueEnrollGroup)
            .projection(d3.geo.mercator()
                        .scale(26778)
                        .translate([8227, 3207]))
            .width(990)
            .height(600)
            .colors(['#ccc', '#e2f2ff', '#c4e4ff', '#9ed2ff', '#81c5ff', '#6bbaff', '#51aeff', '#36a2ff', '#1e96ff', '#0089ff'])
            .colorDomain([0, 155])
            .addLayer(geoJson3.features, 'district', function (d) {
                return d.properties.NAME;
            })
            .transitionDuration(0)
            .title(function (d) {
                return d.key + ' : ' + (d.value ? d.value : 0);
            });
        chart.render();
        return chart;
    }

    describe('creation', function () {
        var chart;
        beforeEach(function () {
            chart = buildChart('choropleth-chart');
        });

        it('should return not null', function () {
            expect(chart).not.toBeNull();
        });
        it('should have a d3.geo.path', function () {
            expect(chart.path()).not.toBeNull();
        });
        it('svg is created', function () {
            expect(chart.selectAll('svg').size()).not.toEqual(0);
        });
        it('geo layer0 g is created', function () {
            expect(chart.selectAll('g.feature').size()).not.toEqual(0);
        });
        it('correct number of states should be generated', function () {
            expect(chart.selectAll('g.feature.layer-state path').size()).toEqual(52);
        });
        it('correct title should be set [Alaska]', function () {
            expect(chart.select('g.feature.layer-state path[key=Alaska] title').text()).toEqual('Alaska : 0');
        });
        it('correct color filling should be set [Alaska]', function () {
            expect(chart.select('g.feature.layer-state path[key=Alaska]').attr('fill')).toMatch(/#ccc/i);
        });
        it('correct state boundary should be rendered [Alaska]', function () {
            expect(chart.select('g.feature.layer-state path[key=Alaska]').attr('d').length).not.toEqual(0);
        });
        it('correct title should be set [California]', function () {
            expect(chart.select('g.feature.layer-state path[key=California] title').text()).toEqual('California : 154');
        });
        it('correct color should be set [California]', function () {
            expect(chart.select('g.feature.layer-state path[key=California]').attr('fill')).toMatch(/#0089ff/i);
        });
        it('correct state boundary should be rendered [California]', function () {
            expect(chart.select('g.feature.layer-state path[key=California]').attr('d').length).not.toEqual(0);
        });
        it('correct title should be set [Colorado]', function () {
            expect(chart.select('g.feature.layer-state path[key=Colorado] title').text()).toEqual('Colorado : 22');
        });
        it('correct color should be set [Colorado]', function () {
            expect(chart.select('g.feature.layer-state path[key=Colorado]').attr('fill')).toMatch(/#e2f2ff/i);
        });
        it('correct state boundary should be rendered [Colorado]', function () {
            expect(chart.select('g.feature.layer-state path[key=Colorado]').attr('d').length).not.toEqual(0);
        });
        it('geo layer1 g is created', function () {
            expect(chart.selectAll('g.feature').size()).not.toEqual(0);
        });
        it('correct number of counties should be generated', function () {
            expect(chart.selectAll('g.feature.layer-county path').size()).toEqual(5);
        });
        it('correct title should be set [county]', function () {
            expect(chart.select('g.feature.layer-county path title').text()).toEqual('');
        });
        it('correct color filling should be set [county]', function () {
            expect(chart.select('g.feature.layer-county path').attr('fill')).toEqual('#ccc');
        });
        it('correct state boundary should be rendered [county]', function () {
            expect(chart.select('g.feature.layer-county path').attr('d').length).not.toEqual(0);
        });
    });

    describe('filter and highlight', function () {
        var chart;
        beforeEach(function () {
            chart = buildChart('choropleth-chart-with-filter');
            chart.filter('Colorado');
            chart.filter('California');
            chart.redraw();
        });

        it('sets deselected classes for some states', function () {
            expect(chart.select('g.feature.layer-state path[key=Alabama]').attr('class')).toEqual('deselected');
            expect(chart.select('g.feature.layer-state path[key=Alaska]').attr('class')).toEqual('deselected');
        });
        it('sets selected classes for selected states', function () {
            expect(chart.select('g.feature.layer-state path[key=California]').attr('class')).toEqual('selected');
            expect(chart.select('g.feature.layer-state path[key=Colorado]').attr('class')).toEqual('selected');
        });
    });

    describe('respond to external filter', function () {
        var chart, nvalueDim;
        beforeEach(function () {
            chart = buildChart('choropleth-chart-being-filtered');
            nvalueDim = data.dimension(function (d) { return +d.nvalue; });
        });
        it('gets right colors when not filtered', function () {
            expect(chart.select('g.feature.layer-state path[key=California]').attr('fill')).toMatch(/#0089ff/i);
            expect(chart.select('g.feature.layer-state path[key=Colorado]').attr('fill')).toMatch(/#e2f2ff/i);
            expect(chart.select('g.feature.layer-state path[key=Delaware]').attr('fill')).toMatch(/#c4e4ff/i);
            expect(chart.select('g.feature.layer-state path[key=Mississippi]').attr('fill')).toMatch(/#81c5ff/i);
            expect(chart.select('g.feature.layer-state path[key=Oklahoma]').attr('fill')).toMatch(/#9ed2ff/i);
            expect(chart.select('g.feature.layer-state path[key=Maryland]').attr('fill')).toMatch(/#ccc/i);
            expect(chart.select('g.feature.layer-state path[key=Washington]').attr('fill')).toMatch(/#ccc/i);
        });
        it('has right titles when not filtered', function () {
            expect(chart.select('g.feature.layer-state path[key=California] title').text()).toEqual('California : 154');
            expect(chart.select('g.feature.layer-state path[key=Colorado] title').text()).toEqual('Colorado : 22');
            expect(chart.select('g.feature.layer-state path[key=Delaware] title').text()).toEqual('Delaware : 33');
            expect(chart.select('g.feature.layer-state path[key=Mississippi] title').text()).toEqual('Mississippi : 77');
            expect(chart.select('g.feature.layer-state path[key=Oklahoma] title').text()).toEqual('Oklahoma : 55');
            expect(chart.select('g.feature.layer-state path[key=Maryland] title').text()).toEqual('Maryland : 0');
            expect(chart.select('g.feature.layer-state path[key=Washington] title').text()).toEqual('Washington : 0');
        });

        function checkEvenNValueColors () {
            expect(chart.select('g.feature.layer-state path[key=California]').attr('fill')).toMatch(/#36a2ff/i);
            expect(chart.select('g.feature.layer-state path[key=Colorado]').attr('fill')).toMatch(/#e2f2ff/i);
            expect(chart.select('g.feature.layer-state path[key=Delaware]').attr('fill')).toMatch(/#ccc/i);
            expect(chart.select('g.feature.layer-state path[key=Mississippi]').attr('fill')).toMatch(/#c4e4ff/i);
            expect(chart.select('g.feature.layer-state path[key=Oklahoma]').attr('fill')).toMatch(/#ccc/i);
            expect(chart.select('g.feature.layer-state path[key=Maryland]').attr('fill')).toMatch(/#ccc/i);
            expect(chart.select('g.feature.layer-state path[key=Washington]').attr('fill')).toMatch(/#ccc/i);
        }

        function checkEvenNValueTitles () {
            expect(chart.select('g.feature.layer-state path[key=California] title').text()).toEqual('California : 110');
            expect(chart.select('g.feature.layer-state path[key=Colorado] title').text()).toEqual('Colorado : 22');
            expect(chart.select('g.feature.layer-state path[key=Delaware] title').text()).toEqual('Delaware : 0');
            expect(chart.select('g.feature.layer-state path[key=Mississippi] title').text()).toEqual('Mississippi : 44');
            expect(chart.select('g.feature.layer-state path[key=Oklahoma] title').text()).toEqual('Oklahoma : 0');
            expect(chart.select('g.feature.layer-state path[key=Maryland] title').text()).toEqual('Maryland : 0');
            expect(chart.select('g.feature.layer-state path[key=Washington] title').text()).toEqual('Washington : 0');
        }

        describe('column filtering with straight crossfilter', function () {
            beforeEach(function () {
                nvalueDim.filterFunction(function (k) {
                    return k % 2 === 0;
                });
                chart.redraw();
            });
            it('gets right filtered colors', function () {
                checkEvenNValueColors();
            });
            it('gets the titles right', function () {
                checkEvenNValueTitles();
            });
        });
        describe('column filtering with cloned results', function () {
            function dupeGroup (group) {
                return {
                    all: function () {
                        return group.all().map(function (kv) {
                            return Object.assign({}, kv);
                        });
                    }
                };
            }
            beforeEach(function () {
                chart.group(dupeGroup(stateValueSumGroup)).render();
                nvalueDim.filterFunction(function (k) {
                    return k % 2 === 0;
                });
                chart.redraw();
            });
            it('gets right filtered colors', function () {
                checkEvenNValueColors();
            });
            it('gets the titles right', function () {
                checkEvenNValueTitles();
            });
        });
    });

    describe('custom projection', function () {
        var chart;
        beforeEach(function () {
            chart = buildChartWithCustomProjection('choropleth-chart-with-projection');
        });

        it('should return not null', function () {
            expect(chart).not.toBeNull();
        });
        it('svg is created', function () {
            expect(chart.selectAll('svg').length).not.toEqual(0);
        });
    });

    describe('replace and remove layer', function () {
        var chart;
        beforeEach(function () {
            chart = buildChart('choropleth-chart-replace-layer');
            chart.addLayer(geoJson3.features, 'state', function (d) {
                return d.properties.name;
            });
        });
        it('geo json layer with the same name should be replaced', function () {
            expect(chart.layers().state.features).toBe(geoJson3.features);
        });
        it('geo json layer can be removed by name', function () {
            chart.removeLayer('state');
            expect(Object.keys(chart.layers()).length).toEqual(1);
        });
    });
});
