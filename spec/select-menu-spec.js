/* global appendChartID, loadDateFixture */
describe('dc.selectMenu', () => {
    let id, chart;
    let data, regionDimension, regionGroup;
    let stateDimension, stateGroup;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        regionDimension = data.dimension(d => d.region);
        stateDimension = data.dimension(d => d.state);

        regionGroup = regionDimension.group();
        stateGroup = stateDimension.group();

        id = 'select-menu';
        appendChartID(id);

        chart = new dc.SelectMenu(`#${id}`);
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
        it('creates select tag', () => {
            expect(chart.selectAll('select').nodes().length).toEqual(1);
        });
        it('select tag is not a multiple select by default', () => {
            expect(chart.selectAll('select').attr('multiple')).toBeNull();
        });
        it('can be made into a multiple', () => {
            chart.multiple(true).redraw();
            expect(chart.selectAll('select').attr('multiple')).toBeTruthy();
        });
        it('select tag does not have size by default', () => {
            expect(chart.selectAll('select').attr('size')).toBeNull();
        });
        it('can have numberVisible set', () => {
            chart.numberVisible(10).redraw();
            expect(chart.selectAll('select').attr('size')).toEqual('10');
        });
        it('treats size as synonym of numberVisible', () => {
            chart.numberVisible(10);
            expect(chart.size()).toEqual(chart.numberVisible());
            chart.size(20);
            expect(chart.numberVisible()).toEqual(20);
        });
        it('creates prompt option with empty value', () => {
            const option = chart.selectAll('option').nodes()[0];
            expect(option).not.toBeNull();
            expect(option.value).toEqual('');
        });
        it('creates prompt option with default prompt text', () => {
            const option = chart.selectAll('option').nodes()[0];
            expect(option.text).toEqual('Select all');
        });
        it('creates correct number of options', () => {
            expect(chart.selectAll('option.dc-select-option').nodes().length).toEqual(stateGroup.all().length);
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
            expect(firstOption.text).toEqual('California: 3');
        });
        it('text property can be changed by changing title', () => {
            chart.title(d => d.key).redraw();
            firstOption = getOption(chart, 0);
            expect(firstOption.text).toEqual('California');
        });
        it('are ordered by ascending group key by default', () => {
            expect(firstOption.text).toEqual('California: 3');
            expect(lastOption.text).toEqual('Ontario: 2');
        });
        it('order can be changed by changing order function', () => {
            chart.order((a, b) => a.key.length - b.key.length);
            chart.redraw();
            lastOption = getOption(chart, lastIndex);
            expect(lastOption.text).toEqual('Mississippi: 2');
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
                expect(chart.selectAll('select').nodes()[0].value).toEqual('California');
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
            // IE returns an extra option with value '', not sure what it means
            const selectedOptions = chart.selectAll('select').selectAll('option').nodes().filter(d => d.value && d.selected);
            expect(selectedOptions.length).toEqual(2);
            expect(selectedOptions.map(d => d.value)).toEqual(['California', 'Colorado']);
        });
        it('does not deselect previously filtered options when new option is added', () => {
            chart.onChange([stateGroup.all()[0].key, stateGroup.all()[1].key, stateGroup.all()[5].key]);

            // IE returns an extra option with value '', not sure what it means
            const selectedOptions = chart.selectAll('select').selectAll('option').nodes().filter(d => d.value && d.selected);
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
            expect(chart.selectAll('option.dc-select-option').nodes().length).toEqual(1);
            expect(getOption(chart, 0).text).toEqual('California: 2');
        });
        it('can be overridden', () => {
            regionDimension.filter('South');
            chart.filterDisplayed(d => true).redraw();
            expect(chart.selectAll('option.dc-select-option').nodes().length).toEqual(stateGroup.all().length);
            expect(getOption(chart, stateGroup.all().length - 1).text).toEqual('Ontario: 0');
        });
        it('retains order with filtered options', () => {
            regionDimension.filter('Central');
            chart.redraw();
            expect(getOption(chart, 0).text).toEqual('Mississippi: 2');
            expect(getOption(chart, 1).text).toEqual('Ontario: 1');
        });
        afterEach(() => {
            regionDimension.filterAll();
        });
    });

    function getOption (_chart, i) {
        return _chart.selectAll('option.dc-select-option').nodes()[i];
    }
});
