describe('dc.dataCount', function() {
    describe('creation', function() {
        var data, countryDimension;
        var chart;
        beforeEach(function() {
            var id = "data-count";
            var div = appendChartID(id);
            div.append("span").attr("class", "filter-count");
            div.append("span").attr("class", "total-count");

            data = crossfilter(loadDateFixture());
            var groupAll = data.groupAll();
            countryDimension = data.dimension(function(d) {
                return d.countrycode;
            });
            countryDimension.filter("CA");
            chart = dc.dataCount("#" + id)
                .transitionDuration(0)
                .dimension(data)
                .group(groupAll)
                .render();
        });
        it('should generate something', function() {
            expect(chart).not.toBeNull();
        });
        it('should be registered', function() {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('should fill in the total count', function() {
            expect(chart.select("span.total-count").text()).toEqual("10");
        });
        it('should fill in the filter count', function() {
            expect(chart.select("span.filter-count").text()).toEqual("2");
        });
        describe('redraw', function() {
            beforeEach(function() {
                countryDimension.filterAll();
                chart.redraw();
                return chart;
            });
            it('should fill in the updated total count', function() {
                expect(chart.select("span.total-count").text()).toEqual("10");
            });
            it('should fill in the updated filter count', function() {
                expect(chart.select("span.filter-count").text()).toEqual("10");
            });
        });
        afterEach(function() {
            countryDimension.filterAll();
        });
    });
});


