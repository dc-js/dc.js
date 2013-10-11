require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Color Chart');

function colorTest(t) {
    t.chart.colorDomain(t.domain);
    var test = t.test || t.domain;
    return test.map(t.chart.getColor);
}

function identity(d) { return d; }

suite.addBatch({
    'with ordinal domain' : {
        topic: function () {
            var chart = dc.colorChart({});
            chart.colorAccessor(identity);
            return {chart:chart,domain:["a","b","c","d","e"]};
        },
        'default' : function (t) {
            assert.deepEqual(colorTest(t),['#3182bd','#6baed6','#9ecae1','#c6dbef','#e6550d']);
        },
        'custom' : function (t) {
            t.chart.colors(d3.scale.category10());
            assert.deepEqual(colorTest(t),['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd']);
        },
        'ordinal' : function (t) {
            t.chart.ordinalColors(['red','green','blue']);
            assert.deepEqual(colorTest(t),['red','green','blue','red','green']);
        },
        'linear' : function (t) {
            t.chart.linearColors(['#FF0000','#00FF00']);
            assert.deepEqual(colorTest(t),[ '#NaNNaNNaN', '#NaNNaNNaN', '#NaNNaNNaN', '#NaNNaNNaN', '#NaNNaNNaN' ]);
        }
    },
    'with numeric domain' : {
        topic: function () {
            var chart = dc.colorChart({});
            chart.colorAccessor(identity);
            return {chart:chart,domain:[1,100],test:[0,1,50,100,101,1]};
        },
        'default' : function (t) {
            assert.deepEqual(colorTest(t),['#9ecae1','#3182bd','#c6dbef','#6baed6','#e6550d','#3182bd']);
        },
        'custom' : function (t) {
            t.chart.colors(d3.scale.category10());
            assert.deepEqual(colorTest(t),[ '#2ca02c', '#1f77b4', '#d62728', '#ff7f0e', '#9467bd', '#1f77b4' ]);
        },
        'ordinal' : function (t) {
            t.chart.ordinalColors(['red','green','blue']);
            assert.deepEqual(colorTest(t),[ 'blue', 'red', 'red', 'green', 'green', 'red' ]);
        },
        'linear' : function (t) {
            t.chart.linearColors(['#4575b4','#ffffbf']);
            assert.deepEqual(colorTest(t),[ '#4773b3', '#4575b4', '#4dc6c1', '#ffffbf', '#ffffc0', '#4575b4' ]);
        }
    },
    'calculateColorDomain' : {
        topic: function () {
            return dc.colorChart(dc.baseChart({}))
              .colorAccessor(function(d){return d.value;})
              .group(valueGroup);
        },
        'check domain' : function (chart) {
              chart.calculateColorDomain();
              assert.deepEqual(chart.colorDomain(),[1,3]);
        }
    }
});

suite.export(module);

