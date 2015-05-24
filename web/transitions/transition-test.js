(function() {
    var inter;
    function stop() {
        window.clearInterval(inter);
    }
    window.stop = stop;
    function back_and_forth(T, f1, f2) {
        return function() {
            stop();
            var which = false;
            f1();
            dc.redrawAll();
            inter = window.setInterval(function() {
                if((which = !which))
                    f2();
                else
                    f1();
                dc.redrawAll();
            }, T);
        };
    }
    window.back_and_forth = back_and_forth;
})();
