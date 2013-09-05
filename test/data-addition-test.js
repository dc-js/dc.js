require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Dynamic data addition in crossfilter');

var width = 200;
var height = 200;
var radius = 100;

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
    chart.expireCache();
    return chart;
}

var baseData2 = crossfilter(json);

var timeDimension = baseData2.dimension(function(d) {
    return d.dd;
});
var timeGroup = timeDimension.group();

function buildLineChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.lineChart("#" + id);
    chart.dimension(timeDimension).group(timeGroup)
        .width(width).height(height)
        .x(d3.time.scale().domain([new Date(2012, 4, 20), new Date(2012, 7, 15)]))
        .transitionDuration(0)
        .xUnits(d3.time.days)
        .brushOn(false)
        .renderArea(true)
        .renderTitle(true);
    chart.render();
    baseData2.add(json2);
    chart.expireCache();
    return chart;
}

function occurrences(str, value) {
    return (str.split(value)).length - 1;
}

suite.addBatch({
    'pie chart slice addition': {
        topic: function() {
            var chart = buildPieChart("pie-chart");
            chart.redraw();
            return chart;
        },
        'slice g should be created with class': function(pieChart) {
            assert.lengthOf(pieChart.selectAll("svg g g.pie-slice").data(), 7);
        },
        'slice path should be created': function(pieChart) {
            assert.lengthOf(pieChart.selectAll("svg g g.pie-slice path").data(), 7);
        },
        'default function should be used to dynamically generate label': function(chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][0]).text(), "11");
        },
        'pie chart slices should be in numerical order': function(chart) {
            assert.deepEqual(chart.selectAll("text.pie-slice").data().map(function(slice) { return slice.data.key; }),
                             ["11","22","33","44","55","66","76"]);
        },
        'default function should be used to dynamically generate title': function(chart) {
            assert.equal(d3.select(chart.selectAll("g.pie-slice title")[0][0]).text(), "11: 1");
        },
        teardown:function(chart) {
            resetAllFilters();
            resetBody();
        }
    },
    'line chart segment addition': {
        topic: function() {
            var chart = buildLineChart("line-chart");
            chart.render();
            return chart;
        },
        'number of dots should equal the size of the group': function(lineChart) {
            assert.lengthOf(lineChart.selectAll("circle.dot")[0], timeGroup.size());
        },
        'number of line segments should equal the size of the group': function(lineChart) {
            var path = lineChart.selectAll("path.line").attr("d");
            assert.equal(occurrences(path, 'L') + 1, timeGroup.size());
        },
        'number of area segments should equal twice the size of the group': function(lineChart) {
            var path = lineChart.selectAll("path.area").attr("d");
            assert.equal(occurrences(path, 'L') + 1, timeGroup.size() * 2);
        },
        teardown:function(chart) {
            resetAllFilters();
            resetBody();
        }
    }
});


suite.export(module);


