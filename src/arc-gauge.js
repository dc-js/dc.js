/**
## Arc Gauge

Includes: [Base Mixin](#base-mixin)

The Arc Gauge is a way to see data displacement similar to the Bar Gauge
 but in curved speedometer-like fashion.

#### dc.arcGauge(parent[, chartGroup])
Parameters:
* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

 Returns:
A newly created arc gauge chart instance

```js
arc = dc.arcGauge("#total-funding-arc")
                                .group(totalFundingGroup)
                                .valueAccessor(function(d){return d;})
                                .totalCapacity(function(){
                                  return crossfilterdata.groupAll().reduceSum(function(d){return d.columnname;}).value();
                                });
```
**/
dc.arcGauge = function (parent, chartGroup) {

    var _chart = dc.baseMixin({});
    var _filledValue,
        _oldValue,
        _totalCapacity,
        _startAngle,
        _endAngle,
        _arc,
        _innerRadius = 30, _outerRadius = 45;

    //dimension is not required because this component only has one dimension
    _chart._mandatoryAttributes (['group']);

    _chart.transitionDuration(450); // good default

    _chart.value = function() {
        return _chart.data();
    };

    _chart.data(function(group) {
        var valObj = group.value ? group.value() : group.top(1)[0];
        return _chart.valueAccessor()(valObj);

    });

    _chart.innerRadius = function(_) {
        if(!arguments.length) return _innerRadius;
        _innerRadius = _;
        return _chart;
    };

    _chart.outerRadius = function(_) {
        if(!arguments.length) return _outerRadius;
        _outerRadius = _;
        return _chart;
    };
    /**
        ####.startAngle(numberofdegrees)
        Start angle of the component arc in degrees. Remember 0 and 360 are at 12 o'clock. 
    **/
    _chart.startAngle = function(_) {
        if(!arguments.length) return _startAngle;
        _startAngle = _;
        return _chart;
    };

    /**
        ####.endAngle(numberofdegrees)
        End angle of the component arc in degrees. Remember 0 and 360 are at 12 o'clock. 
    **/
    _chart.endAngle = function(_) {
        if(!arguments.length) return _endAngle;
        _endAngle = _;
        return _chart;
    };

    _chart.arc = function(_) {
        if(!arguments.length) return _arc;
        _arc = _;
        return _chart;
    };

    /**
        #### .totalCapacity(number)
        Explicitly set total capacity. 
    **/
    _chart.totalCapacity = function(_) {
        if (!arguments.length) return _totalCapacity.call(_chart);
        _totalCapacity = d3.functor(_);
        _chart.expireCache();
        return _chart;
    };

    /**
        #### .filledValue(number)
        Explicitly set filled value. 
        The filled value will be used to get the percentage the bar is filled which will be translated 
        to the correct amount of degrees to fill in the arc. 
    **/
    _chart.filledValue = function(_) {
        if(!arguments.length) return _filledValue;
        _filledValue = _;
        return _chart;
    };

    var degreesToRadians = function(deg) {
        return deg * (Math.PI/180);
    };

    //This function is needed to do the angle transition in the arc. 
    var arcTween = function(transition, newAngle) {
        transition.attrTween("d", function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);

            return function(t) {
                d.endAngle = interpolate(t);
                return _arc(d);
            };
        });
    };

    /**
        #### .initializeArc(ParentSelector)
        Add the background and foreground arcs. Also do the animation of the arc filling/emptying. 
    **/
    var initializeArc = function(selector) {
        //use percentages to fill the gauge
        var _oldpercentFilled = _oldValue/_totalCapacity();
        var _percentFilled = _filledValue/_totalCapacity();
        var totalCapacityDegrees = Math.abs(_startAngle) + Math.abs(_endAngle);
        var oldFillAngle = _oldpercentFilled * totalCapacityDegrees - Math.abs(_startAngle);
        var newFillAngle = _percentFilled * totalCapacityDegrees - Math.abs(_startAngle);

        selector.append("path").classed("dc-arc-gauge-background", true);
        var background = _chart.selectAll(".dc-arc-gauge-background");
        background.datum({endAngle: degreesToRadians(_endAngle)})
            .attr("d", _arc);


        selector.append("path").classed("dc-arc-gauge-foreground", true);
        var foreground = _chart.selectAll(".dc-arc-gauge-foreground");
        foreground.datum({endAngle: degreesToRadians(oldFillAngle)})
            .attr("d", _arc);
        
        foreground.transition()
            .duration(_chart.transitionDuration())
            .call(arcTween, degreesToRadians(newFillAngle));

    };

    _chart._doRender = function () {
        //set some defaults for start/end angle, and values
        _startAngle = (_startAngle === undefined) ? -115 : _chart.startAngle();
        _endAngle = (_endAngle === undefined) ? 115 : _chart.endAngle();
        _arc = d3.svg.arc()
            .innerRadius(_innerRadius)
            .outerRadius(_outerRadius)
            .startAngle(degreesToRadians(_startAngle));
        _oldValue = (_filledValue === undefined) ? 0 : _filledValue;
        _filledValue = _chart.value();

        _chart.root().classed('dc-arc-gauge', true);
        _chart.root().classed('dc-chart', false);
        _chart.root().html('');

        var svgArc = _chart.root().append('svg')
             .append("g");
             

        initializeArc(svgArc);
    };

    _chart._doRedraw = function(){
        return _chart._doRender();
    };

    return _chart.anchor(parent, chartGroup);
};
