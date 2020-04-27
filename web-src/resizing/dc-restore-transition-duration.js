const restore_getset = (property, value) => f => c => {
    if(Array.isArray(c))
        c.forEach(restore_getset(property, value)(f));
    else {
        const cs = c.children ? [c].concat(c.children()) : [c],
              last = cs.map(c => c[property]());
        cs.forEach(ch => ch[property](value));
        f(c);
        cs.forEach(ch => ch[property](last));
    }
    return c;
};

const no_transitions = restore_getset('transitionDuration', 0);
const redraw_chart_no_transitions = no_transitions(c => c.redraw());
