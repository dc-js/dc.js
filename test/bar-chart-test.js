require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 1100;
var height = 200;

function buildChart(id, xdomain) {
    if(!xdomain)
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

suite.addBatch({
    'time bar chart': {
        topic: function() {
            var chart = buildChart("bar-chart");
            chart.filter([new Date(2012, 5, 1), new Date(2012, 5, 30)]);
            chart.redraw();
            return chart;
        },
        'we get something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'dc-chart class should be turned on for parent div': function(chart){
            assert.equal(jQuery("#bar-chart").attr("class"), "dc-chart");
        },
        'svg should be created': function(chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function(chart) {
            assert.equal(chart.dimension(), dateDimension);
        },
        'group should be set': function(chart) {
            assert.equal(chart.group(), dateGroup);
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
            assert.equal(chart.x().range()[1], 1020);
        },
        'x domain should be set': function(chart) {
            assert.equal(chart.x().domain()[0].getTime(), new Date(2012, 0, 1).getTime());
            assert.equal(chart.x().domain()[1].getTime(), new Date(2012, 11, 31).getTime());
        },
        'y can be set': function(chart) {
            assert.isTrue(chart.y() != undefined);
        },
        'y range round is auto calculated based on height': function(chart) {
            assert.equal(chart.y().range()[0], 160);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain is auto calculated based on height': function(chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 3);
        },
        'root g should be created': function(chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'axis x should be placed at the bottom': function(chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(30,170)");
        },
        'axis y should be placed on the left': function(chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(30,10)");
        },
        'bar x should be set correctly': function(chart) {
            chart.selectAll("svg g rect.bar").each(function(d) {
                var halfBarWidth = .5;
                assert.equal(d3.select(this).attr('x'), chart.x()(d.key) + chart.margins().left - halfBarWidth);
            });
        },
        'bar y should be set correctly': function(chart) {
            chart.selectAll("svg g rect.bar").each(function(d) {
                assert.equal(d3.select(this).attr('y'), chart.margins().top + chart.y()(d.value));
            });
        },
        'bar height should be set correctly': function(chart) {
            chart.selectAll("svg g rect.bar").each(function(d) {
                assert.equal(d3.select(this).attr('height'),
                    chart.height() - chart.margins().top - chart.margins().bottom - chart.y()(d.value));
            });
        },
        'bar width should be set correctly': function(chart) {
            chart.selectAll("svg g rect.bar").each(function(d) {
                assert.equal(d3.select(this).attr('width'), 1);
            });
        },
        'x units should be set': function(chart) {
            assert.equal(chart.xUnits(), d3.time.days);
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
        'current filter should be set correctly': function(chart) {
            assert.equal(chart.filter()[0].getTime(), new Date(2012, 5, 1).getTime());
            assert.equal(chart.filter()[1].getTime(), new Date(2012, 5, 30).getTime());
        },
        'reset link on after init rendering': function(chart) {
            assert.isEmpty(chart.select("a.reset").style("display"));
        },
        'filter printer should be set': function(chart) {
            assert.isNotNull(chart.filterPrinter());
        },
        'filter info should be on': function(chart) {
            assert.isEmpty(chart.select("span.filter").style("display"));
        },
        'reset link generated after slice selection': function(chart) {
            assert.isEmpty(chart.select("a.reset").style("display"));
        },
        'filter info generated after slice selection': function(chart) {
            assert.equal(chart.select("span.filter").text(), "[06/01/2012 -> 06/30/2012]");
        },

        'with brush': {
            'be positioned with offset (left margin)': function(chart) {
                assert.equal(chart.select("g.brush").attr("transform"), "translate(" + chart.margins().left + ",10)");
            },
            'brush fancy resize handle should be created': function(chart) {
                chart.select("g.brush").selectAll(".resize path").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).attr("d"), "M0.5,53.333333333333336A6,6 0 0 1 6.5,59.333333333333336V100.66666666666667A6,6 0 0 1 0.5,106.66666666666667ZM2.5,61.333333333333336V98.66666666666667M4.5,61.333333333333336V98.66666666666667");
                    else
                        assert.equal(d3.select(this).attr("d"), "M-0.5,53.333333333333336A6,6 0 0 0 -6.5,59.333333333333336V100.66666666666667A6,6 0 0 0 -0.5,106.66666666666667ZM-2.5,61.333333333333336V98.66666666666667M-4.5,61.333333333333336V98.66666666666667");
                });
            },
            'background should be stretched': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("width"), 1020);
            },
            'background height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("height"), 160);
            },
            'extent height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("height"), 160);
            },
            'extent width should be set based on filter set': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 81);
            },
            'unselected bars should be push to background': function(chart) {
                assert.equal(chart.select("g rect.stack0").attr("class"), "bar stack0 deselected");
            },
            'selected bars should be push to foreground': function(chart) {
                chart.selectAll("g rect.bar").each(function(d, i) {
                    if (i == 1)
                        assert.equal(d3.select(this).attr("class"), "bar stack0");
                });
            },
            'after reset all bars should be pushed to foreground': function(chart) {
                chart.filterAll();
                chart.redraw();
                chart.selectAll("g rect.bar").each(function(d) {
                    assert.equal(d3.select(this).attr("class"), "bar stack0");
                });
            }
        },

        'extra large externally filtered bar chart': {
            topic: function() {
                resetAllFilters();
                valueDimension.filter(66);
                var chart = buildChart("bar-chart2", [new Date(2000, 0, 1), new Date(2012, 11, 31)]);
                return chart;
            },
            'min bar width should be set correctly': function(chart) {
                chart.selectAll("svg g rect.bar").each(function(d) {
                    assert.equal(d3.select(this).attr('width'), 1);
                });
            },
            'no bar should be deselected': function(chart) {
                chart.selectAll("svg g rect.bar").each(function(d) {
                    assert.equal(d3.select(this).attr('class'), "bar stack0");
                });
            }
        },

        'linear number bar chart': {
            topic: function() {
                resetAllFilters();
                d3.select("body").append("div").attr("id", "bar-chart3");
                var chart = dc.barChart("#bar-chart3");
                chart.dimension(valueDimension).group(valueGroup)
                    .width(400).height(150)
                    .centerBar(true)
                    .x(d3.scale.linear().domain([10,80]))
                    .elasticY(true)
                    .transitionDuration(0);
                chart.render();
                return chart;
            },

            'y axis height should be based on max': function(chart) {
                var scaleToThree = false;
                chart.select("g.y").selectAll("g").each(function(d, i) {
                    if (d3.select(this).select("text").text() == "3.0")
                        scaleToThree = true;
                });
                assert.isTrue(scaleToThree);
            },

            'y axis should be rescaled when filter applied': function(chart) {
                var scaleToThree = false;
                countryDimension.filter("CA");
                chart.redraw();
                chart.select("g.y").selectAll("g").each(function(d, i) {
                    if (d3.select(this).select("text").text() == "3.0")
                        scaleToThree = true;
                });
                assert.isFalse(scaleToThree);
            }
        },

        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'elastic axis':{
    topic: function() {
        countryDimension.filter("CA")
        var chart = buildChart("bar-chart2");
        chart.elasticY(true)
            .yAxisPadding(10)
            .elasticX(true)
            .xAxisPadding(30)
            .redraw();
        return chart;
    },
    'y axis should have changed triggered by filter': function(chart) {
        assert.equal(chart.y().domain()[0], 0);
        assert.equal(chart.y().domain()[1], 11);
    },
    'x axis should have changed triggered by filter': function(chart) {
        assert.equal(chart.x().domain()[0].getTime(), new Date("Wed, 25 Apr 2012 04:00:00 GMT").getTime());
        assert.equal(chart.x().domain()[1].getTime(), new Date("Sun, 09 Sep 2012 04:00:00 GMT").getTime());
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'stacked':{
    topic:function() {
        var chart = buildChart("bar-chart-stack");
        chart.group(dateIdSumGroup)
            .stack(dateValueSumGroup)
            .elasticY(true);
        chart.render();
        return chart;
    },
    'y axis domain should encampass all groups in stack':function(chart) {
        var yDomain = chart.y().domain();
        assert.equal(yDomain[0], 0);
        assert.equal(yDomain[1], 149);
    },
    'bar should be generated from all groups':function(chart) {
        assert.equal(chart.selectAll("rect.stack0")[0].length, 6);
        assert.equal(chart.selectAll("rect.stack1")[0].length, 6);
    },
    'bar should be stacked':function(chart) {
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][2]).attr("y"), 152);
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][4]).attr("y"), 154);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][2]).attr("y"), 10);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][4]).attr("y"), 95);
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'stacked with custom value retriever':{
    topic:function() {
        var chart = buildChart("bar-chart-stack");
        chart.group(dateIdSumGroup)
            .stack(dateValueSumGroup, function(d){return 3;})
            .elasticY(true);
        chart.render();
        return chart;
    },
    'y axis domain should encampass all groups in stack':function(chart) {
        var yDomain = chart.y().domain();
        assert.equal(yDomain[0], 0);
        assert.equal(yDomain[1], 20);
    },
    'bar should be generated from all groups':function(chart) {
        assert.equal(chart.selectAll("rect.stack0")[0].length, 6);
        assert.equal(chart.selectAll("rect.stack1")[0].length, 6);
    },
    'bar should be stacked':function(chart) {
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][2]).attr("y"), 34);
        assert.equal(d3.select(chart.selectAll("rect.stack0")[0][4]).attr("y"), 50);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][2]).attr("y"), 10);
        assert.equal(d3.select(chart.selectAll("rect.stack1")[0][4]).attr("y"), 26);
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({
    'renderlet':{
        topic:function(){
            var chart = buildChart("chart-renderlet");
            chart.renderlet(function(chart){chart.selectAll("rect").attr("fill", "red");});
            return chart;
        },
        'custom renderlet should be invoked with render': function(chart){
            chart.render();
            assert.equal(chart.selectAll("rect").attr("fill"), "red");
        },
        'custom renderlet should be invoked with redraw': function(chart){
            chart.redraw();
            assert.equal(chart.selectAll("rect").attr("fill"), "red");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'de-centering':{
        topic:function(){
            var chart = buildChart("chart-decenter");
            chart.centerBar(false);
            chart.redraw();
            return chart;
        },
        'bar x should be set correctly': function(chart) {
            chart.selectAll("svg g rect.bar").each(function(d) {
                var halfBarWidth = 1;
                assert.equal(d3.select(this).attr('x'), chart.x()(d.key) + chart.margins().left);
            });
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'custom title':{
        topic:function(){
            var chart = buildChart("chart-custom-title");
            chart.brushOn(false)
                .title(function(){return "custom title";})
                .render();
            return chart;
        },
        'custom title should be created per bar': function(chart) {
            chart.selectAll("rect.bar").each(function(d) {
                assert.equal(d3.select(this).select("title").text(), "custom title");
            });
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);


