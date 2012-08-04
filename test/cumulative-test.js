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
        'can store and retrieve value in separate sums':function(target){
            var key = "key";
            var value = 100;
            target.add(key, value);
            target.add(key, value);
            var target2 = new dc.cumulative.Sum();
            assert.equal(target2.getValueByKey(key), undefined);
            assert.equal(target2.size(), 0);
            target.clear();
        },
        'can retrieve cumulative value by key':function(target){
            var key = "key";
            var value = 100;
            target.add("0", 10);
            target.add("a", value);
            target.add(key, 19);
            target.add("4", 4);
            assert.equal(target.cumulativeSum(key), value + 10 + 19);
            assert.equal(target.cumulativeSum("4"), value + 10 + 19 + 4);
            target.clear();
        },
        'can retrieve value by out of range key':function(target){
            var key = "key";
            var value = 100;
            target.add("key", value);
            assert.equal(target.cumulativeSum("not found"), 0);
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
        },
        'can retrieve cumulative value by key with empty key in between':function(target){
            var key1 = "0";
            var key2 = "a";
            var key3 = "key";
            var key4 = "4";
            var value = 100;
            target.add(key1, 10);
            target.add(key2, value);
            target.add(key3);
            target.add(key4, 4);
            assert.equal(target.cumulativeSum(key3), value + 10);
            assert.equal(target.cumulativeSum("4"), value + 10 + 4);
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
            var key = 1;
            count.add(key, "abc");
            assert.equal(count.count(key), 1);
            count.clear();
        },
        'can register element w/ different keys':function(count){
            count.add(1, "abc");
            count.add(2, "abc");
            count.add(2, "edf");
            assert.equal(count.count(1), 1);
            assert.equal(count.count(2), 2);
            count.clear();
        },
        'can register the same element multiple times but count only once':function(count){
            var key = 1;
            count.add(key, "abc");
            count.add(key, "abc");
            count.add(key, "edf");
            assert.equal(count.count(key), 2);
            count.clear();
        },
        'can register the same element multiple times w/ key but count only once':function(count){
            var key = 1;
            var key2 = 2;
            count.add(key, "abc");
            count.add(key, "abc");
            count.add(key2, "edf");
            assert.equal(count.count(key), 1);
            assert.equal(count.count(key2), 1);
            count.clear();
        },
        'can register and deregister the same element multiple times w/ key but count only once':function(count){
            var key = 1;
            count.add(key, "abc");
            count.add(key, "abc");
            count.add(key, "edf");
            count.minus(key, "edf");
            assert.equal(count.count(key), 1);
            count.clear();
        },
        'can calculate cumulative count':function(count){
            var key = 1;
            var key2 = 2;
            var key3 = 3;
            count.add(key, "abc");
            count.add(key, "abc");
            count.add(key, "edf");
            count.minus(key, "edf");
            count.add(key2, "abc");
            count.add(key3, "abc");
            count.add(key3, "edf");
            assert.equal(count.cumulativeCount(key), 1);
            assert.equal(count.cumulativeCount(key2), 2);
            assert.equal(count.cumulativeCount(key3), 4);
            count.clear();
        },
        'can calculate cumulative count with empty key in between':function(count){
            var key = 1;
            var key2 = 2;
            var key3 = 3;
            count.add(key, "abc");
            count.add(key, "abc");
            count.add(key, "edf");
            count.minus(key, "edf");
            count.add(key2);
            count.add(key3, "abc");
            count.add(key3, "edf");
            count.add(key3);
            assert.equal(count.cumulativeCount(key), 1);
            assert.equal(count.cumulativeCount(key2), 1);
            assert.equal(count.cumulativeCount(key3), 3);
            count.clear();
        }
    }
});

suite.export(module);


