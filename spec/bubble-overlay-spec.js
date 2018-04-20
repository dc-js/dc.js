/* global appendChartID, loadDateFixture */
describe('dc.bubbleOverlay', function () {
    var chart, data;
    var dimension, group;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(function (d) {return d.state;});
        group = dimension.group().reduceSum(function (d) {return d.value;});

        var id = 'bubble-overlay';
        var parent = appendChartID(id);
        var width = 600, height = 400;
        var svg = parent.append('svg')
            .attr('width', width)
            .attr('height', height);

        chart = dc.bubbleOverlay('#' + id)
            .svg(svg)
            .dimension(dimension)
            .group(group)
            .width(width)
            .height(height)
            .transitionDuration(0)
            .title(function (d) {return 'Title: ' + d.key;})
            .r(d3.scaleLinear().domain([0, 100]))
            .maxBubbleRelativeSize(0.1)
            .ordinalColors(['blue'])
            .point('California', 100, 120)
            .point('Colorado', 300, 120)
            .point('Delaware', 500, 220)
            .point('Ontario', 180, 90)
            .point('Mississippi', 120, 220)
            .point('Oklahoma', 200, 350);

        chart.render();
    });

    describe('creation', function () {
        it('should generate an instance of the dc chart', function () {
            expect(dc.instanceOfChart(chart)).toBeTruthy();
        });

        it('should be registered', function () {
            expect(dc.hasChart(chart)).toBeTruthy();
        });

        it('should generate the correct number of overlay groups', function () {
            expect(chart.selectAll('g.node').nodes().length).toEqual(6);
        });

        it('should generate a correct class name for the overlay groups', function () {
            expect(d3.select(chart.selectAll('g.node').nodes()[0]).attr('class')).toEqual('node california');
            expect(d3.select(chart.selectAll('g.node').nodes()[3]).attr('class')).toEqual('node ontario');
        });

        it('should generate the correct number of overlay bubbles', function () {
            expect(chart.selectAll('circle.bubble').nodes().length).toEqual(6);
        });

        it('should generate a correct translate for overlay groups', function () {
            expect(d3.select(chart.selectAll('g.node').nodes()[0]).attr('transform')).toMatchTranslate(100, 120);
            expect(d3.select(chart.selectAll('g.node').nodes()[3]).attr('transform')).toMatchTranslate(180, 90);
        });

        it('should generate correct radii for circles', function () {
            expect(d3.select(chart.selectAll('circle.bubble').nodes()[0]).attr('r')).toEqual('87');
            expect(d3.select(chart.selectAll('circle.bubble').nodes()[3]).attr('r')).toEqual('48.5');
        });

        it('should generate correct labels', function () {
            expect(d3.select(chart.selectAll('g.node text').nodes()[0]).text()).toEqual('California');
            expect(d3.select(chart.selectAll('g.node text').nodes()[3]).text()).toEqual('Ontario');
        });

        it('should generate the label only once', function () {
            chart.redraw();
            expect(chart.selectAll('g.node text').nodes().length).toEqual(6);
        });

        it('generate the correct titles', function () {
            expect(d3.select(chart.selectAll('g.node title').nodes()[0]).text()).toEqual('Title: California');
            expect(d3.select(chart.selectAll('g.node title').nodes()[3]).text()).toEqual('Title: Ontario');
        });

        it('should only generate titles once', function () {
            chart.redraw();
            expect(chart.selectAll('g.node title').nodes().length).toEqual(6);
        });

        it('should fill circles with the specified colors', function () {
            expect(d3.select(chart.selectAll('circle.bubble').nodes()[0]).attr('fill')).toEqual('blue');
            expect(d3.select(chart.selectAll('circle.bubble').nodes()[3]).attr('fill')).toEqual('blue');
        });

        it('should highlight the filtered bubbles', function () {
            chart.filter('Colorado');
            chart.filter('California');
            chart.redraw();
            expect(d3.select(chart.selectAll('g.node').nodes()[0]).attr('class')).toEqual('node california selected');
            expect(d3.select(chart.selectAll('g.node').nodes()[1]).attr('class')).toEqual('node colorado selected');
            expect(d3.select(chart.selectAll('g.node').nodes()[3]).attr('class')).toEqual('node ontario deselected');
        });
    });

    function removeEmptyBins (group) {
        return {
            all: function () {
                return group.all().filter(function (d) {
                    return d.value !== 0;
                });
            }
        };
    }
    describe('filtering another dimension', function () {
        var regionDim;
        beforeEach(function () {
            chart.group(removeEmptyBins(group)).render();
            regionDim = data.dimension(function (d) { return d.region; });
        });
        function expectRadii (expected) {
            var circles = chart.selectAll('circle.bubble').nodes();
            circles.forEach(function (c, i) {
                expect(+d3.select(c).attr('r')).toBeWithinDelta(expected[i], 0.1);
            });
        }
        describe('without elastic radius', function () {
            it('should have reasonable radii', function () {
                expectRadii([87, 21, 26.5, 48.5, 48.5, 37.5]);
            });
            it('filtering should zero out some radii', function () {
                regionDim.filter('Central');
                dc.redrawAll();
                expectRadii([0, 0, 0, 37.5, 48.5, 0]);
            });
        });
        describe('with elastic radius', function () {
            beforeEach(function () {
                chart.elasticRadius(true).render();
            });
            it('should lock to the minimum and maximum radius sizes', function () {
                expectRadii([60, 10, 14.1, 30.8, 30.8, 22.5]);
            });
            it('filtering should lock the remaining bubbles to min and max radius sizes', function () {
                regionDim.filter('Central');
                dc.redrawAll();
                expectRadii([0, 0, 0, 10, 60, 0]);
            });
        });
    });
});

