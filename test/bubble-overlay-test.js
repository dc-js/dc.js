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
                .point("california", 100, 120)
                .point("colorado", 100, 120)
                .point("delaware", 100, 120)
                .point("ontario", 100, 120)
                .point("mississippi", 100, 120)
                .point("oklahoma", 100, 120);
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
            assert.equal(chart.selectAll("g.bubble-overlay")[0].length, 6);
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


