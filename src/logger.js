let _enableDebugLog = false;
export function enableDebugLog (_ = false) {
    if (!arguments.length) {
        return _enableDebugLog;
    }
    _enableDebugLog = _;
    return _;
}

export function warn (msg) {
    if (console) {
        if (console.warn) {
            console.warn(msg);
        } else if (console.log) {
            console.log(msg);
        }
    }
}

export function debug (msg) {
    if (_enableDebugLog && console) {
        if (console.debug) {
            console.debug(msg);
        } else if (console.log) {
            console.log(msg);
        }
    }
}

export function deprecate (fn, msg) {
    // Allow logging of deprecation
    let warned = false;
    function deprecated (...args) {
        if (!warned) {
            warn(msg);
            warned = true;
        }
        return fn.apply(this, args);
    }
    return deprecated;
}
