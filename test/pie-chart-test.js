require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 200;
var height = 200;
var radius = 100;

suite.addBatch({
    'pie chart generation': {
        topic: function() {
            d3.select("body").append("div").attr("id", "pie-chart-age");
            var chart = dc.createPieChart("#pie-chart-age");
            chart.dimension(valueDimension).group(valueGroup)
                .width(width).height(height).radius(radius);
            chart.render();
            return chart;
        },
        'we get something': function(pieChart) {
            assert.isNotNull(pieChart);
        },
        'we get pie chart instance': function (pieChart) {
            assert.isTrue(pieChart instanceof dc.PieChart);
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
            pieChart.selectAll("svg g g.pie-slice path").call(function(p) {
                assert.isTrue(p.attr("fill") != "");
            });
        },
        'slice path d should be created': function(pieChart) {
            pieChart.selectAll("svg g g.pie-slice path").call(function(p) {
                assert.isTrue(p.attr("d") != "");
            });
        },
        'slice label should be created': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice text").data().length, 5);
        },
        'slice label transform to centroid': function(pieChart) {
            assert.equal(pieChart.selectAll("svg g g.pie-slice text").attr("transform"), "translate(29.389262614623657,40.45084971874737)");
        },
        'slice label text should be set': function(pieChart) {
            pieChart.selectAll("svg g g.pie-slice text").call(function(p) {
                assert.equal(p.text(), p.datum().data.key);
            });
        },
        'slice label should be middle anchored': function(pieChart) {
            pieChart.selectAll("svg g g.pie-slice text").call(function(p) {
                assert.equal(p.attr("text-anchor"), "middle");
            });
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
            }
        },
        'slice selection' :{
            topic: function(pieChart){
                filterAll();
                return pieChart;
            },
            'on click function should be defined': function(pieChart){
                assert.isFalse(pieChart.selectAll("svg g g.pie-slice path").on("click") == undefined);
            },
            'by default no slice should be selected': function(pieChart){
                assert.isFalse(pieChart.hasSliceSelection());
            },
            'be able to set selected slice': function(pieChart){
                assert.equal(pieChart.selectSlice("66").selectSlice(), "66");
                assert.isTrue(pieChart.hasSliceSelection());
            },
            'should filter dimension by selection': function(pieChart){
                console.log(pieChart.dimension().top(Infinity).length);
                pieChart.selectSlice("66");
                console.log(pieChart.dimension().top(Infinity).length);
                assert.equal(pieChart.dimension().top(Infinity).length, 1);
            }
        }
    }
});

suite.export(module);


