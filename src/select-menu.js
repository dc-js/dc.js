/**
 ## Select Menu
 Includes: [Base Mixin](#base-mixin)

The select menu is a simple widget that allows filtering a dimension by selecting an option from an HTML <select/> menu.

 #### dc.selectMenu(parent[, chartGroup])
 Create a select menu instance and attach it to the given parent element.

 Parameters:
* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.

 Returns:
 A newly created select menu instance.

 ```js
   var select = dc.selectMenu('#select-container')
                  .dimension(states)
                  .group(stateGroup);

   // the option text can be set via the title function
   // by default the option text is '`key`: `value`'
   select.title(function(d){
      return 'STATE: ' + d.key;
   })
 ```

 **/
dc.selectMenu = function (parent, chartGroup) {
    var SELECT_CSS_CLASS = 'dc-select-menu';
    var OPTION_CSS_CLASS = 'dc-select-option';

    var _chart = dc.baseMixin({});

    var _select;
    var _promptText = 'Select all';
    var _order = function (a, b) {
        return _chart.keyAccessor()(a) > _chart.keyAccessor()(b) ?
             1 : _chart.keyAccessor()(b) > _chart.keyAccessor()(a) ?
            -1 : 0;
    };

    var _filterDisplayed = function (d) {
        return _chart.valueAccessor()(d) > 0;
    };

    _chart.data(function (group) {
        return group.all().filter(_filterDisplayed);
    });

    _chart._doRender = function () {
        _chart.select('select').remove();
        _select = _chart.root().append('select').classed(SELECT_CSS_CLASS, true);
        _select.append('option').text(_promptText).attr('value', '');
        renderOptions();
        return _chart;
    };

    _chart._doRedraw = function () {
        renderOptions();
        // select the option that corresponds to current filter
        if (_chart.hasFilter()) {
            _select.property('value', _chart.filter());
        } else {
            _select.property('value', '');
        }
        return _chart;
    };

    function renderOptions () {
        var options = _select.selectAll('option.' + OPTION_CSS_CLASS)
          .data(_chart.data(), function (d) { return _chart.keyAccessor()(d); });

        options.enter()
              .append('option')
              .classed(OPTION_CSS_CLASS, true)
              .attr('value', function (d) { return _chart.keyAccessor()(d); });

        options.text(_chart.title());
        options.exit().remove();
        _select.selectAll('option.' + OPTION_CSS_CLASS).sort(_order);

        _select.on('change', onChange);
        return options;
    }

    function onChange () {
        _chart.onChange(this.value);
    }

    _chart.onChange = function (val) {
        if (val) {
            _chart.replaceFilter(val);
        } else {
            _chart.filterAll();
        }
        dc.events.trigger(function () {
            _chart.redrawGroup();
        });
    };

    /**
    #### .order([function])
    Get or set the function that controls the ordering of option tags in the
    select menu. By default options are ordered by the group key in ascending
    order. To order by the group's value for example an appropriate comparator
     function needs to be specified:
    ```
        chart.order(function(a,b) {
            return a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
        });
    ```
    **/
    _chart.order = function (_) {
        if (!arguments.length) {
            return _order;
        }
        _order = _;
        return _chart;
    };

    /**
    #### .promptText([value])
    Gets or sets the text displayed in the options used to prompt selection.
    The default is 'Select all'.
    ```
        chart.promptText('All states');
    ```
    **/
    _chart.promptText = function (_) {
        if (!arguments.length) {
            return _promptText;
        }
        _promptText = _;
        return _chart;
    };

    /**
    #### .filterDisplayed([function])
    Get or set the function that filters option tags prior to display.
    By default options with a value of < 1 are not displayed.
    To always display all options override the `filterDisplayed` function:
    ```
        chart.filterDisplayed(function() {
            return true;
        });
    ```
    **/
    _chart.filterDisplayed = function (_) {
        if (!arguments.length) {
            return _filterDisplayed;
        }
        _filterDisplayed = _;
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
