require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Composite chart');

var width = 500;
var height = 150;

function buildChart(id, xdomain) {
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
        dc.barChart(chart).group(dateValueSumGroup),
        dc.lineChart(chart).stack(dateValueSumGroup).stack(dateValueSumGroup),
        dc.lineChart(chart).group(dateGroup)
    ]);
    chart.render();
    return chart;
}

suite.addBatch({
    'time line composite chart': {
        topic: function() {
            var chart = buildChart("compositeChart", [new Date(2012, 4, 20), new Date(2012, 7, 15)]);
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
            assert.isTrue(chart.x() != undefined);
        },
        'x range round is auto calculated based on width': function(chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 430);
        },
        'x domain should be set': function(chart) {
            assert.equal(chart.x().domain()[0].getTime(), new Date(2012, 4, 20).getTime());
            assert.equal(chart.x().domain()[1].getTime(), new Date(2012, 7, 15).getTime());
        },
        'y can be set': function(chart) {
            assert.isTrue(chart.y() != undefined);
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
        'root g should be translated to left corner': function(chart) {
            assert.equal(chart.select("svg g").attr("transform"), "translate(20,10)");
        },
        'axis x should be placed at the bottom': function(chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(20,120)");
        },
        'axis y should be placed on the left': function(chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(20,10)");
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
            chart.round(d3.time.day.round);
            assert.isNotNull(chart.round());
        },
        'separate g should be created for each sub chart': function(chart) {
            assert.equal(chart.selectAll("g.sub")[0].length, 3);
        },
        'sub line chart path generation': function(chart) {
            chart.selectAll("g.sub path.line").each(function(d, i) {
                switch (i) {
                    case 0:
                        assert.equal(d3.select(this).attr("d"), "M44.712643678160916,119L113.90804597701148,118L123.79310344827586,113L227.58620689655172,118L272.0689655172414,114L425.28735632183907,115");
                        break;
                    case 1:
                        assert.equal(d3.select(this).attr("d"), "M44.712643678160916,103L113.90804597701148,93L123.79310344827586,62L227.58620689655172,102L272.0689655172414,93L425.28735632183907,86");
                        break;
                }
            });
        },
        'sub bar chart generation': function(chart) {
            assert.equal(chart.selectAll("g.sub rect.stack0")[0].length, 6);
        },
        'sub bar chart rendering': function(chart) {
            chart.selectAll("g.sub rect.bar").each(function(d, i) {
                switch (i) {
                    case 0:
                        assert.equal(d3.select(this).attr("x"), "42.712643678160916");
                        assert.equal(d3.select(this).attr("y"), "103");
                        assert.equal(d3.select(this).attr("width"), "4");
                        assert.equal(d3.select(this).attr("height"), "16");
                        break;
                    case 5:
                        assert.equal(d3.select(this).attr("x"), "423.28735632183907");
                        assert.equal(d3.select(this).attr("y"), "90");
                        assert.equal(d3.select(this).attr("width"), "4");
                        assert.equal(d3.select(this).attr("height"), "29");
                        break;
                }
            });
        },
        'with brush': {
            'be positioned with offset (left margin)': function(chart) {
                assert.equal(chart.select("g.brush").attr("transform"), "translate(" + chart.margins().left + ",0)");
            },
            'brush fancy resize handle should be created': function(chart) {
                chart.select("g.brush").selectAll(".resize path").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).attr("d"), "M0.5,40A6,6 0 0 1 6.5,46V74A6,6 0 0 1 0.5,80ZM2.5,48V72M4.5,48V72");
                    else
                        assert.equal(d3.select(this).attr("d"), "M-0.5,40A6,6 0 0 0 -6.5,46V74A6,6 0 0 0 -0.5,80ZM-2.5,48V72M-4.5,48V72");
                });
            },
            'background should be stretched': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("width"), 430);
            },
            'background height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("height"), 120);
            },
            'extent height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("height"), 120);
            },
            'extent width should be set based on filter set': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 143);
            },
            'filterd bars should be faded into background': function(chart) {
                assert.equal(chart.selectAll("g.sub rect.deselected")[0].length, 4);
            },
            'after reset all bars should be pushed to foreground': function(chart) {
                chart.filterAll();
                chart.redraw();
                chart.selectAll("g rect.bar").each(function(d) {
                    assert.equal(d3.select(this).attr("class"), "bar stack0");
                });
            },
            'x value should have default impl': function(chart) {
                assert.isNotNull(chart.keyRetriever());
            },
            'y value should have default impl': function(chart) {
                assert.isNotNull(chart.valueRetriever());
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
        var chart = buildChart("compositeChart2", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
        chart.elasticY(true).elasticX(true);
        chart.render();
        return chart;
    },
    'y axis should have adjusted combining all child charts maxs & mins': function(chart) {
        assert.equal(chart.y().domain()[1], 117);
    },
    'x domain should be set': function(chart) {
        assert.equal(chart.x().domain()[0].getTime(), new Date("Fri, 25 May 2012 04:00:00 GMT").getTime());
        assert.equal(chart.x().domain()[1].getTime(), new Date("Fri, 10 Aug 2012 04:00:00 GMT").getTime());
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.export(module);
