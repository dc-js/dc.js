require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Data table');

suite.addBatch({
    'creation': {
        topic: function() {
            var div = d3.select("body").append("div").attr("id", "data-table");
            var chart = dc.dataTable("#data-table")
                .dimension(data)
                .group(groupAll);
            chart.render();
            return chart;
        },
        'should generate something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'teardown': function() {
            resetAllFilters();
        }
    }
});

suite.export(module);


