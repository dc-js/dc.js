require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Geo choropleth chart');

function buildChart(id) {
    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.geoChoroplethChart("#" + id);
    chart.dimension(stateDimension)
        .group(stateValueSumGroup)
        .width(990)
        .height(600)
        .dimension(stateDimension)
        .group(stateValueSumGroup)
        .colors(["#ccc", "#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF"])
        .colorDomain([0, 155])
        .overlayGeoJson(geoJson.features, "state", function (d) {
            return d.properties.name;
        })
        .overlayGeoJson(geoJson2.features, "county")
        .transitionDuration(0)
        .title(function (d) {
            return d.key + " : " + (d.value ? d.value : 0);
        });
    chart.render();
    return chart;
}

function buildChartWithCustomProjection(id) {
    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.geoChoroplethChart("#" + id);
    chart.dimension(districtDimension)
        .group(districtValueEnrollGroup)
        .projection(d3.geo.mercator()
            .scale(26778)
            .translate([8227, 3207]))
        .width(990)
        .height(600)
        .colors(["#ccc", "#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF"])
        .colorDomain([0, 155])
        .overlayGeoJson(geoJson3.features, "district", function (d) {
            return d.properties.NAME;
        })
        .transitionDuration(0)
        .title(function (d) {
            return d.key + " : " + (d.value ? d.value : 0);
        });
    chart.render();
    return chart;
}


suite.addBatch({
    'creation': {
        topic: function () {
            return buildChart("choropleth-chart");
        },
        'should return not null': function (chart) {
            assert.isNotNull(chart);
        },
        'svg is created': function (chart) {
            assert.isNotEmpty(chart.selectAll("svg"));
        },
        'geo layer0 g is created': function (chart) {
            assert.isNotEmpty(chart.selectAll("g.layer0"));
        },
        'correct number of states should be generated': function (chart) {
            assert.lengthOf(chart.selectAll("g.layer0 g.state")[0], 52);
        },
        'correct css class should be set [Alaska]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state")[0][1].getAttribute("class"), "state alaska");
        },
        'correct title should be set [Alaska]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state title")[0][1].innerHTML, "Alaska : 0");
        },
        'correct color filling should be set [Alaska]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state path")[0][1].getAttribute("fill"), "#ccc");
        },
        'correct state boundary should be rendered [Alaska]': function (chart) {
            assert.isNotEmpty(chart.selectAll("g.layer0 g.state path")[0][1].getAttribute("d"));
        },
        'correct css class should be set [California]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state")[0][4].getAttribute("class"), "state california");
        },
        'correct css class should be set [District of Columbia]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state")[0][8].getAttribute("class"), "state district_of_columbia");
        },
        'correct title should be set [California]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state title")[0][4].innerHTML, "California : 154");
        },
        'correct color should be set [California]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state path")[0][4].getAttribute("fill"), "#0089FF");
        },
        'correct state boundary should be rendered [California]': function (chart) {
            assert.isNotEmpty(chart.selectAll("g.layer0 g.state path")[0][4].getAttribute("d"));
        },
        'correct css class should be set [Colorado]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state")[0][5].getAttribute("class"), "state colorado");
        },
        'correct title should be set [Colorado]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state title")[0][5].innerHTML, "Colorado : 22");
        },
        'correct color should be set [Colorado]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state path")[0][5].getAttribute("fill"), "#E2F2FF");
        },
        'correct state boundary should be rendered [Colorado]': function (chart) {
            assert.isNotEmpty(chart.selectAll("g.layer0 g.state path")[0][5].getAttribute("d"));
        },
        'geo layer1 g is created': function (chart) {
            assert.isNotEmpty(chart.selectAll("g.layer1"));
        },
        'correct number of counties should be generated': function (chart) {
            assert.lengthOf(chart.selectAll("g.layer1 g.county")[0], 5);
        },
        'correct css class should be set [county]': function (chart) {
            assert.equal(chart.selectAll("g.layer1 g.county")[0][1].getAttribute("class"), "county");
        },
        'correct title should be set [county]': function (chart) {
            assert.equal(chart.selectAll("g.layer1 g.county title")[0][1].innerHTML, "");
        },
        'correct color filling should be set [county]': function (chart) {
            assert.equal(chart.selectAll("g.layer1 g.county path")[0][1].getAttribute("fill"), "white");
        },
        'correct state boundary should be rendered [county]': function (chart) {
            assert.isNotEmpty(chart.selectAll("g.layer1 g.county path")[0][1].getAttribute("d"));
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'filter and highlight': {
        topic: function () {
            var chart = buildChart("choropleth-chart-with-filter");
            chart.filter("Colorado");
            chart.filter("California");
            chart.redraw();
            return chart;
        },
        'correct color should be set [California]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state")[0][0].getAttribute("class"), "state alabama deselected");
            assert.equal(chart.selectAll("g.layer0 g.state")[0][1].getAttribute("class"), "state alaska deselected");
        },
        'correct color should be set [California, Colorado]': function (chart) {
            assert.equal(chart.selectAll("g.layer0 g.state")[0][4].getAttribute("class"), "state california selected");
            assert.equal(chart.selectAll("g.layer0 g.state")[0][5].getAttribute("class"), "state colorado selected");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'custom projection': {
        topic: function () {
            var chart = buildChartWithCustomProjection("choropleth-chart-with-projection");
            return chart;
        },
        'should return not null': function (chart) {
            assert.isNotNull(chart);
        },
        'svg is created': function (chart) {
            assert.isNotEmpty(chart.selectAll("svg"));
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'replace and remove layer': {
        topic: function () {
            var chart = buildChart("choropleth-chart-replace-layer");
            chart.overlayGeoJson(geoJson3.features, "state", function (d) {
                return d.properties.name;
            });
            return chart;
        },
        'geo json layer with the same name should be replaced': function (chart) {
            assert.equal(chart.geoJsons().filter(function (e) {
                return e.name == "state";
            })[0].data, geoJson3.features);
        },
        'geo json layer can be removed by name': function (chart) {
            chart.removeGeoJson("state");
            assert.equal(chart.geoJsons().filter(function (e) {
                return e.name == "state";
            }).length, 0);
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});


suite.export(module);


