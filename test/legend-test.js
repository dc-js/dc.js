require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Line chart');

var width = 1100;
var height = 200;

function buildLineChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.lineChart("#" + id);
    chart.width(500)
        .height(180)
        .margins({top: 30, right: 50, bottom: 30, left: 30})
        .dimension(dateDimension)
        .group(dateIdSumGroup, "Id Sum")
        .stack(dateValueSumGroup, "Value Sum")
        .stack(dateValueSumGroup, "Fixed", function (d) {
            return 10;
        })
        .brushOn(false)
        .title(function (d) {
            return d.value;
        })
        .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
        .xUnits(d3.time.days)
        .elasticY(true)
        .renderArea(true)
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
        .xAxis().ticks(5);
    chart.render();
    return chart;
}


function buildBarChart(id) {
    var div = d3.select("body").append("div").attr("id", id);
    var chart = dc.barChart("#" + id);
    chart.width(width)
        .height(height)
        .dimension(dateDimension)
        .group(dateIdSumGroup, "Id Sum")
        .stack(dateValueSumGroup, "Value Sum")
        .centerBar(true)
        .x(d3.time.scale().domain([new Date(2012, 0, 1), new Date(2012, 11, 31)]))
        .gap(1)
        .transitionDuration(0)
        .xUnits(d3.time.days)
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
        .yAxis().ticks(5);
    chart.render();
    return chart;
}


function buildCompositeChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.compositeChart("#" + id);
    chart.compose([
        buildLineChart(id + '_0'),
        buildLineChart(id + '_1')
    ]);
    chart.legend(dc.legend().x(200).y(10).itemHeight(13).gap(5))
        .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
        .width(500)
        .height(180);

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
        }
    }
});

suite.addBatch({
    'line chart legend': {
        topic: function () {
            return buildLineChart("legend-line-chart");
        },
        'should highlight lines and areas when corresponding legend item is hovered over': function (chart) {
            var firstItem = legend(chart).select('g.dc-legend-item');
            var chartLines = chart.selectAll("path.line");
            var chartAreas = chart.selectAll("path.area");

            firstItem.on("mouseover")(firstItem.datum());
            assert.equal("highlight", chartLines[0][0].getAttribute("class").split(" ")[1]);
            assert.equal("highlight", chartAreas[0][0].getAttribute("class").split(" ")[1]);
            assert.equal("fadeout", chartLines[0][1].getAttribute("class").split(" ")[1]);
            assert.equal("fadeout", chartAreas[0][1].getAttribute("class").split(" ")[1]);
        },
        'should remove highlighting when legend items are hovered out': function (chart) {
            var firstItem = legend(chart).select('g.dc-legend-item');
            var chartLines = chart.selectAll("path.line");
            var chartAreas = chart.selectAll("path.area");

            firstItem.on("mouseover")(firstItem.datum());
            firstItem.on("mouseout")(firstItem.datum());
            assert.equal("line", chartLines[0][0].getAttribute("class"));
            assert.equal("area", chartAreas[0][0].getAttribute("class"));
            assert.equal("line", chartLines[0][1].getAttribute("class"));
            assert.equal("area", chartAreas[0][1].getAttribute("class"));
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'bar chart legend': {
        topic: function () {
            return buildBarChart("legend-bar-chart");
        },
        'should highlight bars when corresponding legend item is hovered over': function (chart) {
            var firstItem = legend(chart).select('g.dc-legend-item');
            var chartStacks = chart.selectAll(".stack");

            firstItem.on("mouseover")(firstItem.datum());
            assert.equal("highlight", chartStacks[0][0].getElementsByClassName("bar")[0].getAttribute("class").split(" ")[1]);
            assert.equal("fadeout", chartStacks[0][1].getElementsByClassName("bar")[0].getAttribute("class").split(" ")[1]);
        },
        'should remove highlighting when legend items are hovered out': function (chart) {
            var firstItem = legend(chart).select('g.dc-legend-item');
            var chartStacks = chart.selectAll(".stack");

            firstItem.on("mouseover")(firstItem.datum());
            firstItem.on("mouseout")(firstItem.datum());
            assert.equal("bar", chartStacks[0][0].getElementsByClassName("bar")[0].getAttribute("class"));
            assert.equal("bar", chartStacks[0][1].getElementsByClassName("bar")[0].getAttribute("class"));
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'composite chart legends': {
        topic: function() {
            return buildCompositeChart("legend-composite-chart");
        },
        'should generate legend items for each sub-chart': function (chart) {
            assert.equal(legendItems(chart).size(), 6);
        },
        'should generate legend labels for each sub-chart': function (chart) {
            assert.equal(legendLabels(chart).size(), 6);
        },
        'should be placed according to its own legend option, ignoring the sub-charts': function (chart) {
            assert.equal(legend(chart).attr("transform"), "translate(200,10)");
        },
        'should generate legend labels correctly': function (chart) {
            assert.equal("Id Sum",    d3.select(legendLabels(chart)[0][0]).text());
            assert.equal("Value Sum", d3.select(legendLabels(chart)[0][1]).text());
            assert.equal("Fixed",     d3.select(legendLabels(chart)[0][2]).text());
            assert.equal("Id Sum",    d3.select(legendLabels(chart)[0][3]).text());
            assert.equal("Value Sum", d3.select(legendLabels(chart)[0][4]).text());
            assert.equal("Fixed",     d3.select(legendLabels(chart)[0][5]).text());
        },
        'should properly delegate highlighting to its children': function (chart) {
            var firstItem = legend(chart).select('g.dc-legend-item');
            var firstLine = chart.children()[0].select("path.line");

            firstItem.on("mouseover")(firstItem.datum());
            assert.isTrue(firstLine.classed("highlight"));
            firstItem.on("mouseout")(firstItem.datum());
            assert.isFalse(firstLine.classed("highlight"));
        }
    }
});

suite.export(module);
