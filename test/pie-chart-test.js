require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 200;
var height = 200;
var radius = 100;
var innerRadius = 30;

suite.addBatch({
    'pie chart generation': {
        topic: function() {
            d3.select("body").append("div").attr("id", "pie-chart-age")
                .append("a").attr("class", "reset").style("display", "none");
            var chart = dc.pieChart("#pie-chart-age");
            chart.dimension(valueDimension).group(valueGroup)
                .width(width)
                .height(height)
                .radius(radius)
                .innerRadius(innerRadius)
                .transitionDuration(0);
            chart.render();
            return chart;
        },
        'we get something': function(pieChart) {
            assert.isNotNull(pieChart);
        },
        'inner radius can be set': function(chart) {
            assert.equal(chart.innerRadius(), innerRadius);
        },
        'svg should be created': function(pieChart) {
            assert.isFalse(pieChart.select("svg").empty());
        },
        'default color scheme should be created': function(pieChart) {
            assert.isTrue(pieChart.colors().length > 0);
        },
        'dimension should be set': function(pieChart) {
            assert.equal(pieChart.dimension(), valueDimension);
        },
        'group should be set': function(pieChart) {
            assert.equal(pieChart.group(), valueGroup);
        },
        'width should be set': function(pieChart) {
            assert.equal(pieChart.width(), width);
        },
        'height should be set': function(pieChart) {
            assert.equal(pieChart.height(), height);
        },
        'radius should be set': function(pieChart) {
            assert.equal(pieChart.radius(), radius);
        },
        'height should be used for svg': function(pieChart) {
            assert.equal(pieChart.select("svg").attr("height"), height);
        },
        'root g should be created': function(pieChart) {
            assert.isFalse(pieChart.select("svg g").empty());
        },
        'root g should be translated to center': function(pieChart) {
            assert.equal(pieChart.select("svg g").attr("transform"), "translate(100,100)");
        },
        'slice g should be created with class': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice").data().length, 5);
        },
        'slice path should be created': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice path").data().length, 5);
        },
        'slice path should be filled': function(pieChart) {
            pieChart.selectAll("svg g g.pie-slice path").each(function(p) {
                assert.isTrue(d3.select(this).attr("fill") != "");
            });
        },
        'slice path d should be created': function(pieChart) {
            pieChart.selectAll("svg g g.pie-slice path").each(function(p) {
                assert.isTrue(d3.select(this).attr("d") != "");
            });
        },
        'slice label should be created': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice text").data().length, 5);
        },
        'slice label transform to centroid': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice text").attr("transform"), "translate(52.58610463437159,-38.20604139901075)");
        },
        'slice label text should be set': function(pieChart) {
            pieChart.selectAll("svg g g.pie-slice text").call(function(p) {
                assert.equal(p.text(), p.datum().data.key);
            });
        },
        'slice label should be middle anchored': function(pieChart) {
            pieChart.selectAll("svg g g.pie-slice text").each(function(p) {
                assert.equal(d3.select(this).attr("text-anchor"), "middle");
            });
        },
        'reset link hidden after init rendering': function(chart) {
            assert.equal(chart.select("a.reset").style("display"), "none");
        },
        're-render' : {
            topic: function(pieChart) {
                pieChart.render();
                return pieChart;
            },
            'multiple invocation of render should update chart': function(pieChart) {
                assert.equal(jQuery("#pie-chart-age svg").length, 1);
            }
        },
        'filter' : {
            topic: function(pieChart) {
                regionDimension.filter("East");
                pieChart.render();
                return pieChart;
            },
            'label should be hidden if filtered out': function(pieChart) {
                assert.equal(pieChart.selectAll("svg g g.pie-slice text").text(), "");
            },
            teardown: function() {
                resetAllFilters();
            }
        },
        'n/a filter' : {
            topic: function(pieChart) {
                statusDimension.filter("E");
                pieChart.render();
                return pieChart;
            },
            'NaN centroid should be handled properly': function(pieChart) {
                assert.equal(pieChart.selectAll("svg g g.pie-slice text").attr("transform"), "translate(0,0)");
            },
            teardown: function() {
                resetAllFilters();
            }
        },
        'slice selection' :{
            topic: function(pieChart) {
                resetAllFilters();
                return pieChart;
            },
            'on click function should be defined': function(pieChart) {
                assert.isFalse(pieChart.selectAll("svg g g.pie-slice path").on("click") == undefined);
            },
            'by default no slice should be selected': function(pieChart) {
                assert.isFalse(pieChart.hasFilter());
            },
            'be able to set selected slice': function(pieChart) {
                assert.equal(pieChart.filter("66").filter(), "66");
                assert.isTrue(pieChart.hasFilter());
                pieChart.filterAll();
            },
            'should filter dimension by selection': function(pieChart) {
                pieChart.filter("66");
                assert.equal(pieChart.dimension().top(Infinity).length, 1);
                pieChart.filterAll();
            },
            'should highlight selected slice': function(pieChart) {
                pieChart.filter("66");
                pieChart.render();
                pieChart.selectAll(".pie-slice path").each(function(d) {
                    if (d.data.key == "66")
                        assert.equal(d3.select(this).attr("fill-opacity"), 1);
                    else
                        assert.isTrue(d3.select(this).attr("fill-opacity") < 1);
                });
                pieChart.filterAll();
            },
            'reset link generated after slice selection': function(chart) {
                chart.filter("66");
                assert.isEmpty(chart.select("a.reset").style("display"));
            },
            'should remove highlight if no slice selected': function(pieChart) {
                pieChart.filterAll();
                pieChart.redraw();
                pieChart.selectAll(".pie-slice path").each(function(d) {
                    assert.equal(d3.select(this).attr("fill-opacity"), "1");
                });
            },
            teardown: function(pieChart) {
                resetAllFilters();
            }
        },
        'group order': {
            topic: function(chart) {
                return chart;
            },
            'group should be order': function(chart) {
                var group = chart.orderedGroup().top(Infinity);
                countryDimension.filter("US");
                var group2 = chart.orderedGroup().top(Infinity);
                assert.equal(group2[0].key, group[0].key);
            }
        }
    },

    'redraw after empty selection' :{
        topic: function() {
            d3.select("body").append("div").attr("id", "pie-chart-2");
            var chart = dc.pieChart("#pie-chart-2");
            chart.dimension(valueDimension).group(valueGroup)
                .transitionDuration(0)
                .width(width)
                .height(height)
                .radius(radius);
            chart.render();
            dateDimension.filter([new Date(2010, 0, 1), new Date(2010, 0, 3)]);
            chart.redraw()
            dateDimension.filter([new Date(2012, 0, 1), new Date(2012, 11, 30)]);
            chart.redraw();
            return chart;
        },
        'pie chart should be restored': function(chart) {
            chart.selectAll("g.pie-slice path").each(function(p) {
                assert.isTrue(d3.select(this).attr("d").indexOf("NaN") < 0);
            });
        },
        teardown:function(chart) {
            resetAllFilters();
        }
    }
});

suite.export(module);


