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
                .dimension(stateDimension)
                .group(stateValueSumGroup)
                .transitionDuration(0)
                .title(function(d){return "Title: " + d.key;})
                .r(d3.scale.linear().domain([0, 500]))
                .colors(['blue'])
                .point("California", 100, 120)
                .point("Colorado", 300, 120)
                .point("Delaware", 500, 220)
                .point("Ontario", 180, 90)
                .point("Mississippi", 120, 220)
                .point("Oklahoma", 200, 350);
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
            assert.lengthOf(chart.selectAll("g.node")[0], 6);
        },
        'correct class name for overlay g should be generated':function(chart){
            assert.equal(d3.select(chart.selectAll("g.node")[0][0]).attr("class"), "node california");
            assert.equal(d3.select(chart.selectAll("g.node")[0][3]).attr("class"), "node ontario");
        },
        'correct number of overlay bubble should be generated':function(chart){
            assert.lengthOf(chart.selectAll("circle.bubble")[0], 6);
        },
        'correct translate for overlay g should be generated':function(chart){
            assert.equal(d3.select(chart.selectAll("g.node")[0][0]).attr("transform"), "translate(100,120)");
            assert.equal(d3.select(chart.selectAll("g.node")[0][3]).attr("transform"), "translate(180,90)");
        },
        'correct translate for circle should be generated':function(chart){
            assert.equal(d3.select(chart.selectAll("circle.bubble")[0][0]).attr("r"), "25.4");
            assert.equal(d3.select(chart.selectAll("circle.bubble")[0][3]).attr("r"), "17.7");
        },
        'correct label should be generated':function(chart){
            assert.equal(d3.select(chart.selectAll("g.node text")[0][0]).text(), "California");
            assert.equal(d3.select(chart.selectAll("g.node text")[0][3]).text(), "Ontario");
        },
        'label should only be generated once':function(chart){
            chart.redraw();
            assert.lengthOf(chart.selectAll("g.node text")[0], 6);
        },
        'correct title should be generated':function(chart){
            assert.equal(d3.select(chart.selectAll("g.node title")[0][0]).text(), "Title: California");
            assert.equal(d3.select(chart.selectAll("g.node title")[0][3]).text(), "Title: Ontario");
        },
        'title should only be generated once':function(chart){
            chart.redraw();
            assert.lengthOf(chart.selectAll("g.node title")[0], 6);
        },
        'correct color for circle should be filled':function(chart){
            assert.equal(d3.select(chart.selectAll("circle.bubble")[0][0]).attr("fill"), "blue");
            assert.equal(d3.select(chart.selectAll("circle.bubble")[0][3]).attr("fill"), "blue");
        },
        'correct bubble should be highlighted when filter is active':function(chart){
            chart.filter("Colorado");
            chart.filter("California");
            chart.redraw();
            assert.equal(d3.select(chart.selectAll("g.node")[0][0]).attr("class"), "node california selected");
            assert.equal(d3.select(chart.selectAll("g.node")[0][1]).attr("class"), "node colorado selected");
            assert.equal(d3.select(chart.selectAll("g.node")[0][3]).attr("class"), "node ontario deselected");
        },

        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);


