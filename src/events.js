dc.events = {
    current: null
};

dc.events.trigger = function(closure, delay) {
    dc.events.current = closure;

    if (!delay)
        closure();

    setTimeout(function() {
        if (closure == dc.events.current)
            closure();
    }, delay);
};
