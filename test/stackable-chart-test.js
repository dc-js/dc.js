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
        }
    }
});

suite.export(module);


