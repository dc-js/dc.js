/**
## Data Grid Widget

Includes: [Base Mixin](#base-mixin)

Data grid is a simple widget designed to list crossfilter focused data set (items being filtered) and provide you a simple way to define how each data item is displayed.
fashion.

Examples:
 * [List of members of the european parliament ](http://europarl.me/dc.js/web/ep/index.html)

#### dc.dataGrid(parent[, chartGroup])
Create a data grid widget instance and attach it to the given parent element.

Parameters:
 * parent : string - any valid d3 single selector representing typically a dom block element such as a div.
 * chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
 in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
 chart group.
 * html (item): function - return the html fragment for each item in the dataset. you can use a templating library or build the html directly.
Return:
A newly created data grid widget instance

 **/
dc.dataGrid = function(parent, chartGroup) {
  var LABEL_CSS_CLASS = "dc-grid-label";
  var ITEM_CSS_CLASS = "dc-grid-item";
  var GROUP_CSS_CLASS = "dc-grid-group";
  var GRID_CSS_CLASS = "dc-grid-top";

  var _chart = dc.baseMixin({});

  var _size = 999; // shouldn't be needed, but you might 
  var _html = function (d) { return "you need to provide an html() handling param:  " + JSON.stringify(d)};
  var _sortBy = function(d) {
    return d;
  };
  var _order = d3.ascending;

  _chart._doRender = function() {
    _chart.selectAll("div."+ GRID_CSS_CLASS).remove();

    renderItems(renderGroups());

    return _chart;
  };

  function renderGroups() {
    var groups = _chart.root().selectAll("div."+ GRID_CSS_CLASS)
      .data(nestEntries(), function(d) {
          return _chart.keyAccessor()(d);
          });

    var itemGroup = groups
      .enter()
      .append("div")
      .attr("class", GRID_CSS_CLASS)

      itemGroup
      .append("div")
      .attr("class", GROUP_CSS_CLASS)
      .call (renderGroupLabel);

    function renderGroupLabel(selection) {
      selection
        .append("h1")
        .attr("class", LABEL_CSS_CLASS)
        .html(function(d) {
          return _chart.keyAccessor()(d);
        });
    }

    groups.exit().remove();
    return itemGroup;
  }

  function nestEntries() {
    var entries = _chart.dimension().top(_size);

    return d3.nest()
      .key(_chart.group())
      .sortKeys(_order)
      .entries(entries.sort(function(a, b){
         return _order(_sortBy(a), _sortBy(b));
      }));
  }

  function renderItems(groups) {
    var items = groups.order()
      .selectAll("div." + ITEM_CSS_CLASS)
      .data(function(d) {
        return d.values;
      });

    var itemEnter = items.enter()
      .append("div")
      .attr("class", ITEM_CSS_CLASS)
      .html(function(d) {
        return _html(d);
      });

    items.exit().remove();

    return items;
  }

  _chart._doRedraw = function() {
    return _chart._doRender();
  };

  /**
#### .size([size])
Get or set the grid size which determines the number of items displayed by the widget.

   **/
  _chart.size = function(s) {
    if (!arguments.length) return _size;
    _size = s;
    return _chart;
  };

  /**
#### .html( function (data) { return "<html>"; })
Get or set the function that formats an item. Data grid widget uses a function to generate dynamic html. The provided example uses handlebar templating libary, but feel free to do it the way you want
```js
chart.html(function (d) { return "<div class='item "+data.exampleCategory+"'>"+data.exampleString+"</div>";});
```

   **/
  _chart.html = function(_) {
    if (!arguments.length) return _html;
    _html = _;
    return _chart;
  };

  /**
#### .sortBy([sortByFunction])
Get or set sort-by function. This function works as a value accessor at item level and returns a particular field to be sorted
by. Default value: ``` function(d) {return d;}; ```

```js
chart.sortBy(function(d) {
return d.date;
});
```

   **/
_chart.sortBy = function(_) {
  if (!arguments.length) return _sortBy;
  _sortBy = _;
  return _chart;
};

/**
#### .order([order])
Get or set sort order. Default value: ``` d3.ascending ```

```js
chart.order(d3.descending);
```

 **/
_chart.order = function(_) {
  if (!arguments.length) return _order;
  _order = _;
  return _chart;
};

return _chart.anchor(parent, chartGroup);
};
