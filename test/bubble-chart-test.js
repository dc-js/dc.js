require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bubble chart');

var width = 900;
var height = 350;
var colors = d3.scale.category20c();

function buildChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.bubbleChart("#" + id);
    chart.width(width).height(height)
        .dimension(statusDimension)
        .group(statusMultiGroup)
        .colors(colors)
        .xValue(function(p) {
            return p.value.value;
        })
        .yValue(function(p) {
            return p.value.count;
        })
        .rValue(function(p) {
            return p.value.count;
        })
        .x(d3.scale.linear().domain([0, 300]))
        .y(d3.scale.linear().domain([0, 10]))
        .r(d3.scale.linear().domain([0, 30]))
        .transitionDuration(0)
        .renderLabel(true)
        .renderTitle(true)
        .title(function(p){return p.key + ": {count:" + p.value.count + ",value:" + p.value.value + "}"});
    chart.render();
    return chart;
}

suite.addBatch({
    'bubble chart': {
        topic: function() {
            var chart = buildChart("chart");
            return chart;
        },
        'we get something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'svg should be created': function(chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function(chart) {
            assert.equal(chart.dimension(), statusDimension);
        },
        'group should be set': function(chart) {
            assert.equal(chart.group(), statusMultiGroup);
        },
        'colors should be': function(chart) {
            assert.isNotNull(chart.colors());
        },
        'width should be set': function(chart) {
            assert.equal(chart.width(), width);
        },
        'height should be set': function(chart) {
            assert.equal(chart.height(), height);
        },
        'height should be used for svg': function(chart) {
            assert.equal(chart.select("svg").attr("height"), height);
        },
        'transition duration should be set': function(chart) {
            assert.equal(chart.transitionDuration(), 0);
        },
        'margin should be set': function(chart) {
            assert.isNotNull(chart.margins());
        },
        'x can be set': function(chart) {
            assert.isTrue(chart.x() != undefined);
        },
        'x range round is auto calculated based on width': function(chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 830);
        },
        'x domain should be set': function(chart) {
            assert.equal(chart.x().domain()[0], 0);
            assert.equal(chart.x().domain()[1], 300);
        },
        'y can be set': function(chart) {
            assert.isTrue(chart.y() != undefined);
        },
        'y range round is auto calculated based on height': function(chart) {
            assert.equal(chart.y().range()[0], 310);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain should be set': function(chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 10);
        },
        'r should be set': function(chart) {
            assert.isNotNull(chart.r());
        },
        'rValue should be set': function(chart) {
            assert.isNotNull(chart.rValue());
        },
        'root g should be created': function(chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'root g should be translated to left corner': function(chart) {
            assert.equal(chart.select("svg g").attr("transform"), "translate(20,10)");
        },
        'axis x should be placed at the bottom': function(chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(20,320)");
        },
        'axis y should be placed on the left': function(chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(20,10)");
        },
        'x units should be set': function(chart) {
            assert.equal(chart.xUnits(), dc.units.integers);
        },
        'x axis should be created': function(chart) {
            assert.isNotNull(chart.xAxis());
        },
        'y axis should be created': function(chart) {
            assert.isNotNull(chart.yAxis());
        },
        'brush should be created': function(chart) {
            assert.isNotNull(chart.select("g.brush"));
        },
        'round should be off by default': function(chart) {
            assert.isTrue(chart.round() == null);
        },
        'round can be changed': function(chart) {
            chart.round(d3.time.day.round)
            assert.isNotNull(chart.round());
        },

        'bubble rendering':{
            topic: function(chart) {
                return chart;
            },
            'should generate right number of bubbles': function(chart) {
                assert.equal(chart.selectAll("circle.bubble")[0].length, 2);
            },
            'should calculate right cx for each bubble': function(chart) {
                chart.selectAll("g.node").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).attr("transform"), "translate(582.5555555555557,118.88888888888889)");
                    if (i == 1)
                        assert.equal(d3.select(this).attr("transform"), "translate(521.688888888889,118.88888888888889)");
                });
            },
            'should calculate right r for each bubble': function(chart) {
                chart.selectAll("circle.bubble").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).attr("r"), 46.111111111111114);
                    if (i == 1)
                        assert.equal(d3.select(this).attr("r"), 46.111111111111114);
                });
            },
            'should attach each bubble with index based class': function(chart) {
                chart.selectAll("circle.bubble").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).attr("class"), "bubble 0");
                    if (i == 1)
                        assert.equal(d3.select(this).attr("class"), "bubble 1");
                });
            },
            'should generate right number of labels': function(chart) {
                assert.equal(chart.selectAll("g.node text")[0].length, 2);
            },
            'should create correct label for each bubble': function(chart) {
                chart.selectAll("g.node text").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).text(), "T");
                    if (i == 1)
                        assert.equal(d3.select(this).text(), "F");
                });
            },
            'should generate right number of titles': function(chart) {
                assert.equal(chart.selectAll("g.node title")[0].length, 2);
            },
            'should create correct label for each bubble': function(chart) {
                chart.selectAll("g.node title").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).text(), "F: {count:5,value:220}");
                    if (i == 1)
                        assert.equal(d3.select(this).text(), "T: {count:5,value:198}");
                });
            }
        },

        teardown: function(topic) {
            resetAllFilters();
        }
    }
});

suite.addBatch({
    'bubble chart wo/ label & title': {
        topic: function() {
            var chart = buildChart("chart2");
            chart.renderLabel(false);
            chart.renderTitle(false);
            chart.render();
            return chart;
        },
        'should generate right number of labels': function(chart) {
            assert.equal(chart.selectAll("g.node text")[0].length, 0);
        },
        'should generate right number of labels': function(chart) {
            assert.equal(chart.selectAll("g.node title")[0].length, 0);
        },
        teardown: function(topic) {
            resetAllFilters();
        }
    }
});

suite.export(module);
