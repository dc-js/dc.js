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
        .xUnits(d3.time.days)
        .yAxis().ticks(5);
    chart.render();
    return chart;
}

function buildOrdinalChart(id, xdomain) {
    var div = d3.select("body").append("div").attr("id", id);
    div.append("a").attr("class", "reset").style("display", "none");
    div.append("span").attr("class", "filter").style("display", "none");
    var chart = dc.barChart("#" + id);
    var xscale = d3.scale.ordinal();
    if (xdomain)
        xscale.domain(xdomain);
    chart.dimension(stateDimension).group(stateGroup)
        .width(width).height(height)
        .x(xscale)
        .barPadding(0)
        .outerPadding(0.1)
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
        .xUnits(d3.time.days)
        .legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
        .yAxis().ticks(5);
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
        'bar x should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                var halfBarWidth = 0.5;
                assert.equal(d3.select(this).attr('x'), chart.x()(d.data.key) - halfBarWidth);
            });
        },
        'bar y should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                assert.equal(d3.select(this).attr('y'), chart.y()(d.data.value));
            });
        },
        'bar height should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                assert.equal(d3.select(this).attr('height'),
                    chart.y()(0) - chart.y()(d.data.value));
            });
        },
        'bar width should be set correctly': function (chart) {
            chart.selectAll("svg g rect.bar").each(function (d) {
                assert.equal(d3.select(this).attr('width'), 1);
            });
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
                    if (i === 0)
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
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 83.83561643835617);
            },
            'unselected bars should be push to background': function (chart) {
                assert.equal(d3.select(chart.selectAll("g._0 rect.bar")[0][0]).attr("class"), "bar deselected");
                assert.equal(d3.select(chart.selectAll("g._0 rect.bar")[0][1]).attr("class"), "bar");
                assert.equal(d3.select(chart.selectAll("g._0 rect.bar")[0][3]).attr("class"), "bar deselected");
            },
            'selected bars should be push to foreground': function (chart) {
                chart.selectAll("g rect.bar").each(function (d, i) {
                    if (i == 1)
                        assert.equal(d3.select(this).attr("class"), "bar");
                });
            },
            'after reset all bars should be pushed to foreground': function (chart) {
                chart.filterAll();
                chart.redraw();
                chart.selectAll("g rect.bar").each(function (d) {
                    assert.equal(d3.select(this).attr("class"), "bar");
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
                    assert.equal(d3.select(this).attr('class'), "bar");
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

suite.addBatch({'stacked': {
    topic: function () {
        var chart = buildChart("bar-chart-stack");
        chart.group(dateIdSumGroup)
            .stack(dateValueSumGroup)
            .elasticY(true);
        chart.render();
        return chart;
    },
    'y axis domain should encompass all groups in stack': function (chart) {
        var yDomain = chart.y().domain();
        assert.equal(yDomain[0], 0);
        assert.equal(yDomain[1], 149);
    },
    'bar should be generated from all groups': function (chart) {
        assert.lengthOf(chart.selectAll("g._0 rect.bar")[0], 6);
        assert.lengthOf(chart.selectAll("g._1 rect.bar")[0], 6);
    },
    'bar should be stacked': function (chart) {
        assert.equal(d3.select(chart.selectAll("g._0 rect.bar")[0][2]).attr("y"), 142);
        assert.equal(d3.select(chart.selectAll("g._0 rect.bar")[0][4]).attr("y"), 144);
        assert.equal(d3.select(chart.selectAll("g._1 rect.bar")[0][2]).attr("y"), 0);
        assert.equal(d3.select(chart.selectAll("g._1 rect.bar")[0][4]).attr("y"), 85);
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
    'y axis domain should encompass all groups in stack': function (chart) {
        var yDomain = chart.y().domain();
        assert.equal(yDomain[0], 0);
        assert.equal(yDomain[1], 20);
    },
    'bar should be generated from all groups': function (chart) {
        assert.lengthOf(chart.selectAll("g._0 rect.bar")[0], 6);
        assert.lengthOf(chart.selectAll("g._1 rect.bar")[0], 6);
    },
    'bar should be stacked': function (chart) {
        assert.equal(d3.select(chart.selectAll("g._0 rect.bar")[0][2]).attr("y"), 24);
        assert.equal(d3.select(chart.selectAll("g._0 rect.bar")[0][4]).attr("y"), 40);
        assert.equal(d3.select(chart.selectAll("g._1 rect.bar")[0][2]).attr("y"), 0);
        assert.equal(d3.select(chart.selectAll("g._1 rect.bar")[0][4]).attr("y"), 16);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});


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
                assert.equal(d3.select(this).attr('x'), chart.x()(d.data.key));
            });
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'custom titles': {
        topic: function () {
            var chart = buildChart("chart-custom-title");
            chart.brushOn(false)
                .title(function () {
                    return "custom title";
                })
                .stack(dateGroup, "extra stack", function (d) { return d.value; })
                .title("extra stack", function () {
                    return "extra stack title";
                })
                .render();
            return chart;
        },
        'custom title should be created per bar': function (chart) {
            chart.selectAll(".stack._0 rect.bar").each(function (d) {
                assert.equal(d3.select(this).select("title").text(), "custom title");
            });
            chart.selectAll(".stack._1 rect.bar").each(function (d) {
                assert.equal(d3.select(this).select("title").text(), "extra stack title");
            });
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    },
    'with renderTitle false': {
        topic: function () {
            var chart = buildChart("no-title");
            chart.renderTitle(false).brushOn(false).render();
            return chart;
        },
        'no title elements should be added': function (chart) {
            assert.equal(chart.selectAll("rect title").size(), 0);
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'axis labels': {
        topic: function () {
            var chart = buildChart("chart-with-axis-lables");
            return chart;
        },
        'add x label default pad': function (chart) {
            assert.equal(chart.effectiveHeight(),160);
            chart.xAxisLabel("x axis test");
            chart.render();
            assert.equal(chart.effectiveHeight(),148);
            assert.equal(chart.selectAll("text.x-axis-label").text(),"x axis test");
        },
        'add y label default pad': function (chart) {
            assert.equal(chart.effectiveWidth(),1020);
            chart.yAxisLabel("y axis test");
            chart.render();
            assert.equal(chart.effectiveWidth(),1008);
            assert.equal(chart.selectAll("text.y-axis-label").text(),"y axis test");
        },
        'add x and y axis': function (chart) {
            chart.xAxisLabel("x axis");
            chart.yAxisLabel("y axis");
            chart.render();
            assert.equal(chart.selectAll("text.x-axis-label").text(),"x axis");
            assert.equal(chart.selectAll("text.y-axis-label").text(),"y axis");
        },
        'x label custom padding': function (chart) {
            chart.xAxisLabel("x axis",50);
            chart.render();
            assert.equal(chart.effectiveHeight(),110);
        },
        'y label custom padding': function (chart) {
            chart.yAxisLabel("y axis",50);
            chart.render();
            assert.equal(chart.effectiveWidth(),970);
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'ordinal bar chart': {
    topic: function () {
        var xdomain = ["California", "Colorado", "Delaware", "Ontario", "Mississippi", "Oklahoma"];
        return buildOrdinalChart("bar-chart-ordinal", xdomain);
    },
    'should have brush turned off': function (chart) {
        assert.isFalse(chart.brushOn());
    },
    'should generate correct number of bars': function (chart) {
        assert.lengthOf(chart.selectAll("rect.bar")[0], 6);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), 164);
    },
    'should position bars based on ordinal range': function (chart) {
        assert.match(d3.select(chart.selectAll("rect.bar")[0][0]).attr("x"), /16(\.\d+)?/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][3]).attr("x"), /674(\.\d+)?/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][5]).attr("x"), /509(\.\d+)?/);
    },
    'should respect specified domain order': function (chart) {
        // note bar chart works differently from pie chart in that the bars objects don't
        // get reordered by the custom ordering, but they get placed by the domain
        assert.ok(d3.select(chart.selectAll("rect.bar")[0][5]).attr("x") < // ontario
                  d3.select(chart.selectAll("rect.bar")[0][3]).attr("x")); // mississippi
    },
    'should fade deselected bars': function (chart) {
        chart.filter("Ontario").filter("Colorado").redraw();
        assert.isTrue(d3.select(chart.selectAll("rect.bar")[0][0]).classed("deselected"));
        assert.isFalse(d3.select(chart.selectAll("rect.bar")[0][1]).classed("deselected"));
        assert.isFalse(d3.select(chart.selectAll("rect.bar")[0][5]).classed("deselected"));
        assert.lengthOf(stateDimension.top(Infinity), 3);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'ordinal bar chart auto domain': {
    topic: function () {
        return buildOrdinalChart("bar-chart-ordinal");
    },
    'should use alphabetical ordering': function(chart) {
        assert.deepEqual(chart.selectAll("rect.bar").data().map(function(slice) { return slice.data.key; }),
                         ["California", "Colorado", "Delaware", "Mississippi", "Oklahoma", "Ontario"]);

    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'ordinal bar chart, elastic y': {
    topic: function () {
        var xdomain = ["Colorado", "Delaware", "California", "Ontario", "Mississippi", "Oklahoma"];
        var chart = buildOrdinalChart("bar-chart-ordinal", xdomain);
        chart.elasticY(true)
            .render();
        return chart;
    },
    'should use all ordinal keys to determine max y': function(chart) {
        assert.equal(chart.y().domain()[0], 0);
        assert.equal(chart.y().domain()[1], 3);
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

suite.addBatch({'linear bar chart': {
    topic: function () {
        return buildLinearChart("bar-chart-linear");
    },
    'should generate correct number of bars': function (chart) {
        assert.lengthOf(chart.selectAll("rect.bar")[0], 5);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), "18");
    },
    'should position bars based on linear range': function (chart) {
        assert.match(d3.select(chart.selectAll("rect.bar")[0][0]).attr("x"), /40\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][2]).attr("x"), /489\.\d+/);
        assert.match(d3.select(chart.selectAll("rect.bar")[0][4]).attr("x"), /938\.\d+/);
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
        assert.lengthOf(chart.selectAll("rect.bar")[0], 6);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), "10");
    },
    'should generate correct bars in stack 0': function (chart) {
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][0]).attr("x"), /58\.\d+/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][0]).attr("y"), /84/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][0]).attr("height"), /30/);

        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][3]).attr("x"), /492\.\d+/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][3]).attr("y"), /84/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][3]).attr("height"), /23/);

        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][5]).attr("x"), /961\.\d+/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][5]).attr("y"), /61/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][5]).attr("height"), /23/);
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
        assert.lengthOf(chart.selectAll("rect.bar")[0], 18);
    },
    'should auto size bar width': function (chart) {
        assert.equal(chart.select("rect.bar").attr("width"), "9");
    },
    'should generate correct bars in stack 0': function (chart) {
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][0]).attr("x"), /58\.\d+/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][0]).attr("y"), /73/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][0]).attr("height"), /8/);

        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][3]).attr("x"), /492\.\d+/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][3]).attr("y"), /73/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][3]).attr("height"), /6/);

        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][5]).attr("x"), /961\.\d+/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][5]).attr("y"), /67/);
        assert.match(d3.select(chart.selectAll("g._0 rect.bar")[0][5]).attr("height"), /6/);
    },
    'should generate correct bars in stack 1': function (chart) {
        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][0]).attr("x"), /58\.\d+/);
        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][0]).attr("y"), /81/);
        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][0]).attr("height"), /7/);

        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][3]).attr("x"), /492\.\d+/);
        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][3]).attr("y"), /79/);
        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][3]).attr("height"), /5/);

        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][5]).attr("x"), /961\.\d+/);
        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][5]).attr("y"), /61/);
        assert.match(d3.select(chart.selectAll("g._1 rect.bar")[0][5]).attr("height"), /6/);
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
    'focus': {
        topic: function () {
            var chart = buildChart("chart-out-of-range");
            chart.elasticY(true).focus([new Date(2012, 5, 11), new Date(2012, 6, 9)]);
            chart.render();
            return chart;
        },
        'chart should only render correct number of bars': function (chart) {
            assert.lengthOf(chart.selectAll("rect.bar")[0], 1);
        },
        'bar width should be resized accordingly': function (chart) {
            assert.equal(chart.selectAll("rect.bar").attr("width"), 35);
        },
        'y axis domain should be reset based on focus range': function(chart){
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 1);
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

suite.addBatch({
    'legend': {
        topic: function () {
            return buildNegativeChart("legend-bar-chart");
        },
        'should highlight bars when corresponding legend item is hovered over': function (chart) {
            var firstItem = chart.select('g.dc-legend g.dc-legend-item');
            var chartStacks = chart.selectAll(".stack");

            firstItem.on("mouseover")(firstItem.datum());
            assert.equal("highlight", chartStacks[0][0].getElementsByClassName("bar")[0].getAttribute("class").split(" ")[1]);
            assert.equal("fadeout", chartStacks[0][1].getElementsByClassName("bar")[0].getAttribute("class").split(" ")[1]);
        },
        'should remove highlighting when legend items are hovered out': function (chart) {
            var firstItem = chart.select('g.dc-legend g.dc-legend-item');
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


suite.export(module);


