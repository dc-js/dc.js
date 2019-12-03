/* global appendChartID, loadDateFixture, loadGeoFixture, loadGeoFixture2, loadGeoFixture3 */
describe('dc.geoChoropleth', () => {
    let data;
    let stateDimension, stateValueSumGroup, districtDimension, districtValueEnrollGroup;
    let geoJson, geoJson2, geoJson3;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        stateDimension = data.dimension(d => d.state);
        stateValueSumGroup = stateDimension.group().reduceSum(d => d.value);
        districtDimension = data.dimension(d => d.district);
        districtValueEnrollGroup = districtDimension.group().reduceSum(d => d.value);

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
        const div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        const chart = new dc.GeoChoroplethChart(`#${id}`);
        chart.dimension(stateDimension)
            .group(stateValueSumGroup)
            .width(990)
            .height(600)
            .colors(['#ccc', '#e2f2ff', '#c4e4ff', '#9ed2ff', '#81c5ff', '#6bbaff', '#51aeff', '#36a2ff', '#1e96ff', '#0089ff'])
            .colorDomain([0, 155])
            .overlayGeoJson(geoJson.features, 'state', d => d.properties.name)
            .overlayGeoJson(geoJson2.features, 'county')
            .transitionDuration(0)
            .title(d => `${d.key} : ${d.value ? d.value : 0}`);
        chart.render();
        return chart;
    }

    function buildChartWithCustomProjection (id) {
        const div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        const chart = new dc.GeoChoroplethChart(`#${id}`);
        chart.dimension(districtDimension)
            .group(districtValueEnrollGroup)
            .projection(d3.geoMercator()
                        .scale(26778)
                        .translate([8227, 3207]))
            .width(990)
            .height(600)
            .colors(['#ccc', '#e2f2ff', '#c4e4ff', '#9ed2ff', '#81c5ff', '#6bbaff', '#51aeff', '#36a2ff', '#1e96ff', '#0089ff'])
            .colorDomain([0, 155])
            .overlayGeoJson(geoJson3.features, 'district', d => d.properties.NAME)
            .transitionDuration(0)
            .title(d => `${d.key} : ${d.value ? d.value : 0}`);
        chart.render();
        return chart;
    }

    describe('creation', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('choropleth-chart');
        });

        it('should return not null', () => {
            expect(chart).not.toBeNull();
        });
        it('should have a d3.geoPath', () => {
            expect(chart.geoPath()).not.toBeNull();
        });
        it('svg is created', () => {
            expect(chart.selectAll('svg').length).not.toEqual(0);
        });
        it('geo layer0 g is created', () => {
            expect(chart.selectAll('g.layer0').length).not.toEqual(0);
        });
        it('correct number of states should be generated', () => {
            expect(chart.selectAll('g.layer0 g.state').nodes().length).toEqual(52);
        });
        it('correct css class should be set [Alaska]', () => {
            expect(chart.selectAll('g.layer0 g.state').nodes()[1].getAttribute('class')).toEqual('state alaska');
        });
        it('correct title should be set [Alaska]', () => {
            expect(chart.selectAll('g.layer0 g.state title').nodes()[1].textContent).toEqual('Alaska : 0');
        });
        it('correct color filling should be set [Alaska]', () => {
            expect(chart.selectAll('g.layer0 g.state path').nodes()[1].getAttribute('fill')).toMatch(/#ccc/i);
        });
        it('correct state boundary should be rendered [Alaska]', () => {
            expect(chart.selectAll('g.layer0 g.state path').nodes()[1].getAttribute('d').length).not.toEqual(0);
        });
        it('correct css class should be set [California]', () => {
            expect(chart.selectAll('g.layer0 g.state').nodes()[4].getAttribute('class')).toEqual('state california');
        });
        it('correct css class should be set [District of Columbia]', () => {
            expect(chart.selectAll('g.layer0 g.state').nodes()[8].getAttribute('class')).toEqual('state district_of_columbia');
        });
        it('correct title should be set [California]', () => {
            expect(chart.selectAll('g.layer0 g.state title').nodes()[4].textContent).toEqual('California : 154');
        });
        it('correct color should be set [California]', () => {
            expect(chart.selectAll('g.layer0 g.state path').nodes()[4].getAttribute('fill')).toMatch(/#0089ff/i);
        });
        it('correct state boundary should be rendered [California]', () => {
            expect(chart.selectAll('g.layer0 g.state path').nodes()[4].getAttribute('d').length).not.toEqual(0);
        });
        it('correct css class should be set [Colorado]', () => {
            expect(chart.selectAll('g.layer0 g.state').nodes()[5].getAttribute('class')).toEqual('state colorado');
        });
        it('correct title should be set [Colorado]', () => {
            expect(chart.selectAll('g.layer0 g.state title').nodes()[5].textContent).toEqual('Colorado : 22');
        });
        it('correct color should be set [Colorado]', () => {
            expect(chart.selectAll('g.layer0 g.state path').nodes()[5].getAttribute('fill')).toMatch(/#e2f2ff/i);
        });
        it('correct state boundary should be rendered [Colorado]', () => {
            expect(chart.selectAll('g.layer0 g.state path').nodes()[5].getAttribute('d').length).not.toEqual(0);
        });
        it('geo layer1 g is created', () => {
            expect(chart.selectAll('g.layer1').length).not.toEqual(0);
        });
        it('correct number of counties should be generated', () => {
            expect(chart.selectAll('g.layer1 g.county').nodes().length).toEqual(5);
        });
        it('correct css class should be set [county]', () => {
            expect(chart.selectAll('g.layer1 g.county').nodes()[1].getAttribute('class')).toEqual('county');
        });
        it('correct title should be set [county]', () => {
            expect(chart.selectAll('g.layer1 g.county title').nodes()[1].textContent).toEqual('');
        });
        it('correct color filling should be set [county]', () => {
            expect(chart.selectAll('g.layer1 g.county path').nodes()[1].getAttribute('fill')).toEqual('white');
        });
        it('correct state boundary should be rendered [county]', () => {
            expect(chart.selectAll('g.layer1 g.county path').nodes()[1].getAttribute('d').length).not.toEqual(0);
        });
    });

    describe('filter and highlight', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('choropleth-chart-with-filter');
            chart.filter('Colorado');
            chart.filter('California');
            chart.redraw();
        });

        it('sets deselected classes for some states', () => {
            expect(chart.selectAll('g.layer0 g.state').nodes()[0].getAttribute('class')).toEqual('state alabama deselected');
            expect(chart.selectAll('g.layer0 g.state').nodes()[1].getAttribute('class')).toEqual('state alaska deselected');
        });
        it('sets selected classes for selected states', () => {
            expect(chart.selectAll('g.layer0 g.state').nodes()[4].getAttribute('class')).toEqual('state california selected');
            expect(chart.selectAll('g.layer0 g.state').nodes()[5].getAttribute('class')).toEqual('state colorado selected');
        });
    });

    describe('respond to external filter', () => {
        let chart, nvalueDim;
        beforeEach(() => {
            chart = buildChart('choropleth-chart-being-filtered');
            nvalueDim = data.dimension(d => +d.nvalue);
        });
        it('gets right colors when not filtered', () => {
            expect(chart.selectAll('g.layer0 g.state.california path').attr('fill')).toMatch(/#0089ff/i);
            expect(chart.selectAll('g.layer0 g.state.colorado path').attr('fill')).toMatch(/#e2f2ff/i);
            expect(chart.selectAll('g.layer0 g.state.delaware path').attr('fill')).toMatch(/#c4e4ff/i);
            expect(chart.selectAll('g.layer0 g.state.mississippi path').attr('fill')).toMatch(/#81c5ff/i);
            expect(chart.selectAll('g.layer0 g.state.oklahoma path').attr('fill')).toMatch(/#9ed2ff/i);
            expect(chart.selectAll('g.layer0 g.state.maryland path').attr('fill')).toMatch(/#ccc/i);
            expect(chart.selectAll('g.layer0 g.state.washington path').attr('fill')).toMatch(/#ccc/i);
        });
        it('has right titles when not filtered', () => {
            expect(chart.selectAll('g.layer0 g.state.california title').text()).toEqual('California : 154');
            expect(chart.selectAll('g.layer0 g.state.colorado title').text()).toEqual('Colorado : 22');
            expect(chart.selectAll('g.layer0 g.state.delaware title').text()).toEqual('Delaware : 33');
            expect(chart.selectAll('g.layer0 g.state.mississippi title').text()).toEqual('Mississippi : 77');
            expect(chart.selectAll('g.layer0 g.state.oklahoma title').text()).toEqual('Oklahoma : 55');
            expect(chart.selectAll('g.layer0 g.state.maryland title').text()).toEqual('Maryland : 0');
            expect(chart.selectAll('g.layer0 g.state.washington title').text()).toEqual('Washington : 0');
        });

        function checkEvenNValueColors () {
            expect(chart.selectAll('g.layer0 g.state.california path').attr('fill')).toMatch(/#36a2ff/i);
            expect(chart.selectAll('g.layer0 g.state.colorado path').attr('fill')).toMatch(/#e2f2ff/i);
            expect(chart.selectAll('g.layer0 g.state.delaware path').attr('fill')).toMatch(/#ccc/i);
            expect(chart.selectAll('g.layer0 g.state.mississippi path').attr('fill')).toMatch(/#c4e4ff/i);
            expect(chart.selectAll('g.layer0 g.state.oklahoma path').attr('fill')).toMatch(/#ccc/i);
            expect(chart.selectAll('g.layer0 g.state.maryland path').attr('fill')).toMatch(/#ccc/i);
            expect(chart.selectAll('g.layer0 g.state.washington path').attr('fill')).toMatch(/#ccc/i);
        }

        function checkEvenNValueTitles () {
            expect(chart.selectAll('g.layer0 g.state.california title').text()).toEqual('California : 110');
            expect(chart.selectAll('g.layer0 g.state.colorado title').text()).toEqual('Colorado : 22');
            expect(chart.selectAll('g.layer0 g.state.delaware title').text()).toEqual('Delaware : 0');
            expect(chart.selectAll('g.layer0 g.state.mississippi title').text()).toEqual('Mississippi : 44');
            expect(chart.selectAll('g.layer0 g.state.oklahoma title').text()).toEqual('Oklahoma : 0');
            expect(chart.selectAll('g.layer0 g.state.maryland title').text()).toEqual('Maryland : 0');
            expect(chart.selectAll('g.layer0 g.state.washington title').text()).toEqual('Washington : 0');
        }

        describe('column filtering with straight crossfilter', () => {
            beforeEach(() => {
                nvalueDim.filterFunction(k => k % 2 === 0);
                chart.redraw();
            });
            it('gets right filtered colors', () => {
                checkEvenNValueColors();
            });
            it('gets the titles right', () => {
                checkEvenNValueTitles();
            });
        });
        describe('column filtering with cloned results', () => {
            function dupeGroup (group) {
                return {
                    all: function () {
                        return group.all().map(kv => Object.assign({}, kv));
                    }
                };
            }
            beforeEach(() => {
                chart.group(dupeGroup(stateValueSumGroup)).render();
                nvalueDim.filterFunction(k => k % 2 === 0);
                chart.redraw();
            });
            it('gets right filtered colors', () => {
                checkEvenNValueColors();
            });
            it('gets the titles right', () => {
                checkEvenNValueTitles();
            });
        });
    });

    describe('custom projection', () => {
        let chart;
        beforeEach(() => {
            chart = buildChartWithCustomProjection('choropleth-chart-with-projection');
        });

        it('should return not null', () => {
            expect(chart).not.toBeNull();
        });
        it('svg is created', () => {
            expect(chart.selectAll('svg').length).not.toEqual(0);
        });
    });

    describe('replace and remove layer', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('choropleth-chart-replace-layer');
            chart.overlayGeoJson(geoJson3.features, 'state', d => d.properties.name);
        });
        it('geo json layer with the same name should be replaced', () => {
            expect(chart.geoJsons().filter(e => e.name === 'state')[0].data).toBe(geoJson3.features);
        });
        it('geo json layer can be removed by name', () => {
            chart.removeGeoJson('state');
            expect(chart.geoJsons().filter(e => e.name === 'state').length).toEqual(0);
        });
    });
});
