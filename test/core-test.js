require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Core');

suite.addBatch({
    'dc.version': {
        topic: function () { return dc.version },

        'has the form major.minor.patch': function (version) {
            assert.match(version, /^[0-9]+\.[0-9]+\.[0-9]+$/);
        }
    },
    'dc.charts': {
        topic: function(){
            var chart = dc.createPieChart("#id");
            sinon.spy(chart, "filterAll");
            return chart;
        },
        'should register chart object': function(chart){
            assert.isTrue(dc.hasChart(chart));
        },
        'should invoke filter on each chart': function(chart){
            dc.filterAll();
            assert.isTrue(chart.filterAll.calledOnce);
        },
        'should be gone after remove all': function(chart){
            dc.removeAllCharts();
            assert.isFalse(dc.hasChart(chart));
        },
        teardown: function(topic){dc.removeAllCharts();}
    }
});

suite.export(module);


