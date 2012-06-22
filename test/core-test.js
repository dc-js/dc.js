require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Core');

suite.addBatch({
    'when dc.version': {
        topic: function () { return dc.version },

        'we get version string': function (topic) {
            assert.equal (topic, "0.1.0");
        }
    }
});

suite.export(module);


