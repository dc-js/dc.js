/* global parseTranslate */
/* eslint "no-unused-vars": 0 */

/*exported appendChartID, coordsFromTranslate, makeDate, cleanDateRange, flushAllD3Transitions */
/*exported simulateChartBrushing, simulateChart2DBrushing */

beforeEach(() => {
    jasmine.clock().install();
    d3.select('body').append('div').attr('id', 'test-content');
});

afterEach(() => {
    dc.deregisterAllCharts();
    dc.renderlet(null);
    d3.selectAll('#test-content').remove();
    jasmine.clock().uninstall();
});

function appendChartID (id) {
    return d3.select('#test-content').append('div').attr('id', id);
}

function coordsFromTranslate (translationString) {
    const result = parseTranslate(translationString);
    expect(result).not.toBeNull();
    return {x: +result[1], y: +result[2]};
}

// use UTC dates because these tests will be run in many time zones
function makeDate (year, month, day) {
    if (typeof year === 'string' || arguments.length !== 3) {
        throw new Error('makeDate takes year, month, day');
    }
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
}

// the invisible non-array members that we add in dc.filter cause the objects
// to be non-equal (correctly, but with no good diagnostics) in the eyes of Jasmine.
function cleanDateRange (range) {
    return [range[0], range[1]];
}

// http://stackoverflow.com/questions/20068497/d3-transition-in-unit-testing
function flushAllD3Transitions () {
    d3.timerFlush();
}

// Simulate a dummy event - just enough for the handler to get fooled
const simulateChartBrushing = function (chart, domainSelection) {
    // D3v4 needs scaled coordinates for the event
    const scaledSelection = domainSelection.map(coord => chart.x()(coord));

    d3.event = {
        sourceEvent: true,
        selection: scaledSelection
    };

    try {
        chart._brushing();
    } finally {
        d3.event = null;
    }
};

// Simulate a dummy event - just enough for the handler to get fooled
const simulateChart2DBrushing = function (chart, domainSelection) {
    // D3v4 needs scaled coordinates for the event
    const scaledSelection = domainSelection.map(point => point.map((coord, i) => {
        const scale = i === 0 ? chart.x() : chart.y();
        return scale(coord);
    }));

    d3.event = {
        sourceEvent: true,
        selection: scaledSelection
    };

    try {
        chart._brushing();
    } finally {
        d3.event = null;
    }
};
