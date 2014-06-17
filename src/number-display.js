/**
## Number Display Widget

Includes: [Base Mixin](#base-mixin)

A display of a single numeric value.

Examples:

* [Test Example](http://dc-js.github.io/dc.js/examples/number.html)

#### dc.numberDisplay(parent[, chartGroup])
Create a Number Display instance and attach it to the given parent element.

Unlike other charts, you do not need to set a dimension. Instead a valid group object must be provided and valueAccessor that is expected to return a single value.

Parameters:

* parent : string - any valid d3 single selector representing typically a dom block element such as a div or span
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
   in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
   chart group.

Return:
A newly created number display instance

```js
// create a number display under #chart-container1 element using the default global chart group
var display1 = dc.numberDisplay("#chart-container1");
```

**/
dc.numberDisplay = function (parent, chartGroup) {
    var SPAN_CLASS = 'number-display';
    var _formatNumber = d3.format(".2s");
    var _chart = dc.baseMixin({});
    var _html = {singular:"",plural:"",zero:""};

    // dimension not required
    _chart._mandatoryAttributes(['group']);

    /**
    #### .html({singlular:"%number",plural:"%number",zero:"%number"}})
    %number will be replaced with the value
    Get or set the string attached to the number and pluralize it according to the value. 
    **/

    _chart.html = function(s) {
        if(s.zero)
            _html.zero = s.zero;
        if(s.singular)
            _html.singular = s.singular;
        if(s.plural)
            _html.plural = s.plural;
        return _chart;
    };

    /**
    #### .value()
    Calculate and return the underlying value of the display
    **/
    _chart.value = function () {
        return _chart.data();
    };

    _chart.data(function (group) {
        var valObj = group.value ? group.value() : group.top(1)[0];
        return _chart.valueAccessor()(valObj);
    });

    _chart.transitionDuration(250); // good default

    _chart._doRender = function () {
        var newValue = _chart.value(),
            span     = _chart.selectAll("."+SPAN_CLASS);

        if(span.empty())
            span = span.data([0])
                .enter()
                .append("span")
                .attr("class", SPAN_CLASS);

        span.transition()
            .duration(_chart.transitionDuration())
            .ease('quad-out-in')
            .tween("text", function () {
                var interp = d3.interpolateNumber(this.lastValue || 0, newValue);
                this.lastValue = newValue;
                return function (t) {
                    if(newValue==0)
                        this.textContent = (_html.zero=="")?_chart.formatNumber()(interp(t)):_html.zero.replace("%number",_chart.formatNumber()(interp(t)));
                    else if(newValue==1)
                        this.textContent = (_html.singular=="")?_chart.formatNumber()(interp(t)):_html.singular.replace("%number",_chart.formatNumber()(interp(t)));
                    else
                        this.textContent = (_html.plural=="")?_chart.formatNumber()(interp(t)):_html.plural.replace("%number",_chart.formatNumber()(interp(t)));
                };
            });
    };

    _chart._doRedraw = function(){
        return _chart._doRender();
    };

    /**
    #### .formatNumber([formatter])
    Get or set a function to format the value for the display. By default `d3.format(".2s");` is used.

    **/
    _chart.formatNumber = function (_) {
        if (!arguments.length) return _formatNumber;
        _formatNumber = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};

