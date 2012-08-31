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
                .group(regionGroup);
            chart.render();
            return chart;
        },
        'an instance of dc chart should be generated':function(chart){
            assert.isTrue(dc.instanceOfChart(chart));
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },

        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);


