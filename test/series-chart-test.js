require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Heat Map');

var width = 210;
var height = 210;

function buildChart(id) {
    d3.select("body").append("div").attr("id", id);

    var chart = dc.seriesChart("#" + id);
    chart
        .width(width)
        .height(height)
        .x(d3.scale.linear().domain([1,2]))
        .dimension(dimensionColorData)
        .group(groupColorData)
        .colors(["#000001", "#000002"])
        .seriesAccessor(function(d) { return +d.key[0];})
        .keyAccessor(function(d) { return +d.key[1];})
        .valueAccessor(function(d) { return +d.value ;})
        .transitionDuration(0);

    chart.render();

    return chart;
}

suite.addBatch({
    'render': {
        topic: function () {
            return buildChart("series-chart-new");
        },
        'should create svg': function (chart) {
            assert.isNotNull(chart.svg());
        },
        'should position generated lineCharts using the data': function (chart) {
            var lines = chart.selectAll("path.line");

            assert.equal(d3.select(lines[0][0]).attr("d"), "M0,128L130,85");
            assert.equal(d3.select(lines[0][1]).attr("d"), "M0,43L130,0");
        },
        'should color lines using the colors in the data': function (chart) {
            var lines = chart.selectAll("path.line");

            assert.equal(d3.select(lines[0][0]).attr("fill"), "#000001");
            assert.equal(d3.select(lines[0][0]).attr("stroke"), "#000001");
            assert.equal(d3.select(lines[0][1]).attr("fill"), "#000002");
            assert.equal(d3.select(lines[0][1]).attr("stroke"), "#000002");
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.export(module);
