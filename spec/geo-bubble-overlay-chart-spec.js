describe('dc.geoBubbleOverlayChart', function() {
	var chart, data, id;
    var stateDimension, stateValueSumGroup, districtDimension, districtValueEnrollGroup, regionDimension;
    var geoJson, geoJson2, geoJson3;
    var width, height;
    var state;

	beforeEach(function() {
		data = crossfilter(loadDateFixture());
        stateDimension = data.dimension(function(d){return d.state;});
        regionDimension = data.dimension(function(d){return d.region;});
        stateValueSumGroup = stateDimension.group().reduceSum(function(d){return d.value;});
        districtDimension = data.dimension(function(d){return d.district;});
        districtValueEnrollGroup = districtDimension.group().reduceSum(function(d){return d.value;});

        geoJson = loadGeoFixture();
        geoJson2 = loadGeoFixture2();
        geoJson3 = loadGeoFixture3();

        width = 1000;
        height = 600;

	});

	describe('creation', function() {
		beforeEach(function() {
			var id = "map";
			var parent = appendChartID(id);

			chart = dc.geoBubbleOverlayChart('#map')
                        .width(width)
                        .height(height)
                        .dimension(stateDimension)
                        .group(stateValueSumGroup)
                        .setGeoJson(geoJson.features, 'state', function (d) {
                            return d.properties.name;
                        })
                        .radiusValueAccessor(function(d){
                            var r = d.value;
                            if (r < 0) return 0;
                            return r;
                        })
                        .transitionDuration(0);
			dc.renderAll();

		});

		it('should return not null', function() {
            expect(chart).not.toBeNull();
        });
        it('should have a d3.geo.path', function() {
            expect(chart.geoPath()).not.toBeNull();
        });
        it('svg is created', function() {
            expect(chart.selectAll("svg").length).not.toEqual(0);
        });

        it('should have a node classed as the data ID(eg: California)', function() {
            expect(chart.svg().select("g.california.node")).toBeDefined();
        });

        it('should have circle and text elements for each node', function() {
            expect(chart.svg().select("g.node circle")).toBeDefined();
            expect(chart.svg().select("g.node text")).toBeDefined();
        });

        it('should have the correct radius value for the bubble node', function() {
            expect(chart.select("g.california.node circle").attr("r")).toEqual('43.5');

            //var total =data.groupAll().reduceSum(function(d){return d.value;}).value();
        });

        it('should locate bubbles over map shape centroids', function() {
            expect(chart.select("g.california.node").attr("transform")).toMatchTranslate(146.31608509865737,235.96342551595416);
        });

        it('should have the circle placed at the centroid', function() {
            var region = chart.svg().select("g.geoLayer g.california");
            var datum = region.datum();
            var path = chart.geoPath();
            var centroid = path.centroid(datum);
            expect(centroid).toBeDefined();
        });

        describe('after filtering', function() {
            beforeEach(function() {
                regionDimension.filter("Central");
                chart.redraw();
            });

            it('should change circle radius of node after filter', function() {

                expect(chart.select("g.california.node circle").attr("r")).toEqual('0');

            });

            afterEach(function() {
                regionDimension.filterAll();
            });
        });
	});
});