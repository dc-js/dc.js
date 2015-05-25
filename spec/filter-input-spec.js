describe('dc.inputFilter', function() {
    var id, chart, data;
    var dimension, group;
    var countryDimension;

    beforeEach(function() {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(function(d) {
            return d.countrycode.toLowerCase()+ " "+ d.state.toLowerCase();
        });
        group =  dimension.group().reduceSum(function(d) { return 1; });
        countryDimension = data.dimension(function(d) {
            return d.countrycode;
        });

        id = "input-filter";
        appendChartID(id);
        chart = dc.inputFilter("#" + id)
            .dimension(dimension)
            .group(group);
        chart.render();
    });

    describe('creation', function() {
        it('generates something', function() {
            expect(chart).not.toBeNull();
        });
        it('registers', function() {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets an input field', function() {
            expect(chart.selectAll("input")[0].length).toEqual("1");
        });
        it("doesn't filter by default", function() {
            expect(chart.dimension().top(1000).length).toEqual("10");
        });
    });

    describe('type to filter', function() {
        beforeEach(function() {
            chart.redraw();
        });

        it('filters when the user types', function() {
            expect(chart.selectAll("input")[0].length).toEqual("1");
        });

    });
    describe('external filter', function() {
        beforeEach(function() {
            countryDimension.filter("CA");
            chart.redraw();
        });
        it('renders only filtered data set', function() {
            expect(chart.selectAll("td._0")[0].length).toEqual(2);
        });
        it('renders the correctly filtered records', function() {
            expect(chart.selectAll("td._0")[0][0].innerHTML).toEqual('7');
            expect(chart.selectAll("td._0")[0][1].innerHTML).toEqual('5');
        });
    });

    describe('renderlet', function() {
        var derlet;
        beforeEach(function() {
            derlet = jasmine.createSpy('renderlet', function(chart) {
                chart.selectAll("td.dc-table-label").text("changed");
            });
            derlet.and.callThrough();
            chart.renderlet(derlet);
        });
        it('custom renderlet should be invoked with render', function() {
            chart.render();
            expect(chart.selectAll("td.dc-table-label").text()).toEqual("changed");
            expect(derlet).toHaveBeenCalled();
        });
        it('custom renderlet should be invoked with redraw', function() {
            chart.redraw();
            expect(chart.selectAll("td.dc-table-label").text()).toEqual("changed");
            expect(derlet).toHaveBeenCalled();
        });
    });


    afterEach(function() {
        dimension.filterAll();
        countryDimension.filterAll();
    });
});


