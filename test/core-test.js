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
    'dc.createChart': {
        topic: function(){
            var chart = dc.createPieChart("#id");
            return dc.hasChart(chart);
        },
        'should register chart object': function(hasChart){
            assert.equal(hasChart, true);
        }
    }
});

suite.export(module);


