// Renamed functions

dc.abstractBubbleChart = dc.bubbleMixin;
dc.baseChart = dc.baseMixin;
dc.capped = dc.capMixin;
dc.colorChart = dc.colorMixin;
dc.coordinateGridChart = dc.coordinateGridMixin;
dc.marginable = dc.marginMixin;
dc.stackableChart = dc.stackMixin;

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
