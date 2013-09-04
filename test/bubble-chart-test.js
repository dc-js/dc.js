require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bubble chart');

var width = 900;
var height = 350;

function buildChart(id) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.bubbleChart("#" + id);
    chart.width(width).height(height)
        .dimension(statusDimension)
        .group(statusMultiGroup)
        .colors(["#a60000", "#ff0000", "#ff4040", "#ff7373", "#67e667", "#39e639", "#00cc00"])
        .colorDomain([0, 220])
        .colorAccessor(function (p) {
            return p.value.value;
        })
        .keyAccessor(function (p) {
            return p.value.value;
        })
        .valueAccessor(function (p) {
            return p.value.count;
        })
        .radiusValueAccessor(function (p) {
            return p.value.count;
        })
        .x(d3.scale.linear().domain([0, 300]))
        .y(d3.scale.linear().domain([0, 10]))
        .r(d3.scale.linear().domain([0, 30]))
        .maxBubbleRelativeSize(0.3)
        .transitionDuration(0)
        .renderLabel(true)
        .renderTitle(true)
        .title(function (p) {
            return p.key + ": {count:" + p.value.count + ",value:" + p.value.value + "}";

        });
    chart.render();
    return chart;
}

suite.addBatch({
    'bubble chart': {
        topic: function () {
            var chart = buildChart("chart");
            return chart;
        },
        'we get something': function (chart) {
            assert.isNotNull(chart);
        },
        'should be registered': function (chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'svg should be created': function (chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function (chart) {
            assert.equal(chart.dimension(), statusDimension);
        },
        'group should be set': function (chart) {
            assert.equal(chart.group(), statusMultiGroup);
        },
        'colors should be': function (chart) {
            assert.isNotNull(chart.colors());
        },
        'width should be set': function (chart) {
            assert.equal(chart.width(), width);
        },
        'height should be set': function (chart) {
            assert.equal(chart.height(), height);
        },
        'height should be used for svg': function (chart) {
            assert.equal(chart.select("svg").attr("height"), height);
        },
        'transition duration should be set': function (chart) {
            assert.equal(chart.transitionDuration(), 0);
        },
        'margin should be set': function (chart) {
            assert.isNotNull(chart.margins());
        },
        'x can be set': function (chart) {
            assert.isTrue(chart.x() !== undefined);
        },
        'x range round is auto calculated based on width': function (chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 820);
        },
        'x domain should be set': function (chart) {
            assert.equal(chart.x().domain()[0], 0);
            assert.equal(chart.x().domain()[1], 300);
        },
        'y can be set': function (chart) {
            assert.isTrue(chart.y() !== undefined);
        },
        'y range round is auto calculated based on height': function (chart) {
            assert.equal(chart.y().range()[0], 310);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain should be set': function (chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 10);
        },
        'r should be set': function (chart) {
            assert.isNotNull(chart.r());
        },
        'rValue should be set': function (chart) {
            assert.isNotNull(chart.radiusValueAccessor());
        },
        'root g should be created': function (chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'axis x should be placed at the bottom': function (chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(30,320)");
        },
        'axis y should be placed on the left': function (chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(30,10)");
        },
        'x units should be set': function (chart) {
            assert.equal(chart.xUnits(), dc.units.integers);
        },
        'x axis should be created': function (chart) {
            assert.isNotNull(chart.xAxis());
        },
        'y axis should be created': function (chart) {
            assert.isNotNull(chart.yAxis());
        },
        'brush should be created': function (chart) {
            assert.isNotNull(chart.select("g.brush"));
        },
        'round should be off by default': function (chart) {
            assert.isTrue(chart.round() === undefined);
        },
        'round can be changed': function (chart) {
            chart.round(d3.time.day.round);
            assert.isNotNull(chart.round());
        },

        'bubble rendering': {
            topic: function (chart) {
                return chart;
            },
            'should generate right number of bubbles': function (chart) {
                assert.lengthOf(chart.selectAll("circle.bubble")[0], 2);
            },
            'should calculate right cx for each bubble': function (chart) {
                chart.selectAll("g.node").each(function (d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).attr("transform"), "translate(601.3333333333334,155)");
                    if (i === 1)
                        assert.equal(d3.select(this).attr("transform"), "translate(541.2,155)");
                });
            },
            'should calculate right r for each bubble': function (chart) {
                chart.selectAll("circle.bubble").each(function (d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).attr("r"), 49.33333333333333);
                    if (i === 1)
                        assert.equal(d3.select(this).attr("r"), 49.33333333333333);
                });
            },
            'should attach each bubble with index based class': function (chart) {
                chart.selectAll("circle.bubble").each(function (d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).attr("class"), "bubble _0");
                    if (i === 1)
                        assert.equal(d3.select(this).attr("class"), "bubble _1");
                });
            },
            'should generate right number of labels': function (chart) {
                assert.lengthOf(chart.selectAll("g.node text")[0], 2);
            },
            'should create correct label for each bubble': function (chart) {
                chart.selectAll("g.node text").each(function (d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).text(), "F");
                    if (i === 1)
                        assert.equal(d3.select(this).text(), "T");
                });
            },
            'should generate right number of titles': function (chart) {
                assert.lengthOf(chart.selectAll("g.node title")[0], 2);
            },
            'should create correct title for each bubble': function (chart) {
                chart.selectAll("g.node title").each(function (d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).text(), "F: {count:5,value:220}");
                    if (i === 1)
                        assert.equal(d3.select(this).text(), "T: {count:5,value:198}");
                });
            },
            'should fill bubbles with correct colors': function (chart) {
                chart.selectAll("circle.bubble").each(function (d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).attr("fill"), "#00cc00");
                    if (i === 1)
                        assert.equal(d3.select(this).attr("fill"), "#00cc00");
                });
            }
        },

        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'bubble chart wo/ label & title': {
        topic: function () {
            var chart = buildChart("chart2");
            chart.renderLabel(false);
            chart.renderTitle(false);
            chart.render();
            return chart;
        },
        'should generate right number of labels': function (chart) {
            assert.lengthOf(chart.selectAll("g.node text")[0], 0);
        },
        'should generate right number of titles': function (chart) {
            assert.lengthOf(chart.selectAll("g.node title")[0], 0);
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'bubble chart w/ filter': {
        topic: function () {
            var chart = buildChart("chart3");
            chart.filter("F");
            chart.render();
            return chart;
        },
        'should deselect bubble based on filter value': function (chart) {
            chart.selectAll("g.node").each(function (d, i) {
                if (i === 0)
                    assert.equal(d3.select(this).attr("class"), "node selected");
                if (i === 1)
                    assert.equal(d3.select(this).attr("class"), "node deselected");
            });
        },
        'should handle multi-selection highlight': function (chart) {
            chart.filter("T");
            chart.redraw();
            chart.selectAll("g.node").each(function (d, i) {
                assert.equal(d3.select(this).attr("class"), "node selected");
            });
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'update bubble chart': {
        topic: function () {
            var chart = buildChart("chart3");
            chart.render();
            countryDimension.filter("CA");
            chart.redraw();
            return chart;
        },
        'should create correct label for each bubble': function (chart) {
            chart.selectAll("g.node title").each(function (d, i) {
                if (i === 0)
                    assert.equal(d3.select(this).text(), "F: {count:0,value:0}");
                if (i === 1)
                    assert.equal(d3.select(this).text(), "T: {count:2,value:77}");
            });
        },
        'should fill bubbles with correct colors': function (chart) {
            chart.selectAll("circle.bubble").each(function (d, i) {
                if (i === 0)
                    assert.equal(d3.select(this).attr("fill"), "#a60000");
                if (i === 1)
                    assert.equal(d3.select(this).attr("fill"), "#ff4040");
            });
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'bubble chart w/ no filter': {
        topic: function () {
            var chart = buildChart("chart3");
            countryDimension.filter("ZZ");
            chart.render();
            return chart;
        },
        'should set invisible if bubble has 0 r': function (chart) {
            chart.selectAll("g.node text").each(function (d, i) {
                assert.equal(d3.select(this).attr("opacity"), 0);
            });
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'bubble chart w/ elastic axises': {
        topic: function () {
            var chart = buildChart("chart-elastic-axises");
            chart.elasticY(true)
                .yAxisPadding(3)
                .elasticX(true)
                .xAxisPadding(20);
            chart.redraw();
            return chart;
        },
        'x range round is auto calculated based on width': function (chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 820);
        },
        'x domain should be set': function (chart) {
            assert.equal(chart.x().domain()[0], 178);
            assert.equal(chart.x().domain()[1], 240);
        },
        'y range round is auto calculated based on height': function (chart) {
            assert.equal(chart.y().range()[0], 310);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain should be set': function (chart) {
            assert.equal(chart.y().domain()[0], 2);
            assert.equal(chart.y().domain()[1], 8);
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'renderlet': {
        topic: function () {
            var chart = buildChart("chart-renderlet");
            chart.renderlet(function (chart) {
                chart.selectAll("circle").attr("fill", "red");
            });
            return chart;
        },
        'custom renderlet should be invoked with render': function (chart) {
            chart.render();
            assert.equal(chart.selectAll("circle").attr("fill"), "red");
        },
        'custom renderlet should be invoked with redraw': function (chart) {
            chart.redraw();
            assert.equal(chart.selectAll("circle").attr("fill"), "red");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);
