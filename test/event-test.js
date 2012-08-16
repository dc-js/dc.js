require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Event Engine');

suite.addBatch({
    'event execution': {
        topic: function () {
            return dc.events;
        },

        'event can be dispatched immediately': function (engine) {
            var triggered = false;
            engine.trigger(function() {
                triggered = true;
            });
            assert.isTrue(triggered);
        },

        'event can be dispatched with delay': function (engine) {
            var triggered = false;
            engine.trigger(function() {
                triggered = true;
            }, 100);
            assert.isFalse(triggered);
        },

        'multiple events dispatched with delay should be throttled': function (engine) {
            var times = 0;
            var i = 0;

            while (i < 10) {
                engine.trigger(function() {
                    times++;
                }, 10);
                i++;
            }

            setTimeout(function() {
                assert.equal(times, 1);
            }, 10);
        }
    }
});

suite.export(module);


