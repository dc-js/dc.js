require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Core');

suite.addBatch({
    'dc.version': {
        topic: function () {
            return dc.version;
        },

        'has the form major.minor.patch': function (version) {
            assert.match(version, /^[0-9]+\.[0-9]+\.[0-9]+$/);
        }
    },
    'dc.charts': {
        topic: function() {
            var chart = dc.pieChart("#id").dimension(valueDimension).group(valueGroup);
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
            dc.override(o, "foo", function(_super){return _super() + "2";});
            assert.equal(o.foo(), "foo2");
        }
    }
});

suite.addBatch({
    'dc.charts w/ grouping': {
        topic: function() {
            var chart = dc.pieChart("#a", "groupA").dimension(valueDimension).group(valueGroup);
            sinon.spy(chart, "filterAll");
            sinon.spy(chart, "render");
            dc.pieChart("#b", "groupA").dimension(valueDimension).group(valueGroup);
            dc.bubbleChart("#c", "groupB").dimension(valueDimension).group(valueGroup);
            dc.barChart("#1", "groupB").dimension(valueDimension).group(valueGroup);
            dc.lineChart("#2", "groupB").dimension(valueDimension).group(valueGroup);
            dc.dataCount("#3", "groupB").dimension(valueDimension).group(valueGroup);
            dc.dataTable("#4", "groupB").dimension(valueDimension).group(valueGroup);
            return chart;
        },
        'should register chart object': function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'filterAll should not invoke filter on chart in groupA': function(chart) {
            dc.filterAll();
            assert.isFalse(chart.filterAll.calledOnce);
            chart.filterAll.reset();
        },
        'renderAll should not invoke filter on chart in groupA': function(chart) {
            dc.renderAll();
            assert.isFalse(chart.render.calledOnce);
            chart.filterAll.reset();
        },
        'filterAll by group should invoke filter on each chart within the group': function(chart) {
            dc.filterAll("groupA");
            assert.isTrue(chart.filterAll.calledOnce);
            chart.filterAll.reset();
        },
        'renderAll by group should invoke filter on each chart within the group': function(chart) {
            dc.renderAll("groupA");
            assert.isTrue(chart.render.calledOnce);
            chart.filterAll.reset();
        },
        'should be gone after remove all': function(chart) {
            dc.deregisterAllCharts();
            assert.isFalse(dc.hasChart(chart));
        },
        teardown: function() {
            dc.deregisterAllCharts();
            resetBody();
        }
    }
});

suite.addBatch({'render/redraw all call back': {
    topic:function(){
        dc.renderlet(function(group){dc.__test_result.called = group?group:true;});
        return dc;
    },
    'renderAll call back should be triggered':function(topic){
        dc.__test_result = {called: false};
        dc.renderAll();
        assert.isTrue(dc.__test_result.called);
    },
    'redrawAll call back should be triggered':function(topic){
        dc.__test_result = {called: false};
        dc.redrawAll();
        assert.isTrue(dc.__test_result.called);
    },
    'renderAll by group call back should be triggered':function(topic){
        dc.__test_result = {called: false};
        dc.renderAll("group");
        assert.equal("group", dc.__test_result.called);
    },
    'redrawAll by group call back should be triggered':function(topic){
        dc.__test_result = {called: false};
        dc.redrawAll("group");
        assert.equal("group", dc.__test_result.called);
    },
    teardown:function(){
        delete dc.__test_result;
        dc.renderlet(null);
    }
}});

suite.export(module);


