// for a getter/setter property name and a value,
// return a function that wraps a function so that the property
// is set to the new value, the wrapped function is run on the chart,
// and the property value is then restored

// also applies to arrays of charts, and children of composite charts
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

// specifically, turn off transitions for a chart or charts
const no_transitions = restore_getset('transitionDuration', 0);
// specifically, turn off transitions for a chart or charts and redraw
const redraw_chart_no_transitions = no_transitions(c => c.redraw());
