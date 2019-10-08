/**
 * Provides basis logging and deprecation utilities
 * @class logger
 * @returns {logger}
 */
export const logger = (function () {

    const _logger = {};

    /**
     * Enable debug level logging. Set to `false` by default.
     * @name enableDebugLog
     * @memberof logger
     * @instance
     */
    _logger.enableDebugLog = false;

    /**
     * Put a warning message to console
     * @method warn
     * @memberof logger
     * @instance
     * @example
     * logger.warn('Invalid use of .tension on CurveLinear');
     * @param {String} [msg]
     * @returns {logger}
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

    const _alreadyWarned = {};

    /**
     * Put a warning message to console. It will warn only on unique messages.
     * @method warnOnce
     * @memberof logger
     * @instance
     * @example
     * logger.warnOnce('Invalid use of .tension on CurveLinear');
     * @param {String} [msg]
     * @returns {logger}
     */
    _logger.warnOnce = function (msg) {
        if (!_alreadyWarned[msg]) {
            _alreadyWarned[msg] = true;

            logger.warn(msg);
        }

        return _logger;
    };

    /**
     * Put a debug message to console. It is controlled by `logger.enableDebugLog`
     * @method debug
     * @memberof logger
     * @instance
     * @example
     * logger.debug('Total number of slices: ' + numSlices);
     * @param {String} [msg]
     * @returns {logger}
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
     * Used to deprecate a function. It will return a wrapped version of the function, which will
     * will issue a warning when invoked. The warning will be issued only once.
     *
     * @method deprecate
     * @memberof logger
     * @instance
     * @example
     * _chart.interpolate = logger.deprecate(function (interpolate) {
     *    if (!arguments.length) {
     *        return _interpolate;
     *    }
     *    _interpolate = interpolate;
     *    return _chart;
     * }, 'lineChart.interpolate has been deprecated since version 3.0 use lineChart.curve instead');
     * @param {Function} [fn]
     * @param {String} [msg]
     * @returns {Function}
     */
    _logger.deprecate = function (fn, msg) {
        // Allow logging of deprecation
        let warned = false;

        function deprecated () {
            if (!warned) {
                _logger.warn(msg);
                warned = true;
            }
            return fn.apply(this, arguments);
        }
        return deprecated;
    };

    /**
     * Used to provide an informational message for a function. It will return a wrapped version of
     * the function, which will will issue a messsage with stack when invoked. The message will be
     * issued only once.
     *
     * @method annotate
     * @memberof logger
     * @instance
     * @example
     * _chart.interpolate = logger.annotate(function (interpolate) {
     *    if (!arguments.length) {
     *        return _interpolate;
     *    }
     *    _interpolate = interpolate;
     *    return _chart;
     * }, 'lineChart.interpolate has been annotated since version 3.0 use lineChart.curve instead');
     * @param {Function} [fn]
     * @param {String} [msg]
     * @returns {Function}
     */
    _logger.annotate = function (fn, msg) {
        // Allow logging of deprecation
        let warned = false;

        function annotated () {
            if (!warned) {
                console.groupCollapsed(msg);
                console.trace();
                console.groupEnd();
                warned = true;
            }
            return fn.apply(this, arguments);
        }
        return annotated;
    };

    return _logger;
})();
