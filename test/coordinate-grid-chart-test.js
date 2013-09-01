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
                assert.equal("Mandatory attribute chart.x is missing on chart[#]", e.message);
            }
        }
    }
});

suite.export(module);


