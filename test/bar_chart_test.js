require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

suite.addBatch({
    'creation by id selector': {
        topic: function () {
            d3.select("body").append("div").attr("id", "bar-chart");
            return dc.createBarChart();
        },
        'we get something': function(bar_chart) {
            assert.isNotNull (bar_chart);
        },
        'we get barchart instance': function (bar_chart) {
            assert.isTrue(bar_chart instanceof dc.BarChart);
        }
    }
});

suite.export(module);


