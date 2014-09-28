dc.errors = {};

dc.errors.Exception = function (msg) {
    var _msg = msg || 'Unexpected internal error';

    this.message = _msg;

    this.toString = function () {
        return _msg;
    };
};

dc.errors.InvalidStateException = function () {
    dc.errors.Exception.apply(this, arguments);
};
