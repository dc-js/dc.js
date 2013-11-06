require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Box Plot');

var width = 300;
var height = 144;

function buildChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.boxPlot("#" + id);
    chart
        .dimension(dimensionBoxPlot)
        .group(groupBoxPlot)
        .width(width)
        .height(height)
        .margins({top: 0, right: 0, bottom: 0, left: 0})
        .boxPadding(0)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);

    chart.y(d3.scale.ordinal().domain([0, 144]));
    chart.render();

    return chart;
}

suite.addBatch({
    'render': {
        topic: function () {
            return buildChart("box-plot-new");
        },

        'should create svg': function (chart) {
            assert.isNotNull(chart.svg());
        },

        'should create correct number of outlier circles': function (chart) {
            assert.equal(chart.selectAll("circle.outlier").size(), 2);
        },

        'should create an offset box for each dimension in the group': function (chart) {
            assert.equal(chart.selectAll("g.box:nth-of-type(1)").attr("transform"), "translate(50,0)");
            assert.equal(chart.selectAll("g.box:nth-of-type(2)").attr("transform"), "translate(150,0)");
        },

        'should correctly place median line': function (chart) {
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("line.median").attr("y1"), "100");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("line.median").attr("y2"), "100");
        },

        'should set the median value correctly': function (chart) {
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("text.box:nth-of-type(2)").text(), "44");
        },

        'should correctly place interquartile box lines': function (chart) {
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("rect.box").attr("x"), "0");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("rect.box").attr("y"), "94.5");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("rect.box").attr("width"), "100");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("rect.box").attr("height"), "16.5");
        },

        'should set the box values correctly' : function (chart) {
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("text.box:nth-of-type(1)").text(), "33");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("text.box:nth-of-type(3)").text(), "50");
        },

        'should correctly place whiskers' : function (chart) {
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("line.whisker")[0][0].getAttribute("y1"), "122");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("line.whisker")[0][0].getAttribute("y2"), "122");

            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("line.whisker")[0][1].getAttribute("y1"), "78");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("line.whisker")[0][1].getAttribute("y2"), "78");
        },

        'should set the whiskers values correctly' : function  (chart) {
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("text.whisker")[0][0].textContent, "22");
            assert.equal(chart.select("g.box:nth-of-type(2)").selectAll("text.whisker")[0][1].textContent, "66");
        },
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'boxWidth': {
        topic: function () {
            return buildChart("scatter-plot-boxwidth");
        },

        'should be able to set the box width numerically': function (chart) {
            chart.boxWidth(50).render();
            assert.equal(chart.selectAll("rect.box").attr("width"), "50");
        },

        'should be able to set the box width to a function': function (chart) {
           chart.boxWidth(function(innerChartWidth, xUnits) {
               return innerChartWidth / (xUnits + 2);
           }).render();
            assert.equal(chart.selectAll("rect.box").attr("width"), "75");
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'with filters': {
        topic: function () {
            var chart = buildChart("box-plot-with-filter");
            chart.filter("CA");
            chart.redraw();
            return chart;
        },

        'should select box based on the filter value' : function (chart) {
            chart.selectAll("g.box").each(function (d) {
                if (d.key == "CA") {
                    assert.equal(d3.select(this).attr("class"), "box selected");
                } else {
                    assert.equal(d3.select(this).attr("class"), "box deselected");
                }
            });
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'click' : {
        topic: function () {
            return buildChart("box-plot-with-filter");
        },

        'clicking on a box should apply a filter to the chart' : function (chart) {
            var box = chart.select('g.box');
            box.on("click").call(chart, box.datum());
            assert.equal(chart.hasFilter("CA"), true);
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.export(module);
