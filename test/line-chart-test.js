require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Line chart');

var width = 1100;
var height = 200;

function buildChart(id, xdomain) {
    d3.select("body").append("div").attr("id", id);
    var chart = dc.lineChart("#" + id);
    chart.dimension(dateDimension).group(dateGroup)
        .width(width).height(height)
        .x(d3.time.scale().domain(xdomain))
        .transitionDuration(0)
        .xUnits(d3.time.days);
    chart.render();
    return chart;
}

suite.addBatch({
    'time line chart': {
        topic: function() {
            var chart = buildChart("line-chart", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
            chart.filter([new Date(2012, 5, 1), new Date(2012, 5, 30)]);
            chart.redraw();
            return chart;
        },
        'we get something': function(chart) {
            assert.isNotNull(chart);
        },
        'should be registered':function(chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'svg should be created': function(chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function(chart) {
            assert.equal(chart.dimension(), dateDimension);
        },
        'group should be set': function(chart) {
            assert.equal(chart.group(), dateGroup);
        },
        'width should be set': function(chart) {
            assert.equal(chart.width(), width);
        },
        'height should be set': function(chart) {
            assert.equal(chart.height(), height);
        },
        'height should be used for svg': function(chart) {
            assert.equal(chart.select("svg").attr("height"), height);
        },
        'transition duration should be set': function(chart) {
            assert.equal(chart.transitionDuration(), 0);
        },
        'margin should be set': function(chart) {
            assert.isNotNull(chart.margins());
        },
        'x can be set': function(chart) {
            assert.isTrue(chart.x() != undefined);
        },
        'x range round is auto calculated based on width': function(chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 1030);
        },
        'x domain should be set': function(chart) {
            assert.equal(chart.x().domain()[0].getTime(), new Date(2012, 0, 1).getTime());
            assert.equal(chart.x().domain()[1].getTime(), new Date(2012, 11, 31).getTime());
        },
        'y can be set': function(chart) {
            assert.isTrue(chart.y() != undefined);
        },
        'y range round is auto calculated based on height': function(chart) {
            assert.equal(chart.y().range()[0], 160);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain is auto calculated based on height': function(chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 3);
        },
        'root g should be created': function(chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'root g should be translated to left corner': function(chart) {
            assert.equal(chart.select("svg g").attr("transform"), "translate(20,10)");
        },
        'axis x should be placed at the bottom': function(chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(20,170)");
        },
        'axis y should be placed on the left': function(chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(20,10)");
        },
        'x units should be set': function(chart) {
            assert.equal(chart.xUnits(), d3.time.days);
        },
        'x axis should be created': function(chart) {
            assert.isNotNull(chart.xAxis());
        },
        'y axis should be created': function(chart) {
            assert.isNotNull(chart.yAxis());
        },
        'brush should be created': function(chart) {
            assert.isNotNull(chart.select("g.brush"));
        },
        'round should be off by default': function(chart) {
            assert.isTrue(chart.round() == null);
        },
        'round can be changed': function(chart) {
            chart.round(d3.time.day.round)
            assert.isNotNull(chart.round());
        },
        'current filter should be set correctly': function(chart) {
            assert.equal(chart.filter()[0].getTime(), new Date(2012, 5, 1).getTime());
            assert.equal(chart.filter()[1].getTime(), new Date(2012, 5, 30).getTime());
        },
        'filter printer should be set': function(chart) {
            assert.isNotNull(chart.filterPrinter());
        },

        'with brush': {
            'be positioned with offset (left margin)': function(chart) {
                assert.equal(chart.select("g.brush").attr("transform"), "translate(" + chart.margins().left + ",0)");
            },
            'brush fancy resize handle should be created': function(chart) {
                chart.select("g.brush").selectAll(".resize path").each(function(d, i) {
                    if (i == 0)
                        assert.equal(d3.select(this).attr("d"), "M0.5,56.666666666666664A6,6 0 0 1 6.5,62.666666666666664V107.33333333333333A6,6 0 0 1 0.5,113.33333333333333ZM2.5,64.66666666666666V105.33333333333333M4.5,64.66666666666666V105.33333333333333");
                    else
                        assert.equal(d3.select(this).attr("d"), "M-0.5,56.666666666666664A6,6 0 0 0 -6.5,62.666666666666664V107.33333333333333A6,6 0 0 0 -0.5,113.33333333333333ZM-2.5,64.66666666666666V105.33333333333333M-4.5,64.66666666666666V105.33333333333333");
                });
            },
            'background should be stretched': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("width"), 1030);
            },
            'background height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("height"), 170);
            },
            'extent height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("height"), 170);
            },
            'extent width should be set based on filter set': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 82);
            },
            'path rendering': function(chart) {
                assert.equal(chart.select("path.line").attr("d"), "M429.060502283105,117L468.5673515981735,117L474.21118721461187,10L533.4714611872146,117L558.8687214611872,63L646.3481735159817,63");
            },
            'area path should not be there':function(chart) {
                assert.equal(chart.selectAll("path.area")[0].length, 0)
            },
            'selected bars should be push to foreground': function(chart) {
                chart.selectAll("g rect.bar").each(function(d, i) {
                    if (i == 1)
                        assert.equal(d3.select(this).attr("class"), "bar");
                });
            },
            'x value should have default impl': function(chart) {
                assert.isNotNull(chart.keyRetriever());
            },
            'y value should have default impl': function(chart) {
                assert.isNotNull(chart.valueRetriever());
            }
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'elastic axis':{
    topic: function(chart) {
        countryDimension.filter("CA")
        var chart = buildChart("elastic-y-line-chart", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
        chart.yAxisPadding(10)
            .xAxisPadding(60)
            .elasticX(true)
            .renderArea(true)
            .redraw();
        return chart;
    },
    'y axis should have shrunk triggered by filter': function(chart) {
        assert.equal(chart.y().domain()[1], 1);
    },
    'x domain should be set': function(chart) {
        assert.equal(chart.x().domain()[0].getTime(), new Date("Mon, 26 Mar 2012 04:00:00 GMT").getTime());
        assert.equal(chart.x().domain()[1].getTime(), new Date("Tue, 09 Oct 2012 04:00:00 GMT").getTime());
    },
    'correctly draw line': function(chart) {
        assert.equal(jQuery("#elastic-y-line-chart g.stack0 path.line").attr("d"), "M333.70558375634516,169L406.90355329949233,169L417.3604060913705,10L527.1573604060914,169L574.2131979695431,10L736.2944162436548,169");
    },
    'correctly draw area': function(chart) {
        assert.equal(jQuery("#elastic-y-line-chart g.stack0 path.area").attr("d"), "M333.70558375634516,169L406.90355329949233,169L417.3604060913705,10L527.1573604060914,169L574.2131979695431,10L736.2944162436548,169L736.2944162436548,169L574.2131979695431,169L527.1573604060914,169L417.3604060913705,169L406.90355329949233,169L333.70558375634516,169Z");
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'area chart':{
    topic:function() {
        var chart = buildChart("area-chart", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
        chart.renderArea(true);
        chart.render();
        return chart;
    },
    'area path should be generated':function(chart) {
        assert.equal(chart.selectAll("path.area")[0].length, 1)
    },
    'area path should be appended only once':function(chart) {
        chart.redraw();
        assert.equal(chart.selectAll("path.area")[0].length, 1)
    },
    'correctly draw line': function(chart) {
        assert.equal(jQuery("#area-chart g.stack0 path.line").attr("d"), "M429.060502283105,117L468.5673515981735,117L474.21118721461187,10L533.4714611872146,117L558.8687214611872,63L646.3481735159817,63");
    },
    'correctly draw area': function(chart) {
        assert.equal(jQuery("#area-chart g.stack0 path.area").attr("d"), "M429.060502283105,117L468.5673515981735,117L474.21118721461187,10L533.4714611872146,117L558.8687214611872,63L646.3481735159817,63L646.3481735159817,169L558.8687214611872,169L533.4714611872146,169L474.21118721461187,169L468.5673515981735,169L429.060502283105,169Z");
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}
});

suite.addBatch({'stacked area chart':{
    topic: function() {
        var chart = buildChart("stacked-area-chart", [new Date(2012, 4, 20), new Date(2012, 07, 15)]);
        chart.dimension(dateDimension)
            .group(dateIdSumGroup)
            .stack(dateValueSumGroup)
            .stack(dateValueSumGroup)
            .elasticY(true)
            .renderArea(true)
        chart.render();
        return chart;
    },
    'right number of lines should be rendered': function(chart) {
        assert.equal(jQuery("#stacked-area-chart path.line").size(), 3);
    },
    'correctly draw stack 0 line': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack0 path.line").attr("d"), "M79.19540229885058,169L244.94252873563218,167L268.6206896551724,160L517.2413793103448,168L623.7931034482758,161L990.8045977011494,163");
    },
    'correctly draw stack 1 line': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack1 path.line").attr("d"), "M79.19540229885058,145L244.94252873563218,130L268.6206896551724,86L517.2413793103448,144L623.7931034482758,131L990.8045977011494,120");
    },
    'correctly draw stack 2 line': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack2 path.line").attr("d"), "M79.19540229885058,121L244.94252873563218,93L268.6206896551724,12L517.2413793103448,120L623.7931034482758,101L990.8045977011494,77");
    },
    'right number of areas should be rendered': function(chart) {
        assert.equal(jQuery("#stacked-area-chart path.area").size(), 3);
    },
    'correctly draw stack 0 area': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack0 path.area").attr("d"), "M79.19540229885058,169L244.94252873563218,167L268.6206896551724,160L517.2413793103448,168L623.7931034482758,161L990.8045977011494,163L990.8045977011494,169L623.7931034482758,169L517.2413793103448,169L268.6206896551724,169L244.94252873563218,169L79.19540229885058,169Z");
    },
    'correctly draw stack 1 area': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack1 path.area").attr("d"), "M79.19540229885058,145L244.94252873563218,130L268.6206896551724,86L517.2413793103448,144L623.7931034482758,131L990.8045977011494,120L990.8045977011494,163L623.7931034482758,161L517.2413793103448,168L268.6206896551724,160L244.94252873563218,167L79.19540229885058,169Z");
    },
    'correctly draw stack 2 area': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack2 path.area").attr("d"), "M79.19540229885058,121L244.94252873563218,93L268.6206896551724,12L517.2413793103448,120L623.7931034482758,101L990.8045977011494,77L990.8045977011494,120L623.7931034482758,131L517.2413793103448,144L268.6206896551724,86L244.94252873563218,130L79.19540229885058,145Z");
    }
}});

suite.addBatch({
    'renderlet':{
        topic:function(){
            var chart = buildChart("chart-renderlet", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
            chart.renderlet(function(chart){chart.selectAll("path").attr("fill", "red");});
            return chart;
        },
        'custom renderlet should be invoked with render': function(chart){
            chart.render();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        'custom renderlet should be invoked with redraw': function(chart){
            chart.redraw();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'horizontal grid lines drawing':{
        topic:function(){
            var chart = buildChart("chart-grid-line", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
            chart.renderHorizontalGridLines(true);
            chart.render();
            return chart;
        },
        'horizontal grid line g should be generated': function(chart){
            assert.equal(chart.selectAll("g.horizontal")[0].length, 1);
        },
        'horizontal grid lines should be generated': function(chart){
            assert.equal(jQuery("#chart-grid-line g.horizontal line").size(), 6);
        },
        'horizontal grid line x,y should be generated correctly': function(chart){
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[0].getAttribute("x1"), "1");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[0].getAttribute("y1"), "133");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[0].getAttribute("x2"), "1030");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[0].getAttribute("y2"), "133");

            assert.equal(jQuery("#chart-grid-line g.horizontal line")[3].getAttribute("x1"), "1");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[3].getAttribute("y1"), "53");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[3].getAttribute("x2"), "1030");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[3].getAttribute("y2"), "53");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'horizontal grid lines drawing w/ custom ticks':{
        topic:function(){
            var chart = buildChart("chart-grid-line-custom-ticks", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
            chart.yAxis().tickValues([0, 1, 2]);
            chart.renderHorizontalGridLines(true);
            chart.render();
            return chart;
        },
        'horizontal grid line g should be generated': function(chart){
            assert.equal(chart.selectAll("g.horizontal")[0].length, 1);
        },
        'horizontal grid lines should be generated': function(chart){
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line").size(), 2);
        },
        'horizontal grid line x,y should be generated correctly': function(chart){
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[0].getAttribute("x1"), "1");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[0].getAttribute("y1"), "107");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[0].getAttribute("x2"), "1030");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[0].getAttribute("y2"), "107");

            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[1].getAttribute("x1"), "1");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[1].getAttribute("y1"), "53");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[1].getAttribute("x2"), "1030");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[1].getAttribute("y2"), "53");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'vertical grid lines drawing':{
        topic:function(){
            var chart = buildChart("chart-grid-line-vertical", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
            chart.renderVerticalGridLines(true);
            chart.render();
            return chart;
        },
        'vertical grid line g should be generated': function(chart){
            assert.equal(chart.selectAll("g.vertical")[0].length, 1);
        },
        'vertical grid lines should be generated': function(chart){
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line").size(), 12);
        },
        'vertical grid line x,y should be generated correctly': function(chart){
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x1"), "87.47945205479452");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y1"), "160");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x2"), "87.47945205479452");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y2"), "");

            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[3].getAttribute("x1"), "256.6769406392694");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[3].getAttribute("y1"), "160");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[3].getAttribute("x2"), "256.6769406392694");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[3].getAttribute("y2"), "");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});


suite.addBatch({
    'vertical grid lines drawing':{
        topic:function(){
            var chart = buildChart("chart-grid-line-vertical", [new Date(2012, 0, 1), new Date(2012, 11, 31)]);
            chart.xAxis().tickValues([new Date(2012, 3, 1), new Date(2012, 6, 1), new Date(2012, 9, 1)]);
            chart.renderVerticalGridLines(true);
            chart.render();
            return chart;
        },
        'vertical grid line g should be generated': function(chart){
            assert.equal(chart.selectAll("g.vertical")[0].length, 1);
        },
        'vertical grid lines should be generated': function(chart){
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line").size(), 3);
        },
        'vertical grid line x,y should be generated correctly': function(chart){
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x1"), "513.4714611872146");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y1"), "160");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x2"), "513.4714611872146");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y2"), "");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);
