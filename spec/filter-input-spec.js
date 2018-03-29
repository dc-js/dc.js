/* global loadDateFixture, appendChartID */
describe('dc.inputFilter', function () {
    var dateFixture;
    var id, chart, data;
    var dimension, group;
    var countryDimension;

    beforeEach(function () {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(function (d) {
            return d.countrycode.toLowerCase() + ' ' + d.state.toLowerCase();
        });
        group = dimension.group().reduceSum(function (d) {
            return 1;
        });
        countryDimension = data.dimension(function (d) {
            return d.countrycode;
        });

        id = 'input-filter';
        appendChartID(id);
        chart = dc.inputFilter('#' + id)
            .dimension(dimension)
            .group(group);
        chart.render();
    });

    describe('creation', function () {
        it('generates something', function () {
            expect(chart).not.toBeNull();
        });
        it('registers', function () {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets an input field', function () {
            expect(chart.selectAll('input').nodes().length).toEqual(1);
        });
        it('doesn\'t filter by default', function () {
            expect(chart.dimension().top(1000).length).toEqual(10);
        });
    });

    describe('default accessor functions', function () {
        it('exists for html()', function () {
            var html = chart.html();
            expect(typeof html).toBe('function');
        });
        it('exists for normalize()', function () {
            var normalize = chart.normalize();
            expect(typeof normalize).toBe('function');
        });
        it('exists for filterFunction()', function () {
            var filterFunction = chart.filterFunction();
            expect(typeof filterFunction).toBe('function');
        });
        it('exists for throttleDuration()', function () {
            var throttleDuration = chart.throttleDuration();
            expect(typeof throttleDuration).toBe('number');
            expect(throttleDuration).toBe(200);
        });
    });

    describe('change the html search field', function () {
        it('generates something', function () {
            expect(chart).not.toBeNull();
        });
        it('registers', function () {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets an input field', function () {
            expect(chart.selectAll('input').nodes().length).toEqual(1);
        });
        it('doesn\'t filter by default', function () {
            expect(chart.dimension().top(1000).length).toEqual(10);
        });
    });

    describe('filter when typing', function () {
        var mockTyping = function (q) {
            var i = d3.select('input');
            i.nodes()[0].value = q;
            i.on('input').call(i.node(), i.datum());
        };

        beforeEach(function () {
            chart.redraw();
        });

        it('has a mock function that sets the value', function () {
            mockTyping('42');
            expect(chart.selectAll('input').nodes()[0].value).toEqual('42');
        });

        it('a letter that exists', function () {
            mockTyping('C');
            expect(chart.selectAll('input').nodes().length).toEqual(1);
        });

    });

    afterEach(function () {
        dimension.filterAll();
    });
});
