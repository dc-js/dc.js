/**
## Multiple Group Mixin
A mixin for adding basic multi aggregation support for charts.
**/
dc.multiGroupMixin = function (_chart) {

    _chart._groups   = new Array();
    _chart._groupGap = 5;
    
    _chart.groups = function( g ) {
        if (!arguments.length) return _chart._groups;
        _chart._groups = g;
        _chart.expireCache();
        return _chart;
    };

    _chart.groupGap = function (_) {
        if (!arguments.length) return _chart._groupGap;
        _chart._groupGap = _;
        return _chart;
    };

    _chart.legendables = function() {
        var items = new Array();
        _chart.groups().forEach(function(g, k){
            var item = {
                chart:  _chart,
                name:   g.title,
                hidden: false,
                color:  _chart.colors()(k)
            };
            items.push(item);
        });
        return items;
    };

    return _chart;
};
