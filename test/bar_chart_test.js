require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bar chart');

suite.addBatch({
    'creation by selector': {
        topic: function () {
            d3.select("body").append("div").attr("id", "barchart");
            return dc.createBarChart("#barchart");
        },
        'we get something': function(barChart) {
            assert.isNotNull(barChart);
        },
        'we get barchart instance': function (barChart) {
            assert.isTrue(barChart instanceof dc.BarChart);
        },

        'selector should be set': function(barChart){
            assert.equal("#barchart", barChart.getSelector());
        },
        'svg should be created': function(barChart){
            assert.isFalse(d3.select("#barchart").select("svg").empty());
        }
    },
    'dimensional slice generation by groups': {
        topic: function(){
            d3.select("body").append("div").attr("id", "barchart");
            var ageDimension = data.dimension(function(d){return d.gender;});
            var ageGroup = ageDimension.group();
            var chart = dc.createBarChart("#barchart");
            chart.dimension(ageDimension).group(ageGroup);
            return chart;
        },

        'root g should be created': function(barChart){
            assert.isFalse(d3.select("#barchart").select("svg").select("g").empty());
        }
    }
});

suite.export(module);


