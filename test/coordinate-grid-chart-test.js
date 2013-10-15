require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Coordinate grid chart');

suite.addBatch({
    'missing x': {
        topic: function () {
            return dc.coordinateGridChart({})
                .group(valueGroup)
                .dimension(valueGroup);
        },

        'should trigger descriptive exception': function (chart) {
            try{
                chart.render();
                assert.fail("Exception should have been triggered");
            }catch(e){
                assert.isTrue(e instanceof dc.errors.InvalidStateException);
                assert.match(e.toString(), /Mandatory attribute chart.x is missing on chart\[#\d+\]/);
            }
        }
    },

    'brushing with equal dates': {
        topic: function () {
            var chart = dc.coordinateGridChart({});
            sinon.spy(chart, "filter");
            sinon.stub(chart, "redrawBrush");
            sinon.stub(chart, "extendBrush").returns([new Date("2013/1/1"), new Date("2013/1/1")]);
            return chart;
        },

        'should not trigger a filter event': function(chart) {
            chart._brushing();
            assert.isTrue(chart.filter.notCalled);
        }
    }
});

suite.export(module);


