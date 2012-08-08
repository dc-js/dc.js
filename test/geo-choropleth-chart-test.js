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
        .colors(["#E2F2FF","#C4E4FF","#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF"])
        .overlayGeoJson(geoJson.features, "state",
        function(d) {
            return d.properties.name;
        })
        .transitionDuration(0);
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
        'svg is created': function(chart){
            assert.isNotEmpty(chart.selectAll("svg"));
        }
    }
});

suite.export(module);


