require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Choropleth chart');

function buildChart(id, json) {
    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.geoChoroplethChart("#" + id);
    chart.dimension(dateDimension).group(dateGroup)
        .width(width).height(height)
        .transitionDuration(0);
    chart.render();
    return chart;
}


suite.addBatch({
    'json': { topic: function() {
        var cb = this.callback;
        return d3.json("us-states.json", function(json) {
            cb(null, json);
        });
    },
        'creation': {
            topic: function (json) {
                return buildChart("choropleth-chart", json);
            },

            'should return something': function (chart) {
                assert.isNotNull(chart);
            }
        }
    }
});

suite.export(module);


