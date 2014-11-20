describe('dc.selectMenu', function() {
    var id, chart;
    var data, regionDimension, regionGroup;
    var stateDimension, stateGroup;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        regionDimension = data.dimension(function(d) { return d.region; });
        stateDimension = data.dimension(function(d) { return d.state; });

        regionGroup = regionDimension.group();
        stateGroup = stateDimension.group();

        id = 'seclect-menu';
        appendChartID(id);

        chart = dc.selectMenu("#" + id);
        chart.dimension(stateDimension)
            .group(stateGroup)
            .transitionDuration(0);
        chart.render();
    });

    describe('generation', function () {
        it('we get something', function() {
            expect(chart).not.toBeNull();
        });
        it('should be registered', function() {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets order', function() {
            expect(chart.order()).toBeDefined();
        });
        it('sets prompt text', function() {
            expect(chart.promptText()).toBe("Select all");
        });
        it('creates select tag', function() {
            expect(chart.selectAll("select").length).toEqual(1);
        });
        it('creates prompt option with empty value', function() {
            var option = chart.selectAll("option")[0][0];
            expect(option).toBeTruthy();
            expect(option.value).toEqual("");
        });
        it('creates prompt option with default prompt text', function() {
            var option = chart.selectAll("option")[0][0];
            expect(option.text).toEqual("Select all");
        });
        it('creates correct number of options', function() {
            expect(chart.selectAll("option.dc-select-option")[0].length).toEqual(stateGroup.all().length);
        });
    });

    describe('select options', function(){
        var first_option, last_option, last_index;
        beforeEach(function () {
            last_index = stateGroup.all().length - 1;
            first_option = getOption(chart,0);
            last_option = getOption(chart,last_index);
        });
        it('display title as default option text', function() {
            expect(first_option.text).toEqual("California: 3");
        });
        it('text property can be changed by changing title', function() {
            chart.title(function(d){ return d.key }).redraw();
            first_option = getOption(chart,0);
            expect(first_option.text).toEqual("California");
        });
        it('are ordered by ascending group key by default', function(){
            expect(first_option.text).toEqual("California: 3");
            expect(last_option.text).toEqual("Ontario: 2");
        });
        it('order can be changed by changing order function', function(){
            chart.order(function(a,b) { return a.key.length - b.key.length; });
            chart.redraw();
            last_option = getOption(chart,last_index);
            expect(last_option.text).toEqual("Mississippi: 2");
        });
    })

    describe('selecting an option', function () {
        it('filters dimension based on selected option\'s value', function(){
            chart.onChange(stateGroup.all()[0].key);
            expect(chart.filter()).toEqual("California");
        });
        it('replaces filter on second selection', function(){
            chart.onChange(stateGroup.all()[0].key);
            chart.onChange(stateGroup.all()[1].key);
            expect(chart.filter()).toEqual("Colorado");
            expect(chart.filters().length).toEqual(1);
        });
        it('actually filters dimension', function(){
            chart.onChange(stateGroup.all()[0].key);
            expect(regionGroup.all()[0].value).toEqual(0);
            expect(regionGroup.all()[3].value).toEqual(2);
        });
        it('removes filter when prompt option is selected', function(){
            chart.onChange('');
            expect(chart.hasFilter()).not.toBeTruthy();
            expect(regionGroup.all()[0].value).toEqual(1);
        });
    });

    describe('redraw with existing filter', function () {
        it('selects option corresponding to active filter', function(){
            chart.onChange(stateGroup.all()[0].key);
            chart.redraw();
            expect(chart.selectAll("select")[0][0].value).toEqual("California");
        });
    });

    describe('filterDisplayed', function () {
        it('only displays options whose value > 0 by default', function(){
            regionDimension.filter('South');
            chart.redraw();
            expect(chart.selectAll("option.dc-select-option")[0].length).toEqual(1);
            expect(getOption(chart,0).text).toEqual("California: 2");
        });
        it('can be overridden', function(){
            regionDimension.filter('South');
            chart.filterDisplayed(function(d) { return true; }).redraw();
            expect(chart.selectAll("option.dc-select-option")[0].length).toEqual(stateGroup.all().length);
            expect(getOption(chart, stateGroup.all().length - 1).text).toEqual("Ontario: 0");
        });
        it('retains order with filtered options', function(){
            regionDimension.filter('Central');
            chart.redraw();
            expect(getOption(chart,0).text).toEqual('Mississippi: 2');
            expect(getOption(chart,1).text).toEqual('Ontario: 1');
        });
        afterEach(function(){
            regionDimension.filterAll();
        })
    });

    function getOption(chart, i){
        return chart.selectAll("option.dc-select-option")[0][i];
    }
    

});

