/* global appendChartID, loadDateFixture */
describe('dc.cboxMenu', () => {
    let id, chart;
    let data, regionDimension, regionGroup;
    let stateDimension, stateGroup;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        regionDimension = data.dimension(d => d.region);
        stateDimension = data.dimension(d => d.state);

        regionGroup = regionDimension.group();
        stateGroup = stateDimension.group();

        id = 'cbox-menu';
        appendChartID(id);

        chart = new dc.CboxMenu(`#${id}`);
        chart.dimension(stateDimension)
            .group(stateGroup)
            .transitionDuration(0);
        chart.render();
    });

    describe('generation', () => {
        it('we get something', () => {
            expect(chart).not.toBeNull();
        });
        it('should be registered', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets order', () => {
            expect(chart.order()).toBeDefined();
        });
        it('sets prompt text', () => {
            expect(chart.promptText()).toBe('Select all');
        });
        it('creates an unordered list', () => {
            expect(chart.selectAll('ul').nodes().length).toEqual(1);
        });
        it('creates .dc-cbox-item class elements for each item', () => {
            expect(chart.selectAll('li.dc-cbox-item').nodes().length).toEqual(stateGroup.all().length);
        });
        it('creates an extra item for the select all option', () => {
            expect(chart.selectAll('li').nodes().length).toEqual(stateGroup.all().length + 1);
        });
        it('creates input elements within each list item', () => {
            expect(chart.selectAll('li input').nodes().length).toEqual(stateGroup.all().length + 1);
        });
        // check labels and IDs
        it('creates input elements with IDs and labels with the corresponding "for" attribute', () => {
            const str = chart.selectAll('input').nodes().map(e => e.id).join('--');
            expect(str).toMatch(/^(input_\d+_\d+--)+input_\d+_all$/);
            expect(str).toEqual(chart.selectAll('label').nodes().map(e => e.getAttribute('for')).join('--'));
        });

        // Single select
        it('creates radio buttons by default', () => {
            expect(chart.selectAll('input[type=checkbox]').nodes().length).toEqual(0);
            expect(chart.selectAll('.dc-cbox-item input[type=radio]').nodes().length).toEqual(stateGroup.all().length);
        });
        it('uses a radio button for the select all option', () => {
            expect(chart.selectAll('input[type=radio]').nodes().length).toEqual(stateGroup.all().length + 1);
        });
        // select all:
        it('creates a select all option with default prompt text', () => {
            const option = chart.selectAll('li label').nodes().pop();
            expect(option.textContent).toEqual('Select all');
        });
        it('creates a select all option with no value', () => {
            const option = chart.selectAll('li input').nodes().pop();
            expect(option.name).toMatch(/^domain_\d+$/);
            expect(option.getAttribute('value')).toBeNull();
        });
        // multiple select
        it('can be made into a multiple', () => {
            chart.multiple(true).redraw();
            expect(chart.selectAll('.dc-cbox-item input[type=checkbox]').nodes().length).toEqual(stateGroup.all().length);
        });
        it('does not use radio buttons for multiples', () => {
            chart.multiple(true).redraw();
            expect(chart.selectAll('.dc-cbox-item input[type=radio]').nodes().length).toEqual(0);
        });
        // select all multiple:
        it('has a reset button in multiple mode', () => {
            chart.multiple(true).redraw();
            const option = chart.selectAll('li input').nodes().pop();
            expect(option.type).toEqual('reset');
            expect(chart.selectAll('input[type=reset]').nodes().length).toEqual(1);
        });
        it('creates prompt option with default prompt text', () => {
            chart.multiple(true).redraw();
            const option = chart.selectAll('li input').nodes().pop();
            expect(option.textContent).toEqual('Select all');
        });

    });

    describe('select options', () => {
        let firstOption, lastOption, lastIndex;
        beforeEach(() => {
            lastIndex = stateGroup.all().length - 1;
            firstOption = getOption(chart, 0);
            lastOption = getOption(chart, lastIndex);
        });
        it('display title as default option text', () => {
            expect(firstOption.textContent).toEqual('California: 3');
        });
        it('text property can be changed by changing title', () => {
            chart.title(d => d.key).redraw();
            firstOption = getOption(chart, 0);
            expect(firstOption.textContent).toEqual('California');
        });
        it('are ordered by ascending group key by default', () => {
            expect(firstOption.textContent).toEqual('California: 3');
            expect(lastOption.textContent).toEqual('Ontario: 2');
        });
        it('order can be changed by changing order function', () => {
            chart.order((a, b) => a.key.length - b.key.length);
            chart.redraw();
            lastOption = getOption(chart, lastIndex);
            expect(lastOption.textContent).toEqual('Mississippi: 2');
        });
    });

    describe('regular single select', () => {
        describe('selecting an option', () => {
            it('filters dimension based on selected option\'s value', () => {
                chart.onChange(stateGroup.all()[0].key);
                expect(chart.filter()).toEqual('California');
            });
            it('replaces filter on second selection', () => {
                chart.onChange(stateGroup.all()[0].key);
                chart.onChange(stateGroup.all()[1].key);
                expect(chart.filter()).toEqual('Colorado');
                expect(chart.filters().length).toEqual(1);
            });
            it('actually filters dimension', () => {
                chart.onChange(stateGroup.all()[0].key);
                expect(regionGroup.all()[0].value).toEqual(0);
                expect(regionGroup.all()[3].value).toEqual(2);
            });
            it('removes filter when prompt option is selected', () => {
                chart.onChange(null);
                expect(chart.hasFilter()).not.toBeTruthy();
                expect(regionGroup.all()[0].value).toEqual(1);
            });
        });

        describe('redraw with existing filter', () => {
            it('selects option corresponding to active filter', () => {
                chart.onChange(stateGroup.all()[0].key);
                chart.redraw();
                expect(chart.selectAll('input').nodes()[0].value).toEqual('California');
            });
        });

        afterEach(() => {
            chart.onChange(null);
        });
    });

    describe('multiple select', () => {
        beforeEach(() => {
            chart.multiple(true);
            chart.onChange([stateGroup.all()[0].key, stateGroup.all()[1].key]);
        });
        it('adds filters based on selections', () => {
            expect(chart.filters()).toEqual(['California', 'Colorado']);
            expect(chart.filters().length).toEqual(2);
        });
        it('actually filters dimension', () => {
            expect(regionGroup.all()[3].value).toEqual(2);
            expect(regionGroup.all()[4].value).toEqual(2);
        });
        it('removes all filters when prompt option is selected', () => {
            chart.onChange(null);
            expect(chart.hasFilter()).not.toBeTruthy();
            expect(regionGroup.all()[0].value).toEqual(1);
        });
        it('selects all options corresponding to active filters on redraw', () => {
            const selectedOptions = getSelectedOptions(chart);
            expect(selectedOptions.length).toEqual(2);
            expect(selectedOptions.map(d => d.value)).toEqual(['California', 'Colorado']);
        });
        it('does not deselect previously filtered options when new option is added', () => {
            chart.onChange([stateGroup.all()[0].key, stateGroup.all()[1].key, stateGroup.all()[5].key]);

            const selectedOptions = getSelectedOptions(chart);
            expect(selectedOptions.length).toEqual(3);
            expect(selectedOptions.map(d => d.value)).toEqual(['California', 'Colorado', 'Ontario']);
        });

        afterEach(() => {
            chart.onChange(null);
        });
    });

    describe('filterDisplayed', () => {
        it('only displays options whose value > 0 by default', () => {
            regionDimension.filter('South');
            chart.redraw();
            expect(chart.selectAll('.dc-cbox-item').nodes().length).toEqual(1);
            expect(getOption(chart, 0).textContent).toEqual('California: 2');
        });
        it('can be overridden', () => {
            regionDimension.filter('South');
            chart.filterDisplayed(d => true).redraw();
            expect(chart.selectAll('.dc-cbox-item').nodes().length).toEqual(stateGroup.all().length);
            expect(getOption(chart, stateGroup.all().length - 1).textContent).toEqual('Ontario: 0');
        });
        it('retains order with filtered options', () => {
            regionDimension.filter('Central');
            chart.redraw();
            expect(getOption(chart, 0).textContent).toEqual('Mississippi: 2');
            expect(getOption(chart, 1).textContent).toEqual('Ontario: 1');
        });
        afterEach(() => {
            regionDimension.filterAll();
        });
    });

    function getSelectedOptions (_chart) {
        return _chart.selectAll('.dc-cbox-item input').nodes().filter(d => d.value && d.checked);
    }

    function getOption (_chart, i) {
        return _chart.selectAll('.dc-cbox-item label').nodes()[i];
    }
});
