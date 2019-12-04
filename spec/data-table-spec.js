/* global appendChartID, loadDateFixture */
describe('dc.dataTable', () => {
    let id, chart, data;
    let dateFixture;
    let dimension;
    let countryDimension;
    let valueGroup;

    beforeEach(() => {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(d => d3.utcDay(d.dd));
        countryDimension = data.dimension(d => d.countrycode);
        valueGroup = function () {
            return 'Data Table';
        };

        id = 'data-table';
        appendChartID(id);
        chart = new dc.DataTable(`#${id}`)
            .dimension(dimension)
            .group(valueGroup)
            .transitionDuration(0)
            .size(3)
            .sortBy(d => d.id)
            .order(d3.descending)
            .columns(
                [function (d) {
                    return d.id;
                }, function (d) {
                    return d.status;
                }]
            );
    });

    describe('simple table', () => {
        beforeEach(() => {
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
            it('group should be set', () => {
                expect(chart.group()).toEqual(valueGroup);
            });
            it('treats group as synonym of section', () => {
                expect(chart.group()).toEqual(chart.section());
                const newSection = () => {};
                chart.group(newSection);
                expect(chart.section()).toBe(newSection);
            });
            it('treats showGroups as synonym of showSections', () => {
                expect(chart.showGroups()).toEqual(chart.showSections());
                const newVal = !(chart.showGroups());
                chart.showGroups(newVal);
                expect(chart.showSections()).toBe(newVal);
            });
            it('group tr should not be undefined', () => {
                expect(typeof(chart.selectAll('tr.dc-table-group').nodes()[0])).not.toBe('undefined');
            });
            it('sets column span set on group tr', () => {
                expect(chart.selectAll('tr.dc-table-group td').nodes()[0].getAttribute('colspan')).toEqual('2');
            });
            it('creates id column', () => {
                expect(chart.selectAll('td._0').nodes()[0].innerHTML).toEqual('9');
                expect(chart.selectAll('td._0').nodes()[1].innerHTML).toEqual('8');
                expect(chart.selectAll('td._0').nodes()[2].innerHTML).toEqual('3');
            });
            it('creates status column', () => {
                expect(chart.selectAll('td._1').nodes()[0].innerHTML).toEqual('T');
                expect(chart.selectAll('td._1').nodes()[1].innerHTML).toEqual('F');
                expect(chart.selectAll('td._1').nodes()[2].innerHTML).toEqual('T');
            });
        });

        describe('slicing entries', () => {
            beforeEach(() => {
                chart.beginSlice(1);
                chart.redraw();
            });

            it('slice beginning', () => {
                expect(chart.selectAll('tr.dc-table-row').nodes().length).toEqual(2);
            });

            it('slice beginning and end', () => {
                chart.endSlice(2);
                chart.redraw();

                expect(chart.selectAll('tr.dc-table-row').nodes().length).toEqual(1);
            });
        });

        describe('external filter', () => {
            beforeEach(() => {
                countryDimension.filter('CA');
                chart.redraw();
            });
            it('renders only filtered data set', () => {
                expect(chart.selectAll('td._0').nodes().length).toEqual(2);
            });
            it('renders the correctly filtered records', () => {
                expect(chart.selectAll('td._0').nodes()[0].innerHTML).toEqual('7');
                expect(chart.selectAll('td._0').nodes()[1].innerHTML).toEqual('5');
            });
        });

        describe('ascending order', () => {
            beforeEach(() => {
                chart.order(d3.ascending);
                chart.redraw();
            });
            it('uses dimension.bottom() instead of top()', () => {
                expect(chart.selectAll('td._0').nodes()[0].innerHTML).toEqual('1');
            });
        });
    });

    describe('renderlet', () => {
        let derlet;
        beforeEach(() => {
            derlet = jasmine.createSpy('renderlet', _chart => {
                _chart.selectAll('td.dc-table-label').text('changed');
            });
            derlet.and.callThrough();
            chart.on('renderlet', derlet);
        });
        it('custom renderlet should be invoked with render', () => {
            chart.render();
            expect(chart.selectAll('td.dc-table-label').text()).toEqual('changed');
            expect(derlet).toHaveBeenCalled();
        });
        it('custom renderlet should be invoked with redraw', () => {
            chart.redraw();
            expect(chart.selectAll('td.dc-table-label').text()).toEqual('changed');
            expect(derlet).toHaveBeenCalled();
        });
    });

    describe('specifying chart columns with label', () => {
        beforeEach(() => {
            chart.columns(['state']);
            chart.render();
        });
        it('should render value and capitalized header', () => {
            const cols = chart.selectAll('td.dc-table-column').nodes().map(d => d.textContent);
            const expected = ['Mississippi', 'Mississippi', 'Delaware'];
            expect(cols.length).toEqual(expected.length);
            expected.forEach(d => {
                expect(cols).toContain(d);
            });
            const colheader = chart.selectAll('th.dc-table-head').nodes().map(d => d.textContent);
            expect(colheader.length).toEqual(1);
            expect(colheader[0]).toEqual('State');

        });
    });
    describe('specifying chart columns with function', () => {
        beforeEach(() => {
            chart.columns([function (d) {return `${d.id}test`;}]);
            chart.render();
        });
        it('should render function result and no header', () => {
            const cols = chart.selectAll('td.dc-table-column').nodes().map(d => d.textContent);
            const expected = ['9test', '8test', '3test'];
            expect(cols.length).toEqual(expected.length);
            expected.forEach(d => {
                expect(cols).toContain(d);
            });
            const colheader = chart.selectAll('th.dc-table-head').nodes().map(d => d.textContent);
            expect(colheader.length).toEqual(0);
        });
    });
    describe('specifying chart columns with object', () => {
        beforeEach(() => {
            chart.columns([{
                label: 'Test ID',
                format: function (d) {
                    return `test${d.id}`;
                }
            }]);
            chart.render();
        });
        it('should produce correct table header with single column', () => {
            const thead = chart.selectAll('thead');
            expect(thead.nodes().length).toBe(1);
            const tr = thead.selectAll('tr');
            expect(tr.nodes().length).toBe(1);
            const colheader = tr.selectAll('th.dc-table-head').nodes().map(d => d.textContent);
            expect(colheader.length).toEqual(1);
            expect(colheader[0]).toEqual('Test ID');
        });

        it('should render correct values in rows', () => {
            const cols = chart.selectAll('td.dc-table-column').nodes().map(d => d.textContent);
            const expected = ['test9', 'test8', 'test3'];
            expect(cols.length).toEqual(expected.length);
            expected.forEach((d, i) => {
                expect(cols[i]).toEqual(d);
            });
        });
    });

    describe('with existing table header', () => {
        beforeEach(() => {
            // add some garbage for table to replace
            d3.select('#data-table')
                .selectAll('thead').data([0]).enter().append('thead')
                .selectAll('tr').data([1,2]).enter().append('tr')
                .selectAll('th').data([1,2,3]).enter().append('th');
            chart.columns([{
                label: 'Test ID',
                format: function (d) {
                    return `test${d.id}`;
                }
            }]);
            chart.render();
        });
        it('should produce correct table header with single column', () => {
            const thead = chart.selectAll('thead');
            expect(thead.nodes().length).toBe(1);
            const tr = thead.selectAll('tr');
            expect(tr.nodes().length).toBe(1);
            const colheader = tr.selectAll('th.dc-table-head').nodes().map(d => d.textContent);
            expect(colheader.length).toEqual(1);
            expect(colheader[0]).toEqual('Test ID');
        });
    });

    describe('specifying showGroups as false', () => {
        beforeEach(() => {
            chart.showGroups(false);
            chart.render();
        });
        it('group tr should be undefined', () => {
            expect(typeof(chart.selectAll('tr.dc-table-group').nodes()[0])).toBe('undefined');
        });
    });

    afterEach(() => {
        dimension.filterAll();
        countryDimension.filterAll();
    });
});

