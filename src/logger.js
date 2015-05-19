var enableDebugLogging = false;
export var enableDebugLog = function (_) {
    if (!arguments.length) {
        enableDebugLogging = _;
    }
    return enableDebugLogging;
};

export var warn = function (msg) {
    if (console) {
        if (console.warn) {
            console.warn(msg);
        } else if (console.log) {
            console.log(msg);
        }
    }
};

export var debug = function (msg) {
    if (enableDebugLogging && console) {
        if (console.debug) {
            console.debug(msg);
        } else if (console.log) {
            console.log(msg);
        }
    }
};

export var deprecate = function (fn, msg) {
    // Allow logging of deprecation
    var warned = false;
    function deprecated() {
        if (!warned) {
            warn(msg);
            warned = true;
        }
        return fn.apply(this, arguments);
    }
    return deprecated;
};
