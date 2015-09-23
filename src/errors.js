var Exception = function (msg) {
    var _msg = msg || 'Unexpected internal error';

    this.message = _msg;

    this.toString = function () {
        return _msg;
    };
    this.stack = (new Error()).stack;
};
Exception.prototype = Object.create(Error.prototype);
Exception.prototype.constructor = Exception;

var InvalidStateException = function () {
    Exception.apply(this, arguments);
};
InvalidStateException.prototype = Object.create(Exception.prototype);
InvalidStateException.prototype.constructor = InvalidStateException;

var BadArgumentException = function () {
    Exception.apply(this, arguments);
};
BadArgumentException.prototype = Object.create(Exception.prototype);
BadArgumentException.prototype.constructor = BadArgumentException;

export {Exception, InvalidStateException, BadArgumentException};
