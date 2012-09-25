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
        topic: function() {
            var chart = buildChart("pie-chart-age");
            chart.innerRadius(innerRadius);
            chart.render();
            return chart;
        },
        'we get something': function(pieChart) {
            assert.isNotNull(pieChart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'dc-chart class should be turned on for parent div': function(chart){
            assert.equal(jQuery("#pie-chart-age").attr("class"), "dc-chart");
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
        'slice css class should be numbered with index': function(pieChart) {
            pieChart.selectAll("g.pie-slice").each(function(p, i) {
                assert.equal(d3.select(this).attr("class"), "pie-slice " + i);
            });
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
        'slice path fill should be set correctly': function(pieChart) {
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][0]).attr("fill"), "#3182bd");
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][1]).attr("fill"), "#6baed6");
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][2]).attr("fill"), "#9ecae1");
            assert.equal(d3.select(pieChart.selectAll("g.pie-slice path")[0][3]).attr("fill"), "#c6dbef");
        },
        'slice label should be created': function(pieChart) {
            assert.equal(pieChart.selectAll("svg text.pie-slice").data().length, 5);
        },
        'slice label transform to centroid': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g text.pie-slice").attr("transform"), "translate(52.58610463437159,-38.20604139901075)");
        },
        'slice label text should be set': function(pieChart) {
            pieChart.selectAll("svg g text.pie-slice").call(function(p) {
                assert.equal(p.text(), p.datum().data.key);
            });
        },
        'slice label should be middle anchored': function(pieChart) {
            pieChart.selectAll("svg g text.pie-slice").each(function(p) {
                assert.equal(d3.select(this).attr("text-anchor"), "middle");
            });
        },
        'reset link hidden after init rendering': function(chart) {
            assert.equal(chart.select("a.reset").style("display"), "none");
        },
        'filter printer should be set': function(chart){
            assert.isNotNull(chart.filterPrinter());
        },
        'filter info should be hidden after init rendering': function(chart) {
            assert.equal(chart.select("span.filter").style("display"), "none");
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
                assert.equal(pieChart.selectAll("svg g text.pie-slice").text(), "");
            },
            teardown: function() {
                resetAllFilters();
                resetBody();
            }
        },
        'n/a filter' : {
            topic: function(pieChart) {
                statusDimension.filter("E");
                pieChart.render();
                return pieChart;
            },
            'NaN centroid should be handled properly': function(pieChart) {
                assert.equal(pieChart.selectAll("svg g text.pie-slice").attr("transform"), "translate(0,0)");
            },
            teardown: function() {
                resetAllFilters();
                resetBody();
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
                pieChart.selectAll("g.pie-slice").each(function(d) {
                    if (d.data.key == "66")
                        assert.isTrue(d3.select(this).attr("class").indexOf("selected") > 0);
                    else
                        assert.isTrue(d3.select(this).attr("class").indexOf("deselected") > 0);
                });
                pieChart.filterAll();
            },
            'reset link generated after slice selection': function(chart) {
                chart.filter("66");
                assert.isEmpty(chart.select("a.reset").style("display"));
            },
            'filter info generated after slice selection': function(chart) {
                chart.filter("66");
                assert.isEmpty(chart.select("span.filter").style("display"));
                assert.equal(chart.select("span.filter").text(), "66");
            },
            'should remove highlight if no slice selected': function(pieChart) {
                pieChart.filterAll();
                pieChart.redraw();
                pieChart.selectAll(".pie-slice path").each(function(d) {
                    assert.equal(d3.select(this).attr("class"), "");
                });
            },
            teardown: function(pieChart) {
                resetAllFilters();
                resetBody();
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
            var chart = buildChart("pie-chart2");
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
            resetBody();
        }
    },

    'custom label & title generation' :{
        topic: function() {
            var chart = buildChart("pie-chart3");
            chart.label(function(d) {
                    return "custom";
                })
                .title(function(d) {
                    return "custom";
                })
                .minAngelForLabel(1)
                .renderTitle(true);
            chart.render();
            return chart;
        },
        'should render correct number of text': function(chart) {
            assert.equal(chart.selectAll("text.pie-slice")[0].length, 5);
        },
        'custom function should be used to dynamically generate label': function(chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][0]).text(), "custom");
        },
        'label should not be generated if the slice is too small': function(chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][1]).text(), "");
        },
        'should render correct number of title': function(chart) {
            assert.equal(chart.selectAll("g.pie-slice title")[0].length, 5);
        },
        'custom function should be used to dynamically generate title': function(chart) {
            chart.selectAll("g.pie-slice title").each(function(p) {
                assert.equal(d3.select(this).text(), "custom");
            });
        },
        teardown:function(chart) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'pie chart wo/ label': {
        topic: function() {
            var chart = buildChart("pie-chart4");
            chart.innerRadius(innerRadius);
            chart.renderLabel(false);
            chart.render();
            return chart;
        },
        'slice label should not be created': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g text.pie-slice").data().length, 0);
        },
        teardown:function(chart) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'renderlet':{
        topic:function(){
            var chart = buildChart("chart-renderlet");
            chart.renderlet(function(chart){chart.selectAll("path").attr("fill", "red");});
            return chart;
        },
        'custom renderlet should be invoked with render': function(chart){
            chart.render();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        'custom renderlet should be invoked with redraw': function(chart){
            chart.redraw();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'pie chart label and title w/ value accessor': {
        topic: function() {
            var chart = buildChart("pie-chart-default-label-title");
            chart.dimension(statusGroup)
                .group(statusMultiGroup)
                .valueAccessor(function(d){return d.value.count;})
                .renderLabel(true).renderTitle(true);
            chart.render();
            return chart;
        },
        'default function should be used to dynamically generate label': function(chart) {
            assert.equal(d3.select(chart.selectAll("text.pie-slice")[0][0]).text(), "F");
        },
        'default function should be used to dynamically generate title': function(chart) {
            assert.equal(d3.select(chart.selectAll("g.pie-slice title")[0][0]).text(), "F: 5");
        },
        teardown:function(chart) {
            resetAllFilters();
            resetBody();
        }
    }
});


suite.export(module);


