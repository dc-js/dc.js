describe('dc.bubbleChart', function() {
    var id, chart, data;
    var dimension, group;
    var countryDimension;
    var width = 900, height = 350;

    beforeEach(function() {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(function(d) {
            return d.status;
        });
        group = dimension.group()
            .reduce(
                //add
                function(p, v) {
                    ++p.count;
                    p.value += +v.value;
                    return p;
                },
                //remove
                function(p, v) {
                    --p.count;
                    p.value -= +v.value;
                    return p;
                },
                //init
                function() {
                    return {count:0, value:0};
                }
            )
            .order(function(d){return d.value;});
        countryDimension = data.dimension(function(d) {
            return d.countrycode;
        });

        id = 'bubble-chart';
        appendChartID(id);

        chart = dc.bubbleChart('#' + id);
        chart.dimension(dimension).group(group)
            .width(width).height(height)
            .colors(["#a60000", "#ff0000", "#ff4040", "#ff7373", "#67e667", "#39e639", "#00cc00"])
            .colorDomain([0,220])
            .colorAccessor(function(p) {
                return p.value.value;
            })
            .keyAccessor(function (p) {
                return p.value.value;
            })
            .valueAccessor(function (p) {
                return p.value.count;
            })
            .radiusValueAccessor(function (p) {
                return p.value.count;
            })
            .x(d3.scale.linear().domain([0, 300]))
            .y(d3.scale.linear().domain([0, 10]))
            .r(d3.scale.linear().domain([0, 30]))
            .maxBubbleRelativeSize(0.3)
            .transitionDuration(0)
            .renderLabel(true)
            .renderTitle(true)
            .title(function (p) {
                return p.key + ": {count:" + p.value.count + ",value:" + p.value.value + "}";
            });
    });

    it("should produce a chart", function() {
        expect(chart).not.toBeNull();
    });
    it('should register the chart with DC', function () {
        expect(dc.hasChart(chart)).toBeTruthy();
    });
    it('should set the requested dimension', function () {
        expect(chart.dimension()).toBe(dimension);
    });
    it('should set the requested group', function () {
        expect(chart.group()).toBe(group);
    });

    it('should assign colors', function () {
        expect(chart.colors()).not.toBeNull();
    });
    it('should set the width', function () {
        expect(chart.width()).toBe(width);
    });
    it('should set the height', function () {
        expect(chart.height()).toBe(height);
    });
    it('should set the transition duration', function () {
        expect(chart.transitionDuration()).toBe(0);
    });
    it('should set the margin', function () {
        expect(chart.margins()).not.toBeNull();
    });
    it('should set the x scale', function () {
        expect(chart.x()).toBeDefined();
    });
    it('should set the x scale domain', function () {
        expect(chart.x().domain()[0]).toBe(0);
        expect(chart.x().domain()[1]).toBe(300);
    });
    it('should set the y scale', function () {
        expect(chart.y()).toBeDefined();
    });
    it('should set the y scale domain', function () {
        expect(chart.y().domain()[0]).toBe(0);
        expect(chart.y().domain()[1]).toBe(10);
    });
    it('should set the radius scale', function () {
        expect(chart.r()).not.toBeNull();
    });
    it('should set the radius value accessor', function () {
        expect(chart.radiusValueAccessor()).not.toBeNull();
    });
    it('should set the x units', function () {
        expect(chart.xUnits()).toBe(dc.units.integers);
    });
    it('should create the x axis', function () {
        expect(chart.xAxis()).not.toBeNull();
    });
    it('should create the y axis', function () {
        expect(chart.yAxis()).not.toBeNull();
    });
    it('should create the brush', function () {
        expect(chart.select("g.brush")).not.toBeNull();
    });
    it('should leave round off by default', function () {
        expect(chart.round()).toBeUndefined();
    });
    it('allow round to be changed', function () {
        chart.round(d3.time.day.round);
        expect(chart.round()).not.toBeNull();
    });

    describe('render', function() {
        beforeEach(function() {
            chart.render();
        });
        it('should create the svg', function () {
            expect(chart.select("svg").empty()).toBeFalsy();
        });
        it('should use the height for svg', function () {
            expect(Number(chart.select("svg").attr("height"))).toEqual(height);
        });
        it('should auto calculate the x range based on width', function () {
            expect(chart.x().range()[0]).toBe(0);
            expect(chart.x().range()[1]).toBe(820);
        });
        it('should auto calculate the y range round based on height', function () {
            expect(chart.y().range()[0]).toBe(310);
            expect(chart.y().range()[1]).toBe(0);
        });
        it('should create the root g', function () {
            expect(chart.select("svg g").empty()).toBeFalsy();
        });
        it('should place the x axis at the bottom', function () {
            expect(chart.select("svg g g.x").attr("transform")).toBe("translate(30,320)");
        });
        it('should place the y axis on the left', function () {
            expect(chart.select("svg g g.y").attr("transform")).toBe("translate(30,10)");
        });

        // bubbles
        it('should generate right number of bubbles', function () {
            expect(chart.selectAll("circle.bubble")[0].length).toBe(2);
        });
        it('should calculate right cx for each bubble', function () {
            chart.selectAll("g.node").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).attr("transform")).toBe("translate(601.3333333333334,155)");
                if (i === 1)
                    expect(d3.select(this).attr("transform")).toBe("translate(541.2,155)");
            });
        });
        it('should generate opaque groups and circles for each bubble', function () {
            chart.selectAll("g.node").each(function (d, i) {
                expect(d3.select(this).attr("opacity")).toBeNull();
                expect(d3.select(this).select('circle').attr("opacity")).toBe('1');
            });
        });
        it('should calculate right r for each bubble', function () {
            chart.selectAll("circle.bubble").each(function (d, i) {
                if (i === 0)
                    expect(Number(d3.select(this).attr("r"))).toBe(49.33333333333333);
                if (i === 1)
                    expect(Number(d3.select(this).attr("r"))).toBe(49.33333333333333);
            });
        });
        it('should attach each bubble with index based class', function () {
            chart.selectAll("circle.bubble").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).attr("class")).toBe("bubble _0");
                if (i === 1)
                    expect(d3.select(this).attr("class")).toBe("bubble _1");
            });
        });
        it('should generate right number of labels', function () {
            expect(chart.selectAll("g.node text")[0].length).toBe(2);
        });
        it('should create correct label for each bubble', function () {
            chart.selectAll("g.node text").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).text()).toBe("F");
                if (i === 1)
                    expect(d3.select(this).text()).toBe("T");
            });
        });
        it('should generate right number of titles', function () {
            expect(chart.selectAll("g.node title")[0].length).toBe(2);
        });
        it('should create correct title for each bubble', function () {
            chart.selectAll("g.node title").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).text()).toBe("F: {count:5,value:220}");
                if (i === 1)
                    expect(d3.select(this).text()).toBe("T: {count:5,value:198}");
            });
        });
        it('should fill bubbles with correct colors', function () {
            chart.selectAll("circle.bubble").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).attr("fill")).toBe("#00cc00");
                if (i === 1)
                    expect(d3.select(this).attr("fill")).toBe("#00cc00");
            });
        });
    });

    describe('bubble chart w/o label & title', function() {
        beforeEach(function () {
            chart.renderLabel(false);
            chart.renderTitle(false);
            chart.render();
        });
        it('should generate right number of labels', function () {
            expect(chart.selectAll("g.node text")[0].length).toBe(0);
        });
        it('should generate right number of titles', function () {
            expect(chart.selectAll("g.node title")[0].length).toBe(0);
        });
    });

    describe('bubble chart w/ filter', function() {
        beforeEach(function () {
            chart.filter("F");
            chart.render();
        });
        it('should deselect bubble based on filter value', function () {
            chart.selectAll("g.node").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).attr("class")).toBe("node selected");
                if (i === 1)
                    expect(d3.select(this).attr("class")).toBe("node deselected");
            });
        });
        it('should handle multi-selection highlight', function () {
            chart.filter("T");
            chart.redraw();
            chart.selectAll("g.node").each(function (d, i) {
                expect(d3.select(this).attr("class")).toBe("node selected");
            });
        });
    });

    describe('update bubble chart', function() {
        beforeEach(function () {
            chart.render();
            countryDimension.filter("CA");
            chart.redraw();
        });
        it('should create correct label for each bubble', function () {
            chart.selectAll("g.node title").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).text()).toBe("F: {count:0,value:0}");
                if (i === 1)
                    expect(d3.select(this).text()).toBe("T: {count:2,value:77}");
            });
        });
        it('should fill bubbles with correct colors', function () {
            chart.selectAll("circle.bubble").each(function (d, i) {
                if (i === 0)
                    expect(d3.select(this).attr("fill")).toBe("#a60000");
                if (i === 1)
                    expect(d3.select(this).attr("fill")).toBe("#ff4040");
            });
        });
    });

    describe('bubble chart w/ no filter', function() {
        beforeEach(function () {
            countryDimension.filter("ZZ");
            chart.render();
        });
       it('should set invisible if bubble has 0 r', function () {
            chart.selectAll("g.node text").each(function (d, i) {
                expect(Number(d3.select(this).attr("opacity"))).toBe(0);
            });
        });
    });

   describe('bubble chart w/ elastic axises', function() {
        beforeEach(function () {
            chart.elasticY(true)
                .yAxisPadding(3)
                .elasticX(true)
                .xAxisPadding(20);
            chart.render();
        });
       it('x range round is auto calculated based on width', function () {
            expect(chart.x().range()[0]).toBe(0);
            expect(chart.x().range()[1]).toBe(820);
        });
       it('x domain should be set', function () {
            expect(chart.x().domain()[0]).toBe(178);
            expect(chart.x().domain()[1]).toBe(240);
        });
       it('y range round is auto calculated based on height', function () {
            expect(chart.y().range()[0]).toBe(310);
            expect(chart.y().range()[1]).toBe(0);
        });
       it('y domain should be set', function () {
            expect(chart.y().domain()[0]).toBe(2);
            expect(chart.y().domain()[1]).toBe(8);
        });
   });

   describe('renderlet', function() {
       var derlet;
       beforeEach(function () {
           // spyOn doesn't seem to work with plain functions
           derlet = jasmine.createSpy('renderlet', function () {
               chart.selectAll("circle").attr("fill", "red");
           });
           derlet.and.callThrough();
           chart.renderlet(derlet);
       });
       it('custom renderlet should be invoked with render', function () {
           chart.render();
           expect(chart.selectAll("circle").attr("fill")).toBe("red");
           expect(derlet).toHaveBeenCalled();
       });
       it('custom renderlet should be invoked with redraw', function () {
           chart.render().redraw();
           expect(chart.selectAll("circle").attr("fill")).toBe("red");
           expect(derlet.calls.count()).toEqual(2);
        });
    });
});
