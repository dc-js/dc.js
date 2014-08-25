dc.barGauge = function (parent, chartGroup) {

    var _chart = dc.baseMixin({});
    var _filledValue,
        _oldValue,
        _totalCapacity,
        _orientation = 'vertical',
        _thickness = 25,
        _longness = 100;


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

    /**
        #### .orientation(string)
        Set the orientation of the bar 'horizontal' or 'vertical'. 
    **/
    _chart.orientation = function(_) {
        if(!arguments.length) return _orientation;
        _orientation = _;
        return _chart;
    };


    _chart.thickness = function(_) {
        if(!arguments.length) return _thickness;
        _thickness = _;
        return _chart;
    };

//TODO: add functionality for setting the longness, right now longness is 100% of parent element
/*
    _chart.longness = function(_) {
        if(!arguments.length) return _longness;
        _longness = _;
        if(_orientation === 'vertical') {
            newX = _thickness;
            newY = _longness;
        }
        else if(_orientation === 'horizontal') {
            newX = _longness;
            newY = _thickness;
        }

        _chart.root().selectAll('.svg-container-container')
            .selectAll('rect')
            .attr('width', newX)
            .attr('height', newY);
        return _chart;
    };
*/

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
        The filled value will be used to get the percentage the bar is filled.
    **/
    _chart.filledValue = function(_) {
      if(!arguments.length) return _filledValue;
      _filledValue = _;
      return _chart;
    };

    /**
        #### .initializeRectangles(HTML node, number, number, string)
        Add the background and foreground rectangles. Set the foreground
        rectangle to the calculated fill percantage.
    **/
    var initializeRectangles = function(selector, thickness, longness, orientation) {
        //the percentage value will be how much the bar is actually filled up
        var _percentFilled = _filledValue/_totalCapacity() * 100;
        var _oldpercentFilled = _oldValue/_totalCapacity() * 100;
        var filledX, filledY,
            newFilledX, newFilledY,
            offsetX, offsetY,
            containingX, containingY;

        if(orientation == 'vertical') {
            filledX = thickness;
            filledY = _oldpercentFilled + "%";
            newFilledX = filledX;
            newFilledY = _percentFilled + "%"
            containingX = thickness;
            containingY = longness + "%";
            offsetX = 0;
            offsetY = longness - _percentFilled + "%";
        }
        else { //horizontal
            filledX = _oldpercentFilled + "%";
            filledY = thickness;
            newFilledX = _percentFilled + "%";
            newFilledY = filledY;
            containingX = longness + "%";
            containingY = thickness;
            offsetX = 0;
            offsetY = 0;
        }

        selector.selectAll('rect')
          .data(['0'])
        .enter().append('rect')
          .classed("dc-bar-gauge-background", true)
          .attr('width', function(){ return containingX;})
          .attr('height', function(){return containingY;})
          .attr('x', 0)
          .attr('y', 0);
        selector.append('rect')
            .classed("dc-bar-gauge-foreground", true)
            .attr('width', function(){return filledX;})
            .attr('height', function(){return filledY;})
            .attr('x', offsetX)
            .attr('y', offsetY);
        var myRectangle = _chart.selectAll('.dc-bar-gauge-foreground');
        myRectangle.transition()
            .duration(_chart.transitionDuration())
            .ease('ease-out')
            .attr('width', function(){return newFilledX;})
            .attr('height', function(){return newFilledY;});
    };

    _chart._doRender = function () {
        _oldValue = (_filledValue === undefined) ? 0 : _filledValue;
        _filledValue = _chart.value();
        _chart.root().classed('dc-bar-gauge', true);
        _chart.root().classed('dc-chart', false);
        _chart.root().html('');
        var svgBar = _chart.root().append('svg');
        initializeRectangles(svgBar, _thickness, _longness, _orientation);



    };


    _chart._doRedraw = function(){
      return _chart._doRender();
    };

    return _chart.anchor(parent, chartGroup);
};
