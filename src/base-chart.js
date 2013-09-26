/**
## <a name="base-chart" href="#base-chart">#</a> Base Chart [Abstract]
Base chart is an abstract functional object representing a basic dc chart object for all chart and widget implementation.
Every function on base chart are also inherited available on all concrete chart implementation in dc library.

**/
dc.baseChart = function (_chart) {
    _chart.__dc_flag__ = true;

    var _dimension;
    var _group;

    var _anchor;
    var _root;
    var _svg;

    var _width = 200, _height = 200;

    var _keyAccessor = function (d) {
        return d.key;
    };
    var _valueAccessor = function (d) {
        return d.value;
    };
    var _ordering = function (p) {
        return p.key;
    };

    var _label = function (d) {
        return d.key;
    };
    var _renderLabel = false;

    var _title = function (d) {
        return d.key + ": " + d.value;
    };
    var _renderTitle = false;

    var _transitionDuration = 750;

    var _filterPrinter = dc.printers.filters;

    var _renderlets = [];

    var _chartGroup = dc.constants.DEFAULT_CHART_GROUP;

    var NULL_LISTENER = function () {};

    var _listeners = {
        preRender: NULL_LISTENER,
        postRender: NULL_LISTENER,
        preRedraw: NULL_LISTENER,
        postRedraw: NULL_LISTENER,
        filtered: NULL_LISTENER,
        zoomed: NULL_LISTENER
    };

    var _legend;

    var _filters = [];
    var _filterHandler = function (dimension, filters) {
        dimension.filter(null);

        if (filters.length === 0)
            dimension.filter(null);
        else if (filters.length === 1)
            dimension.filter(filters[0]);
        else
            dimension.filterFunction(function (d) {
                return filters.indexOf(d) >= 0;
            });

        return filters;
    };

    /**
    #### .width([value])
    Set or get width attribute of a chart. If the value is given, then it will be used as the new width.

    If no value specified then value of the current width attribute will be returned.

    **/
    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    /**
    #### .height([value])
    Set or get height attribute of a chart. If the value is given, then it will be used as the new height.

    If no value specified then value of the current height attribute will be returned.

    **/
    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    /**
    #### .dimension([value]) - **mandatory**
    Set or get dimension attribute of a chart. In dc a dimension can be any valid
    [crossfilter dimension](https://github.com/square/crossfilter/wiki/API-Reference#wiki-dimension). If the value is given,
    then it will be used as the new dimension.

    If no value specified then the current dimension will be returned.

    **/
    _chart.dimension = function (d) {
        if (!arguments.length) return _dimension;
        _dimension = d;
        _chart.expireCache();
        return _chart;
    };

    /**
    #### .group([value], [name]) - **mandatory**
    Set or get group attribute of a chart. In dc a group is a
    [crossfilter group](https://github.com/square/crossfilter/wiki/API-Reference#wiki-group). Usually the group should be
    created from the particular dimension associated with the same chart. If the value is given, then it will be used as
    the new group.

    If no value specified then the current group will be returned.
    If name is specified then it will be used to generate legend label.

    **/
    _chart.group = function (g, name) {
        if (!arguments.length) return _group;
        _group = g;
        _chart.expireCache();
        if (typeof name === 'string') _chart._setGroupName(_group, name);
        return _chart;
    };

    function groupName(chart, g, accessor) {
        var c = chart.anchor(),
            k = '__names__';
        if (!accessor || accessor == chart.valueAccessor())
            accessor = "default";
        if (!g[k]) g[k] = {};
        if (!g[k][c]) g[k][c] = {a:[],n:[]};
        var i = g[k][c].a.indexOf(accessor);
        if (i == -1) {
          i = g[k][c].a.length;
          g[k][c].a[i] = accessor;
          g[k][c].n[i] = {name:''};
        }
        return g[k][c].n[i];
    }


    _chart._getGroupName = function (g, accessor) {
      return groupName(_chart, g, accessor).name;
    };

    _chart._setGroupName = function (g, name, accessor) {
      groupName(_chart, g, accessor).name = name;
    };

    _chart.ordering = function(o) {
        if (!arguments.length) return _ordering;
        _ordering = o;
        _chart.expireCache();
        return _chart;
    };

    _chart.computeOrderedGroups = function(arr) {
        var data = arr ? arr : _chart.group().all().slice(0); // clone
        if(data.length < 2)
            return data;
        var sort = crossfilter.quicksort.by(_chart.ordering());
        return sort(data,0,data.length);
    };

    /**
    #### .filterAll()
    Clear all filters associated with this chart.

    **/
    _chart.filterAll = function () {
        return _chart.filter(null);
    };

    _chart.dataSet = function () {
        return _dimension !== undefined && _group !== undefined;
    };

    /**
    #### .select(selector)
    Execute in scope d3 single selection using the given selector and return d3 selection result. Roughly the same as:
    ```js
    d3.select("#chart-id").select(selector);
    ```
    This function is **not chainable** since it does not return a chart instance; however the d3 selection result is chainable
    from d3's perspective.

    **/
    _chart.select = function (s) {
        return _root.select(s);
    };

    /**
    #### .selectAll(selector)
    Execute in scope d3 selectAll using the given selector and return d3 selection result. Roughly the same as:
    ```js
    d3.select("#chart-id").selectAll(selector);
    ```
    This function is **not chainable** since it does not return a chart instance; however the d3 selection result is
    chainable from d3's perspective.

    **/
    _chart.selectAll = function (s) {
        return _root ? _root.selectAll(s) : null;
    };

    /**
    #### .anchor([anchorChart/anchorSelector], [chartGroup])
    Set the svg root to either be an existing chart's root or the first element returned from a d3 css string selector. Optionally registers the chart within the chartGroup. This class is called internally on chart initialization, but be called again to relocate the chart. However, it will orphan any previously created SVG elements.

    **/
    _chart.anchor = function (a, chartGroup) {
        if (!arguments.length) return _anchor;
        if (dc.instanceOfChart(a)) {
            _anchor = a.anchor();
            _root = a.root();
        } else {
            _anchor = a;
            _root = d3.select(_anchor);
            _root.classed(dc.constants.CHART_CLASS, true);
            dc.registerChart(_chart, chartGroup);
        }
        _chartGroup = chartGroup;
        return _chart;
    };

    /**
    #### .anchorName()
    Return the dom ID for chart's anchored location

    **/
    _chart.anchorName = function () {
        var a = _chart.anchor();
        if (a && a.id) return a.id;
        if (a) return a.replace('#','');
        return '';
    };

    /**
    #### .root([rootElement])
    Returns the root element where a chart resides. Usually it will be the parent div element where svg was created. You
    can also pass in a new root element however this is usually handled as part of the dc internal. Resetting root element
    on a chart outside of dc internal might have unexpected consequences.

    **/
    _chart.root = function (r) {
        if (!arguments.length) return _root;
        _root = r;
        return _chart;
    };

    /**
    #### .svg([svgElement])
    Returns the top svg element for this specific chart. You can also pass in a new svg element however this is usually
    handled as part of the dc internal. Resetting svg element on a chart outside of dc internal might have unexpected
    consequences.

    **/
    _chart.svg = function (_) {
        if (!arguments.length) return _svg;
        _svg = _;
        return _chart;
    };

    /**
    #### .resetSvg()
    Remove the chart's SVG elements from the dom and recreate the container SVG element.
    **/
    _chart.resetSvg = function () {
        _chart.select("svg").remove();
        return generateSvg();
    };

    function generateSvg() {
        _svg = _chart.root().append("svg")
            .attr("width", _chart.width())
            .attr("height", _chart.height());
        return _svg;
    };

    /**
    #### .filterPrinter([filterPrinterFunction])
    Set or get filter printer function. Filter printer function is used to generate human friendly text for filter value(s)
    associated with the chart instance. By default dc charts shipped with a default filter printer implementation dc.printers.filter
    that provides simple printing support for both single value and ranged filters.

    **/
    _chart.filterPrinter = function (_) {
        if (!arguments.length) return _filterPrinter;
        _filterPrinter = _;
        return _chart;
    };

    /**
    #### .turnOnControls() & .turnOffControls()
    Turn on/off optional control elements within the root element. dc.js currently support the following html control elements.

    * root.selectAll(".reset") elements are turned on if the chart has an active filter. This type of control elements are usually used to store reset link to allow user to reset filter on a certain chart. This element will be turned off automatically if the filter is cleared.
    * root.selectAll(".filter") elements are turned on if the chart has an active filter. The text content of this element is then replaced with the current filter value using the filter printer function. This type of element will be turned off automatically if the filter is cleared.

    **/
    _chart.turnOnControls = function () {
        if (_root) {
            _chart.selectAll(".reset").style("display", null);
            _chart.selectAll(".filter").text(_filterPrinter(_chart.filters())).style("display", null);
        }
        return _chart;
    };

    _chart.turnOffControls = function () {
        if (_root) {
            _chart.selectAll(".reset").style("display", "none");
            _chart.selectAll(".filter").style("display", "none").text(_chart.filter());
        }
        return _chart;
    };

    /**
    #### .transitionDuration([duration])
    Set or get animation transition duration(in milliseconds) for specific chart instance. Default duration is 750ms.

    **/
    _chart.transitionDuration = function (d) {
        if (!arguments.length) return _transitionDuration;
        _transitionDuration = d;
        return _chart;
    };

    /**
    #### .render()
    Invoke this method will force the chart to re-render everything from scratch. Generally it should be only used to
    render the chart for the first time on the page or if you want to make sure everything is redrawn from scratch instead
    of relying on the default incremental redrawing behaviour.

    **/
    _chart.render = function () {
        _listeners.preRender(_chart);

        if (_dimension === undefined)
            throw new dc.errors.InvalidStateException("Mandatory attribute chart.dimension is missing on chart[#"
                + _chart.anchorName() + "]");

        if (_group === undefined)
            throw new dc.errors.InvalidStateException("Mandatory attribute chart.group is missing on chart[#"
                + _chart.anchorName() + "]");

        var result = _chart.doRender();

        if (_legend) _legend.render();

        _chart.activateRenderlets("postRender");

        return result;
    };

    _chart.activateRenderlets = function (event) {
        if (_chart.transitionDuration() > 0 && _svg) {
            _svg.transition().duration(_chart.transitionDuration())
                .each("end", function () {
                    runAllRenderlets();
                    if (event) _listeners[event](_chart);
                });
        } else {
            runAllRenderlets();
            if (event) _listeners[event](_chart);
        }
    };

    /**
    #### .redraw()
    Calling redraw will cause the chart to re-render delta in data change incrementally. If there is no change in the
    underlying data dimension then calling this method will have no effect on the chart. Most of the chart interaction in
    dc library will automatically trigger this method through its internal event engine, therefore you only need to manually
    invoke this function if data is manipulated outside of dc's control; for example if data is loaded on a periodic basis
    in the background using crossfilter.add().

    **/
    _chart.redraw = function () {
        _listeners.preRedraw(_chart);

        var result = _chart.doRedraw();

        _chart.activateRenderlets("postRedraw");

        return result;
    };

    _chart._invokeFilteredListener = function (f) {
        if (f !== undefined) _listeners.filtered(_chart, f);
    };

    _chart._invokeZoomedListener = function () {
        _listeners.zoomed(_chart);
    };

    /**
    #### .hasFilter([filter])
    Check whether is any active filter or a specific filter is associated with particular chart instance.
    This function is **not chainable**.

    **/
    _chart.hasFilter = function (filter) {
        if (!arguments.length) return _filters.length > 0;
        return _filters.indexOf(filter) >= 0;
    };

    function removeFilter(_) {
        _filters.splice(_filters.indexOf(_), 1);
        applyFilters();
        _chart._invokeFilteredListener(_);
    }

    function addFilter(_) {
        _filters.push(_);
        applyFilters();
        _chart._invokeFilteredListener(_);
    }

    function resetFilters() {
        _filters = [];
        applyFilters();
        _chart._invokeFilteredListener(null);
    }

    function applyFilters() {
        if (_chart.dataSet() && _chart.dimension().filter !== undefined) {
            var fs = _filterHandler(_chart.dimension(), _filters);
            _filters = fs ? fs : _filters;
        }
    }

    /**
    #### .filter([filterValue])
    Filter the chart by the given value or return the current filter if the input parameter is missing.
    ```js
    // filter by a single string
    chart.filter("Sunday");
    // filter by a single age
    chart.filter(18);
    ```

    **/
    _chart.filter = function (_) {
        if (!arguments.length) return _filters.length > 0 ? _filters[0] : null;

        if (_ === null) {
            resetFilters();
        } else {
            if (_chart.hasFilter(_))
                removeFilter(_);
            else
                addFilter(_);
        }

        if (_root !== null && _chart.hasFilter()) {
            _chart.turnOnControls();
        } else {
            _chart.turnOffControls();
        }

        return _chart;
    };

    /**
    #### .filters()
    Return all current filters. This method does not perform defensive cloning of the internal filter array before returning
    therefore any modification of returned array will affact chart's internal filter storage.

    **/
    _chart.filters = function () {
        return _filters;
    };

    _chart.highlightSelected = function (e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, true);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };

    _chart.fadeDeselected = function (e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, true);
    };

    _chart.resetHighlight = function (e) {
        d3.select(e).classed(dc.constants.SELECTED_CLASS, false);
        d3.select(e).classed(dc.constants.DESELECTED_CLASS, false);
    };

    _chart.onClick = function (d) {
        var filter = _chart.keyAccessor()(d);
        dc.events.trigger(function () {
            _chart.filter(filter);
            dc.redrawAll(_chart.chartGroup());
        });
    };

    /**
    #### .filterHandler([function])
    Set or get filter handler. Filter handler is a function that performs the filter action on a specific dimension. Using
    custom filter handler give you the flexibility to perform additional logic before or after filtering.

    ```js
    // default filter handler
    function(dimension, filter){
        dimension.filter(filter); // perform filtering
        return filter; // return the actual filter value
    }

    // custom filter handler
    chart.filterHandler(function(dimension, filter){
        var newFilter = filter + 10;
        dimension.filter(newFilter);
        return newFilter; // set the actual filter value to the new value
    });
    ```

    **/
    _chart.filterHandler = function (_) {
        if (!arguments.length) return _filterHandler;
        _filterHandler = _;
        return _chart;
    };

    // abstract function stub
    _chart.doRender = function () {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    _chart.doRedraw = function () {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    _chart.legendables = function () {
        // do nothing in base, should be overridden by sub-function
        return [];
    };

    _chart.legendHighlight = function (d) {
        // do nothing in base, should be overridden by sub-function
    };

    _chart.legendReset = function (d) {
        // do nothing in base, should be overridden by sub-function
    };

    /**
    #### .keyAccessor([keyAccessorFunction])
    Set or get the key accessor function. Key accessor function is used to retrieve key value in crossfilter group. Key
    values are used differently in different charts, for example keys correspond to slices in pie chart and x axis position
    in grid coordinate chart.
    ```js
    // default key accessor
    chart.keyAccessor(function(d) { return d.key; });
    // custom key accessor for a multi-value crossfilter reduction
    chart.keyAccessor(function(p) { return p.value.absGain; });
    ```

    **/
    _chart.keyAccessor = function (_) {
        if (!arguments.length) return _keyAccessor;
        _keyAccessor = _;
        return _chart;
    };

    /**
    #### .valueAccessor([valueAccessorFunction])
    Set or get the value accessor function. Value accessor function is used to retrieve value in crossfilter group. Group
    values are used differently in different charts, for example group values correspond to slices size in pie chart and y
    axis position in grid coordinate chart.
    ```js
    // default value accessor
    chart.valueAccessor(function(d) { return d.value; });
    // custom value accessor for a multi-value crossfilter reduction
    chart.valueAccessor(function(p) { return p.value.percentageGain; });
    ```

    **/
    _chart.valueAccessor = function (_) {
        if (!arguments.length) return _valueAccessor;
        _valueAccessor = _;
        return _chart;
    };

    /**
    #### .label([labelFunction])
    Set or get the label function. Chart class will use this function to render label for each child element in the chart,
    i.e. a slice in a pie chart or a bubble in a bubble chart. Not every chart supports label function for example bar chart
    and line chart do not use this function at all.
    ```js
    // default label function just return the key
    chart.label(function(d) { return d.key; });
    // label function has access to the standard d3 data binding and can get quite complicated
    chart.label(function(d) { return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)"; });
    ```

    **/
    _chart.label = function (_) {
        if (!arguments.length) return _label;
        _label = _;
        _renderLabel = true;
        return _chart;
    };

    /**
    #### .renderLabel(boolean)
    Turn on/off label rendering

    **/
    _chart.renderLabel = function (_) {
        if (!arguments.length) return _renderLabel;
        _renderLabel = _;
        return _chart;
    };

    /**
    #### .title([titleFunction])
    Set or get the title function. Chart class will use this function to render svg title(usually interrupted by browser
    as tooltips) for each child element in the chart, i.e. a slice in a pie chart or a bubble in a bubble chart. Almost
    every chart supports title function however in grid coordinate chart you need to turn off brush in order to use title
    otherwise the brush layer will block tooltip trigger.
    ```js
    // default title function just return the key
    chart.title(function(d) { return d.key + ": " + d.value; });
    // title function has access to the standard d3 data binding and can get quite complicated
    chart.title(function(p) {
        return p.key.getFullYear()
            + "\n"
            + "Index Gain: " + numberFormat(p.value.absGain) + "\n"
            + "Index Gain in Percentage: " + numberFormat(p.value.percentageGain) + "%\n"
            + "Fluctuation / Index Ratio: " + numberFormat(p.value.fluctuationPercentage) + "%";
    });
    ```

    **/
    _chart.title = function (_) {
        if (!arguments.length) return _title;
        _title = _;
        _renderTitle = true;
        return _chart;
    };

    /**
    #### .renderTitle(boolean)
    Turn on/off title rendering

    **/
    _chart.renderTitle = function (_) {
        if (!arguments.length) return _renderTitle;
        _renderTitle = _;
        return _chart;
    };

    /**
    #### .renderlet(renderletFunction)
    Renderlet is similar to an event listener on rendering event. Multiple renderlets can be added to an individual chart.
    Every time when chart is rerendered or redrawn renderlet then will be invoked right after the chart finishes its own
    drawing routine hence given you a way to override or modify certain behaviour. Renderlet function accepts the chart
    instance as the only input parameter and you can either rely on dc API or use raw d3 to achieve pretty much any effect.
    ```js
    // renderlet function
    chart.renderlet(function(chart){
        // mix of dc API and d3 manipulation
        chart.select("g.y").style("display", "none");
        // its a closure so you can also access other chart variable available in the closure scope
        moveChart.filter(chart.filter());
    });
    ```

    **/
    _chart.renderlet = function (_) {
        _renderlets.push(_);
        return _chart;
    };

    function runAllRenderlets() {
        for (var i = 0; i < _renderlets.length; ++i) {
            _renderlets[i](_chart);
        }
    }

    _chart.chartGroup = function (_) {
        if (!arguments.length) return _chartGroup;
        _chartGroup = _;
        return _chart;
    };

    /**
    #### .expireCache()
    Expire internal chart cache. dc.js chart cache some data internally on a per chart basis so it can speed up rendering
    and avoid unnecessary calculation however under certain circumstances it might be useful to clear the cache e.g. after
    you invoke crossfilter.add function or if you reset group or dimension post render it is always a good idea to clear
    the cache to make sure charts are rendered properly.

    **/
    _chart.expireCache = function () {
        // do nothing in base, should be overridden by sub-function
        return _chart;
    };

    /**
    #### .legend([dc.legend])
    Attach dc.legend widget to this chart. Legend widget will automatically draw legend labels based on the color setting
    and names associated with each group.

    ```js
    chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5))
    ```

    **/
    _chart.legend = function (l) {
        if (!arguments.length) return _legend;
        _legend = l;
        _legend.parent(_chart);
        return _chart;
    };

    /**
    ## <a name="listeners" href="#listeners">#</a> Listeners
    All dc chart instance supports the following listeners.

    #### .on("preRender", function(chart){...})
    This listener function will be invoked before chart rendering.

    #### .on("postRender", function(chart){...})
    This listener function will be invoked after chart finish rendering including all renderlets' logic.

    #### .on("preRedraw", function(chart){...})
    This listener function will be invoked before chart redrawing.

    #### .on("postRedraw", function(chart){...})
    This listener function will be invoked after chart finish redrawing including all renderlets' logic.

    #### .on("filtered", function(chart, filter){...})
    This listener function will be invoked after a filter is applied, added or removed.

    #### .on("zoomed", function(chart, filter){...})
    This listener function will be invoked after a zoom is triggered.

    **/
    _chart.on = function (event, listener) {
        _listeners[event] = listener;
        return _chart;
    };

    return _chart;
};
