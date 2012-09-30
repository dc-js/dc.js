require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Dynamic data addition in crossfilter');

var width = 200;
var height = 200;
var radius = 100;
var innerRadius = 30;

var baseData = crossfilter(json);

var valueDimension = baseData.dimension(function(d) {
    return d.value;
});
var valueGroup = valueDimension.group();

function buildPieChart(id) {
    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.pieChart("#" + id);
    chart.dimension(valueDimension).group(valueGroup)
        .width(width)
        .height(height)
        .radius(radius)
        .transitionDuration(0);
    chart.render();
    baseData.add(json2);
    return chart;
}

suite.addBatch({
    'pie chart slice addition': {
        topic: function() {
            var chart = buildPieChart("pie-chart");
            chart.redraw();
            return chart;
        },
        'slice g should be created with class': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice").data().length, 7);
        },
        'slice path should be created': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice path").data().length, 7);
        },
        'default function should be used to dynamically generate label': function(chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][0]).text(), "66");
        },
        'default function should be used to dynamically generate title': function(chart) {
            assert.equal(d3.select(chart.selectAll("g.pie-slice title")[0][0]).text(), "66: 1");
        },
        teardown:function(chart) {
            resetAllFilters();
            resetBody();
        }
    }
});


suite.export(module);


