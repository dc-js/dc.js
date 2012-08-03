require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Cumulative');

suite.addBatch({
    'dc.cumulative.Sum':{
        topic:function(){
            return new dc.cumulative.Sum();
        },
        'is a class':function(target){
            assert.isTrue(target instanceof dc.cumulative.Sum);
        },
        'can store and retrieve value by key':function(target){
            var key = "key";
            var value = 100;
            target.add(key, value);
            target.add(key, value);
            assert.equal(target.getValueByKey(key), value * 2);
            assert.equal(target.size(), 1);
            target.clear();
        },
        'can retrieve cumulative value by key':function(target){
            var key = "key";
            var value = 100;
            target.add("0", 10);
            target.add("a", value);
            target.add(key, 19);
            target.add("4", 4);
            assert.equal(target.getCumulativeValueByKey(key), value + 10 + 19);
            assert.equal(target.getCumulativeValueByKey("4"), value + 10 + 19 + 4);
            target.clear();
        },
        'can retrieve value by out of range key':function(target){
            var key = "key";
            var value = 100;
            target.add("key", value);
            assert.equal(target.getCumulativeValueByKey("not found"), 0);
            target.clear();
        },
        'can reduce value by key':function(target){
            var key = "key";
            var value = 100;
            target.add(key, value);
            target.add(key, value);
            target.minus(key, value);
            assert.equal(target.getValueByKey(key), value);
            assert.equal(target.size(), 1);
            target.clear();
        },
        'can store and retrieve value by date key':function(target){
            var key = new Date(2012, 1, 1);
            var value = 100;
            target.add(key, value);
            target.add(key, value);
            target.add(key, value);
            target.minus(key, value);
            assert.equal(target.getValueByKey(key), value * 2);
            assert.equal(target.size(), 1);
            target.clear();
        }
    }
});

suite.addBatch({
    'dc.cumulative.CountUnique':{
        topic:function(){
            return new dc.cumulative.CountUnique();
        },
        'is a class':function(count){
            assert.isTrue(count instanceof dc.cumulative.CountUnique);
        },
        'can register element':function(count){
            count.register("abc");
            assert.equal(count.count(), 1);
        },
        'can register the same element multiple times but count only once':function(count){
            count.register("abc");
            count.register("abc");
            count.register("edf");
            assert.equal(count.count(), 2);
        }
    }
});

suite.export(module);


