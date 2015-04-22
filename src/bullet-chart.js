/**
## Bullet Chart
Includes: [Color Mixin](#color-mixin), [Margin Mixin](#margin-mixin), [Base Mixin](#base-mixin)

Concrete bullet chart implementation.

Inspired by:

* [Mike Bostock's bullet chart](http://bl.ocks.org/mbostock/4061961)

Examples:

* ToDO

#### dc.bulletChart(parent[, chartGroup])
Create a bullet chart instance and attach it to the given parent element.

Parameters:
* parent : string | node | selection | compositeChart - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

Returns:
A newly created bullet chart instance

```js
// create a bullet chart under #chart-container1 element using the default global chart group
var chart1 = dc.bulletChart('#chart-container1');
// create a bullet chart under #chart-container2 element using chart group A
var chart2 = dc.bulletChart('#chart-container2', 'chartGroupA');
// create a sub-chart under a composite parent chart
var chart3 = dc.bulletChart(compositeChart);
```

**/
dc.bulletChart = function (parent, chartGroup) {
  var _chart = dc.marginMixin(dc.baseMixin({}));

  // from http://bl.ocks.org/mbostock/4061961
  var _bulletMargin = {top: 5, right: 40, bottom: 20, left:120},
      _bulletWidth = 960 - _bulletMargin.left - _bulletMargin.right,
      _bulletHeight = 50 - _bulletMargin.top  - _bulletMargin.bottom,
      _bulletOrient = 'left',
      _titleTranslate = [-6, _bulletHeight / 2]; // see default from titleTranslate()

  // HELPERS
  function titleTranslate(orient) {
    if (!arguments.length) {
      return _titleTranslate;
    }
    
    if (_bulletOrient === 'left' || _bulletOrient === 'right') {
      return [-6, _bulletHeight / 2];
    }
    else if (_bulletOrient === 'bottom' || _bulletOrient === 'top') {
      return [_bulletWidth, _bulletHeight + 20];
    }

    return [-6, _bulletHeight / 2];
  }

  _chart._doRender = function () {
    var _bullet = d3.bullet()
      .width(_bulletWidth)
      .height(_bulletHeight)
      .orient(_bulletOrient);

    var svg = _chart.root().selectAll('svg')
        .data(_chart.data())
      .enter().append('svg')
        .attr('class', 'bullet')
        .attr('width', _bulletWidth + _bulletMargin.left + _bulletMargin.right)
        .attr('height', _bulletHeight + _bulletMargin.top  + _bulletMargin.bottom)
      .append('g')
        .attr('transform', 'translate(' + _bulletMargin.left + ',' + _bulletMargin.top + ')')
        .call(_bullet);


    var title = svg.append('g')
        .style('text-anchor', 'end')
        .attr('transform', 'translate(' + _titleTranslate[0] + ',' + _titleTranslate[1] + ')');

    title.append('text')
        .attr('class', 'title')
        .text(function(d) {
          return d.title;
        });

    title.append('text')
        .attr('class', 'subtitle')
        .attr('dy', '1em')
        .text(function(d) {
          return d.subtitle;
        });

    return _chart;
  };

  _chart._doRedraw = function () {
    _chart._doRender();
    return _chart;
  };


  // SPECIFIC API
  /**
  #### .bulletWidth([value])
  Set or get the bullet width.

  **/
  _chart.bulletWidth = function (_) {
      if (!arguments.length) {
          return _bulletWidth;
      }
      _bulletWidth = +_;
      return _chart;
  };

  /**
  #### .bulletHeight([value])
  Set or get the bullet height.

  **/
  _chart.bulletHeight = function (_) {
      if (!arguments.length) {
          return _bulletHeight;
      }
      _bulletHeight = +_;
      return _chart;
  };

  /**
  #### .bulletMargin([value])
  Set or get the bullet margin, i.e. `{top: 5, right: 40, bottom: 50, left:120}`.

  **/
  _chart.bulletMargin = function (_) {
      if (!arguments.length) {
          return _bulletMargin;
      }
      _bulletMargin = _;
      return _chart;
  };

  /**
  #### .orient([value])
  Set or get the bullet orientation (one of `"left"`, `"right"`, `"top"` or `"bottom"`).

  **/
  _chart.orient = function (_) {
      if (!arguments.length) {
          return _bulletOrient;
      }
      _bulletOrient = _;
      _titleTranslate = titleTranslate(_bulletOrient);
      return _chart;
  };

  return _chart.anchor(parent, chartGroup);
};
