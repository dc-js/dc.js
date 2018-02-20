
// Simple function change package/name
d3.time.format.iso = d3v4.isoFormat;
d3.time.format.utc = d3v4.utcFormat;

d3.time.format.iso.parse = d3v4.isoParse;

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

d3.timer.flush = d3v4.timerFlush;

d3.axisBottom = d3v4.axisBottom;
d3.axisLeft = d3v4.axisLeft;
d3.axisRight = d3v4.axisRight;

d3.layout.stack = d3v4.stack;
d3.curveLinear = d3v4.curveLinear;

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
