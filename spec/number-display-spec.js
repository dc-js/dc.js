/* global appendChartID, loadDateFixture */
describe('dc.numberDisplay', () => {
    let data, meanGroup;
    let countryDimension;

    function average (d) {
        return d.n ? d.tot / d.n : 0;
    }

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        const groupAll = data.groupAll();
        meanGroup = groupAll.reduce(
            (p, v) => {
                ++p.n;
                p.tot += +v.value;
                return p;
            },
            (p, v) => {
                --p.n;
                p.tot -= +v.value;
                return p;
            },
            () => ({n: 0,tot: 0})
        );
        countryDimension = data.dimension(d => d.countrycode);
        countryDimension.filter('CA');
    });

    function buildChart (id) {
        const chart = new dc.NumberDisplay(id)
            .transitionDuration(0)
            .group(meanGroup)
            .formatNumber(d3.format('.3s'))
            .valueAccessor(average);
        chart.render();
        d3.timerFlush();
        return chart;
    }

    describe('Empty Div', () => {
        let chart;
        beforeEach(() => {
            const id = 'empty-div';
            appendChartID(id);
            chart = buildChart(`#${id}`);
        });
        it('should generate something', () => {
            expect(chart).not.toBeNull();
        });
        it('should be registered', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('should return a value', () => {
            expect(chart.value()).toEqual(38.5);
        });
        it('should have text value in child', () => {
            expect(chart.select('span.number-display').text()).toEqual('38.5');
        });
        describe('redraw', () => {
            beforeEach(() => {
                countryDimension.filterAll();
                chart.redraw();
                d3.timerFlush();
            });
            it('should update value', () => {
                expect(chart.select('span.number-display').text()).toEqual('41.8');
            });
        });
        describe('html with one, some and none', () => {
            beforeEach(() => {
                chart.html({one: '%number number',none: 'no number',some: '%number numbers'});
                chart.redraw();
                d3.timerFlush();
            });
            it('should use some for some', () => {
                expect(chart.select('span.number-display').text()).toEqual('38.5 numbers');
            });
        });
        describe('html with one, some and none', () => {
            beforeEach(() => {
                chart.html({one: '%number number',none: 'no number',some: '%number numbers'});
                chart.valueAccessor(d => 1);
                chart.redraw();
                d3.timerFlush();
            });
            it('should use one for one', () => {
                expect(chart.select('span.number-display').text()).toEqual('1.00 number');
            });
        });
        describe('html with one, some and none', () => {
            beforeEach(() => {
                chart.html({one: '%number number',none: 'no number',some: '%number numbers'});
                chart.valueAccessor(d => 0);
                chart.redraw();
                d3.timerFlush();
            });
            it('should use zero for zero', () => {
                expect(chart.select('span.number-display').text()).toEqual('no number');
            });
        });
        describe('html with just one', () => {
            beforeEach(() => {
                chart.html({one: '%number number'});
                chart.redraw();
                d3.timerFlush();
            });
            it('should use one for showing some', () => {
                expect(chart.select('span.number-display').text()).toEqual('38.5 number');
            });
        });
        describe('html with just some', () => {
            beforeEach(() => {
                chart.html({some: '%number numbers'});
                chart.redraw();
                d3.timerFlush();
            });
            it('should use some for showing one', () => {
                expect(chart.select('span.number-display').text()).toEqual('38.5 numbers');
            });
        });
        describe('html with just none', () => {
            beforeEach(() => {
                chart.html({});
                chart.redraw();
                d3.timerFlush();
            });
            it('should just show the number in case of some and one', () => {
                expect(chart.select('span.number-display').text()).toEqual('38.5');
            });
        });
        afterEach(() => {
            countryDimension.filterAll();
        });
    });
    describe('Div with embedded span', () => {
        let chart;
        beforeEach(() => {
            const id = 'full-div';
            const div = appendChartID(id);
            div.append('p').html('There are <span class="number-display">_</span> Total Widgets.');
            chart = buildChart(`#${id}`);
        });
        it('should have text value in child', () => {
            expect(chart.root().text()).toEqual('There are 38.5 Total Widgets.');
        });
        afterEach(() => {
            countryDimension.filterAll();
        });
    });
    describe('Inline nonspan element' , () => {
        beforeEach(() => {
            const div = d3.select('body').append('div').attr('id', 'number-display-test-section');
            div.append('p').html('There are <em id="nonspan"></em> Total Widgets.');
            buildChart('#nonspan');
        });
        it('should have text value in child', () => {
            expect(d3.select('body').select('#number-display-test-section').html())
                .toMatch(new RegExp('<p>There are <em (?:id="nonspan" class="dc-chart"|class="dc-chart" id="nonspan")>' +
                    '<span class="number-display">38.5</span></em> Total Widgets.</p>'));
        });
        afterEach(() => {
            countryDimension.filterAll();
            d3.select('#number-display-test-section').remove();
        });
    });
    describe('with group with multiple values', () => {
        let group, chart;
        beforeEach(() => {
            countryDimension.filterAll();
            group = countryDimension.group().reduceSum(d => +d.value);
            const id = 'empty-div';
            appendChartID(id);
            chart = buildChart(`#${id}`);
            chart
                .group(group)
                .valueAccessor(kv => kv.value)
                .render();
            d3.timerFlush();
        });

        it('should show the largest value', () => {
            expect(chart.select('span.number-display').text()).toEqual('341');
        });

        describe('with reversed ordering', () => {
            beforeEach(() => {
                chart.ordering(kv => -kv.value)
                    .render();
                d3.timerFlush();
            });
            it('should show the smallest value', () => {
                expect(chart.select('span.number-display').text()).toEqual('77.0');
            });
        });

    });
    describe('Infinity', () => {
        let chart;
        beforeEach(() => {
            const id = 'empty-div';
            appendChartID(id);
            chart = buildChart(`#${id}`);
            chart.valueAccessor(x => x)
                .group({value: function () { return Infinity; }})
                .formatNumber(d => d)
                .render();
            d3.timerFlush();
        });
        it('should display as Infinity', () => {
            expect(chart.root().text()).toEqual('Infinity');
        });
        describe('returning to finite', () => {
            beforeEach(() => {
                chart.group({value: function () { return 17; }})
                    .render();
                d3.timerFlush();
            });
            it('should display finite', () => {
                expect(chart.root().text()).toEqual('17');
            });
        });
    });
});
