require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Row chart');

var width = 600;
var height = 200;
var gap = 10;

function buildChart(id) {
    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.rowChart("#" + id);
    chart.dimension(valueDimension).group(valueGroup)
         .width(width)
         .height(height)
         .gap(gap);
    chart.render();
    return chart;
}

suite.addBatch({
    "row chart generation": {
        topic: function () {
            var chart = buildChart("row-chart");
            chart.render();
            return chart;
        },

        'we get something': function (chart) {
            assert.isNotNull(chart);
        },
        'should be registered': function (chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'dc-chart class should be turned on for parent div': function (chart) {
            assert.equal(d3.select("#row-chart").attr("class"), "dc-chart");
        },
        'svg should be created': function (chart) {
            assert.isFalse(chart.select("svg").empty());
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
        'width should be used for svg': function (chart) {
            assert.equal(chart.select("svg").attr("width"), width);
        },
        'dimension should be set': function (chart) {
            assert.equal(chart.dimension(), valueDimension);
        },
        'group should be set': function (chart) {
            assert.equal(chart.group(), valueGroup);
        },

        'root g should be created': function (chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'rect g should be created with class': function (chart) {
            assert.equal(chart.selectAll("svg g g.row").data().length, 5);
        },
        'rect row css class should be numbered with index': function (chart) {
            chart.selectAll("svg g g.row").each(function (r, i) {
                assert.equal(d3.select(this).attr("class"), "row _" + i);
            });
        },
        'row path should be filled': function (chart) {
            chart.selectAll("svg g g.row rect").each(function (r) {
                assert.isTrue(d3.select(this).attr("fill") != "");
            });
        },
        'row path fill should be set correctly': function (chart) {
            assert.equal(d3.select(chart.selectAll("g.row rect")[0][0]).attr("fill"), "#3182bd");
            assert.equal(d3.select(chart.selectAll("g.row rect")[0][1]).attr("fill"), "#6baed6");
            assert.equal(d3.select(chart.selectAll("g.row rect")[0][2]).attr("fill"), "#9ecae1");
            assert.equal(d3.select(chart.selectAll("g.row rect")[0][3]).attr("fill"), "#c6dbef");
            assert.equal(d3.select(chart.selectAll("g.row rect")[0][4]).attr("fill"), "#e6550d");
        },
        'row label should be created': function (chart) {
            assert.equal(chart.selectAll("svg text.row").data().length, 5);
        },
        'row label text should be set': function (chart) {
            chart.selectAll("svg g text.row").call(function (t) {
                assert.equal(t.text(), t.datum().key);

            });
        },

        're-render': {
            topic: function (chart) {
                chart.render();
                return chart;
            },

            'multiple invocation of render should update chart': function (chart) {
                assert.equal(d3.selectAll("#row-chart svg")[0].length, 1);
            }
        },

        'filter': {
            topic: function (chart) {
                statusDimension.filter("E");
                chart.render();
                return chart;
            },

            'label should still display when filtered out': function (chart) {
                assert.notEqual(chart.selectAll("svg g text.row").text(), "");
            },

            teardown: function () {
                resetAllFilters();
                resetBody();
            }
        },

        'custom title generation': {
            topic: function () {
                var chart = buildChart("pie-chart-custom-title");
                chart.title(function (d) { return "custom title"; })
                     .label(function (d) { return "custom label"; });

                chart.render();
                return chart;
            },

            'should render corret number of text': function (chart) {
                assert.equal(5, chart.selectAll("text.row")[0].length);
            },
            'custom function should be used to dynamically generate label': function (chart) {
                chart.selectAll("text.row").each(function (r) {
                    assert.equal("custom label", d3.select(this).text());
                });
            },
            'should render correct number of title': function (chart) {
                assert.equal(5, chart.selectAll("g.row title")[0].length);
            },
            'custom function should be used to dynamically generate title': function (chart) {
                chart.selectAll("g.row title").each(function (t) {
                    assert.equal("custom title", d3.select(this).text());
                });
            },

            teardown: function (chart) {
                resetAllFilters();
                resetBody();
            }
        },

        teardown: function (chart) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);