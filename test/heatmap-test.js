require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Heat Map');

var width = 210;
var height = 210;

function buildChart(id) {
    d3.select("body").append("div").attr("id", id);

    var chart = dc.heatMap("#" + id);
    chart
        .dimension(dimensionColorData)
        .group(groupColorData)
        .keyAccessor(function(d) { return d.key[0]; })
        .valueAccessor(function(d) { return d.key[1]; })
        .colorAccessor(function(d) { return d.value; })
        .colors(["#000001", "#000002", "#000003", "#000004"])
        .title(function(d) {return d.key + ": " + d.value; })
        .height(height)
        .width(width)
        .transitionDuration(0)
        .margins({top: 5, right: 5, bottom: 5, left: 5})
        .calculateColorDomain();

    chart.render();

    return chart;
}

suite.addBatch({
    'render': {
        topic: function () {
            return buildChart("heat-map-new");
        },

        'should create svg': function (chart) {
            assert.isNotNull(chart.svg());
        },

        'should transform the graph position using the graph margins': function (chart) {
            assert.equal(chart.select("g.heatmap").attr("transform"), "translate(5,5)");
        },

        'should position heatboxes in a matrix': function (chart) {
            var heatBoxes = chart.selectAll("rect.heat-box");
            assert.equal(heatBoxes[0][0].getAttribute("x"), "0");
            assert.equal(heatBoxes[0][0].getAttribute("y"), "100");

            assert.equal(heatBoxes[0][1].getAttribute("x"), "0");
            assert.equal(heatBoxes[0][1].getAttribute("y"), "0");

            assert.equal(heatBoxes[0][2].getAttribute("x"), "100");
            assert.equal(heatBoxes[0][2].getAttribute("y"), "100");

            assert.equal(heatBoxes[0][3].getAttribute("x"), "100");
            assert.equal(heatBoxes[0][3].getAttribute("y"), "0");
        },

        'should color heatboxes using the provided colors option': function (chart) {
            var heatBoxes = chart.selectAll("rect.heat-box");

            assert.equal(heatBoxes[0][0].getAttribute("fill"), "#000001");
            assert.equal(heatBoxes[0][1].getAttribute("fill"), "#000002");
            assert.equal(heatBoxes[0][2].getAttribute("fill"), "#000003");
            assert.equal(heatBoxes[0][3].getAttribute("fill"), "#000004");
        },

        'should size heatboxes based on the size of the matrix': function (chart) {
            chart.selectAll("rect.heat-box")[0].forEach(function(box) {
               assert.equal(box.getAttribute("height"), 100);
               assert.equal(box.getAttribute("width"), 100);
            });
        },

        'should round the corners of the boxes based on the box widths': function (chart) {
            chart.selectAll("rect.heat-box")[0].forEach(function(box) {
                assert.equal(box.getAttribute("rx"), 15);
                assert.equal(box.getAttribute("ry"), 15);
            });
        },

        'should position the y-axis labels with their associated rows': function(chart) {
            var yaxisTexts = chart.selectAll(".rows.axis text");
            assert.equal(yaxisTexts[0][0].getAttribute("y"), "150");
            assert.equal(yaxisTexts[0][0].getAttribute("x"), "0");
            assert.equal(yaxisTexts[0][1].getAttribute("y"), "50");
            assert.equal(yaxisTexts[0][1].getAttribute("x"), "0");
        },

        'should have labels on the y-axis corresponding to the row values': function(chart) {
            var yaxisTexts = chart.selectAll(".rows.axis text");
            assert.equal(yaxisTexts[0][0].textContent, 1);
            assert.equal(yaxisTexts[0][1].textContent, 2);
        },

        'should position the x-axis labels with their associated columns': function(chart) {
            var xaxisTexts = chart.selectAll(".cols.axis text");
            assert.equal(xaxisTexts[0][0].getAttribute("y"), "200");
            assert.equal(xaxisTexts[0][0].getAttribute("x"), "50");
            assert.equal(xaxisTexts[0][1].getAttribute("y"), "200");
            assert.equal(xaxisTexts[0][1].getAttribute("x"), "150");
        },

        'should have labels on the x-axis corresponding to the row values': function(chart) {
            var xaxisTexts = chart.selectAll(".cols.axis text");
            assert.equal(xaxisTexts[0][0].textContent, 1);
            assert.equal(xaxisTexts[0][1].textContent, 2);
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'filters': {
        topic: function () {
            return buildChart("heat-map-new");
        },
        'clicking on a cell toggles a filter for the key': function (chart) {
            chart.selectAll("#heat-map-new .box-group").each( function(d,i) {
                var cell = d3.select(this).select("rect");
                cell.on("click")(d);
                assert.isTrue(chart.hasFilter(d.key));
                cell.on("click")(d);
                assert.isFalse(chart.hasFilter(d.key));
            });
        },
        'when the key is filtered, cells have appropriate class': function (chart) {
            var filterValue = Math.ceil(Math.random() * 2);
            chart.filter(filterValue).render();
            chart.selectAll("#heat-map-new .box-group").each( function(d,i) {
                var cell = d3.select(this);
                assert.equal(cell.classed("selected"), chart.hasFilter(d.key));
                assert.equal(cell.classed("deselected"), !chart.hasFilter(d.key));
            });
            chart.filter(filterValue).render();
        }
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.export(module);
