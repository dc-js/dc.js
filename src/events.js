dc.events = {
    current: null
};

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
