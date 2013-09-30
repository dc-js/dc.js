require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Number Display');

var meanGroup = groupAll2.reduce(
    function (p, v) {
        ++p.n;
        p.tot += +v.value;
        return p;
    },
    function (p, v) {
        --p.n;
        p.tot -= +v.value;
        return p;
    },
    function () { return {n:0,tot:0}; }
);

function average(d) {
  return d.n ? d.tot / d.n : 0;
}

function buildChart(id) {
    countryDimension.filter("CA");
    var chart = dc.numberDisplay(id)
        .transitionDuration(0)
        .group(meanGroup)
        .formatNumber(d3.format(".3s"))
        .valueAccessor(average);
    chart.render();
    d3.timer.flush();
    return chart;
}

suite.addBatch({
    'Empty Div': {
        topic: function() {
            d3.select("body").append("div").attr("id","empty-div");
            return buildChart("#empty-div");
        },
        'should generate something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered': function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'should return a value': function(chart) {
            assert.equal(chart.value(), "38.5");
        },
        'should have text value in child': function(chart) {
            assert.equal(chart.select("span.number-display").text(), "38.5");
        },
        'redraw':{
            topic: function(chart) {
                resetAllFilters();
                chart.redraw();
                d3.timer.flush();
                return chart;
            },
            'should update value': function(chart) {
                assert.equal(chart.select("span.number-display").text(), "41.8");
            }
        },
        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    },
    'Div with embedded span': {
        topic: function() {
            var div = d3.select("body").append("div").attr("id","full-div");
            var p = div.append("p").html("There are <span class=\"number-display\">_</span> Total Widgets.");
            return buildChart("#full-div");
        },
        'should have text value in child': function(chart) {
            assert.equal(chart.root().text(), "There are 38.5 Total Widgets.");
        },
        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    },
    'Inline nonspan element' : {
        topic: function() {
            var div = d3.select("body").append("div").attr("id","section");
            div.append("p").html("There are <em id=\"nonspan\"></em> Total Widgets.");
            return buildChart("#nonspan");
        },
        'should have text value in child': function(chart) {
            assert.equal(d3.select("body").select("#section").html(),
                '<p>There are <em id="nonspan" class="dc-chart"><span class="number-display">38.5</span></em> Total Widgets.</p>');
        },
        'teardown': function() {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);

