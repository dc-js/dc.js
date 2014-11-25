
return dc;}
    if(typeof define === "function" && define.amd) {
        define(["d3", "crossfilter"], _dc);
    } else if(typeof module === "object" && module.exports) {
        // When using window global, window.crossfilter is a function
        // When using require, the value will be an object with 'crossfilter'
        // field, so we need to access it here.
        module.exports = _dc(require('d3'), require('crossfilter').crossfilter);
    } else {
        this.dc = _dc(d3, crossfilter);
    }
}
)();
