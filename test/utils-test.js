require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Utils');

suite.addBatch({
    'dc.printer.filter': {
        topic: function () {
            return dc.printers.filter;
        },
        'print simple string': function (printer) {
            assert.equal(dc.printers.filter("a"), "a");
        },
        'print date string': function (printer) {
            assert.equal(dc.printers.filter(new Date(2012, 1, 1)), "02/01/2012");
        },
        'print int range': function (printer) {
            assert.equal(dc.printers.filter([10, 30]), "[10 -> 30]");
        },
        'print float range': function (printer) {
            assert.equal(dc.printers.filter([10.124244, 30.635623]), "[10 -> 31]");
        },
        'print date range': function (printer) {
            assert.equal(dc.printers.filter([new Date(2012, 1, 1), new Date(2012, 1, 15)]), "[02/01/2012 -> 02/15/2012]");
        },
        'print single element array': function (printer) {
            assert.equal(dc.printers.filter([new Date(2012, 1, 1)]), "02/01/2012");
        },
        'print null': function (printer) {
            assert.equal(dc.printers.filter(null), "");
        }
    }
});

suite.addBatch({
    'dc.utils.nameToId': {
        topic: function () {
            return dc.utils.nameToId("St. John's");
        },
        'id should be escaped properly': function (id) {
            assert.equal(id, "st_johns");
        }
    }
});

suite.addBatch({
    'dc.utils.add': {
        topic: function () {
            return dc.utils.add;
        },
        'should be able to add days': function (add) {
            var date = add(new Date(2012, 0, 1), 10);
            assert.equal(date.toString(), (new Date(2012, 0, 11)).toString());
        },
        'should be able to add numbers': function (add) {
            var num = add(10, 10);
            assert.equal(num, 20);
        },
        'should be able to add numbers w/ %': function (add) {
            var num = add(10, "10%");
            assert.equal(num, 11);
        },
        'should be able to add negative numbers w/ %': function (add) {
            var num = add(-10, "10%");
            assert.equal(num, -9);
        },
        'should ignore % when adding dates': function (add) {
            var date = add(new Date(2012, 0, 1), "10%");
            assert.equal(date.toString(), new Date(2012, 0, 11).toString());
        }
    }
});

suite.addBatch({
    'dc.utils.subtract': {
        topic: function () {
            return dc.utils.subtract;
        },
        'should be able to subtract dates': function (subtract) {
            var date = subtract(new Date(2012, 0, 11), 10);
            assert.equal(date.toString(), (new Date(2012, 0, 1)).toString());
        },
        'should be able to subtract numbers': function (subtract) {
            var num = subtract(10, 10);
            assert.equal(num, 0);
        },
        'should be able to subtract numbers w/ %': function (subtract) {
            var num = subtract(10, "10%");
            assert.equal(num, 9);
        },
        'should be able to subtract negative numbers w/ %': function (subtract) {
            var num = subtract(-10, "10%");
            assert.equal(num, -11);
        },
        'should ignore % when subtracting dates': function (subtract) {
            var date = subtract(new Date(2012, 0, 11), "10%");
            assert.equal(date.toString(), new Date(2012, 0, 1).toString());
        }
    }
});

suite.export(module);


