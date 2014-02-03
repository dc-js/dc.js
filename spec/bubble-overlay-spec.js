describe('dc.bubbleOverlay', function() {
    var id, chart, data;
    var dateFixture;
    var stateDimension, stateValueSumGroup;
    describe('creation', function() {
        beforeEach(function() {
            dateFixture = loadDateFixture();
            data = crossfilter(dateFixture);
            stateDimension = data.dimension(function(d){return d.state;});
            stateValueSumGroup = stateDimension.group().reduceSum(function(d){return d.value;});

            var id = "bubble-overlay";
            var div = appendChartID(id);
            var svg = div.append("svg");
            chart = dc.bubbleOverlay("#" + id)
                .svg(svg)
                .dimension(stateDimension)
                .group(stateValueSumGroup)
                .transitionDuration(0)
                .title(function(d){return "Title: " + d.key;})
                .r(d3.scale.linear().domain([0, 500]))
                .ordinalColors(['blue'])
                .point("California", 100, 120)
                .point("Colorado", 300, 120)
                .point("Delaware", 500, 220)
                .point("Ontario", 180, 90)
                .point("Mississippi", 120, 220)
                .point("Oklahoma", 200, 350);
            chart.render();
        });
        it('an instance of dc chart should be generated', function() {
            expect(dc.instanceOfChart(chart)).toBeTruthy();
        });
        it('should be registered', function() {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('correct number of overlay g should be generated', function() {
            expect(chart.selectAll("g.node")[0].length).toEqual(6);
        });
        it('correct class name for overlay g should be generated', function() {
            expect(d3.select(chart.selectAll("g.node")[0][0]).attr("class")).toEqual("node california");
            expect(d3.select(chart.selectAll("g.node")[0][3]).attr("class")).toEqual("node ontario");
        });
        it('correct number of overlay bubble should be generated', function() {
            expect(chart.selectAll("circle.bubble")[0].length).toEqual(6);
        });
        it('correct translate for overlay g should be generated', function() {
            expect(d3.select(chart.selectAll("g.node")[0][0]).attr("transform")).toEqual("translate(100,120)");
            expect(d3.select(chart.selectAll("g.node")[0][3]).attr("transform")).toEqual("translate(180,90)");
        });
        it('correct radius for circle should be generated', function() {
            expect(d3.select(chart.selectAll("circle.bubble")[0][0]).attr("r")).toEqual("25.4");
            expect(d3.select(chart.selectAll("circle.bubble")[0][3]).attr("r")).toEqual("17.7");
        });
        it('correct label should be generated', function() {
            expect(d3.select(chart.selectAll("g.node text")[0][0]).text()).toEqual("California");
            expect(d3.select(chart.selectAll("g.node text")[0][3]).text()).toEqual("Ontario");
        });
        it('label should only be generated once', function() {
            chart.redraw();
            expect(chart.selectAll("g.node text")[0].length).toEqual(6);
        });
        it('correct title should be generated', function() {
            expect(d3.select(chart.selectAll("g.node title")[0][0]).text()).toEqual("Title: California");
            expect(d3.select(chart.selectAll("g.node title")[0][3]).text()).toEqual("Title: Ontario");
        });
        it('title should only be generated once', function() {
            chart.redraw();
            expect(chart.selectAll("g.node title")[0].length).toEqual(6);
        });
        it('correct color for circle should be filled', function() {
            expect(d3.select(chart.selectAll("circle.bubble")[0][0]).attr("fill")).toEqual("blue");
            expect(d3.select(chart.selectAll("circle.bubble")[0][3]).attr("fill")).toEqual("blue");
        });
        it('correct bubble should be highlighted when filter is active', function() {
            chart.filter("Colorado");
            chart.filter("California");
            chart.redraw();
            expect(d3.select(chart.selectAll("g.node")[0][0]).attr("class")).toEqual("node california selected");
            expect(d3.select(chart.selectAll("g.node")[0][1]).attr("class")).toEqual("node colorado selected");
            expect(d3.select(chart.selectAll("g.node")[0][3]).attr("class")).toEqual("node ontario deselected");
        });

        afterEach(function() {
            stateDimension.filterAll();
        });
    });
});


