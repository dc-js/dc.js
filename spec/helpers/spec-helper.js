function parseTranslate(actual) {
    var parts = /translate\((-?[\d\.]*)(?:[, ](.*))?\)/.exec(actual);
    if(!parts)
        return null;
    if(parts[2]===undefined)
        parts[2] = 0;
    expect(parts.length).toEqual(3);
    return parts;
}

function parseTranslateRotate(actual) {
    var parts = /translate\((-?[\d\.]*)(?:[, ](.*))?\)[, ]rotate\((-?[\d\.]*)\)/.exec(actual);
    if(!parts)
        return null;
    if(parts[2]===undefined)
        parts[2] = 0;
    expect(parts.length).toEqual(4);
    return parts;
}

beforeEach(function() {
    d3.select("body").append("div").attr("id", "test-content");
    jasmine.clock().install();
    var matchers = {
        toMatchTranslate: function() {
            return {
                compare: function(actual, x, y, prec) {
                    var parts = parseTranslate(actual);
                    if(!parts)
                        return {pass: false, message: "'" + actual + "' did not match translate(x[,y]) regexp"};
                    expect(+parts[1]).toBeCloseTo(x, prec);
                    expect(+parts[2]).toBeCloseTo(y, prec);
                    return {pass: true};  // ignore possibility of not.toBeTranslate (?)
                }
            };
        },
        toMatchTransRot: function() {
            return {
                compare: function(actual, x, y, r, prec) {
                    var parts = parseTranslateRotate(actual);
                    if(!parts)
                        return {pass: false, message: "'" + actual + "' did not match translate(x[,y]),rotate(r) regexp"};
                    expect(+parts[1]).toBeCloseTo(x, prec);
                    expect(+parts[2]).toBeCloseTo(y, prec);
                    expect(+parts[3]).toBeCloseTo(r, prec);
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
    var result = parseTranslate(translationString);
    expect(result).not.toBeNull();
    return { x: +result[1], y: +result[2] };
}
