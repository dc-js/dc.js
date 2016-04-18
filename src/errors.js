// TODO Extending built-ins is not currently supported by Babel
// https://phabricator.babeljs.io/T3083
// http://stackoverflow.com/a/33877501
function extendableError () {
    function _extendableBuiltin (message) {
        Error.apply(this, arguments); // eslint-disable-line prefer-rest-params
        this.message = message;
        // eslint-disable-next-line no-restricted-globals
        this.name = name;
    }
    _extendableBuiltin.prototype = Object.create(Error.prototype);
    // Jasmine doesn't support Object.setPrototypeOf
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(_extendableBuiltin, Error);
    } else {
        _extendableBuiltin.__proto__ = Error; // eslint-disable-line no-proto
    }
    return _extendableBuiltin;
}

export class Exception extends extendableError() { // Error {
}

export class InvalidStateException extends Exception {
}

export class BadArgumentException extends Exception {
}
