dc.events = {};

dc.events.trigger = function(closure, delay){
    if(!delay)
        closure();

    setTimeout(closure, delay);
};
