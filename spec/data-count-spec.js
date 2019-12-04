/* global appendChartID, loadDateFixture */
describe('dc.dataCount', () => {
    let data, countryDimension, groupAll;
    let chart;
    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        groupAll = data.groupAll();
        countryDimension = data.dimension(d => d.countrycode);
        countryDimension.filter('CA');
    });
    function buildChart (id) {
        const dataCount = new dc.DataCount(`#${id}`)
            .transitionDuration(0)
            .dimension(data)
            .group(groupAll);
        dataCount.render();
        d3.timerFlush();
        return dataCount;
    }
    describe('creation', () => {
        beforeEach(() => {
            const id = 'data-count';
            const div = appendChartID(id);
            div.append('span').attr('class', 'filter-count');
            div.append('span').attr('class', 'total-count');
            chart = buildChart(id);
        });
        it('should generate something', () => {
            expect(chart).not.toBeNull();
        });
        it('treats dimension as synonym of crossfilter', () => {
            expect(chart.dimension()).toEqual(chart.crossfilter());
            const newVal = () => {}; // Just any value will do
            chart.dimension(newVal);
            expect(chart.crossfilter()).toBe(newVal);
        });
        it('treats group as synonym of groupAll', () => {
            expect(chart.group()).toEqual(chart.groupAll());
            const newVal = () => {}; // Just any value will do
            chart.group(newVal);
            expect(chart.groupAll()).toBe(newVal);
        });
        it('should be registered', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('should fill in the total count', () => {
            expect(chart.select('span.total-count').text()).toEqual('10');
        });
        it('should fill in the filter count', () => {
            expect(chart.select('span.filter-count').text()).toEqual('2');
        });
        describe('redraw', () => {
            beforeEach(() => {
                countryDimension.filterAll();
                chart.redraw();
                return chart;
            });
            it('should fill in the updated total count', () => {
                expect(chart.select('span.total-count').text()).toEqual('10');
            });
            it('should fill in the updated filter count', () => {
                expect(chart.select('span.filter-count').text()).toEqual('10');
            });
        });
        afterEach(() => {
            countryDimension.filterAll();
        });
    });

    describe('creation with html attribute', () => {
        beforeEach(() => {
            const id = 'data-count';
            const div = appendChartID(id);
            div.append('span').attr('class', 'filter-count');
            div.append('span').attr('class', 'total-count');
            chart = buildChart(id);
            chart.html({some: '%filter-count selected from %total-count',all: 'All Records Selected'});
            chart.redraw();
        });
        it('should generate something', () => {
            expect(chart).not.toBeNull();
        });
        it('should be registered', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('should fill the element replacing %filter-count and %total-count', () => {
            expect(chart.root().text()).toEqual('2 selected from 10');
        });
        describe('when all selected', () => {
            beforeEach(() => {
                countryDimension.filterAll();
                chart.redraw();
                return chart;
            });
            it('should use html.all', () => {
                expect(chart.root().text()).toEqual('All Records Selected');
            });
        });
        afterEach(() => {
            countryDimension.filterAll();
        });
    });

    describe('creation with just html.some attribute', () => {
        beforeEach(() => {
            const id = 'data-count';
            const div = appendChartID(id);
            div.append('span').attr('class', 'filter-count');
            div.append('span').attr('class', 'total-count');
            chart = buildChart(id);
            chart.html({some: '%filter-count selected from %total-count'});
            chart.redraw();
        });
        it('should fill the element replacing %filter-count and %total-count', () => {
            expect(chart.root().text()).toEqual('2 selected from 10');
        });
        describe('when all selected', () => {
            beforeEach(() => {
                countryDimension.filterAll();
                chart.redraw();
                return chart;
            });
            it('should use html.some for all', () => {
                expect(chart.root().text()).toEqual('10 selected from 10');
            });
        });
        afterEach(() => {
            countryDimension.filterAll();
        });
    });

    describe('creation with just html.all attribute', () => {
        beforeEach(() => {
            const id = 'data-count';
            const div = appendChartID(id);
            div.append('span').attr('class', 'filter-count');
            div.append('span').attr('class', 'total-count');
            chart = buildChart(id);
            chart.html({all: 'All Records Selected'});
            chart.redraw();
        });
        it('should fill in the total count', () => {
            expect(chart.select('span.total-count').text()).toEqual('10');
        });
        it('should fill in the filter count', () => {
            expect(chart.select('span.filter-count').text()).toEqual('2');
        });
        describe('when all selected', () => {
            beforeEach(() => {
                countryDimension.filterAll();
                chart.redraw();
                return chart;
            });
            it('should use html.all for all', () => {
                expect(chart.root().text()).toEqual('All Records Selected');
            });
        });
        afterEach(() => {
            countryDimension.filterAll();
        });
    });

    describe('creation with formatNumber attribute', () => {
        beforeEach(() => {
            const id = 'data-count';
            const div = appendChartID(id);
            div.append('span').attr('class', 'filter-count');
            div.append('span').attr('class', 'total-count');
            chart = buildChart(id);
            chart.formatNumber(d3.format('04.1g'));
            chart.redraw();
        });
        it('should generate something', () => {
            expect(chart).not.toBeNull();
        });
        it('should be registered', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('should fill in the formatted total count', () => {
            expect(chart.select('span.total-count').text()).toEqual('1e+1');
        });
        it('should fill in the formatted filter count', () => {
            expect(chart.select('span.filter-count').text()).toEqual('0002');
        });
        afterEach(() => {
            countryDimension.filterAll();
        });
    });

});
