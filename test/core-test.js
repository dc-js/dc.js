require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Core');

suite.addBatch({
    'dc.version': {
        topic: function () {
            return dc.version
        },

        'has the form major.minor.patch': function (version) {
            assert.match(version, /^[0-9]+\.[0-9]+\.[0-9]+$/);
        }
    },
    'dc.charts': {
        topic: function() {
            var chart = dc.pieChart("#id");
            sinon.spy(chart, "filterAll");
            sinon.spy(chart, "render");
            return chart;
        },
        'should register chart object': function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'filterAll should invoke filter on each chart': function(chart) {
            dc.filterAll();
            assert.isTrue(chart.filterAll.calledOnce);
        },
        'renderAll should invoke filter on each chart': function(chart) {
            dc.renderAll();
            assert.isTrue(chart.render.calledOnce);
        },
        'should be gone after remove all': function(chart) {
            dc.deregisterAllCharts();
            assert.isFalse(dc.hasChart(chart));
        },
        teardown: function() {
            dc.deregisterAllCharts();
            resetBody();
        }
    },

    'dc.transition normal': {
        topic:function() {
            var selections = {
                transition:function() {
                    return selections;
                },
                duration:function() {
                    return selections;
                }
            };
            sinon.spy(selections, "transition");
            sinon.spy(selections, "duration");
            return selections;
        },
        'transition should be activated with duration': function(selections) {
            dc.transition(selections, 100);
            assert.isTrue(selections.transition.calledOnce);
            assert.isTrue(selections.duration.calledOnce);
        },
        'transition callback should be triggered': function(selections) {
            var triggered = false;
            dc.transition(selections, 100, function() {
                triggered = true;
            });
            assert.isTrue(triggered);
        },
        teardown: function(selections) {
            selections.transition.restore();
            selections.duration.restore();
            resetBody();
        }
    },

    'dc.transition skip': {
        topic:function() {
            var selections = {
                transition:function() {
                    return selections;
                },
                duration:function() {
                    return selections;
                }
            };
            sinon.spy(selections, "transition");
            sinon.spy(selections, "duration");
            return selections;
        },
        'transition should not be activated with 0 duration': function(selections) {
            dc.transition(selections, 0);
            assert.isFalse(selections.transition.called);
            assert.isFalse(selections.duration.called);
        },
        'transition callback should not be triggered': function(selections) {
            var triggered = false;
            dc.transition(selections, 0, function() {
                triggered = true;
            });
            assert.isFalse(triggered);
        },
        teardown: function(selections) {
            selections.transition.restore();
            selections.duration.restore();
            resetBody();
        }
    },

    'dc.units':{
        '.integers': {
            topic: function() {
                return dc.units.integers(0, 100);
            },
            'units should be based on subtraction': function(units) {
                assert.equal(units.length, 100);
            }
        }
    },

    'dc.round':{
        '.floor': {
            topic: function() {
                return dc.round.floor(0.33);
            },
            'should floored number': function(result) {
                assert.equal(result, 0);
            }
        }
    },

    'dc.override':{
        topic:function(){
            return {foo: function(){return "foo";}};
        },
        'wo/ override function should work as expected':function(o){
            assert.equal(o.foo(), "foo");
        },
        'should expose existing function':function(o){
            dc.override(o, "foo", function(_){return _() + "2";});
            assert.equal(o.foo(), "foo2");
        }
    },

    'dc.printer.filter':{
        topic:function(){
            return dc.printers.filter;
        },
        'print simple string':function(printer){
            assert.equal(dc.printers.filter("a"), "a");
        },
        'print date string':function(printer){
            assert.equal(dc.printers.filter(new Date(2012, 1, 1)), "02/01/2012");
        },
        'print int range':function(printer){
            assert.equal(dc.printers.filter([10, 30]), "[10 -> 30]");
        },
        'print date range':function(printer){
            assert.equal(dc.printers.filter([new Date(2012, 1, 1), new Date(2012, 1, 15)]), "[02/01/2012 -> 02/15/2012]");
        },
        'print single element array':function(printer){
            assert.equal(dc.printers.filter([new Date(2012, 1, 1)]), "02/01/2012");
        }
    }
});

suite.export(module);


