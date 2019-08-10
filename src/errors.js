export const errors = {};

errors.Exception = function (msg) {
    var _msg = msg || 'Unexpected internal error';

    this.message = _msg;

    this.toString = function () {
        return _msg;
    };
    this.stack = (new Error()).stack;
};
errors.Exception.prototype = Object.create(Error.prototype);
errors.Exception.prototype.constructor = errors.Exception;

errors.InvalidStateException = function () {
    errors.Exception.apply(this, arguments);
};

errors.InvalidStateException.prototype = Object.create(errors.Exception.prototype);
errors.InvalidStateException.prototype.constructor = errors.InvalidStateException;

errors.BadArgumentException = function () {
    errors.Exception.apply(this, arguments);
};

errors.BadArgumentException.prototype = Object.create(errors.Exception.prototype);
errors.BadArgumentException.prototype.constructor = errors.BadArgumentException;
