require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 1100;
var height = 200;

function buildChart(id, xdomain) {
    if (!xdomain)
        xdomain = [new Date(2012, 0, 1), new Date(2012, 11, 31)];

    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.barChart("#" + id);
    chart.dimension(dateDimension).group(dateGroup)
        .width(width).height(height)
        .centerBar(true)
        .x(d3.time.scale().domain(xdomain))
        .gap(1)
        .transitionDuration(0)
        .xUnits(d3.time.days);
    chart.render();
    return chart;
}

function buildOrdinalChart(id, xdomain) {
    if (!xdomain)
        xdomain = ["California", "Colorado", "Delaware", "Ontario", "Mississippi", "Oklahoma"];

    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.barChart("#" + id);
    chart.dimension(stateDimension).group(stateGroup)
        .width(width).height(height)
        .x(d3.scale.ordinal().domain(xdomain))
        .transitionDuration(0)
        .xUnits(dc.units.ordinal);
    chart.render();
    return chart;
}

function buildNegativeChart(id, xdomain) {
    if (!xdomain)
        xdomain = [new Date(2012, 4, 20), new Date(2012, 7, 15)];

    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.barChart("#" + id);
    chart.width(1100)
        .height(200)
        .transitionDuration(0)
        .margins({top: 30, right: 50, bottom: 30, left: 30})
        .dimension(dateDimension)
        .group(dateNegativeValueSumGroup)
        .stack(dateNegativeValueSumGroup)
        .stack(dateNegativeValueSumGroup)
        .yAxisPadding(5)
        .elasticY(true)
        .x(d3.time.scale().domain(xdomain))
        .renderHorizontalGridLines(true)
        .xUnits(d3.time.days);
    chart.render();
    return chart;
}

function buildLinearChart(id, xdomain) {
    if (!xdomain)
        xdomain = [20, 70];

    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.barChart("#" + id);
    chart.dimension(valueDimension).group(valueGroup)
        .width(width).height(height)
        .x(d3.scale.linear().domain(xdomain))
        .transitionDuration(0)
        .xUnits(dc.units.integers);
    chart.render();
    return chart;
}

suite.addBatch({
    'time bar chart': {
        topic: function () {
            var chart = buildChart("bar-chart");
            chart.filter([new Date(2012, 5, 1), new Date(2012, 6, 1)]);
            chart.redraw();
            return chart;
        },
        'we get something': function (chart) {
            assert.isNotNull(chart);
        },
        'should be registered': function (chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'dc-chart class should be turned on for parent div': function (chart) {
            assert.equal(d3.select("#bar-chart").attr("class"), "dc-chart");
        },
        'svg should be created': function (chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function (chart) {
            assert.equal(chart.dimension(), dateDimension);
        },
        'group should be set': function (chart) {
            assert.equal(chart.group(), dateGroup);
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
            assert.isTrue(chart.x() != undefined);
        },
        'x range round is auto calculated based on width': function (chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 1020);
        },
        'x domain should be set': function (chart) {
            assert.equal(chart.x().domain()[0].getTime(), new Date(2012, 0, 1).getTime());
            assert.equal(chart.x().domain()[1].getTime(), new Date(2012, 11, 31).getTime());
        },
        'y can be set': function (chart) {
            assert.isTrue(chart.y() != undefined);
        },
        'y range round is auto calculated based on height': function (chart) {
            assert.equal(chart.y().range()[0], 160);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain is auto calculated based on height': function (chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 3);
        },
        'root g should be created': function (chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'axis x should be placed at the bottom': function (chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(30,170)");
        },
        'axis y should be placed on the left': function (chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(30,10)");
        },
        'bar x should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                var halfBarWidth = .5;
                assert.equal(d3.select(this).attr('x'), chart.x()(d.key) + chart.margins().left - halfBarWidth);
            });
        },
        'bar y should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                assert.equal(d3.select(this).attr('y'), chart.margins().top + chart.y()(d.value));
            });
        },
        'bar height should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                assert.equal(d3.select(this).attr('height'),
                    chart.height() - chart.margins().top - chart.margins().bottom - chart.y()(d.value));
            });
        },
        'bar width should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                assert.equal(d3.select(this).attr('width'), 1);
            });
        },
        'x units should be set': function (chart) {
            assert.equal(chart.xUnits(), d3.time.days);
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
            assert.isTrue(chart.round() == null);
        },
        'round can be changed': function (chart) {
            chart.round(d3.time.day.round)
            assert.isNotNull(chart.round());
        },
        'current filter should be set correctly': function (chart) {
            assert.equal(chart.filter()[0].getTime(), new Date(2012, 5, 1).getTime());
            assert.equal(chart.filter()[1].getTime(), new Date(2012, 6, 1).getTime());
        },
        'reset link on after init rendering': function (chart) {
            assert.isEmpty(chart.select("a.reset").style("display"));
        },
        'filter printer should be set': function (chart) {
            assert.isNotNull(chart.filterPrinter());
        },
        'filter info should be on': function (chart) {
            assert.isEmpty(chart.select("span.filter").style("display"));
        },
        'reset link generated after slice selection': function (chart) {
            assert.isEmpty(chart.select("a.reset").style("display"));
        },
        'filter info generated after slice selection': function (chart) {
            assert.equal(chart.select("span.filter").text(), "[06/01/2012 -> 07/01/2012]");
        },

        'with brush': {
            'be positioned with offset (left margin)': function (chart) {
                assert.equal(chart.select("g.brush").attr("transform"), "translate(" + chart.margins().left + ",10)");
            },
            'brush fancy resize handle should be created': function (chart) {
                chart.select("g.brush").selectAll(".resize path").each(function (d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).attr("d"), "M0.5,53.333333333333336A6,6 0 0 1 6.5,59.333333333333336V100.66666666666667A6,6 0 0 1 0.5,106.66666666666667ZM2.5,61.333333333333336V98.66666666666667M4.5,61.333333333333336V98.66666666666667");
                    else
                        assert.equal(d3.select(this).attr("d"), "M-0.5,53.333333333333336A6,6 0 0 0 -6.5,59.333333333333336V100.66666666666667A6,6 0 0 0 -0.5,106.66666666666667ZM-2.5,61.333333333333336V98.66666666666667M-4.5,61.333333333333336V98.66666666666667");
                });
            },
            'background should be stretched': function (chart) {
                assert.equal(chart.select("g.brush rect.background").attr("width"), 1020);
            },
            'background height should be set to chart height': function (chart) {
                assert.equal(chart.select("g.brush rect.background").attr("height"), 160);
            },
            'extent height should be set to chart height': function (chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("height"), 160);
            },
            'extent width should be set based on filter set': function (chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 84);
            },
            'unselected bars should be push to background': function (chart) {
                assert.equal(d3.select(chart.selectAll("g rect.stack0")[0][0]).attr("class"), "bar stack0 deselected");
                assert.equal(d3.select(chart.selectAll("g rect.stack0")[0][1]).attr("class"), "bar stack0");
                assert.equal(d3.select(chart.selectAll("g rect.stack0")[0][3]).attr("class"), "bar stack0 deselected");
            },
            'selected bars should be push to foreground': function (chart) {
                chart.selectAll("g rect.bar").each(function (d, i) {
                    if (i == 1)
                        assert.equal(d3.select(this).attr("class"), "bar stack0");
                });
            },
            'after reset all bars should be pushed to foreground': function (chart) {
                chart.filterAll();
                chart.redraw();
                chart.selectAll("g rect.bar").each(function (d) {
                    assert.equal(d3.select(this).attr("class"), "bar stack0");
                });
            }
        },

        'extra large externally filtered bar chart': {
            topic: function () {
                resetAllFilters();
                valueDimension.filter(66);
                var chart = buildChart("bar-chart2", [new Date(2000, 0, 1), new Date(2012, 11, 31)]);
                return chart;
            },
            'min bar width should be set correctly': function (chart) {
                chart.selectAll("svg g rect.bar").each(function (d) {
                    assert.equal(d3.select(this).attr('width'), 1);
                });
            },
            'no bar should be deselected': function (chart) {
                chart.selectAll("svg g rect.bar").each(function (d) {
                    assert.equal(d3.select(this).attr('class'), "bar stack0");
                });
            }
        },

        'linear number bar chart': {
            topic: function () {
                resetAllFilters();
                d3.select("body").append("div").attr("id", "bar-chart3");
                var chart = dc.barChart("#bar-chart3");
                chart.dimension(valueDimension).group(valueGroup)
                    .width(400).height(150)
                    .centerBar(true)
                    .x(d3.scale.linear().domain([10, 80]))
                    .elasticY(true)
                    .transitionDuration(0);
                chart.render();
                return chart;
            },

            'y axis height should be based on max': function (chart) {
                var scaleToThree = false;
                chart.select("g.y").selectAll("g").each(function (d, i) {
                    if (d3.select(this).select("text").text() == "3.0")
                        scaleToThree = true;
                });
                assert.isTrue(scaleToThree);
            },

            'y axis should be rescaled when filter applied': function (chart) {
                var scaleToThree = false;
                countryDimension.filter("CA");
                chart.redraw();
                chart.select("g.y").selectAll("g").each(function (d, i) {
                    if (d3.select(this).select("text").text() == "3.0")
                        scaleToThree = true;
                });
                assert.isFalse(scaleToThree);
            }
        },

        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'elastic axis': {
    topic: function () {
        countryDimension.filter("CA")
        var chart = buildChart("bar-chart2");
        chart.elasticY(true)
            .yAxisPadding(10)
            .elasticX(true)
            .xAxisPadding(30)
            .redraw();
        return chart;
    },
    'y axis should have changed triggered by filter': function (chart) {
        assert.equal(chart.y().domain()[0], -10);
        assert.equal(chart.y().domain()[1], 11);
    },
    'x axis should have changed triggered by filter': function (chart) {
        assert.isTrue(chart.x().domain()[0].getTime() >= 1335312000000);
        assert.isTrue(chart.x().domain()[1].getTime() >= 1347148800000);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'elastic y axis with no data in focus': {
    topic: function () {
        countryDimension.filter("CC")
        var chart = buildChart("bar-chart-no-data");
        chart.elasticY(true).redraw();
        return chart;
    },
    'y axis should have been set to empty': function (chart) {
        assert.equal(chart.y().domain()[0], 0);
        assert.equal(chart.y().domain()[1], 0);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'stacked': {
    topic: function () {
        var chart = buildChart("bar-chart-stack");
        chart.group(dateIdSumGroup)
            .stack(dateValueSumGroup)
            .elasticY(true);
        chart.render();
        return chart;
    },
    'y axis domain should encampass all groups in stack': function (chart) {
        var yDomain = chart.y().domain();
        assert.equal(yDomain[0], 0);
        assert.equal(yDomain[1], 149);
    },
    'bar should be generated from all groups': function (chart) {
        assert.equal(chart.selectAll("rect.stack0")[0].length, 6);
        assert.equal(chart.selectAll("rect.stack1")[0].length, 6);
    },
    'bar should be stacked': function (chart) {
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][2]).attr("y"), 152);
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][4]).attr("y"), 154);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][2]).attr("y"), 10);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][4]).attr("y"), 95);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'stacked with custom value retriever': {
    topic: function () {
        var chart = buildChart("bar-chart-stack");
        chart.group(dateIdSumGroup)
            .stack(dateValueSumGroup, function (d) {
                return 3;
            })
            .elasticY(true);
        chart.render();
        return chart;
    },
    'y axis domain should encampass all groups in stack': function (chart) {
        var yDomain = chart.y().domain();
        assert.equal(yDomain[0], 0);
        assert.equal(yDomain[1], 20);
    },
    'bar should be generated from all groups': function (chart) {
        assert.equal(chart.selectAll("rect.stack0")[0].length, 6);
        assert.equal(chart.selectAll("rect.stack1")[0].length, 6);
    },
    'bar should be stacked': function (chart) {
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][2]).attr("y"), 34);
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][4]).attr("y"), 50);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][2]).attr("y"), 10);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][4]).attr("y"), 26);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({
    'renderlet': {
        topic: function () {
            var chart = buildChart("chart-renderlet");
            chart.renderlet(function (chart) {
                chart.selectAll("rect").attr("fill", "red");
            });
            return chart;
        },
        'custom renderlet should be invoked with render': function (chart) {
            chart.render();
            assert.equal(chart.selectAll("rect").attr("fill"), "red");
        },
        'custom renderlet should be invoked with redraw': function (chart) {
            chart.redraw();
            assert.equal(chart.selectAll("rect").attr("fill"), "red");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'de-centering': {
        topic: function () {
            var chart = buildChart("chart-decenter");
            chart.centerBar(false);
            chart.redraw();
            return chart;
        },
        'bar x should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                var halfBarWidth = 1;
                assert.equal(d3.select(this).attr('x'), chart.x()(d.key) + chart.margins().left);
            });
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'custom title': {
        topic: function () {
            var chart = buildChart("chart-custom-title");
            chart.brushOn(false)
                .title(function () {
                    return "custom title";
                })
                .render();
            return chart;
        },
        'custom title should be created per bar': function (chart) {
            chart.selectAll("rect.bar").each(function (d) {
                assert.equal(d3.select(this).select("title").text(), "custom title");
            });
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'ordinal bar chart': {
    topic: function () {
        return buildOrdinalChart("bar-chart-ordinal");
    },
    'should have brush turned off': function (chart) {
        assert.isFalse(chart.brushOn());
    },
    'should generate correct number of bars': function (chart) {
        assert.equal(chart.selectAll("rect.bar")[0].length, 6);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), "143");
    },
    'should position bars based on ordinal range': function (chart) {
        assert.match(d3.select(chart.selectAll("rect.bar")[0][0]).attr("x"), /30/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][3]).attr("x"), /612.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][5]).attr("x"), /467.\d+/);
    },
    'should fade deselected bars': function (chart) {
        chart.filter("Ontario").redraw();
        assert.isTrue(d3.select(chart.selectAll("rect.bar")[0][0]).classed("deselected"));
        assert.isFalse(d3.select(chart.selectAll("rect.bar")[0][5]).classed("deselected"));
        assert.equal(stateDimension.top(Infinity).length, 2);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'dynamic accessor switch': {
    topic: function () {
        return buildOrdinalChart("bar-chart-accessor");
    },
    'should position bars based on ordinal range': function (chart) {
        chart.valueAccessor(function () {
            return 30;
        });
        chart.redraw();
        assert.match(d3.select(chart.selectAll("rect.bar")[0][0]).attr("height"), /160/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][1]).attr("height"), /160/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][1]).attr("height"), /160/);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'linear integers bar chart': {
    topic: function () {
        return buildLinearChart("bar-chart-linear-integers");
    },
    'should generate correct number of bars': function (chart) {
        assert.equal(chart.selectAll("rect.bar")[0].length, 5);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), "18");
    },
    'should position bars based on linear range': function (chart) {
        assert.match(d3.select(chart.selectAll("rect.bar")[0][0]).attr("x"), /70.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][2]).attr("x"), /519.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][4]).attr("x"), /968.\d+/);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'runtime dimension & group switch': {
    topic: function () {
        var chart = buildChart("bar-chart-switch", [new Date(2012, 4, 20), new Date(2012, 7, 15)]);
        chart.dimension(dateDimension)
            .group(dateNegativeValueSumGroup)
            .elasticY(true)
            .centerBar(false)
            .render();
        return chart;
    },
    'should generate correct number of bars': function (chart) {
        assert.equal(chart.selectAll("rect.bar")[0].length, 6);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), "10");
    },
    'should generate correct bars in stack 0': function (chart) {
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][0]).attr("x"), /88\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][0]).attr("y"), /94/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][0]).attr("height"), /30/);

        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][3]).attr("x"), /522\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][3]).attr("y"), /94/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][3]).attr("height"), /23/);

        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][5]).attr("x"), /991\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][5]).attr("y"), /71/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][5]).attr("height"), /23/);
    },
    'should generate y axis domain dynamically': function (chart) {
        assert.match(d3.select(chart.selectAll("g.y text")[0][0]).text(), /[−-]10/);
        assert.match(d3.select(chart.selectAll("g.y text")[0][1]).text(), /[−-]5/);
        assert.equal(d3.select(chart.selectAll("g.y text")[0][2]).text(), "0");
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'negative bar chart': {
    topic: function () {
        return buildNegativeChart("bar-chart-negative");
    },
    'should generate correct number of bars': function (chart) {
        assert.equal(chart.selectAll("rect.bar")[0].length, 18);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), "9");
    },
    'should generate correct bars in stack 0': function (chart) {
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][0]).attr("x"), /88\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][0]).attr("y"), /103/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][0]).attr("height"), /8/);

        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][3]).attr("x"), /522\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][3]).attr("y"), /103/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][3]).attr("height"), /6/);

        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][5]).attr("x"), /991\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][5]).attr("y"), /97/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack0")[0][5]).attr("height"), /6/);
    },
    'should generate correct bars in stack 1': function (chart) {
        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][0]).attr("x"), /88\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][0]).attr("y"), /111/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][0]).attr("height"), /8/);

        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][3]).attr("x"), /522\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][3]).attr("y"), /109/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][3]).attr("height"), /6/);

        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][5]).attr("x"), /991\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][5]).attr("y"), /91/);
        assert.match(d3.select(chart.selectAll("rect.bar.stack1")[0][5]).attr("height"), /6/);
    },
    'should generate y axis domain dynamically': function (chart) {
        assert.match(d3.select(chart.selectAll("g.y text")[0][0]).text(), /[−-]20/);
        assert.equal(d3.select(chart.selectAll("g.y text")[0][1]).text(), "0");
        assert.equal(d3.select(chart.selectAll("g.y text")[0][2]).text(), "20");
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({
    'refocus flag': {
        topic: function () {
            return buildChart("chart-refocus-flag");
        },
        'chart should be by default not focused': function (chart) {
            assert.isFalse(chart.refocused());
        },
        'chart should set its focus flag': function (chart) {
            chart.focus([new Date(2012, 5, 11), new Date(2012, 6, 9)]);
            assert.isTrue(chart.refocused());
        },
        'chart should be able to reset its focus flag': function (chart) {
            chart.focus(null);
            assert.isFalse(chart.refocused());
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'out of x range drawing': {
        topic: function () {
            var chart = buildChart("chart-out-of-range");
            chart.focus([new Date(2012, 5, 11), new Date(2012, 6, 9)]);
            chart.render();
            return chart;
        },
        'chart should only render one bar': function (chart) {
            assert.equal(chart.selectAll("rect.bar")[0].length, 1);
        },
        'bar width should be resized accordingly': function (chart) {
            assert.equal(chart.selectAll("rect.bar").attr("width"), 35);
        },
        'focus should reset if null is passed': function (chart) {
            chart.focus(null);
            assert.equal(chart.x().domain()[0].toISOString(), new Date(2012, 0, 1).toISOString());
            assert.equal(chart.x().domain()[1].toISOString(), new Date(2012, 11, 31).toISOString());
        },
        'focus should reset if [] is passed': function (chart) {
            chart.focus([]);
            assert.equal(chart.x().domain()[0].toISOString(), new Date(2012, 0, 1).toISOString());
            assert.equal(chart.x().domain()[1].toISOString(), new Date(2012, 11, 31).toISOString());
        },
        'focus should redraw x axis scale and ticks': function (chart) {
            chart.focus(null);
            assert.equal(d3.select(chart.selectAll("g.x text")[0][0]).text(), "July");
            assert.equal(d3.select(chart.selectAll("g.x text")[0][1]).text(), "2012");
            assert.equal(d3.select(chart.selectAll("g.x text")[0][3]).text(), "March");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'clip path': {
    topic: function () {
        return buildChart("chart-clip-path");
    },
    'only one defs should be created': function (chart) {
        assert.equal(chart.selectAll("defs")[0].length, 1);
    },
    'only one clip path should be created': function (chart) {
        assert.equal(chart.selectAll("defs clipPath")[0].length, 1);
    },
    'only one clip rect should be created': function (chart) {
        assert.equal(chart.selectAll("defs clipPath rect")[0].length, 1);
    },
    'clip rect size should be correct': function (chart) {
        var rect = chart.select("defs clipPath rect");
        assert.equal(rect.attr("width"), 1020);
        assert.equal(rect.attr("height"), 160);
    },
    'clip rect position should be correct': function (chart) {
        var rect = chart.select("defs clipPath rect");
        assert.equal(rect.attr("x"), 30);
        assert.equal(rect.attr("y"), 10);
    },
    'clip id should be correct': function (chart) {
        assert.equal(chart.select("defs clipPath").attr("id"), "chart-clip-path-clip");
    },
    'chart body g should have clip path refs': function (chart) {
        chart.selectAll("g.chartBody").each(function () {
            assert.equal(d3.select(this).attr("clip-path"), "url(#chart-clip-path-clip)");
        });
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.export(module);


