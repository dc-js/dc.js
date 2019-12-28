/* global appendChartID, loadDateFixture */
describe('dc.dataGrid', () => {
    let id, chart, data;
    let dateFixture;
    let dimension;
    let countryDimension;

    beforeEach(() => {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(d => d3.utcDay(d.dd));
        countryDimension = data.dimension(d => d.countrycode);

        id = 'data-grid';
        appendChartID(id);
        chart = new dc.DataGrid(`#${id}`)
            .dimension(dimension)
            .group(d => 'Data Grid')
            .transitionDuration(0)
            .size(3)
            .sortBy(d => d.id)
            .order(d3.descending)
            .html(d => `<div id='id_${d.id}' class='${d.countrycode} ${d.region}'>${d.state}:${d.value}</div>`);
        chart.render();
    });

    describe('creation', () => {
        it('generates something', () => {
            expect(chart).not.toBeNull();
        });
        it('registers', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets size', () => {
            expect(chart.size()).toEqual(3);
        });
        it('sets sortBy', () => {
            expect(chart.sortBy()).not.toBeNull();
        });
        it('sets order', () => {
            expect(chart.order()).toBe(d3.descending);
        });
        it('sets the group label', () => {
            expect(chart.selectAll('.dc-grid-group h1.dc-grid-label').nodes()[0].innerHTML).toEqual('Data Grid');
        });
        it('treats group as synonym of section', () => {
            expect(chart.group()).toEqual(chart.section());
            const newSection = () => {};
            chart.group(newSection);
            expect(chart.section()).toBe(newSection);
        });
        it('treats htmlGroup as synonym of htmlSection', () => {
            expect(chart.htmlGroup()).toEqual(chart.htmlSection());
            const newHtmlSection = () => {};
            chart.htmlGroup(newHtmlSection);
            expect(chart.htmlSection()).toBe(newHtmlSection);
        });
        it('creates id div', () => {
            expect(chart.selectAll('.dc-grid-item div#id_9').nodes().length).toEqual(1);
            expect(chart.selectAll('.dc-grid-item div#id_8').nodes().length).toEqual(1);
            expect(chart.selectAll('.dc-grid-item div#id_3').nodes().length).toEqual(1);
        });
        it('creates div content', () => {
            expect(chart.selectAll('.dc-grid-item div').nodes()[0].innerHTML).toEqual('Mississippi:44');
            expect(chart.selectAll('.dc-grid-item div').nodes()[1].innerHTML).toEqual('Mississippi:33');
            expect(chart.selectAll('.dc-grid-item div').nodes()[2].innerHTML).toEqual('Delaware:33');
        });
    });

    describe('slicing entries', () => {
        beforeEach(() => {
            chart.beginSlice(1);
            chart.redraw();
        });

        it('slice beginning', () => {
            expect(chart.selectAll('.dc-grid-item').nodes().length).toEqual(2);
        });

        it('slice beginning and end', () => {
            chart.endSlice(2);
            chart.redraw();

            expect(chart.selectAll('.dc-grid-item').nodes().length).toEqual(1);
        });
    });

    describe('external filter', () => {
        beforeEach(() => {
            countryDimension.filter('CA');
            chart.redraw();
        });
        it('renders only filtered data set', () => {
            expect(chart.selectAll('.dc-grid-item div').nodes().length).toEqual(2);
        });
        it('renders the correctly filtered records', () => {
            expect(chart.selectAll('.dc-grid-item div').nodes()[0].innerHTML).toEqual('Ontario:22');
            expect(chart.selectAll('.dc-grid-item div').nodes()[1].innerHTML).toEqual('Ontario:55');
        });
    });

    describe('renderlet', () => {
        let derlet;
        beforeEach(() => {
            derlet = jasmine.createSpy('renderlet', _chart => {
                _chart.selectAll('.dc-grid-label').text('changed');
            });
            derlet.and.callThrough();
            chart.on('renderlet', derlet);
        });
        it('custom renderlet should be invoked with render', () => {
            chart.render();
            expect(chart.selectAll('.dc-grid-label').text()).toEqual('changed');
            expect(derlet).toHaveBeenCalled();
        });
        it('custom renderlet should be invoked with redraw', () => {
            chart.redraw();
            expect(chart.selectAll('.dc-grid-label').text()).toEqual('changed');
            expect(derlet).toHaveBeenCalled();
        });
    });

    afterEach(() => {
        dimension.filterAll();
        countryDimension.filterAll();
    });
});

