
describe('dc.barGauge', function () {
	var chart, data;
	var dimension, group;
	var totalCapacity, maxValue, regionDimension;
	describe('creation', function(){
		beforeEach(function () {
			data = crossfilter(loadDateFixture());
			group = data.groupAll().reduceSum(function(d){return d.value;});
			maxValue = group.value();

			regionDimension = data.dimension(function(d) {
                return d.region;
            });

			var id = "bar-gauge";
			var parent = appendChartID(id);

			chart = dc.barGauge("#" + id)
                                .group(group)
                                .valueAccessor(function(d){return d;})
                                .totalCapacity(maxValue);

            chart.render();
		});


		it('should generate an instance of the dc chart', function() {
            expect(dc.instanceOfChart(chart)).toBeTruthy();
        });

        it('should be registered', function() {
            expect(dc.hasChart(chart)).toBeTruthy();
        });

        it('should have rectangles for background and foreground', function() {
            expect(d3.select(chart.root().selectAll('rect')[0][0]).attr('class')).toEqual("dc-bar-gauge-background");
            expect(d3.select(chart.root().selectAll('rect')[0][1]).attr('class')).toEqual("dc-bar-gauge-foreground");
        });

        it('should only create two rectangles in the svg', function() {
            expect(chart.root().selectAll('svg rect')[0].length).toEqual(2);
        });

        it('should have default thickness, longness, orientation, ', function() {
            expect(chart.value()).toBeDefined();
            expect(chart.totalCapacity()).toBeDefined();
            expect(chart.filledValue()).toBeDefined();
            expect(chart.orientation()).toBeDefined();
        });

        //test cases after filter change
        describe('filter change', function() {
            beforeEach(function() {
                regionDimension.filter('East');
                chart.render();
            });

            it('should have correct calculated length for foreground rectangle when filter changes', function() {
                //expect the chart value to mirror the value of the cross filter data
                expect(chart.value()).toEqual(data.groupAll().reduceSum(function(d){return d.value;}).value());
                var expectedPercentageFill = chart.value() / maxValue * 100;
                var attrForFillCheck;
                if(chart.orientation() === 'vertical') attrForFillCheck = 'height';
                else if(chart.orientation() === 'horizontal') attrForFillCheck = 'width';

                chart.render(); //need render to be here for some reason even though it is in beforeEach???
                var innerFilledValue = d3.select(chart.root().selectAll('rect')[0][1]).attr(attrForFillCheck);
                var actualPercentageFill = innerFilledValue.replace('%', '') - 0;

                //expect the rendered fill amount percentage is the same as the calculated amount
                expect(expectedPercentageFill).toEqual(actualPercentageFill);
            });

            afterEach(function() {
                //unfilter after each case
                regionDimension.filterAll();
            });
        });
        
	});

});