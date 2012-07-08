require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Data table');

suite.addBatch({
    'creation': {
        topic: function() {
            var div = d3.select("body").append("div").attr("id", "data-table");
            var chart = dc.dataTable("#data-table")
                .dimension(dateDimension)
                .group(dateGroup)
                .size(3)
                .columns([function(d){return d.id;}, function(d){return d.status;}]);
            chart.render();
            return chart;
        },
        'should generate something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'should have id column created':function(chart) {
            assert.isFalse(chart.selectAll("span.0").empty());
        },
        'should have status column created':function(chart) {
            assert.isFalse(chart.selectAll("span.1").empty());
        },
        'teardown': function() {
            resetAllFilters();
        }
    }
});

suite.export(module);


