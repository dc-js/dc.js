require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Stackable chart');

suite.addBatch({
    'chart stack': {
        topic: function () {
            return new dc.utils.GroupStack();
        },

        'is an object': function (stack) {
            assert.isTrue(stack instanceof dc.utils.GroupStack);
        },
        'is a data point matrix holder': function(stack){
            stack.setDataPoint(1, 1, 99);
            assert.equal(stack.getDataPoint(1, 1), 99);
        },
        'does not cause error when retrieving uninitialized data point': function(stack){
            assert.equal(stack.getDataPoint(1, 2), 0);
        },
        'be able to add group to stack': function(stack){
            var group = {};
            var index = stack.addGroup(group);
            assert.equal(stack.getGroupByIndex(index), group);
            assert.equal(stack.size(), 1);
            stack.clear();
        },
        'be able to add group with retriever': function(stack){
            var retriever = {};
            var index = stack.addGroup({}, retriever);
            assert.equal(stack.getAccessorByIndex(index), retriever);
            assert.equal(stack.size(), 1);
            stack.clear();
        },
        'should use default retriever if custom retriever is missing': function(stack){
            var retriever = {};
            stack.setDefaultAccessor(retriever);
            var index = stack.addGroup({});
            assert.equal(stack.getAccessorByIndex(index), retriever);
            stack.clear();
        }
    }
});

suite.export(module);


