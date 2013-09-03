/*  dc.numberDisplay example:
 *    <div id="total-sales-chart" class="widget">
 *        <strong>Total Sales</strong>
 *        <h2>$<span class="number-display"></span></h2>
 *    </div>
 */

dc.numberDisplay = function (parent, chartGroup) {

  var _chart = dc.baseChart({});

  _chart.doRender = function () {
    var newValue = _chart.group().top(1)[0].value;

    _chart.selectAll(".number-display")
    .transition()
    .duration(750)

    .tween("text", function (d, i, a) {
      var interp = d3.interpolate(dehumanize(this.textContent), newValue);
      return function (t) {
        this.textContent = humanize(Math.round(interp(t)));
      };
    });

    return _chart;
  };

  _chart.doRedraw = function () {
    return _chart.doRender();
  };


  function humanize(value) {
    if (value >= 1000000) {
      var val = (value / 1000000);
      if (val.toFixed(1).length > 3)
        return val.toFixed(0) + "M";
      else
        return val.toFixed(1) + "M";
    }
    if (value >= 1000) {
      var val = (value / 1000);
      if (val.toFixed(1).length > 3)
        return val.toFixed(0) + "K";
      else
        return val.toFixed(1) + "K";
    }

    return value + "";
  }

  function dehumanize(text) {
    if (text === "" || text === undefined)
      return 0;

    var num = parseFloat(text);

    if (text.indexOf("K") !== -1)
      return num * 1000;

    if (text.indexOf("M") !== -1)
      return num * 1000000;

    return num;
  }

  return _chart.anchor(parent, chartGroup);
};
