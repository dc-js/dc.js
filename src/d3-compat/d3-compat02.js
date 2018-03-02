
// Simple function change package/name
d3.time.format.iso = d3v4.isoFormat;
d3.time.format.utc = d3v4.utcFormat;

d3.time.format.iso.parse = d3v4.isoParse;
d3.timeParse = d3v4.timeParse;

d3.scaleTime = d3v4.scaleTime;
d3.scaleQuantize = d3v4.scaleQuantize;

d3.time.second = d3v4.timeSecond;
d3.time.minute = d3v4.timeMinute;
d3.time.hour = d3v4.timeHour;
d3.time.day = d3v4.timeDay;
d3.time.week = d3v4.timeWeek;
d3.time.month = d3v4.timeMonth;
d3.time.year = d3v4.timeYear;

d3.time.seconds = d3v4.timeSeconds;
d3.time.minutes = d3v4.timeMinutes;
d3.time.hours = d3v4.timeHours;
d3.time.days = d3v4.timeDays;
d3.time.weeks = d3v4.timeWeeks;
d3.time.months = d3v4.timeMonths;
d3.time.years = d3v4.timeYears;


d3.time.day.utc = d3v4.utcDay;
d3.time.days.utc = d3v4.utcDays;

d3.time.scale = {};
d3.time.scale.utc = d3v4.scaleUtc;

d3.easeQuadIn = d3v4.easeQuadIn;

d3.scale.log = d3v4.scaleLog;
d3.scaleBand = d3v4.scaleBand;

d3.timer.flush = d3v4.timerFlush;

d3.axisBottom = d3v4.axisBottom;
d3.axisLeft = d3v4.axisLeft;
d3.axisRight = d3v4.axisRight;

d3.layout.stack = d3v4.stack;
d3.curveLinear = d3v4.curveLinear;
d3.curveStepBefore = d3v4.curveStepBefore;
d3.curveCardinal = d3v4.curveCardinal;

d3.symbolTypes = d3v4.symbolTypes;
d3.symbols = d3v4.symbols;

d3.geo.mercator = d3v4.geoMercator;
d3.geoPath = d3v4.geoPath;
d3.geoAlbersUsa = d3v4.geoAlbersUsa;


d3.csv = d3v4.csv;
d3.json = d3v4.json;
d3.csvFormat = d3v4.csvFormat;
d3.csvParse = d3v4.csvParse;
d3.brush = d3v4.brush;
d3.brushX = d3v4.brushX;
d3.brushSelection = d3v4.brushSelection;

d3.bisector = d3v4.bisector;
d3.median = d3v4.median;

d3.randomNormal = d3v4.randomNormal;

// Selection behavior have changed significantly, need manual changes for
// each invocation of .enter()
d3.selectAll = d3v4.selectAll;


// Semantic change
d3.scale.category10 = function () {
    return d3v4.scaleOrdinal(d3v4.schemeCategory10);
};

d3.scale.category20c = function () {
    return d3v4.scaleOrdinal(d3v4.schemeCategory20c);
};


// Missing in D3v4, code picked up from D3v3
d3.functor = function (v) {
    return typeof v === "function" ? v : function () {
        return v;
    };
};


// Behavior of d3.dispatch has changed, ultimately changes will
// be applied to code directly - thankfully used in code only once
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


// Brushes - used only once, significant changes
//


// Significant changes in d3.layout.stack - copying from D3v3 for now
d3.permute = d3v4.permute;

d3.layout.stack = function () {
    function d3_layout_stackOrderDefault(data) {
        return d3.range(data.length);
    }

    function d3_layout_stackOffsetZero(data) {
        var j = -1, m = data[0].length, y0 = [];
        while (++j < m) y0[j] = 0;
        return y0;
    }

    function d3_layout_stackOut(d, y0, y) {
        d.y0 = y0;
        d.y = y;
    }

    function d3_layout_stackX(d) {
        return d.x;
    }

    function d3_layout_stackY(d) {
        return d.y;
    }

    function d3_identity(d) {
        return d;
    }

    return function () {
        var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero,
            out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;

        function stack(data, index) {
            if (!(n = data.length)) return data;
            var series = data.map(function (d, i) {
                return values.call(stack, d, i);
            });
            var points = series.map(function (d) {
                return d.map(function (v, i) {
                    return [x.call(stack, v, i), y.call(stack, v, i)];
                });
            });
            var orders = order.call(stack, points, index);
            series = d3.permute(series, orders);
            points = d3.permute(points, orders);
            var offsets = offset.call(stack, points, index);
            var m = series[0].length, n, i, j, o;
            for (j = 0; j < m; ++j) {
                out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
                for (i = 1; i < n; ++i) {
                    out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
                }
            }
            return data;
        }

        stack.values = function (x) {
            if (!arguments.length) return values;
            values = x;
            return stack;
        };
        stack.order = function (x) {
            if (!arguments.length) return order;
            order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
            return stack;
        };
        stack.offset = function (x) {
            if (!arguments.length) return offset;
            offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
            return stack;
        };
        stack.x = function (z) {
            if (!arguments.length) return x;
            x = z;
            return stack;
        };
        stack.y = function (z) {
            if (!arguments.length) return y;
            y = z;
            return stack;
        };
        stack.out = function (z) {
            if (!arguments.length) return out;
            out = z;
            return stack;
        };
        return stack;
    }
}();
