require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Stackable chart');

suite.addBatch({
    'chart stack': {
        topic: function () {
            return new dc.utils.ChartStack();
        },

        'is an object': function (stack) {
            assert.isTrue(stack instanceof dc.utils.ChartStack);
        },
        'is a data point matrix holder': function(stack){
            stack.setDataPoint(1, 1, 99);
            assert.equal(stack.getDataPoint(1, 1), 99);
        },
        'does not cause error when retrieving uninitialized data point': function(stack){
            assert.equal(stack.getDataPoint(1, 2), 0);
        }
    }
});

suite.export(module);


