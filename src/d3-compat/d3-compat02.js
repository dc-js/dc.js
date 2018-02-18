d3.selectAll = d3v4.selectAll;

d3.time.format.iso = d3v4.isoFormat;

d3.time.format.iso.parse = d3v4.isoParse;

d3.time.day = d3v4.timeDay;

d3.time.day.utc = d3v4.utcDay;

d3.scale.category20c = function () {
    return d3v4.scaleOrdinal(d3v4.schemeCategory20c);
};

d3.functor = function (v) {
    return typeof v === "function" ? v : function () {
        return v;
    };
};

d3._dispatch_tmp_fn_gen = function (_dispatch, event) {
    return function () {
        _dispatch.apply(event, this, arguments);
    };
};

d3.dispatch = function () {
    var _out = {};
    var _dispatch = d3v4.dispatch.apply(this, arguments);

    for (var i = 0; i < arguments.length; i++) {
        var event = arguments[i];
        _out[event] = this._dispatch_tmp_fn_gen(_dispatch, event);
    }

    _out.on = function (event, callback) {
        _dispatch.on(event, callback);
    };

    return _out;
};
