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
        'be able to hide and show stacked groups': function(stack) {
            stack.addNamedGroup({}, "first group");
            stack.addNamedGroup({}, "second group");

            stack.setDataPoint(0, 0, 77);
            stack.setDataPoint(1, 0, 55);
            stack.setDataPoint(2, 0, 33);
            stack.hideGroups("first group");

            var layers = stack.toLayers();
            assert.equal(layers.length, 2);
            assert.equal(layers[0].points[0], 77);
            assert.equal(layers[1].points[0], 33);

            stack.showGroups("first group");

            assert.equal(stack.toLayers().length, 3);

            stack.clear();
        },
        'be able to hide and show the main group': function(stack) {
            stack.addNamedGroup({}, "first group");
            stack.addNamedGroup({}, "second group");

            stack.setDataPoint(0, 0, 77);
            stack.setDataPoint(1, 0, 55);
            stack.setDataPoint(2, 0, 33);
            stack.hideGroups("main group", true);

            var layers = stack.toLayers();
            assert.equal(layers.length, 2);
            assert.equal(layers[0].points[0], 55);
            assert.equal(layers[1].points[0], 33);

            stack.showGroups("main group", true);

            assert.equal(stack.toLayers().length, 3);

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


