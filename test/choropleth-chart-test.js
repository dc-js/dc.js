require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Choropleth chart');

function buildChart(id) {
    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.containerChart("#" + id);
    chart.dimension(dateDimension).group(dateGroup)
        .width(width).height(height)
        .transitionDuration(0);
    chart.render();
    return chart;
}

suite.addBatch({
    'creation': {
        topic: function () {
            return buildChart("choropleth-chart");
        },

        'should return something': function (chart) {
            assert.isNotNull(chart);
        }
    }
});

suite.export(module);


