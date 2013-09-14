require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Pie chart');

var width = 200;
var height = 200;
var radius = 100;
var innerRadius = 30;

function buildChart(id) {
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
    return chart;
}

suite.addBatch({
    'pie chart generation': {
        topic: function () {
            var chart = buildChart("pie-chart-age");
            chart.innerRadius(innerRadius);
            chart.render();
            return chart;
        },
        'we get something': function (pieChart) {
            assert.isNotNull(pieChart);
        },
        'should be registered': function (chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'dc-chart class should be turned on for parent div': function (chart) {
            assert.equal(d3.select("#pie-chart-age").attr("class"), "dc-chart");
        },
        'inner radius can be set': function (chart) {
            assert.equal(chart.innerRadius(), innerRadius);
        },
        'svg should be created': function (pieChart) {
            assert.isFalse(pieChart.select("svg").empty());
        },
        'default color scheme should be created': function (pieChart) {
            assert.isTrue(pieChart.colors().length > 0);
        },
        'dimension should be set': function (pieChart) {
            assert.equal(pieChart.dimension(), valueDimension);
        },
        'group should be set': function (pieChart) {
            assert.equal(pieChart.group(), valueGroup);
        },
        'width should be set': function (pieChart) {
            assert.equal(pieChart.width(), width);
        },
        'height should be set': function (pieChart) {
            assert.equal(pieChart.height(), height);
        },
        'radius should be set': function (pieChart) {
            assert.equal(pieChart.radius(), radius);
        },
        'height should be used for svg': function (pieChart) {
            assert.equal(pieChart.select("svg").attr("height"), height);
        },
        'root g should be created': function (pieChart) {
            assert.isFalse(pieChart.select("svg g").empty());
        },
        'root g should be translated to center': function (pieChart) {
            assert.equal(pieChart.select("svg g").attr("transform"), "translate(100,100)");
        },
        'slice g should be created with class': function (pieChart) {
            assert.lengthOf(pieChart.selectAll("svg g g.pie-slice").data(), 5);
        },
        'slice path should be created': function (pieChart) {
            assert.lengthOf(pieChart.selectAll("svg g g.pie-slice path").data(), 5);
        },
        'slice css class should be numbered with index': function (pieChart) {
            pieChart.selectAll("g.pie-slice").each(function (p, i) {
                assert.equal(d3.select(this).attr("class"), "pie-slice _" + i);
            });
        },
        'slice path should be filled': function (pieChart) {
            pieChart.selectAll("svg g g.pie-slice path").each(function (p) {
                assert.isTrue(d3.select(this).attr("fill") !== "");
            });
        },
        'slice path d should be created': function (pieChart) {
            pieChart.selectAll("svg g g.pie-slice path").each(function (p) {
                assert.isTrue(d3.select(this).attr("d") !== "");
            });
        },
        'slice path fill should be set correctly': function (pieChart) {
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][0]).attr("fill"), "#3182bd");
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][1]).attr("fill"), "#6baed6");
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][2]).attr("fill"), "#9ecae1");
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][3]).attr("fill"), "#c6dbef");
        },
        'slice label should be created': function (pieChart) {
            assert.lengthOf(pieChart.selectAll("svg text.pie-slice").data(), 5);
        },
        'slice label transform to centroid': function (pieChart) {
            assert.equal(pieChart.selectAll("svg g text.pie-slice").attr("transform"), "translate(38.20604139901075,-52.58610463437159)");
        },
        'slice label text should be set': function (pieChart) {
            pieChart.selectAll("svg g text.pie-slice").call(function (p) {
                assert.equal(p.text(), p.datum().data.key);
            });
        },
        'slice label should be middle anchored': function (pieChart) {
            pieChart.selectAll("svg g text.pie-slice").each(function (p) {
                assert.equal(d3.select(this).attr("text-anchor"), "middle");
            });
        },
        'reset link hidden after init rendering': function (chart) {
            assert.equal(chart.select("a.reset").style("display"), "none");
        },
        'filter printer should be set': function (chart) {
            assert.isNotNull(chart.filterPrinter());
        },
        'filter info should be hidden after init rendering': function (chart) {
            assert.equal(chart.select("span.filter").style("display"), "none");
        },
        're-render': {
            topic: function (pieChart) {
                pieChart.render();
                return pieChart;
            },
            'multiple invocation of render should update chart': function (pieChart) {
                assert.lengthOf(d3.selectAll("#pie-chart-age svg")[0], 1);
            }
        },
        'filter': {
            topic: function (pieChart) {
                regionDimension.filter("East");
                pieChart.render();
                return pieChart;
            },
            'label should be hidden if filtered out': function (pieChart) {
                assert.equal(pieChart.selectAll("svg g text.pie-slice").text(), "");
            },
            teardown: function () {
                resetAllFilters();
                resetBody();
            }
        },
        'n/a filter': {
            topic: function (pieChart) {
                statusDimension.filter("E");
                pieChart.render();
                return pieChart;
            },
            'NaN centroid should be handled properly': function (pieChart) {
                assert.equal(pieChart.selectAll("svg g text.pie-slice").attr("transform"), "translate(0,0)");
            },
            'slice path should not contain NaN': function (pieChart) {
                assert.equal(pieChart.selectAll("g.pie-slice path").attr("d"), "M0,0");
            },
            teardown: function () {
                resetAllFilters();
                resetBody();
            }
        },
        'slice selection': {
            topic: function (pieChart) {
                resetAllFilters();
                return pieChart;
            },
            'on click function should be defined': function (pieChart) {
                assert.isTrue(pieChart.selectAll("svg g g.pie-slice path").on("click") !== undefined);
            },
            'by default no slice should be selected': function (pieChart) {
                assert.isFalse(pieChart.hasFilter());
            },
            'be able to set selected slice': function (pieChart) {
                assert.equal(pieChart.filter("66").filter(), "66");
                assert.isTrue(pieChart.hasFilter());
                pieChart.filterAll();
            },
            'should filter dimension by single selection': function (pieChart) {
                pieChart.filter("22");
                assert.equal(countryGroup.all()[0].value, 1);
                assert.equal(countryGroup.all()[1].value, 1);
                pieChart.filterAll();
            },
            'should filter dimension by multiple selections': function (pieChart) {
                pieChart.filter("66");
                pieChart.filter("22");
                assert.equal(countryGroup.all()[0].value, 1);
                assert.equal(countryGroup.all()[1].value, 2);
                pieChart.filterAll();
            },
            'should filter dimension with deselection': function (pieChart) {
                pieChart.filter("22");
                pieChart.filter("66");
                pieChart.filter("22");
                assert.equal(countryGroup.all()[0].value, 0);
                assert.equal(countryGroup.all()[1].value, 1);
                pieChart.filterAll();
            },
            'should highlight selected slices': function (pieChart) {
                pieChart.filter("66");
                pieChart.filter("22");
                pieChart.render();
                pieChart.selectAll("g.pie-slice").each(function (d) {
                    if (d.data.key === "66" || d.data.key === "22")
                        assert.isTrue(d3.select(this).attr("class").indexOf("selected") > 0);
                    else
                        assert.isTrue(d3.select(this).attr("class").indexOf("deselected") > 0);
                });
                pieChart.filterAll();
            },
            'reset link generated after slice selection': function (chart) {
                chart.filter("66");
                assert.isEmpty(chart.select("a.reset").style("display"));
            },
            'filter info generated after slice selection': function (chart) {
                chart.filter(null);
                chart.filter("66");
                assert.isEmpty(chart.select("span.filter").style("display"));
                assert.equal(chart.select("span.filter").text(), "66");
            },
            'should remove highlight if no slice selected': function (pieChart) {
                pieChart.filterAll();
                pieChart.redraw();
                pieChart.selectAll(".pie-slice path").each(function (d) {
                    var cls = d3.select(this).attr("class");
                    assert.isTrue(cls === null || cls === "");
                });
            },
            teardown: function (pieChart) {
                resetAllFilters();
                resetBody();
            }
        },
        'filter through clicking': {
            topic: function (pieChart) {
                return pieChart;
            },
            'onClick should trigger filtering of according group': function (pieChart) {
                pieChart.onClick(pieChart.group().all()[0]);
                assert.equal(pieChart.filter(), "22");
            },
            'onClick should reset filter if clicked twice': function (pieChart) {
                pieChart.onClick(pieChart.group().all()[0]);
                assert.equal(pieChart.filter(), null);
            },
            'multiple onClick should trigger filtering of according groups': function (pieChart) {
                pieChart.onClick(pieChart.group().all()[0]);
                pieChart.onClick(pieChart.group().all()[1]);
                assert.isTrue(pieChart.hasFilter("22"));
                assert.isTrue(pieChart.hasFilter("33"));
            },
            teardown: function () {
                resetAllFilters();
                resetBody();
            }
        },
        'group order': {
            topic: function (chart) {
                return chart;
            },
            'group should be order': function (chart) {
                var group = chart.computeOrderedGroups();
                countryDimension.filter("US");
                var group2 = chart.computeOrderedGroups();
                assert.equal(group2[0].key, group[0].key);
            }
        }
    },

    'redraw after empty selection': {
        topic: function () {
            var chart = buildChart("pie-chart2");
            dateDimension.filter([new Date(2010, 0, 1), new Date(2010, 0, 3)]);
            chart.redraw();
            dateDimension.filter([new Date(2012, 0, 1), new Date(2012, 11, 30)]);
            chart.redraw();
            return chart;
        },
        'pie chart should be restored': function (chart) {
            chart.selectAll("g.pie-slice path").each(function (p) {
                assert.isTrue(d3.select(this).attr("d").indexOf("NaN") < 0);
            });
        },
        teardown: function (chart) {
            resetAllFilters();
            resetBody();
        }
    },

    'custom label & title generation': {
        topic: function () {
            var chart = buildChart("pie-chart3");
            chart.label(function (d) {
                return "custom";
            })
                .title(function (d) {
                    return "custom";
                })
                .minAngleForLabel(1)
                .renderTitle(true);
            chart.render();
            return chart;
        },
        'should render correct number of text': function (chart) {
            assert.lengthOf(chart.selectAll("text.pie-slice")[0], 5);
        },
        'custom function should be used to dynamically generate label': function (chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][0]).text(), "custom");
        },
        'label should not be generated if the slice is too small': function (chart) {
            // slice '66'
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][4]).text(), "");
        },
        'should render correct number of title': function (chart) {
            assert.lengthOf(chart.selectAll("g.pie-slice title")[0], 5);
        },
        'custom function should be used to dynamically generate title': function (chart) {
            chart.selectAll("g.pie-slice title").each(function (p) {
                assert.equal(d3.select(this).text(), "custom");
            });
        },
        teardown: function (chart) {
            resetAllFilters();
            resetBody();
        }
    }
});
suite.addBatch({
    'pie chart slices cap': {
        topic: function () {
            var chart = buildChart("pie-chart4");
            chart.slicesCap(3)
                .renderTitle(true)
                .othersLabel("small");
            chart.render();
            return chart;
        },
        'produce expected number of slices': function(chart) {
            assert.lengthOf(chart.selectAll("text.pie-slice")[0], 4);
        },
        'others slice should use custom name': function(chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][3]).text(), "small");
        },
        'remaining slices should be in numerical order': function(chart) {
            assert.deepEqual(chart.selectAll("text.pie-slice").data().map(function(slice) { return slice.data.key; }),
                             ["22","33","44","small"]);
        },
        'clicking others sclice should filter all groups slices': function(chart) {
            var event = document.createEvent("SVGEvents");
            event.initEvent("click",true,true);
            chart.selectAll(".pie-slice path")[0][3].dispatchEvent(event);
            assert.deepEqual(chart.filters(),["55","66","small"]);
            chart.selectAll(".pie-slice path")[0][3].dispatchEvent(event);
            assert.deepEqual(chart.filters(),[]);
        },
        teardown: function (chart) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'pie chart wo/ label': {
        topic: function () {
            var chart = buildChart("pie-chart4");
            chart.innerRadius(innerRadius);
            chart.renderLabel(false);
            chart.render();
            return chart;
        },
        'slice label should not be created': function (pieChart) {
            assert.lengthOf(pieChart.selectAll("svg g text.pie-slice").data(), 0);
        },
        teardown: function (chart) {
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
                chart.selectAll("path").attr("fill", "red");
            });
            return chart;
        },
        'custom renderlet should be invoked with render': function (chart) {
            chart.render();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        'custom renderlet should be invoked with redraw': function (chart) {
            chart.redraw();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'pie chart label and title w/ value accessor': {
        topic: function () {
            var chart = buildChart("pie-chart-default-label-title");
            chart.dimension(statusGroup)
                .group(statusMultiGroup)
                .valueAccessor(function (d) {
                    return d.value.count;
                })
                .renderLabel(true).renderTitle(true);
            chart.render();
            return chart;
        },
        'default function should be used to dynamically generate label': function (chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][0]).text(), "F");
        },
        'default function should be used to dynamically generate title': function (chart) {
            assert.equal(d3.select(chart.selectAll("g.pie-slice title")[0][0]).text(), "F: 5");
        },
        teardown: function (chart) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'custom filter handler': {
        topic: function () {
            var chart = buildChart("pie-chart-filter-handler");
            chart.filterHandler(function (dimension, filters) {
                dimension.filter("66");
                return ["66"];
            });
            return chart;
        },
        'default function should be used to dynamically generate label': function (chart) {
            chart.filter(6);
            assert.equal(chart.filter(), 66);
        },
        teardown: function (chart) {
            resetAllFilters();
            resetBody();
        }
    }
});


suite.export(module);


