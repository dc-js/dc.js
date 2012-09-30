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

suite.addBatch({
    'missing dimension': {
        topic: function () {
            return dc.baseChart({}).group(valueGroup);
        },

        'should trigger descriptive exception': function (chart) {
            try{
                chart.render();
                assert.fail("Exception should have been triggered");
            }catch(e){
                assert.isTrue(e instanceof dc.errors.InvalidStateException);
                assert.equal("Mandatory attribute chart.dimension is not set", e.message);
            }
        }
    }
});

suite.addBatch({
    'missing group': {
        topic: function () {
            return dc.baseChart({}).dimension(valueDimension)
        },

        'should trigger descriptive exception': function (chart) {
            try{
                chart.render();
                assert.fail("Exception should have been triggered");
            }catch(e){
                assert.isTrue(e instanceof dc.errors.InvalidStateException);
                assert.equal("Mandatory attribute chart.group is not set", e.message);
            }
        }
    }
});

suite.export(module);


