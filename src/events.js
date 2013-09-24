dc.events = {
    current: null
};

/**
#### dc.events.trigger(function[, delay])
This function is design to trigger throttled event function optionally with certain amount of delay(in milli-seconds).
Events that are triggered repetitively due to user interaction such as the dragging of the brush might over flood
library and cause too much rendering being scheduled. In this case, using this function to wrap your event function
allows the library to smooth out the rendering by throttling event flood and only respond to the most recent event.

```js
    chart.renderlet(function(chart){
        // smooth the rendering through event throttling
        dc.events.trigger(function(){
            // focus some other chart to the range selected by user on this chart
            someOtherChart.focus(chart.filter());
        });
    })
```
**/
dc.events.trigger = function(closure, delay) {
    if (!delay){
        closure();
        return;
    }

    dc.events.current = closure;

    setTimeout(function() {
        if (closure == dc.events.current)
            closure();
    }, delay);
};
