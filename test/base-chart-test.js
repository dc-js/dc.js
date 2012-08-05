require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Base chart');

suite.addBatch({
    'renderlet': {
        topic: function () {
            return dc.baseChart({}).renderlet(function(chart){});
        },

        'should be set': function (chart) {
            assert.isNotNull(chart.renderlet());
        }
    }
});

suite.export(module);


