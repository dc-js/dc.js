/**
## Margin Mixin

Margin is a mixin that provides margin utility functions for both the Row Chart and Coordinate Grid Charts.

**/
dc.marginMixin = function (_chart) {
    var _margin = {top: 10, right: 50, bottom: 30, left: 30};

    /**
    #### .margins([margins])
    Get or set the margins for a particular coordinate grid chart instance. The margins is stored as an associative Javascript
    array. Default margins: {top: 10, right: 50, bottom: 30, left: 30}.

    You can modify only some of the values, for example:

    ```js
    chart.margins({left: 30}) // set left margin to 35
    ```

    The margins can be accessed directly from the getter.
    ```js
    var leftMargin = chart.margins().left; // 30 by default
    chart.margins().left = 50;
    leftMargin = chart.margins().left; // now 50
    ```

    **/
    _chart.margins = function (m) {
        if (!arguments.length) return _margin;
        if ( m.top    != undefined ){ _margin.top = m.top; }
        if ( m.right  != undefined ){ _margin.right = m.right; }
        if ( m.bottom != undefined ){ _margin.bottom = m.bottom; }
        if ( m.left   != undefined ){ _margin.left = m.left; }
        return _chart;
    };

    _chart.effectiveWidth = function () {
        return _chart.width() - _chart.margins().left - _chart.margins().right;
    };

    _chart.effectiveHeight = function () {
        return _chart.height() - _chart.margins().top - _chart.margins().bottom;
    };

    return _chart;
};
