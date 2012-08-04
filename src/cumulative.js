dc.cumulative = {};

dc.cumulative.Base = function() {
    this._keyIndex = [];
    this._map = {};

    this.sanitizeKey = function(key) {
        key = key + "";
        return key;
    };

    this.index = function() {
        return this._keyIndex;
    };

    this.map = function() {
        return this._map;
    };

    this.clear = function() {
        this._keyIndex = [];
        this._map = {};
    };

    this.size = function() {
        return this._keyIndex.length;
    };

    this.getValueByKey = function(key) {
        key = this.sanitizeKey(key);
        return this._map[key];
    };

    this.setValueByKey = function(key, value) {
        key = this.sanitizeKey(key);
        return this._map[key] = value;
    };
};

dc.cumulative.Sum = function() {
    dc.cumulative.Base.apply(this, arguments);

    this.add = function(key, value) {
        key = this.sanitizeKey(key);
        if (this.getValueByKey(key) == null) {
            this.index().push(key);
            this.setValueByKey(key, value);
        } else {
            this.setValueByKey(key, this.getValueByKey(key) + value);
        }
    };

    this.minus = function(key, value) {
        this.setValueByKey(key, this.getValueByKey(key) - value);
    };

    this.getCumulativeValueByKey = function(key) {
        key = this.sanitizeKey(key);
        var keyIndex = this.index().indexOf(key);
        if (keyIndex < 0) return 0;
        var cumulativeValue = this.getValueByKey(key);
        for (var i = 0; i < keyIndex; ++i) {
            var k = this.index()[i];
            cumulativeValue += this.getValueByKey(k);
        }
        return cumulativeValue;
    };
};
dc.cumulative.Sum.prototype = new dc.cumulative.Base();

dc.cumulative.CountUnique = function() {
    var _hash = {};

    function hashSize(hash) {
        var size = 0, key;
        for (key in hash) {
            if (hash.hasOwnProperty(key)) size++;
        }
        return size;
    }

    this.add = function(key, e) {
        _hash[e] = true;
    };

    this.count = function(key) {
        return hashSize(_hash);
    };
};
