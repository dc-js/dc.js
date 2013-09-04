require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Scatterplot chart');

var width = 500;
var height = 180;

function buildChart(id, xdomain) {
    if (!xdomain)
        xdomain = [new Date(2012, 0, 1), new Date(2012, 11, 31)];

    d3.select("body").append("div").attr("id", id);
    var chart = dc.scatterPlot("#" + id);
    chart.dimension(dateDimension).group(dateGroup)
        .width(width).height(height)
        .x(d3.time.scale().domain(xdomain))
        .transitionDuration(0)
        .xUnits(d3.time.days);
    chart.render();
    return chart;
}

function symbol_by_index(chart, i) {
    return d3.select(chart.selectAll('path.dc-symbol')[0][ i]);
}

suite.addBatch({
    'render': {
        topic: function () {
            return buildChart('scatter-plot');
        },

        'should create svg': function (chart) {
            assert.isNotNull(chart.svg());
        },

        'should create correct number of symbols': function (chart) {
            assert.equal(chart.group().all().length, chart.selectAll('path.dc-symbol').size());
        },

        'should correctly place symbols': function (chart) {
            assert.equal("translate(166.8013698630137,140)", symbol_by_index(chart, 0).attr("transform"));
            assert.equal("translate(209.37671232876713,140)", symbol_by_index(chart, 3).attr("transform"));
            assert.equal("translate(255.40410958904107,70)", symbol_by_index(chart, 5).attr("transform"));
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.export(module);