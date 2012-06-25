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
            assert.equal(ageDimension, pieChart.dimension());
        },
        'group should be set': function(pieChart){
            assert.equal(ageGroup, pieChart.group());
        },
        'width should be set': function(pieChart){
            assert.equal(width, pieChart.width());
        },
        'height should be set': function(pieChart){
            assert.equal(height, pieChart.height());
        },
        'radius should be set': function(pieChart){
            assert.equal(radius, pieChart.radius());
        },
        'height should be used for svg': function(pieChart){
            assert.equal(height, pieChart.select("svg").attr("height"));
        },
        'root g should be created': function(pieChart){
            assert.isFalse(pieChart.select("svg g").empty());
        },
        'root g should be created': function(pieChart){
            assert.isFalse(pieChart.select("svg g").empty());
        },
        'root g should be translated to center': function(pieChart){
            assert.equal("translate(100,100)", pieChart.select("svg g").attr("transform"));
        }
    }
});

suite.export(module);


