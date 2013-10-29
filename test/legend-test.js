require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Line chart');

function buildLineChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.lineChart("#" + id);
    chart
        .dimension(dateDimension)
        .group(dateIdSumGroup, "Id Sum")
        .stack(dateValueSumGroup, "Value Sum")
        .stack(dateValueSumGroup, "Fixed", function () {})
        .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5));

    chart.render();
    return chart;
}

function legend(chart) {
    return chart.select("g.dc-legend");
}

function legendItems(chart) {
    return legend(chart).selectAll('g.dc-legend-item');
}

function legendIcon(chart) {
    return legend(chart).selectAll("rect");
}

function legendLabels(chart) {
    return chart.selectAll("g.dc-legend-item text");
}

suite.addBatch({
    'render': {
        topic: function () {
            return buildLineChart("legend-chart");
        },
        'should generate legend g': function (chart) {
            assert.isFalse(legend(chart).empty());
        },
        'should generate legend g transform for correct placement': function (chart) {
            assert.equal(legend(chart).attr("transform"), "translate(400,10)");
        },
        'should generate correct number of legend items': function (chart) {
            assert.equal(legendItems(chart).size(), 3);
        },
        'should place legend items vertically with gap in between': function (chart) {
            assert.equal(d3.select(legendItems(chart)[0][0]).attr("transform"), "translate(0,0)");
            assert.equal(d3.select(legendItems(chart)[0][1]).attr("transform"), "translate(0,18)");
            assert.equal(d3.select(legendItems(chart)[0][2]).attr("transform"), "translate(0,36)");
        },
        'should generate legend rect': function (chart) {
            assert.equal(d3.select(legendIcon(chart)[0][0]).attr("width"), "13");
            assert.equal(d3.select(legendIcon(chart)[0][1]).attr("height"), "13");
        },
        'should color legend rect correctly': function (chart) {
            assert.equal(d3.select(legendIcon(chart)[0][0]).attr("fill"), "#1f77b4");
            assert.equal(d3.select(legendIcon(chart)[0][1]).attr("fill"), "#ff7f0e");
            assert.equal(d3.select(legendIcon(chart)[0][2]).attr("fill"), "#2ca02c");
        },
        'should generate correct number of legend labels': function (chart) {
            assert.equal(3, legendLabels(chart).size());
        },
        'should place legend labels correctly': function (chart) {
            assert.equal("15", d3.select(legendLabels(chart)[0][0]).attr("x"));
            assert.equal("11", d3.select(legendLabels(chart)[0][1]).attr("y"));
            assert.equal("11", d3.select(legendLabels(chart)[0][2]).attr("y"));
        },
        'should generate legend labels correctly': function (chart) {
            assert.equal("Id Sum", d3.select(legendLabels(chart)[0][0]).text());
            assert.equal("Value Sum", d3.select(legendLabels(chart)[0][1]).text());
            assert.equal("Fixed", d3.select(legendLabels(chart)[0][2]).text());
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);
