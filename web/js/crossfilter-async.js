(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.crossfilterAsync = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var operative = (typeof window !== "undefined" ? window['operative'] : typeof global !== "undefined" ? global['operative'] : null);

var cfFacade = function(data, cfUrl) {
  
  if(!cfUrl) cfUrl = 'crossfilter.js';

  // URL.createObjectURL
  // window.URL = window.URL || window.webkitURL;
  
  // var blob;
  // try {
  // blob = new Blob([function() {}.toString()], {type: 'application/javascript'});
  // } catch (e) { // Backwards-compatibility
  // window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
  // blob = new BlobBuilder();
  // blob.append(function() {}.toString());
  // blob = blob.getBlob();
  // }
  // var cfUrl = URL.createObjectURL(blob);
  
  var opfilter = operative({
    "unpack": function unpackFunction(func, context) {
      var internal, evalStr = "";
      if (context) {
        evalStr += context;
      }
      evalStr += "internal = " + func;
      /* jshint evil:true */
      eval(evalStr);
      /* jshint evil:false */
      return internal;
    },
    "crossfilters": {},
    "crossfilterIndex": 0,
    "dimensions": {},
    "dimensionIndex": 0,
    "groupAlls": {},
    "groupAllIndex": 0,
    "dimensionGroupAlls": {},
    "dimensionGroupAllIndex": 0,
    "dimensionGroups": {},
    "dimensionGroupIndex": 0,
    "new": function(data) {
      if (data) {
        this.crossfilters[this.crossfilterIndex] = crossfilter(data);
      } else {
        this.crossfilters[this.crossfilterIndex] = crossfilter([]);
      }
      var oldIndex = this.crossfilterIndex;
      this.crossfilterIndex++;
      this.deferred().fulfill(oldIndex);
    },
    "dimension": function(index, accessor) {
      var promise = this.deferred();
      this.dimensions[this.dimensionIndex] = this.crossfilters[index].dimension(this.unpack(accessor));
      var oldIndex = this.dimensionIndex;
      this.dimensionIndex++;
      promise.fulfill(oldIndex);
    },
    "dimension.dispose": function(index) {
      this.dimensions[index].dispose();
      this.deferred().fulfill();
    },
    "dimension.groupAll": function(index) {
      this.dimensionGroupAlls[this.dimensionGroupAllIndex] = this.dimensions[index].groupAll();
      var oldIndex = this.dimensionGroupAllIndex;
      this.dimensionGroupAllIndex++;
      this.deferred().fulfill(oldIndex);
    },
    "dimension.groupAll.value": function(index) {
      var value = this.dimensionGroupAlls[index].value();
      this.deferred().fulfill(value);
    },
    "dimension.groupAll.reduceSum": function(index, accessor) {
      this.dimensionGroupAlls[index].reduceSum(this.unpack(accessor));
      this.deferred().fulfill();
    },
    "dimension.groupAll.reduceCount": function(index) {
      this.dimensionGroupAlls[index].reduceCount();
      this.deferred().fulfill();
    },
    "dimension.groupAll.reduce": function(index, add, remove, initial) {
      this.dimensionGroupAlls[index].reduce(this.unpack(add), this.unpack(remove), this.unpack(initial));
      this.deferred().fulfill();
    },
    "dimension.groupAll.dispose": function(index) {
      this.dimensionGroupAlls[index].dispose();
      this.deferred().fulfill();
    },
    "dimension.filterRange": function(index, range) {
      this.dimensions[index].filterRange(range);
      this.deferred().fulfill();
    },
    "dimension.filterExact": function(index, value) {
      this.dimensions[index].filterExact(value);
      this.deferred().fulfill();
    },
    "dimension.filterFunction": function(index, func) {
      this.dimensions[index].filterFunction(this.unpack(func));
      this.deferred().fulfill();
    },
    "dimension.filterAll": function(index) {
      this.dimensions[index].filterAll();
      this.deferred().fulfill();
    },
    "dimension.filter": function(index, value) {
      this.dimensions[index].filter(value);
      this.deferred().fulfill();
    },
    "dimension.top": function(index, value) {
      var top = this.dimensions[index].top(value);
      this.deferred().fulfill(top);
    },
    "dimension.bottom": function(index, value) {
      var bottom = this.dimensions[index].bottom(value);
      this.deferred().fulfill(bottom);
    },
    "dimension.group": function(index, accessor) {
      this.dimensionGroups[this.dimensionGroupIndex] = this.dimensions[index].group(this.unpack(accessor));
      var oldIndex = this.dimensionGroupIndex;
      this.dimensionGroupIndex++;
      this.deferred().fulfill(oldIndex);
    },
    "dimension.group.top": function(index, value) {
      var top = this.dimensionGroups[index].top(value);
      this.deferred().fulfill(top);
    },
    "dimension.group.all": function(index) {
      var all = this.dimensionGroups[index].all();
      this.deferred().fulfill(all);
    },
    "dimension.group.size": function(index) {
      var size = this.dimensionGroups[index].size();
      this.deferred().fulfill(size);
    },
    "dimension.group.reduce": function(index, add, remove, initial) {
      this.dimensionGroups[index].reduce(this.unpack(add), this.unpack(remove), this.unpack(initial));
      this.deferred().fulfill();
    },
    "dimension.group.order": function(index, accessor) {
      this.dimensionGroups[index].order(this.unpack(accessor));
      this.deferred().fulfill();
    },
    "dimension.group.orderNatural": function(index) {
      this.dimensionGroups[index].orderNatural();
      this.deferred().fulfill();
    },
    "dimension.group.reduceSum": function(index, accessor) {
      this.dimensionGroups[index].reduceSum(this.unpack(accessor));
      this.deferred().fulfill();
    },
    "dimension.group.reduceCount": function(index) {
      this.dimensionGroups[index].reduceCount();
      this.deferred().fulfill();
    },
    "dimension.group.dispose": function(index) {
      this.dimensionGroups[index].dispose();
      this.deferred().fulfill();
    },
    "groupAll": function(index) {
      var promise = this.deferred();
      this.groupAlls[this.groupAllIndex] = this.crossfilters[index].groupAll();
      var oldIndex = this.groupAllIndex;
      this.groupAllIndex++;
      promise.fulfill(oldIndex);
    },
    "groupAll.value": function(index) {
      var value = this.groupAlls[index].value();
      this.deferred().fulfill(value);
    },
    "groupAll.reduceSum": function(index, accessor) {
      this.groupAlls[index].reduceSum(this.unpack(accessor));
      this.deferred().fulfill();
    },
    "groupAll.reduceCount": function(index) {
      this.groupAlls[index].reduceCount();
      this.deferred().fulfill();
    },
    "groupAll.reduce": function(index, add, remove, initial) {
      this.groupAlls[index].reduce(this.unpack(add), this.unpack(remove), this.unpack(initial));
      this.deferred().fulfill();
    },
    "groupAll.dispose": function(index) {
      this.groupAlls[index].dispose();
      this.deferred().fulfill();
    },
    "add": function(index, data) {
      this.crossfilters[index].add(data);
      this.deferred().fulfill();
    },
    "size": function(index) {
      var size = this.crossfilters[index].size();
      this.deferred().fulfill(size);
    },
    "all": function(index) {
      var all = this.crossfilters[index].all();
      this.deferred().fulfill(all);
    },
    "remove": function(index) {
      this.crossfilters[index].remove();
      this.deferred().fulfill();
    }
  }, [cfUrl]);
  
  var readSynchronizer = Promise.all([]);
  var updateSynchronizer = Promise.all([]);
  
  var cfIndex = opfilter['new'](data);
  var cfAsync = {
    dimension: function(accessor) {
      var dimIndex = cfIndex.then(function(idx) {
        return opfilter.dimension(idx, accessor.toString());
      });
      return {
        dispose: function() {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.dispose"](idx[0]);
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return p;
        },
        groupAll: function() {
          var dimGaIndex = dimIndex.then(function(idx) {
            return opfilter["dimension.groupAll"](idx);
          });
          return {
            value: function() {
              var p = Promise.all([dimGaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.groupAll.value"](idx[0]);
              });
              readSynchronizer = Promise.all([readSynchronizer, p]);
              return p;
            },
            reduceSum: function(accessor) {
              var p = Promise.all([dimGaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.groupAll.reduceSum"](idx[0], accessor.toString());
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            reduceCount: function() {
              var p = Promise.all([dimGaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.groupAll.reduceCount"](idx[0]);
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            reduce: function(add, remove, initial) {
              var p = Promise.all([dimGaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.groupAll.reduce"](idx[0], add.toString(), remove.toString(), initial.toString());
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            dispose: function() {
              var p = Promise.all([dimGaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.groupAll.dispose"](idx[0]);
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return p;
            }
          };
        },
        group: function(accessor) {
          var dimGroupIndex = dimIndex.then(function(idx) {
            return opfilter["dimension.group"](idx, accessor ? accessor.toString() : (function(d) {
              return d;
            }).toString());
          });
          return {
            top: function(value) {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.top"](idx[0], value);
              });
              readSynchronizer = Promise.all([readSynchronizer, p]);
              return p;
            },
            all: function() {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.all"](idx[0]);
              });
              readSynchronizer = Promise.all([readSynchronizer, p]);
              return p;
            },
            size: function() {
              return dimGroupIndex.then(function(idx) {
                return opfilter["dimension.group.size"](idx);
              });
            },
            reduceSum: function(accessor) {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.reduceSum"](idx[0], accessor.toString());
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            reduceCount: function() {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.reduceCount"](idx[0]);
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            reduce: function(add, remove, initial) {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.reduce"](idx[0], add.toString(), remove.toString(), initial.toString());
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            order: function(accessor) {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.order"](idx[0], accessor.toString());
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            orderNatural: function() {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.orderNatural"](idx[0]);
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return this;
            },
            dispose: function() {
              var p = Promise.all([dimGroupIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
                return opfilter["dimension.group.dispose"](idx[0]);
              });
              updateSynchronizer = Promise.all([updateSynchronizer, p]);
              return p;
            }
          };
        },
        filterRange: function(range) {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.filterRange"](idx[0], range);
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return p;
        },
        filterExact: function(value) {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.filterExact"](idx[0], value);
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return p;
        },
        filterFunction: function(func) {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.filterFunction"](idx[0], func.toString());
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return p;
        },
        filterAll: function() {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.filterAll"](idx[0]);
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return p;
        },
        filter: function(value) {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.filter"](idx[0], value);
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return p;
        },
        top: function(value) {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.top"](idx[0], value);
          });
          readSynchronizer = Promise.all([readSynchronizer, p]);
          return p;
        },
        bottom: function(value) {
          var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["dimension.bottom"](idx[0], value);
          });
          readSynchronizer = Promise.all([readSynchronizer, p]);
          return p;
        }
      };
    },
    groupAll: function() {
      var gaIndex = cfIndex.then(function(idx) {
        return opfilter.groupAll(idx);
      });

      return {
        value: function() {
          var p = Promise.all([gaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["groupAll.value"](idx[0]);
          });
          readSynchronizer = Promise.all([readSynchronizer, p]);
          return p;
        },
        reduceSum: function(accessor) {
          var p = Promise.all([gaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["groupAll.reduceSum"](idx[0], accessor.toString());
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return this;
        },
        reduceCount: function() {
          var p = Promise.all([gaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["groupAll.reduceCount"](idx[0]);
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return this;
        },
        reduce: function(add, remove, initial) {
          var p = Promise.all([gaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["groupAll.reduce"](idx[0], add.toString(), remove.toString(), initial.toString());
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return this;
        },
        dispose: function() {
          var p = Promise.all([gaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
            return opfilter["groupAll.dispose"](idx[0]);
          });
          updateSynchronizer = Promise.all([updateSynchronizer, p]);
          return p;
        }
      };
    },
    remove: function() {
      var p = Promise.all([cfIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
        return opfilter.remove(idx[0]);
      });
      updateSynchronizer = Promise.all([updateSynchronizer, p]);
      return this;
    },
    add: function(data) {
      var p = Promise.all([cfIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
        return opfilter.add(idx[0], data);
      });
      updateSynchronizer = Promise.all([updateSynchronizer, p]);
      return this;
    },
    size: function() {
      var p = Promise.all([cfIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
        return opfilter.size(idx[0]);
      });
      readSynchronizer = Promise.all([readSynchronizer, p]);
      return p;
    },
    all: function() {
      return cfIndex.then(function(idx) {
        return opfilter.all(idx);
      });
    }
  };
  
  var callback = function() { };
  
  // Add Crossfilter facade
  cfAsync.facade = {
    dimension: function(accessor) {
      var cfDimension = cfAsync.dimension(accessor);
      return {
        dispose: cfDimension.dispose,
        groupAll: function() {
          var cfGroupAll = cfDimension.groupAll();
          var cachedValue = {};
          return {
            value: function() {
              cfGroupAll.value().then(function(d){
                cachedValue = d;
              }).then(callback);
              return cachedValue;
            },
            reduceSum: function(accessor) {
              cfGroupAll.reduceSum(accessor);
              return this;
            },
            reduceCount: function() {
              cfGroupAll.reduceCount();
              return this;
            },
            reduce: function(add, remove, initial) {
              cfGroupAll.reduce(add, remove, initial);
              return this;
            },
            dispose: function() {
              cfGroupAll.dispose();
            }
          };
        },
        group: function(accessor) {
          var cfGroup = cfDimension.group(accessor);
          var cachedTop = [];
          var cachedAll = [];
          var cachedSize = 0;
          return {
            top: function(value) {
              cfGroup.top(Infinity).then(function(d) {
                cachedTop = d;
              }).then(callback);
              return cachedTop.slice(0,value);
            },
            all: function() {
              cfGroup.all().then(function(d) {
                cachedAll = d;
              }).then(callback);
              return cachedAll;
            },
            size: function() {
              cfGroup.size().then(function(d) {
                cachedSize = d;
              }).then(callback);
              return cachedSize;
            },
            reduceSum: function(accessor) {
              cfGroup.reduceSum(accessor);
              return this;
            },
            reduceCount: function() {
              cfGroup.reduceCount();
              return this;
            },
            reduce: function(add, remove, initial) {
              cfGroup.reduce(add, remove, initial);
              return this;
            },
            order: function(accessor) {
              cfGroup.order(accessor);
              return this;
            },
            orderNatural: function() {
              cfGroup.orderNatural();
              return this;
            },
            dispose: function() {
              cfGroup.dispose();
            }
          };
        },
        filterRange: function(range) {
          cfDimension.filterRange(range);
        },
        filterExact: function(value) {
          cfDimension.filterExact(value);
        },
        filterFunction: function(func) {
          cfDimension.filterFunction(func);
        },
        filterAll: function() {
          cfDimension.filterAll();
        },
        filter: function(value) {
          cfDimension.filter(value);
        },
        top: function(value) {
          // TODO
          // var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
          //   return opfilter["dimension.top"](idx[0], value);
          // });
          // readSynchronizer = Promise.all([readSynchronizer, p]);
          // return p;
        },
        bottom: function(value) {
          // TODO
          // var p = Promise.all([dimIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
          //   return opfilter["dimension.bottom"](idx[0], value);
          // });
          // readSynchronizer = Promise.all([readSynchronizer, p]);
          // return p;
        }
      };
    },
    groupAll: function() {
      var cfGroupAll = cfAsync.groupAll();

      return {
        value: function() {
          // TODO
          // var p = Promise.all([gaIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
          //   return opfilter["groupAll.value"](idx[0]);
          // });
          // readSynchronizer = Promise.all([readSynchronizer, p]);
          // return p;
        },
        reduceSum: function(accessor) {
          cfGroupAll.reduceSum(accessor);
          return this;
        },
        reduceCount: function() {
          cfGroupAll.reduceCount();
          return this;
        },
        reduce: function(add, remove, initial) {
          cfGroupAll.reduct(add, remove, initial);
          return this;
        },
        dispose: function() {
          cfGroupAll.dispose();
        }
      };
    },
    remove: function() {
      cfAsync.remove();
      return this;
    },
    add: function(data) {
      cfAsync.add(data);
      return this;
    },
    size: function() {
      // TODO
      // var p = Promise.all([cfIndex, readSynchronizer, updateSynchronizer]).then(function(idx) {
      //   return opfilter.size(idx[0]);
      // });
      // readSynchronizer = Promise.all([readSynchronizer, p]);
      // return p;
    },
    all: function() {
      // TODO
      // return cfIndex.then(function(idx) {
      //   return opfilter.all(idx);
      // });
    },
    callback: function(cb) { 
      if(cb) {
        callback = cb;
      } else {
        return callback;
      }
    }
  };
  
  return cfAsync;
};

module.exports = cfFacade;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});