require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Bubble overlay chart');


suite.addBatch({
    'creation': {
        topic: function() {
            var id = "bubble-overlay";
            var div = d3.select("body").append("div").attr("id", id);
            var svg = div.append("svg");
            var chart = dc.bubbleOverlay("#" + id)
                .svg(svg)
                .dimension(regionDimension)
                .group(regionGroup)
                .point("California", 100, 120)
                .point("Colorado", 100, 120)
                .point("Delaware", 100, 120)
                .point("Ontario", 100, 120)
                .point("Mississippi", 100, 120)
                .point("Oklahoma", 100, 120);
            chart.render();
            return chart;
        },
        'an instance of dc chart should be generated':function(chart){
            assert.isTrue(dc.instanceOfChart(chart));
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'correct number of overlay g should be generated':function(chart){
            assert.equal(chart.selectAll("g.node")[0].length, 6);
        },
        'correct class name for overlay g should be generated':function(chart){
            assert.equal(d3.select(chart.selectAll("g.node")[0][0]).attr("class"), "node california");
            assert.equal(d3.select(chart.selectAll("g.node")[0][3]).attr("class"), "node ontario");
        },
        'correct number of overlay bubble should be generated':function(chart){
            assert.equal(chart.selectAll("circle.bubble")[0].length, 6);
        },

        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);


