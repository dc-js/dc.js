/* global loadDateFixture, appendChartID */
describe('dc.textFilterWidget', () => {
    let dateFixture;
    let id, chart, data;
    let dimension, group;

    beforeEach(() => {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(d => `${d.countrycode} ${d.state}`);
        group = dimension.group().reduceSum(d => 1);

        id = 'input-filter';
        appendChartID(id);
        chart = new dc.TextFilterWidget(`#${id}`)
            .dimension(dimension)
            .group(group);
        chart.render();
    });

    describe('creation', () => {
        it('generates something', () => {
            expect(chart).not.toBeNull();
        });
        it('registers', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets an input field', () => {
            expect(chart.selectAll('input').nodes().length).toEqual(1);
        });
        it('doesn\'t filter by default', () => {
            expect(chart.dimension().top(1000).length).toEqual(10);
        });
    });

    describe('default accessor functions', () => {
        it('exists for normalize()', () => {
            const normalize = chart.normalize();
            expect(typeof normalize).toBe('function');
        });
        it('exists for filterFunctionFactory()', () => {
            const filterFunctionFactory = chart.filterFunctionFactory();
            expect(typeof filterFunctionFactory).toBe('function');
        });
        it('exists for placeHolder()', () => {
            const placeHolder = chart.placeHolder();
            expect(typeof placeHolder).toBe('string');
            expect(placeHolder).toBe('search');
        });
    });

    describe('filter when typing', () => {
        const mockTyping = function (q) {
            const i = d3.select('input');
            i.nodes()[0].value = q;
            i.on('input').call(i.node(), i.datum());
        };

        beforeEach(() => {
            chart.redraw();
        });

        it('has a mock function that sets the value', () => {
            mockTyping('42');
            expect(chart.selectAll('input').nodes()[0].value).toEqual('42');
        });

        it('filters the dimension', () => {
            mockTyping('lifo'); // Will match California
            expect(chart.dimension().top(1000).length).toEqual(3);
        });

        it('filters the dimension in case insensitive way', () => {
            mockTyping('LiFo'); // Will match California
            expect(chart.dimension().top(1000).length).toEqual(3);
        });

    });

    afterEach(() => {
        dimension.filterAll();
    });
});
