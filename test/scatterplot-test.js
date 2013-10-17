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
    chart.dimension(dateDimension).group(dateIdSumGroup)
        .width(width).height(height)
        .x(d3.time.scale().domain(xdomain))
        .transitionDuration(0);
    chart.render();
    return chart;
}

function symbol_by_index(chart, i) {
    return d3.select(chart.selectAll('circle.symbol')[0][i]);
}

suite.addBatch({
    'render': {
        topic: function () {
            return buildChart('scatter-plot-new');
        },

        'should create svg': function (chart) {
            assert.isNotNull(chart.svg());
        },

        'should create correct number of symbols': function (chart) {
            assert.equal(chart.group().all().length, chart.selectAll('circle.symbol').size());
        },

        'should correctly place symbols': function (chart) {
            assert.equal(symbol_by_index(chart, 0).attr("transform"), "translate(166.8013698630137,140)");
            assert.equal(symbol_by_index(chart, 3).attr("transform"), "translate(209.37671232876713,114)");
            assert.equal(symbol_by_index(chart, 5).attr("transform"), "translate(255.40410958904107,44)");
        },

        'should generate color fill for symbols': function (chart) {
            assert.equal(symbol_by_index(chart, 0).attr("fill"), '#1f77b4');
            assert.equal(symbol_by_index(chart, 3).attr("fill"), '#1f77b4');
            assert.equal(symbol_by_index(chart, 5).attr("fill"), '#1f77b4');
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'update': {
        topic: function () {
            var chart = buildChart('scatter-plot-update');
            valueDimension.filter(66);
            chart.redraw();
            return chart;
        },

        'should remove empty groups': function (chart) {
            assert.equal(chart.selectAll('circle.symbol').size(), 1);
        },

        'should correctly place symbols': function (chart) {
            assert.equal(symbol_by_index(chart, 0).attr("transform"), "translate(182.91095890410958,96)");
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.export(module);