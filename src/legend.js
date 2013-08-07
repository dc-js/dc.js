dc.legend = function() {
    var _legend = {};
    var _parent;

    var _g;

    _legend.parent = function(p){
        if(!arguments.length) return _parent;
        _parent = p;
        return _legend;
    };

    _legend.render = function(){
        _g = _parent.svg().append("g")
            .attr("class", "dc-legend");
    };

    return _legend;
};
