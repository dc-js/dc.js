
return dc;}
if(typeof define === "function" && define.amd) {
  define(["d3"], _dc);
} else if(typeof module === "object" && module.exports) {
  module.exports = _dc(d3);
} else {
  this.dc = _dc(d3);
}
}
)();
