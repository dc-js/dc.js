require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

var width = 200;
var height = 200;
var radius = 100;

suite.addBatch({
    'creation by selector': {
        topic: function () {
            d3.select("body").append("div").attr("id", "pie-chart");
            return dc.createPieChart("#pie-chart");
        },
        'we get something': function(pieChart) {
            assert.isNotNull(pieChart);
        },
        'we get pie chart instance': function (pieChart) {
            assert.isTrue(pieChart instanceof dc.PieChart);
        },
        'svg should be created': function(pieChart){
            assert.isFalse(pieChart.select("svg").empty());
        }
    },
    'dimensional slice generation by groups': {
        topic: function(){
            d3.select("body").append("div").attr("id", "pie-chart");
            var chart = dc.createPieChart("#pie-chart");
            chart.dimension(ageDimension).group(ageGroup)
                .width(width).height(height).radius(radius);
            chart.render();
            return chart;
        },
        'dimension should be set': function(pieChart){
            assert.equal(pieChart.dimension(), ageDimension);
        },
        'group should be set': function(pieChart){
            assert.equal(pieChart.group(), ageGroup);
        },
        'width should be set': function(pieChart){
            assert.equal(pieChart.width(), width);
        },
        'height should be set': function(pieChart){
            assert.equal(pieChart.height(), height);
        },
        'radius should be set': function(pieChart){
            assert.equal(pieChart.radius(), radius);
        },
        'height should be used for svg': function(pieChart){
            assert.equal(pieChart.select("svg").attr("height"), height);
        },
        'root g should be created': function(pieChart){
            assert.isFalse(pieChart.select("svg g").empty());
        },
        'root g should be created': function(pieChart){
            assert.isFalse(pieChart.select("svg g").empty());
        },
        'root g should be translated to center': function(pieChart){
            assert.equal(pieChart.select("svg g").attr("transform"), "translate(100,100)");
        },
        'slice g should be created with class': function(pieChart){
            assert.equal(pieChart.selectAll("svg g g.pie-slice").data().length, 2);
        }
    }
});

suite.export(module);


