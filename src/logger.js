/**
 * Provides basis logging and deprecation utilities
 * @class logger
 * @memberof dc
 * @returns {dc.logger}
 */
dc.logger = (function () {

    var _logger = {};

    /**
     * Enable debug level logging. Set to `false` by default.
     * @name enableDebugLog
     * @memberof dc.logger
     * @instance
     */
    _logger.enableDebugLog = false;

    /**
     * Put a warning message to console
     * @method warn
     * @memberof dc.logger
     * @instance
     * @example
     * dc.logger.warn('Invalid use of .tension on CurveLinear');
     * @param {String} [msg]
     * @returns {dc.logger}
     */
    _logger.warn = function (msg) {
        if (console) {
            if (console.warn) {
                console.warn(msg);
            } else if (console.log) {
                console.log(msg);
            }
        }

        return _logger;
    };

    var _alreadyWarned = {};

    /**
     * Put a warning message to console. It will warn only on unique messages.
     * @method warnOnce
     * @memberof dc.logger
     * @instance
     * @example
     * dc.logger.warnOnce('Invalid use of .tension on CurveLinear');
     * @param {String} [msg]
     * @returns {dc.logger}
     */
    _logger.warnOnce = function (msg) {
        if (!_alreadyWarned[msg]) {
            _alreadyWarned[msg] = true;

            dc.logger.warn(msg);
        }

        return _logger;
    };

    /**
     * Put a debug message to console. It is controlled by `dc.logger.enableDebugLog`
     * @method debug
     * @memberof dc.logger
     * @instance
     * @example
     * dc.logger.debug('Total number of slices: ' + numSlices);
     * @param {String} [msg]
     * @returns {dc.logger}
     */
    _logger.debug = function (msg) {
        if (_logger.enableDebugLog && console) {
            if (console.debug) {
                console.debug(msg);
            } else if (console.log) {
                console.log(msg);
            }
        }

        return _logger;
    };

    /**
     * Use it to deprecate a function. It will return a wrapped version of the function, which will
     * will issue a warning when invoked. For each function, warning will be issued only once.
     *
     * @method deprecate
     * @memberof dc.logger
     * @instance
     * @example
     * _chart.interpolate = dc.logger.deprecate(function (interpolate) {
     *    if (!arguments.length) {
     *        return _interpolate;
     *    }
     *    _interpolate = interpolate;
     *    return _chart;
     * }, 'dc.lineChart.interpolate has been deprecated since version 3.0 use dc.lineChart.curve instead');
     * @param {Function} [fn]
     * @param {String} [msg]
     * @returns {Function}
     */
    _logger.deprecate = function (fn, msg) {
        // Allow logging of deprecation
        var warned = false;
        function deprecated () {
            if (!warned) {
                _logger.warn(msg);
                warned = true;
            }
            return fn.apply(this, arguments);
        }
        return deprecated;
    };

    return _logger;
})();
