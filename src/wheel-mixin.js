/**
## Wheel Mixin

Wheel Mixin is an abstract chart functional class created to simplify use of
  as a mix-in for any concrete
chart implementation.

**/

dc.wheelMixin = function(_chart) {

    /*
     * These 3 elements below allow to disable an action during a certain time.
     * It is necessary because the mousewheel call the function several time successively.
     */
    var disabledActions = {
        mousewheel : false,
    };

    function delayAction (name, delay) {
        disabledActions[name] = true;
        d3.timer(function () { enableAction(name); return true; }, delay);
    }

    function enableAction (name) {
        disabledActions[name] = false;
    }


    /**
    #### .onMouseWheel(d, zoomIn, zoomOut)

    This function will be called on mouseweel event.

    **Parameters:**

    * `d`: d3 SVG element on which we zoomed
    * `zoomIn`: optional, indicates if zoomIn behavior is allowed (default: true)
    * `zoomOut`:  optional, indicates if zoomOut behavior is allowed (default: true)

    You should call this function when a mouseweel event is done on an element of the SVG.
    To do this, simply use this code when on the SVG elements that you want:

    ```js
    // only allows zoomIn
    elements
        .on("mousewheel", function(d) { _chart.onMouseWheel(d, true, false); })
        .on("DOMMouseScroll", _chart.onMouseWheel function(d) { _chart.onMouseWheel(d, true, false); }) // older versions of Firefox
        .on("wheel", function(d) { _chart.onMouseWheel(d, true, false); }); // newer versions of Firefox
    ```
    */
    _chart.onMouseWheel = function (d, zoomIn, zoomOut) {
        if (zoomIn === undefined)
            zoomIn = true;
        if (zoomOut === undefined)
            zoomOut = true;

        // on zoomIn
        if (!disabledActions.mousewheel && zoomIn && (d3.event.deltaY < 0 || d3.event.wheelDeltaY > 0) && _chart._callbackZoomIn !== undefined) {
            delayAction('mousewheel', 1500);
            _chart._zoomIn(d);
        }

        // on zoomIn-out
        else if (!disabledActions.mousewheel && zoomOut && (d3.event.deltaY > 0 || d3.event.wheelDeltaY < 0) && _chart._callbackZoomOut !== undefined) {
            delayAction('mousewheel', 1500);
            _chart._zoomOut();
        }

        // prevent scrolling on page
        d3.event.preventDefault();
        return false;
    };

    _chart._zoomIn = function (d) {
        _chart._onZoomIn(d);
        _chart.callbackZoomIn()(_chart.keyAccessor()(d));
    };

    _chart._zoomOut = function (d) {
        _chart._onZoomOut();
        _chart.callbackZoomOut()();
    };

    /**
    #### ._onZoomIn(d)
    Function called on zoom in. Default behavior does nothing. Your chart should redefine this if you want to do something on zoom in other that calling the callback.
    **/
    _chart._onZoomIn = function (d) {
    };

    /**
    #### ._onZoomOut()
    Function called on zoom out. Default behavior does nothing. Your chart should redefine this if you want to do something on zoom out other that calling the callback.
    **/
    _chart._onZoomOut = function () {
    };

    /**
    #### .callbackZoomIn([callback])
    Set or get the current callback function on zoomIn.

    If `callback` is `null`, removes the callback.
    **/
    _chart.callbackZoomIn = function (callback) {
        if (!arguments.length) {
            if (_chart._callbackZoomIn !== undefined)
                return _chart._callbackZoomIn;
            else
                return null;
        }

        if (callback === null) _chart._callbackZoomIn = undefined;
        else _chart._callbackZoomIn = callback;

        return _chart;
    };

    /**
    #### .callbackZoomOut([callback])
    Set or get the current callback function on zoomOut.

    If `callback` is `null`, removes the callback.
    **/
    _chart.callbackZoomOut = function (callback) {
        if (!arguments.length) {
            if (_chart._callbackZoomOut !== undefined)
                return _chart._callbackZoomOut;
            else
                return null;
        }

        if (callback === null) _chart._callbackZoomOut = undefined;
        else _chart._callbackZoomOut = callback;

        return _chart;
    };

    return _chart;
};
