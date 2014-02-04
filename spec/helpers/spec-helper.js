beforeEach(function() {
    d3.select("body").append("div").attr("id", "test-content");
    jasmine.clock().install();
    var matchers = {
        toMatchTranslate: function() {
            return {
                compare: function(actual, x, y, prec) {
                    var parts = /translate\((.*)[, ](.*)\)/.exec(actual);
                    prec = prec || 10; // default 10 digits after decimal
                    if(!parts && !y) { // IE clips y if it's 0
                        parts = /translate\((.*)\)/.exec(actual);
                        if(parts) parts.push(0);
                    }
                    if(!parts)
                        return {pass: false, message: "'" + actual + "' did not match translate(x,y) regexp"};
                    expect(parts.length).toEqual(3);
                    expect(+parts[1]).toBeCloseTo(x, prec);
                    expect(+parts[2]).toBeCloseTo(y, prec);
                    return {pass: true};  // ignore possibility of not.toBeTranslate (?)
                }
            };
        },
        toMatchUrl: function() {
            return {
                compare: function(actual, url) {
                    var regexp = new RegExp("url\\(\"?" + url + "\"?\\)");
                    expect(actual).toMatch(regexp);
                    return {pass:true};
                }
            };
        }
    };
    jasmine.addMatchers(matchers);
});

afterEach(function () {
    dc.deregisterAllCharts();
    d3.selectAll("#test-content").remove();
    jasmine.clock().uninstall();
});

function appendChartID(id) {
    return d3.select("#test-content").append("div").attr("id", id);
}

function coordsFromTranslate(translationString) {
    var regex = /translate\((.+)[, ](.+)\)/;
    var result = regex.exec(translationString);
    if(!result) { // IE clips y if it's 0
        result = /translate\((.*)\)/.exec(translationString);
        if(result) result.push(0);
    }
    expect(result).not.toBeNull();
    return { x: +result[1], y: +result[2] };
}
