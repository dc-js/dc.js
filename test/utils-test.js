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
    'dc.utils.nameToId':{
        topic:function(){return dc.utils.nameToId("St. John's");},
        'id should be escaped properly':function(id){
            assert.equal(id,"st_johns");
        }
    }
});

suite.export(module);


