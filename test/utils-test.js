require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Utils');

suite.addBatch({
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
        'print float range':function(printer){
            assert.equal(dc.printers.filter([10.124244, 30.635623]), "[10 -> 31]");
        },
        'print date range':function(printer){
            assert.equal(dc.printers.filter([new Date(2012, 1, 1), new Date(2012, 1, 15)]), "[02/01/2012 -> 02/15/2012]");
        },
        'print single element array':function(printer){
            assert.equal(dc.printers.filter([new Date(2012, 1, 1)]), "02/01/2012");
        },
        'print null':function(printer){
            assert.equal(dc.printers.filter(null), "");
        }
    }
});

suite.addBatch({
    'dc.printer.CulmulativeReduceTarget':{
        topic:function(){
            return new dc.utils.CulmulativeReduceTarget();
        },
        'is a class':function(target){
            assert.isTrue(target instanceof dc.utils.CulmulativeReduceTarget);
        },
        'can store and retrieve value by key':function(target){
            var key = "key";
            var value = 100;
            target.addValue(key, value);
            assert.equal(target.getValueByKey(key), value);
            target.clear();
        },
        'can retrieve value by key - 1':function(target){
            var key = "key";
            var value = 100;
            target.addValue("0", 0);
            target.addValue("a", value);
            target.addValue(key, 19);
            target.addValue("4", 4);
            assert.equal(target.getPreviousValueByKey(key), value);
            target.clear();
        }
    }
});

suite.export(module);


