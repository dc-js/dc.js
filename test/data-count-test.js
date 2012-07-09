require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Data count');

suite.addBatch({
    'creation': {
        topic: function() {
            var div = d3.select("body").append("div").attr("id", "data-count");
            div.append("span").attr("class", "filter-count");
            div.append("span").attr("class", "total-count");
            var chart = dc.dataCount("#data-count")
                .dimension(data)
                .group(groupAll);
            chart.render();
            return chart;
        },
        'should generate something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart){
            assert.isTrue(dc.hasChart(chart));
        },
        'should fill in the total count': function(chart) {
            assert.equal(chart.select("span.total-count").text(), "10");
        }
    }
});

suite.export(module);


