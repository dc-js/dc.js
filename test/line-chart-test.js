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
            assert.equal(chart.x().range()[1], 1020);
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
        'axis x should be placed at the bottom': function(chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(30,170)");
        },
        'axis y should be placed on the left': function(chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(30,10)");
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
            chart.round(d3.time.day.round);
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
                assert.equal(chart.select("g.brush rect.background").attr("width"), 1020);
            },
            'background height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.background").attr("height"), 170);
            },
            'extent height should be set to chart height': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("height"), 170);
            },
            'extent width should be set based on filter set': function(chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 81);
            },
            'path rendering': function(chart) {
                assert.equal(chart.select("path.line").attr("d"), "M435.08904109589037,117L474.21232876712327,117L479.8013698630137,10L538.486301369863,117L563.6369863013698,63L650.2671232876712,63");
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
                assert.isNotNull(chart.keyAccessor());
            },
            'y value should have default impl': function(chart) {
                assert.isNotNull(chart.valueAccessor());
            }
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'elastic axis':{
    topic: function() {
        countryDimension.filter("CA");
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
        assert.equal(jQuery("#elastic-y-line-chart g.stack0 path.line").attr("d"), "M340.65989847715736,169L413.14720812182736,169L423.502538071066,10L532.233502538071,169L578.8324873096446,10L739.3401015228426,169");
    },
    'correctly draw area': function(chart) {
        assert.equal(jQuery("#elastic-y-line-chart g.stack0 path.area").attr("d"), "M340.65989847715736,169L413.14720812182736,169L423.502538071066,10L532.233502538071,169L578.8324873096446,10L739.3401015228426,169L739.3401015228426,169L578.8324873096446,169L532.233502538071,169L423.502538071066,169L413.14720812182736,169L340.65989847715736,169Z");
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
        assert.equal(jQuery("#area-chart g.stack0 path.line").attr("d"), "M435.08904109589037,117L474.21232876712327,117L479.8013698630137,10L538.486301369863,117L563.6369863013698,63L650.2671232876712,63");
    },
    'correctly draw area': function(chart) {
        assert.equal(jQuery("#area-chart g.stack0 path.area").attr("d"), "M435.08904109589037,117L474.21232876712327,117L479.8013698630137,10L538.486301369863,117L563.6369863013698,63L650.2671232876712,63L650.2671232876712,169L563.6369863013698,169L538.486301369863,169L479.8013698630137,169L474.21232876712327,169L435.08904109589037,169Z");
    },
    teardown: function(topic) {
        resetAllFilters();
        resetBody();
    }
}
});

suite.addBatch({'stacked area chart':{
    topic: function() {
        var chart = buildChart("stacked-area-chart", [new Date(2012, 4, 20), new Date(2012, 7, 15)]);
        chart.dimension(dateDimension)
            .group(dateIdSumGroup)
            .stack(dateValueSumGroup)
            .stack(dateValueSumGroup)
            .elasticY(true)
            .renderArea(true);
        chart.render();
        return chart;
    },
    'right number of lines should be rendered': function(chart) {
        assert.equal(jQuery("#stacked-area-chart path.line").size(), 3);
    },
    'correctly draw stack 0 line': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack0 path.line").attr("d"), "M88.62068965517241,169L252.75862068965515,167L276.2068965517241,160L522.4137931034483,168L627.9310344827586,161L991.3793103448276,163");
    },
    'correctly draw stack 1 line': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack1 path.line").attr("d"), "M88.62068965517241,145L252.75862068965515,130L276.2068965517241,86L522.4137931034483,144L627.9310344827586,131L991.3793103448276,120");
    },
    'correctly draw stack 2 line': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack2 path.line").attr("d"), "M88.62068965517241,121L252.75862068965515,93L276.2068965517241,12L522.4137931034483,120L627.9310344827586,101L991.3793103448276,77");
    },
    'right number of areas should be rendered': function(chart) {
        assert.equal(jQuery("#stacked-area-chart path.area").size(), 3);
    },
    'correctly draw stack 0 area': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack0 path.area").attr("d"), "M88.62068965517241,169L252.75862068965515,167L276.2068965517241,160L522.4137931034483,168L627.9310344827586,161L991.3793103448276,163L991.3793103448276,169L627.9310344827586,169L522.4137931034483,169L276.2068965517241,169L252.75862068965515,169L88.62068965517241,169Z");
    },
    'correctly draw stack 1 area': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack1 path.area").attr("d"), "M88.62068965517241,145L252.75862068965515,130L276.2068965517241,86L522.4137931034483,144L627.9310344827586,131L991.3793103448276,120L991.3793103448276,163L627.9310344827586,161L522.4137931034483,168L276.2068965517241,160L252.75862068965515,167L88.62068965517241,169Z");
    },
    'correctly draw stack 2 area': function(chart) {
        assert.equal(jQuery("#stacked-area-chart g.stack2 path.area").attr("d"), "M88.62068965517241,121L252.75862068965515,93L276.2068965517241,12L522.4137931034483,120L627.9310344827586,101L991.3793103448276,77L991.3793103448276,120L627.9310344827586,131L522.4137931034483,144L276.2068965517241,86L252.75862068965515,130L88.62068965517241,145Z");
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
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[0].getAttribute("x2"), "1020");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[0].getAttribute("y2"), "133");

            assert.equal(jQuery("#chart-grid-line g.horizontal line")[3].getAttribute("x1"), "1");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[3].getAttribute("y1"), "53");
            assert.equal(jQuery("#chart-grid-line g.horizontal line")[3].getAttribute("x2"), "1020");
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
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[0].getAttribute("x2"), "1020");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[0].getAttribute("y2"), "107");

            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[1].getAttribute("x1"), "1");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[1].getAttribute("y1"), "53");
            assert.equal(jQuery("#chart-grid-line-custom-ticks g.horizontal line")[1].getAttribute("x2"), "1020");
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
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x1"), "86.63013698630137");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y1"), "160");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x2"), "86.63013698630137");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y2"), "");

            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[3].getAttribute("x1"), "254.18493150684932");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[3].getAttribute("y1"), "160");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[3].getAttribute("x2"), "254.18493150684932");
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
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x1"), "508.48630136986304");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y1"), "160");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("x2"), "508.48630136986304");
            assert.equal(jQuery("#chart-grid-line-vertical g.vertical line")[1].getAttribute("y2"), "");
        },
        teardown: function(topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.export(module);
