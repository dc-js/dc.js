/* global appendChartID, loadDateFixture */
describe('dc.cboxMenu', function () {
    var id, chart;
    var data, regionDimension, regionGroup;
    var stateDimension, stateGroup;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        regionDimension = data.dimension(function (d) { return d.region; });
        stateDimension = data.dimension(function (d) { return d.state; });

        regionGroup = regionDimension.group();
        stateGroup = stateDimension.group();

        id = 'cbox-menu';
        appendChartID(id);

        chart = dc.cboxMenu('#' + id);
        chart.dimension(stateDimension)
            .group(stateGroup)
            .transitionDuration(0);
        chart.render();
    });

    describe('generation', function () {
        it('we get something', function () {
            expect(chart).not.toBeNull();
        });
        it('should be registered', function () {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets order', function () {
            expect(chart.order()).toBeDefined();
        });
        it('sets prompt text', function () {
            expect(chart.promptText()).toBe('Select all');
        });
        it('creates an unordered list', function () {
            expect(chart.selectAll('ul').nodes().length).toEqual(1);
        });
        it('creates .dc-cbox-item class elements for each item', function () {
            expect(chart.selectAll('li.dc-cbox-item').nodes().length).toEqual(stateGroup.all().length);
        });
        it('creates an extra item for the select all option', function () {
            expect(chart.selectAll('li').nodes().length).toEqual(stateGroup.all().length + 1);
        });
        it('creates input elements within each list item', function () {
            expect(chart.selectAll('li input').nodes().length).toEqual(stateGroup.all().length + 1);
        });
        // check labels and IDs
        it('creates input elements with IDs and labels with the corresponding "for" attribute', function () {
            var str = chart.selectAll('input').nodes().map(function (e) {
                return e.id;
            }).join('--');
            expect(str).toMatch(/^(input_\d+_\d+--)+input_\d+_all$/);
            expect(str).toEqual(chart.selectAll('label').nodes().map(function (e) {
                return e.getAttribute('for');
            }).join('--'));
        });

        // Single select
        it('creates radio buttons by default', function () {
            expect(chart.selectAll('input[type=checkbox]').nodes().length).toEqual(0);
            expect(chart.selectAll('.dc-cbox-item input[type=radio]').nodes().length).toEqual(stateGroup.all().length);
        });
        it('uses a radio button for the select all option', function () {
            expect(chart.selectAll('input[type=radio]').nodes().length).toEqual(stateGroup.all().length + 1);
        });
        // select all:
        it('creates a select all option with default prompt text', function () {
            var option = chart.selectAll('li label').nodes().pop();
            expect(option.textContent).toEqual('Select all');
        });
        it('creates a select all option with no value', function () {
            var option = chart.selectAll('li input').nodes().pop();
            expect(option.name).toMatch(/^domain_\d+$/);
            expect(option.getAttribute('value')).toBeNull();
        });
        // multiple select
        it('can be made into a multiple', function () {
            chart.multiple(true).redraw();
            expect(chart.selectAll('.dc-cbox-item input[type=checkbox]').nodes().length).toEqual(stateGroup.all().length);
        });
        it('does not use radio buttons for multiples', function () {
            chart.multiple(true).redraw();
            expect(chart.selectAll('.dc-cbox-item input[type=radio]').nodes().length).toEqual(0);
        });
        // select all multiple:
        it('has a reset button in multiple mode', function () {
            chart.multiple(true).redraw();
            var option = chart.selectAll('li input').nodes().pop();
            expect(option.type).toEqual('reset');
            expect(chart.selectAll('input[type=reset]').nodes().length).toEqual(1);
        });
        it('creates prompt option with default prompt text', function () {
            chart.multiple(true).redraw();
            var option = chart.selectAll('li input').nodes().pop();
            expect(option.textContent).toEqual('Select all');
        });

    });

    describe('select options', function () {
        var firstOption, lastOption, lastIndex;
        beforeEach(function () {
            lastIndex = stateGroup.all().length - 1;
            firstOption = getOption(chart, 0);
            lastOption = getOption(chart, lastIndex);
        });
        it('display title as default option text', function () {
            expect(firstOption.textContent).toEqual('California: 3');
        });
        it('text property can be changed by changing title', function () {
            chart.title(function (d) { return d.key; }).redraw();
            firstOption = getOption(chart, 0);
            expect(firstOption.textContent).toEqual('California');
        });
        it('are ordered by ascending group key by default', function () {
            expect(firstOption.textContent).toEqual('California: 3');
            expect(lastOption.textContent).toEqual('Ontario: 2');
        });
        it('order can be changed by changing order function', function () {
            chart.order(function (a, b) { return a.key.length - b.key.length; });
            chart.redraw();
            lastOption = getOption(chart, lastIndex);
            expect(lastOption.textContent).toEqual('Mississippi: 2');
        });
    });

    describe('regular single select', function () {
        describe('selecting an option', function () {
            it('filters dimension based on selected option\'s value', function () {
                chart.onChange(stateGroup.all()[0].key);
                expect(chart.filter()).toEqual('California');
            });
            it('replaces filter on second selection', function () {
                chart.onChange(stateGroup.all()[0].key);
                chart.onChange(stateGroup.all()[1].key);
                expect(chart.filter()).toEqual('Colorado');
                expect(chart.filters().length).toEqual(1);
            });
            it('actually filters dimension', function () {
                chart.onChange(stateGroup.all()[0].key);
                expect(regionGroup.all()[0].value).toEqual(0);
                expect(regionGroup.all()[3].value).toEqual(2);
            });
            it('removes filter when prompt option is selected', function () {
                chart.onChange(null);
                expect(chart.hasFilter()).not.toBeTruthy();
                expect(regionGroup.all()[0].value).toEqual(1);
            });
        });

        describe('redraw with existing filter', function () {
            it('selects option corresponding to active filter', function () {
                chart.onChange(stateGroup.all()[0].key);
                chart.redraw();
                expect(chart.selectAll('input').nodes()[0].value).toEqual('California');
            });
        });

        afterEach(function () {
            chart.onChange(null);
        });
    });

    describe('multiple select', function () {
        beforeEach(function () {
            chart.multiple(true);
            chart.onChange([stateGroup.all()[0].key, stateGroup.all()[1].key]);
        });
        it('adds filters based on selections', function () {
            expect(chart.filters()).toEqual(['California', 'Colorado']);
            expect(chart.filters().length).toEqual(2);
        });
        it('actually filters dimension', function () {
            expect(regionGroup.all()[3].value).toEqual(2);
            expect(regionGroup.all()[4].value).toEqual(2);
        });
        it('removes all filters when prompt option is selected', function () {
            chart.onChange(null);
            expect(chart.hasFilter()).not.toBeTruthy();
            expect(regionGroup.all()[0].value).toEqual(1);
        });
        it('selects all options corresponding to active filters on redraw', function () {
            var selectedOptions = getSelectedOptions(chart);
            expect(selectedOptions.length).toEqual(2);
            expect(selectedOptions.map(function (d) { return d.value; })).toEqual(['California', 'Colorado']);
        });
        it('does not deselect previously filtered options when new option is added', function () {
            chart.onChange([stateGroup.all()[0].key, stateGroup.all()[1].key, stateGroup.all()[5].key]);

            var selectedOptions = getSelectedOptions(chart);
            expect(selectedOptions.length).toEqual(3);
            expect(selectedOptions.map(function (d) { return d.value; })).toEqual(['California', 'Colorado', 'Ontario']);
        });

        afterEach(function () {
            chart.onChange(null);
        });
    });

    describe('filterDisplayed', function () {
        it('only displays options whose value > 0 by default', function () {
            regionDimension.filter('South');
            chart.redraw();
            expect(chart.selectAll('.dc-cbox-item').nodes().length).toEqual(1);
            expect(getOption(chart, 0).textContent).toEqual('California: 2');
        });
        it('can be overridden', function () {
            regionDimension.filter('South');
            chart.filterDisplayed(function (d) { return true; }).redraw();
            expect(chart.selectAll('.dc-cbox-item').nodes().length).toEqual(stateGroup.all().length);
            expect(getOption(chart, stateGroup.all().length - 1).textContent).toEqual('Ontario: 0');
        });
        it('retains order with filtered options', function () {
            regionDimension.filter('Central');
            chart.redraw();
            expect(getOption(chart, 0).textContent).toEqual('Mississippi: 2');
            expect(getOption(chart, 1).textContent).toEqual('Ontario: 1');
        });
        afterEach(function () {
            regionDimension.filterAll();
        });
    });

    function getSelectedOptions (chart) {
        return chart.selectAll('.dc-cbox-item input').nodes().filter(function (d) {
                return d.value && d.checked;
            });
    }

    function getOption (chart, i) {
        return chart.selectAll('.dc-cbox-item label').nodes()[i];
    }
});
