dc.utils.CulmulativeReduceTarget = function() {
    var _keyIndex = [];
    var _map = {};

    function sanitizeKey(key) {
        key = key + "";
        return key;
    }

    this.addValue = function(key, value) {
        key = sanitizeKey(key);
        if (_map[key] == null) {
            _keyIndex.push(key);
            _map[key] = value;
        } else {
            _map[key] += value;
        }
    };

    this.minusValue = function(key, value) {
        key = sanitizeKey(key);
        _map[key] -= value;
    };

    this.getValueByKey = function(key) {
        key = sanitizeKey(key);
        return _map[key];
    };

    this.getCumulativeValueByKey = function(key) {
        key = sanitizeKey(key);
        var keyIndex = _keyIndex.indexOf(key);
        if (keyIndex < 0) return 0;
        var cumulativeValue = this.getValueByKey(key);
        for (var i = 0; i < keyIndex; ++i) {
            var k = _keyIndex[i];
            cumulativeValue += this.getValueByKey(k);
        }
        return cumulativeValue;
    };

    this.clear = function() {
        _keyIndex = [];
        _map = {};
    };

    this.size = function() {
        return _keyIndex.length;
    };

    this.index = function() {
        return _keyIndex;
    };

    this.map = function() {
        return _map;
    };
};
