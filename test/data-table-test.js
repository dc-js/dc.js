require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Data table');

function buildChart(id) {
    var div = d3.select("body").append("div").attr("id", id);
    var chart = dc.dataTable("#" + id)
        .dimension(dateDimension)
        .group(function(d) {
            return dateFormat(d3.time.day(d.dd));
        })
        .transitionDuration(0)
        .size(3)
        .sortBy(function(d){return d.dd.getTime();})
        .columns(
        [function(d) {
            return d.id;
        }, function(d) {
            return d.status;
        }]
    );
    chart.render();
    return chart;
}

suite.addBatch({
    'creation': {
        topic: function() {
            var chart = buildChart("data-table");
            return chart;
        },
        'should generate something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'size should be set':function(chart) {
            assert.equal(chart.size(), 3);
        },
        'sortBy should be set':function(chart) {
            assert.isNotNull(chart.sortBy());
        },
        'order should be set':function(chart) {
            assert.equal(chart.order(), d3.ascending);
        },
        'should have column span set on group tr':function(chart) {
            assert.equal(chart.selectAll("tr.dc-table-group td")[0][0].getAttribute("colspan"), "2");
        },
        'should have id column created':function(chart) {
            assert.equal(chart.selectAll("td._0")[0][0].innerHTML, 8);
            assert.equal(chart.selectAll("td._0")[0][1].innerHTML, 3);
            assert.equal(chart.selectAll("td._0")[0][2].innerHTML, 9);
        },
        'should have status column created':function(chart) {
            assert.equal(chart.selectAll("td._1")[0][0].innerHTML, "F");
            assert.equal(chart.selectAll("td._1")[0][1].innerHTML, "T");
            assert.equal(chart.selectAll("td._1")[0][2].innerHTML, "T");
        },
        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'external filter':{
        topic: function() {
            var chart = buildChart("data-table2");
            countryDimension.filter("CA");
            chart.redraw();
            return chart;
        },
        'should only render filtered data set': function(chart) {
            assert.lengthOf(chart.selectAll("td._0")[0], 2);
        },
        'should render the correctly filtered records': function(chart) {
            assert.equal(chart.selectAll("td._0")[0][0].innerHTML, 5);
            assert.equal(chart.selectAll("td._0")[0][1].innerHTML, 7);
        },
        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'renderlet':{
        topic:function() {
            var chart = buildChart("chart-renderlet");
            chart.renderlet(function(chart) {
                chart.selectAll("td.dc-table-label").text("changed");
            });
            return chart;
        },
        'custom renderlet should be invoked with render': function(chart) {
            chart.render();
            assert.equal(chart.selectAll("td.dc-table-label").text(), "changed");
        },
        'custom renderlet should be invoked with redraw': function(chart) {
            chart.redraw();
            assert.equal(chart.selectAll("td.dc-table-label").text(), "changed");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);


