var transitionTest = (function() {

    // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    var querystring = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    var inter, duration = +querystring.duration, pause = +querystring.pause;
    if(isNaN(duration)) duration = 3000;
    if(isNaN(pause)) pause = 500;
    function stop() {
        window.clearInterval(inter);
        inter = null;
    }
    function oscillate(f1, f2) {
        return function() {
            stop();
            var which = false;
            f1();
            dc.redrawAll();
            inter = window.setInterval(function() {
                if((which = !which))
                    f2();
                else
                    f1();
                dc.redrawAll();
            }, duration+pause);
        };
    }
    // generate continuous data
    function progression(N, initial) {
        var _steps = 5, // number of data points to add each tick
            _interval = 1, // distance in x between points
            _magnitude = 1, // maximum change in y per observation
            _reverse = false; // whether to regress instead of progress
        var _data = [];
        var rand = d3.random.normal();
        function startval() { // .fill() (when can we drop ie?)
            var a = new Array(N);
            for(var i = 0; i<N; ++i) {
                a[i] = _magnitude*2;
            }
            return a;
        }
        function drop() {
            _data.splice(_reverse ? _data.length-1 : 0, 1);
        }
        function generate() {
            var basis = _data.length ?
                    _data[_reverse ? 0 : _data.length-1] :
                {key: 0, value: startval()};
            var obs = [], key = basis.key + (_reverse ? -1 : 1) * _interval;
            for(var i = 0; i<N; ++i) {
                obs[i] = Math.max(basis.value[i] + rand() * _magnitude, 0);
            }
            var datum = {key: key, value: obs};
            if(_reverse)
                _data.unshift(datum);
            else
                _data.push(datum);
        }
        while(initial--) generate();
        return {
            steps: function(steps) {
                if(!arguments.length)
                    return _steps;
                _steps = steps;
                return this;
            },
            interval: function(interval) {
                if(!arguments.length)
                    return _interval;
                _interval = interval;
                return this;
            },
            magnitude: function(magnitude) {
                if(!arguments.length)
                    return _magnitude;
                _magnitude = magnitude;
                return this;
            },
            reverse: function(reverse) {
                if(!arguments.length)
                    return _reverse;
                _reverse = reverse;
                return this;
            },
            start: function() {
                stop();
                dc.redrawAll();
                inter = window.setInterval(function() {
                    for(var i = 0; i < _steps; ++i) {
                        generate();
                        drop();
                    }
                    dc.redrawAll();
                }, duration+pause);
            },
            data: function() {
                return _data;
            }
        };
    }
    return {
        querystring : querystring,
        duration: duration,
        pause: pause,
        stop: stop,
        oscillate: oscillate,
        progression: progression
    };
})();
