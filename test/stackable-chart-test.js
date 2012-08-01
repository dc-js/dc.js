require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Stackable chart');

suite.addBatch({
    'chart stack': {
        topic: function () {
            return new dc.stackableChart.ChartStack();
        },

        'is an object': function (stack) {
            assert.isTrue(stack instanceof dc.stackableChart.ChartStack);
        },
        'is a data point matrix holder': function(stack){
            stack.setDataPoint(1, 1, 99);
            assert.equal(stack.getDataPoint(1, 1), 99);
        }
    }
});

suite.export(module);


