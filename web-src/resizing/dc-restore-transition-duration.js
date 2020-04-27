const restore_getset = (property, value) => f => c => {
    const self = restore_getset(property, value)(f);
    if(Array.isArray(c))
        c.forEach(self);
    else {
        if(c.children)
            c.children().forEach(self);
        const last = c[property]();
        c[property](value);
        f(c);
        c[property](last);
    }
    return c;
};

const no_transitions = restore_getset('transitionDuration', 0);
const redraw_chart_no_transitions = no_transitions(c => c.redraw());
