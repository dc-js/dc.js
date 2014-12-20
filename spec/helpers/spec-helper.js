beforeEach(function() {
    d3.select("body").append("div").attr("id", "test-content");
    jasmine.clock().install();

    // If we're using browserify bundle, pull d3 and crossfilter out of it,
    // so that tests don't have to deal with this incidental complexity.
    if (typeof d3 === 'undefined') { d3 = dc.d3; }
    if (typeof crossfilter === 'undefined') { crossfilter = dc.crossfilter; }

});

afterEach(function () {
    dc.deregisterAllCharts();
    dc.renderlet(null);
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

// use UTC dates because these tests will be run in many time zones
function makeDate(year, month, day) {
    if(typeof year === 'string' || arguments.length !== 3)
        throw new Error("makeDate takes year, month, day");
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}
