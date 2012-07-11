require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Data table');

function buildChart(id) {
    var div = d3.select("body").append("div").attr("id", id);
    var chart = dc.dataTable("#" + id)
        .dimension(dateDimension)
        .group(function(d) {
            return d3.time.day(d3.time.format.iso.parse(d.date));
        })
        .size(3)
        .columns(
            [function(d) {
                return d.id;
            }, function(d) {
                return d.status;
            }]
        );
    chart.render();
    return chart;
}

suite.addBatch({
    'creation': {
        topic: function() {
            var chart = buildChart( "data-table");
            return chart;
        },
        'should generate something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'size should be set':function(chart) {
            assert.equal(chart.size(), 3);
        },
        'should have id column created':function(chart) {
            assert.equal(chart.selectAll("span.0")[0][0].innerHTML, 9);
            assert.equal(chart.selectAll("span.0")[0][1].innerHTML, 3);
            assert.equal(chart.selectAll("span.0")[0][2].innerHTML, 8);
        },
        'should have status column created':function(chart) {
            assert.equal(chart.selectAll("span.1")[0][0].innerHTML, "T");
            assert.equal(chart.selectAll("span.1")[0][1].innerHTML, "T");
            assert.equal(chart.selectAll("span.1")[0][2].innerHTML, "F");
        },
        'teardown': function() {
            resetAllFilters();
        }
    }
});

suite.addBatch({
    'external filter':{
        topic: function() {
            var chart = buildChart( "data-table2");
            countryDimension.filter("CA");
            chart.redraw();
            return chart;
        },
        'should only render filtered data set': function(chart) {
            assert.equal(chart.selectAll("span.0")[0].length, 2);
        },
        'should render the correctly filtered records': function(chart) {
            assert.equal(chart.selectAll("span.0")[0][0].innerHTML, 7);
            assert.equal(chart.selectAll("span.0")[0][1].innerHTML, 5);
        },
        'teardown': function() {
            resetAllFilters();
        }
    }
});

suite.export(module);


