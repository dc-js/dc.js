require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Composite chart');

var width = 500;
var height = 150;

function buildChart(id, xdomain) {
    if(xdomain === undefined)
        xdomain = [new Date(2012, 4, 20), new Date(2012, 7, 15)];

    d3.select("body").append("div").attr("id", id);
    var chart = dc.compositeChart("#" + id);
    chart
        .dimension(dateDimension)
        .group(dateIdSumGroup)
        .width(width)
        .height(height)
        .x(d3.time.scale().domain(xdomain))
        .transitionDuration(0)
        .xUnits(d3.time.days)
        .compose([
        dc.barChart(chart).centerBar(true).group(dateValueSumGroup).gap(1),
        dc.lineChart(chart).stack(dateValueSumGroup).stack(dateValueSumGroup),
        dc.lineChart(chart).group(dateGroup)
    ]);
    chart.render();
    return chart;
}

suite.addBatch({
    'time line composite chart': {
        topic: function() {
            var chart = buildChart("compositeChart");
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
        'svg should be created': function(chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function(chart) {
            assert.equal(chart.dimension(), dateDimension);
        },
        'group should be set': function(chart) {
            assert.equal(chart.group(), dateIdSumGroup);
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
            assert.isDefined(chart.x());
        },
        'x range round is auto calculated based on width': function(chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 420);
        },
        'x domain should be set': function(chart) {
            assert.equal(chart.x().domain()[0].getTime(), new Date(2012, 4, 20).getTime());
            assert.equal(chart.x().domain()[1].getTime(), new Date(2012, 7, 15).getTime());
        },
        'y can be set': function(chart) {
            assert.isDefined(chart.y());
        },
        'y range round is auto calculated based on height': function(chart) {
            assert.equal(chart.y().range()[0], 110);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain is auto calculated based on height': function(chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 281);
        },
        'root g should be created': function(chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'axis x should be placed at the bottom': function(chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(30,120)");
        },
        'axis y should be placed on the left': function(chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(30,10)");
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
            assert.isUndefined(chart.round());
        },
        'round can be changed': function(chart) {
            chart.round(d3.time.day.round);
            assert.isNotNull(chart.round());
        },
        'separate g should be created for each sub chart': function(chart) {
            assert.lengthOf(chart.selectAll("g.sub")[0], 3);
        },
        'sub chart g should be indexed by css class': function(chart) {
            assert.equal(d3.select(chart.selectAll("g.sub")[0][0]).attr("class"), "sub _0");
            assert.equal(d3.select(chart.selectAll("g.sub")[0][1]).attr("class"), "sub _1");
        },
        'sub line chart path generation': function(chart) {
            chart.selectAll("g.sub path.line").each(function(d, i) {
                switch (i) {
                    case 0:
                        assert.equal(d3.select(this).attr("d"), "M24.137931034482758,110L91.72413793103448,108L101.37931034482757,103L202.75862068965515,108L246.20689655172413,104L395.8620689655172,105");
                        break;
                    case 1:
                        assert.equal(d3.select(this).attr("d"), "M24.137931034482758,92L91.72413793103448,82L101.37931034482757,52L202.75862068965515,91L246.20689655172413,83L395.8620689655172,75");
                        break;
                }
            });
        },
        'sub bar chart generation': function(chart) {
            assert.lengthOf(chart.selectAll("g.sub g._0 rect")[0], 6);
        },
        'sub bar chart rendering': function(chart) {
            chart.selectAll("g.sub rect.bar").each(function(d, i) {
                switch (i) {
                    case 0:
                        assert.equal(d3.select(this).attr("x"), "22.637931034482758");
                        assert.equal(d3.select(this).attr("y"), "93");
                        assert.equal(d3.select(this).attr("width"), "3");
                        assert.equal(d3.select(this).attr("height"), "17");
                        break;
                    case 5:
                        assert.equal(d3.select(this).attr("x"), "394.3620689655172");
                        assert.equal(d3.select(this).attr("y"), "80");
                        assert.equal(d3.select(this).attr("width"), "3");
                        assert.equal(d3.select(this).attr("height"), "30");
                        break;
                }
            });
        },
        'with brush': {
            'be positioned with offset (left margin)': function(chart) {
                assert.equal(chart.select("g.brush").attr("transform"), "translate(" + chart.margins().left + ",10)");
            },
            'brush fancy resize handle should be created': function(chart) {
                chart.select("g.brush").selectAll(".resize path").each(function(d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).attr("d"), "M0.5,36.666666666666664A6,6 0 0 1 6.5,42.666666666666664V67.33333333333333A6,6 0 0 1 0.5,73.33333333333333ZM2.5,44.666666666666664V65.33333333333333M4.5,44.666666666666664V65.33333333333333");
                    else
                        assert.equal(d3.select(this).attr("d"), "M-0.5,36.666666666666664A6,6 0 0 0 -6.5,42.666666666666664V67.33333333333333A6,6 0 0 0 -0.5,73.33333333333333ZM-2.5,44.666666666666664V65.33333333333333M-4.5,44.666666666666664V65.33333333333333");
                });
            },
            'background should be stretched': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("width"), 420);
            },
            'background height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("height"), 110);
            },
            'extent height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("height"), 110);
            },
            'extent width should be set based on filter set': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 140);
            },
            'filterd bars should be faded into background': function(chart) {
                assert.lengthOf(chart.selectAll("g.sub rect.deselected")[0], 4);
            },
            'after reset all bars should be pushed to foreground': function(chart) {
                chart.filterAll();
                chart.redraw();
                chart.selectAll("g rect.bar").each(function(d) {
                    assert.equal(d3.select(this).attr("class"), "bar");
                });
            },
            'x value should have default impl': function(chart) {
                assert.isNotNull(chart.keyAccessor());
            },
            'y value should have default impl': function(chart) {
                assert.isNotNull(chart.valueAccessor());
            }
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'elastic axises':{
    topic: function() {
        countryDimension.filter("CA");
        var chart = buildChart("composite-chart-elastic", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
        chart.elasticY(true).elasticX(true);
        chart.render();
        return chart;
    },
    'y axis should have adjusted combining all child charts maxs & mins': function(chart) {
        assert.equal(chart.y().domain()[1], 115);
    },
    'x domain should be set': function(chart) {
        assert.isTrue(chart.x().domain()[0].getTime() >= 1337904000000);
        assert.isTrue(chart.x().domain()[1].getTime() >= 1344556800000);
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'sub renderlet':{
    topic: function() {
        var chart = buildChart("composite-chart-sub-renderlet");
        chart.children()[0].renderlet(function(chart) {
            chart.selectAll("rect.bar").attr("width", function(d) {
                return 10;
            });
        });
        chart.redraw();
        return chart;
    },
    'sub-chart renderlet should be triggered': function(chart) {
        assert.equal(d3.select(chart.selectAll("rect")[0][0]).attr("width"), 10);
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({
    'time line composite chart': {
        topic: function() {
            var chart = buildChart("composite-chart-rerender");
            chart.render();
            dc.renderAll();
            return chart;
        },
        'separate g should be created for each sub chart': function(chart) {
            assert.lengthOf(chart.selectAll("g.sub")[0], 3);
        },
        'sub line chart path generation': function(chart) {
            chart.selectAll("g.sub path.line").each(function(d, i) {
                switch (i) {
                    case 0:
                        assert.equal(d3.select(this).attr("d"), "M24.137931034482758,110L91.72413793103448,108L101.37931034482757,103L202.75862068965515,108L246.20689655172413,104L395.8620689655172,105");
                        break;
                    case 1:
                        assert.equal(d3.select(this).attr("d"), "M24.137931034482758,92L91.72413793103448,82L101.37931034482757,52L202.75862068965515,91L246.20689655172413,83L395.8620689655172,75");
                        break;
                }
            });
        },
        'sub bar chart generation': function(chart) {
            assert.lengthOf(chart.selectAll("g.sub g._0 rect.bar")[0], 6);
        },
        'sub bar chart rendering': function(chart) {
            chart.selectAll("g.sub rect.bar").each(function(d, i) {
                switch (i) {
                    case 0:
                        assert.equal(d3.select(this).attr("x"), "22.637931034482758");
                        assert.equal(d3.select(this).attr("y"), "93");
                        assert.equal(d3.select(this).attr("width"), "3");
                        assert.equal(d3.select(this).attr("height"), "17");
                        break;
                    case 5:
                        assert.equal(d3.select(this).attr("x"), "394.3620689655172");
                        assert.equal(d3.select(this).attr("y"), "80");
                        assert.equal(d3.select(this).attr("width"), "3");
                        assert.equal(d3.select(this).attr("height"), "30");
                        break;
                }
            });
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
}});

suite.addBatch({'clip path':{
    topic: function() {
        var chart = buildChart("composite-chart-clip-path");
        return chart;
    },
    'only one defs should be created': function(chart) {
        assert.lengthOf(chart.selectAll("defs")[0], 1);
    },
    'only one clip path should be created': function(chart) {
        assert.lengthOf(chart.selectAll("defs clipPath")[0], 1);
    },
    'only one clip rect should be created': function(chart) {
        assert.lengthOf(chart.selectAll("defs clipPath rect")[0], 1);
    },
    'clip rect size should be correct': function(chart) {
        var rect = chart.select("defs clipPath rect");
        assert.equal(rect.attr("width"), 420);
        assert.equal(rect.attr("height"), 110);
    },
    'clip id should be correct': function(chart) {
        assert.equal(chart.select("defs clipPath").attr("id"), "composite-chart-clip-path-clip");
    },
    'chart body g should have clip path refs': function(chart) {
        chart.selectAll("g.chart-body").each(function(){
            assert.equal(d3.select(this).attr("clip-path"),"url(#composite-chart-clip-path-clip)");
        });
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.export(module);
