/* global loadDateFixture, appendChartID */
describe('dc.textFilterWidget', function () {
    var dateFixture;
    var id, chart, data;
    var dimension, group;
    var countryDimension;

    beforeEach(function () {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(function (d) {
            return d.countrycode + ' ' + d.state;
        });
        group = dimension.group().reduceSum(function (d) {
            return 1;
        });
        countryDimension = data.dimension(function (d) {
            return d.countrycode;
        });

        id = 'input-filter';
        appendChartID(id);
        chart = dc.textFilterWidget('#' + id)
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
        it('exists for normalize()', function () {
            var normalize = chart.normalize();
            expect(typeof normalize).toBe('function');
        });
        it('exists for filterFunctionFactory()', function () {
            var filterFunctionFactory = chart.filterFunctionFactory();
            expect(typeof filterFunctionFactory).toBe('function');
        });
        it('exists for placeHolder()', function () {
            var placeHolder = chart.placeHolder();
            expect(typeof placeHolder).toBe('string');
            expect(placeHolder).toBe('search');
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

        it('filters the dimension', function () {
            mockTyping('lifo'); // Will match California
            expect(chart.dimension().top(1000).length).toEqual(3);
        });

        it('filters the dimension in case insensitive way', function () {
            mockTyping('LiFo'); // Will match California
            expect(chart.dimension().top(1000).length).toEqual(3);
        });

    });

    afterEach(function () {
        dimension.filterAll();
    });
});
