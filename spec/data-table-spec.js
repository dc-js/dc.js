describe('dc.dataTable', function() {
    var id, chart, data;
    var dateFixture;
    var dimension, group;
    var countryDimension;

    beforeEach(function() {
        dateFixture = loadDateFixture();
        data = crossfilter(dateFixture);
        dimension = data.dimension(function(d) {
            return d3.time.day.utc(d.dd);
        });
        countryDimension = data.dimension(function(d) {
            return d.countrycode;
        });

        id = "data-table";
        appendChartID(id);
        chart = dc.dataTable("#" + id)
            .dimension(dimension)
            .group(function(d) {
                return "Data Table";
            })
            .transitionDuration(0)
            .size(3)
            .sortBy(function(d){return d.id;})
            .order(d3.descending)
            .columns(
                [function(d) {
                    return d.id;
                }, function(d) {
                    return d.status;
                }]
            );
        chart.render();
    });

    describe('creation', function() {
        it('generates something', function() {
            expect(chart).not.toBeNull();
        });
        it('registers', function() {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('sets size', function() {
            expect(chart.size()).toEqual(3);
        });
        it('sets sortBy', function() {
            expect(chart.sortBy()).not.toBeNull();
        });
        it('sets order', function() {
            expect(chart.order()).toBe(d3.descending);
        });
        it('sets column span set on group tr', function() {
            expect(chart.selectAll("tr.dc-table-group td")[0][0].getAttribute("colspan")).toEqual("2");
        });
        it('creates id column', function() {
            expect(chart.selectAll("td._0")[0][0].innerHTML).toEqual('9');
            expect(chart.selectAll("td._0")[0][1].innerHTML).toEqual('8');
            expect(chart.selectAll("td._0")[0][2].innerHTML).toEqual('3');
        });
        it('creates status column', function() {
            expect(chart.selectAll("td._1")[0][0].innerHTML).toEqual("T");
            expect(chart.selectAll("td._1")[0][1].innerHTML).toEqual("F");
            expect(chart.selectAll("td._1")[0][2].innerHTML).toEqual("T");
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


