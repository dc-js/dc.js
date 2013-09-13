require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Line chart');

var width = 1100;
var height = 200;

function buildChart(id, xdomain) {
    if (!xdomain)
        xdomain = [new Date(2012, 0, 1), new Date(2012, 11, 31)];

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

function buildNegativeChart(id, xdomain) {
    if (!xdomain)
        xdomain = [new Date(2012, 4, 20), new Date(2012, 7, 15)];

    d3.select("body").append("div").attr("id", id);
    var chart = dc.lineChart("#" + id);
    chart.width(1100)
        .height(200)
        .transitionDuration(0)
        .margins({top: 30, right: 50, bottom: 30, left: 30})
        .dimension(dateDimension)
        .group(dateNegativeValueSumGroup)
        .renderArea(true)
        .stack(dateNegativeValueSumGroup)
        .stack(dateNegativeValueSumGroup)
        .yAxisPadding(5)
        .elasticY(true)
        .x(d3.time.scale().domain(xdomain))
        .renderHorizontalGridLines(true)
        .xUnits(d3.time.days)
        .yAxis().ticks(5);
    chart.render();
    return chart;
}

function buildOrdinalChart(id, xdomain) {
    if (!xdomain)
        xdomain = ["California", "Colorado", "Delaware", "Mississippi", "Oklahoma", "Ontario"];

    d3.select("body").append("div").attr("id", id);
    var chart = dc.lineChart("#" + id);
    chart.dimension(stateDimension).group(stateGroup)
        .width(width).height(height)
        .x(d3.scale.ordinal().domain(xdomain))
        .transitionDuration(0)
        .xUnits(dc.units.ordinal);
    chart.render();
    return chart;
}

suite.addBatch({
    'time line chart': {
        topic: function () {
            var chart = buildChart("line-chart");
            chart.filter([new Date(2012, 5, 1), new Date(2012, 5, 30)]);
            chart.redraw();
            return chart;
        },
        'we get something': function (chart) {
            assert.isNotNull(chart);
        },
        'should be registered': function (chart) {
            assert.isTrue(dc.hasChart(chart));
        },
        'svg should be created': function (chart) {
            assert.isFalse(chart.select("svg").empty());
        },
        'dimension should be set': function (chart) {
            assert.equal(chart.dimension(), dateDimension);
        },
        'group should be set': function (chart) {
            assert.equal(chart.group(), dateGroup);
        },
        'width should be set': function (chart) {
            assert.equal(chart.width(), width);
        },
        'height should be set': function (chart) {
            assert.equal(chart.height(), height);
        },
        'height should be used for svg': function (chart) {
            assert.equal(chart.select("svg").attr("height"), height);
        },
        'transition duration should be set': function (chart) {
            assert.equal(chart.transitionDuration(), 0);
        },
        'margin should be set': function (chart) {
            assert.isNotNull(chart.margins());
        },
        'x can be set': function (chart) {
            assert.isTrue(chart.x() !== undefined);
        },
        'x range round is auto calculated based on width': function (chart) {
            assert.equal(chart.x().range()[0], 0);
            assert.equal(chart.x().range()[1], 1020);
        },
        'x domain should be set': function (chart) {
            assert.equal(chart.x().domain()[0].getTime(), new Date(2012, 0, 1).getTime());
            assert.equal(chart.x().domain()[1].getTime(), new Date(2012, 11, 31).getTime());
        },
        'y can be set': function (chart) {
            assert.isTrue(chart.y() !== undefined);
        },
        'y range round is auto calculated based on height': function (chart) {
            assert.equal(chart.y().range()[0], 160);
            assert.equal(chart.y().range()[1], 0);
        },
        'y domain is auto calculated based on height': function (chart) {
            assert.equal(chart.y().domain()[0], 0);
            assert.equal(chart.y().domain()[1], 3);
        },
        'root g should be created': function (chart) {
            assert.isFalse(chart.select("svg g").empty());
        },
        'axis x should be placed at the bottom': function (chart) {
            assert.equal(chart.select("svg g g.x").attr("transform"), "translate(30,170)");
        },
        'axis y should be placed on the left': function (chart) {
            assert.equal(chart.select("svg g g.y").attr("transform"), "translate(30,10)");
        },
        'x units should be set': function (chart) {
            assert.equal(chart.xUnits(), d3.time.days);
        },
        'x axis should be created': function (chart) {
            assert.isNotNull(chart.xAxis());
        },
        'y axis should be created': function (chart) {
            assert.isNotNull(chart.yAxis());
        },
        'brush should be created': function (chart) {
            assert.isNotNull(chart.select("g.brush"));
        },
        'round should be off by default': function (chart) {
            assert.isTrue(chart.round() === undefined);
        },
        'round can be changed': function (chart) {
            chart.round(d3.time.day.round);
            assert.isNotNull(chart.round());
        },
        'current filter should be set correctly': function (chart) {
            assert.equal(chart.filter()[0].getTime(), new Date(2012, 5, 1).getTime());
            assert.equal(chart.filter()[1].getTime(), new Date(2012, 5, 30).getTime());
        },
        'filter printer should be set': function (chart) {
            assert.isNotNull(chart.filterPrinter());
        },
        'circle.dot should not be generated by default': function (chart) {
            assert.lengthOf(chart.selectAll("circle.dot")[0], 0);
        },

        'with brush': {
            'be positioned with offset (left margin)': function (chart) {
                assert.equal(chart.select("g.brush").attr("transform"), "translate(" + chart.margins().left + ",10)");
            },
            'brush fancy resize handle should be created': function (chart) {
                chart.select("g.brush").selectAll(".resize path").each(function (d, i) {
                    if (i === 0)
                        assert.equal(d3.select(this).attr("d"), "M0.5,53.333333333333336A6,6 0 0 1 6.5,59.333333333333336V100.66666666666667A6,6 0 0 1 0.5,106.66666666666667ZM2.5,61.333333333333336V98.66666666666667M4.5,61.333333333333336V98.66666666666667");
                    else
                        assert.equal(d3.select(this).attr("d"), "M-0.5,53.333333333333336A6,6 0 0 0 -6.5,59.333333333333336V100.66666666666667A6,6 0 0 0 -0.5,106.66666666666667ZM-2.5,61.333333333333336V98.66666666666667M-4.5,61.333333333333336V98.66666666666667");
                });
            },
            'background should be stretched': function (chart) {
                assert.equal(chart.select("g.brush rect.background").attr("width"), 1020);
            },
            'background height should be set to chart height': function (chart) {
                assert.equal(chart.select("g.brush rect.background").attr("height"), 160);
            },
            'extent height should be set to chart height': function (chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("height"), 160);
            },
            'extent width should be set based on filter set': function (chart) {
                assert.equal(chart.select("g.brush rect.extent").attr("width"), 81.04109589041093);
            },
            'path rendering': function (chart) {
                assert.matches(chart.select("path.line").attr("d"), /M405.\d+,107L444.\d+,107L449.\d+,0L508.\d+,107L533.\d+,53L620.\d+,53/);
            },
            'area path should not be there': function (chart) {
                assert.lengthOf(chart.selectAll("path.area")[0], 0);
            },
            'selected bars should be push to foreground': function (chart) {
                chart.selectAll("g rect.bar").each(function (d, i) {
                    if (i === 1)
                        assert.equal(d3.select(this).attr("class"), "bar");
                });
            },
            'x value should have default impl': function (chart) {
                assert.isNotNull(chart.keyAccessor());
            },
            'y value should have default impl': function (chart) {
                assert.isNotNull(chart.valueAccessor());
            }
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'elastic axis': {
    topic: function () {
        countryDimension.filter("CA");
        var chart = buildChart("elastic-y-line-chart");
        chart.yAxisPadding(10)
            .xAxisPadding(60)
            .elasticX(true)
            .renderArea(true)
            .render();
        return chart;
    },
    'y axis should have shrunk triggered by filter': function (chart) {
        assert.equal(chart.y().domain()[1], 1);
    },
    'x domain should be set': function (chart) {
        assert.isTrue(chart.x().domain()[0].getTime() >= 1332720000000);
        assert.isTrue(chart.x().domain()[1].getTime() >= 1349740800000);
    },
    'correctly draw line': function (chart) {
        assert.matches(d3.select("#elastic-y-line-chart path.line").attr("d"), /M310.\d+,160L383.\d+,160L393.\d+,0L502.\d+,160L548.\d+,0L709.\d+,160/);
    },
    'correctly draw area': function (chart) {
        assert.matches(d3.select("#elastic-y-line-chart path.area").attr("d"), /M310.\d+,160L383.\d+,160L393.\d+,0L502.\d+,160L548.\d+,0L709.\d+,160L709.\d+,160L548.\d+,160L502.\d+,160L393.\d+,160L383.\d+,160L310.\d+,160Z/);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'area chart': {
    topic: function () {
        var chart = buildChart("area-chart");
        chart.renderArea(true);
        chart.render();
        return chart;
    },
    'area path should be generated': function (chart) {
        assert.lengthOf(chart.selectAll("path.area")[0], 1);
    },
    'area path should be appended only once': function (chart) {
        chart.redraw();
        assert.lengthOf(chart.selectAll("path.area")[0], 1);
    },
    'correctly draw line': function (chart) {
        assert.matches(d3.select("#area-chart g._0 path.line").attr("d"), /M405.\d+,107L444.\d+,107L449.\d+,0L508.\d+,107L533.\d+,53L620.\d+,53/);
    },
    'correctly draw area': function (chart) {
        assert.matches(d3.select("#area-chart g._0 path.area").attr("d"), /M405.\d+,107L444.\d+,107L449.\d+,0L508.\d+,107L533.\d+,53L620.\d+,53L620.\d+,160L533.\d+,160L508.\d+,160L449.\d+,160L444.\d+,160L405.\d+,160Z/);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}
});

suite.addBatch({'stacked area chart': {
    topic: function () {
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
    'right number of lines should be rendered': function (chart) {
        assert.lengthOf(d3.selectAll("#stacked-area-chart path.line")[0], 3);
    },
    'correctly draw stack 0 line': function (chart) {
        assert.equal(d3.select("#stacked-area-chart g._0 path.line").attr("d"), "M58.62068965517241,159L222.75862068965515,157L246.20689655172413,150L492.41379310344826,158L597.9310344827586,151L961.3793103448276,153");
    },
    'correctly draw stack 1 line': function (chart) {
        assert.equal(d3.select("#stacked-area-chart g._1 path.line").attr("d"), "M58.62068965517241,134L222.75862068965515,119L246.20689655172413,75L492.41379310344826,133L597.9310344827586,120L961.3793103448276,109");
    },
    'correctly draw stack 2 line': function (chart) {
        assert.equal(d3.select("#stacked-area-chart g._2 path.line").attr("d"), "M58.62068965517241,109L222.75862068965515,81L246.20689655172413,0L492.41379310344826,108L597.9310344827586,89L961.3793103448276,65");
    },
    'right number of areas should be rendered': function (chart) {
        assert.lengthOf(d3.selectAll("#stacked-area-chart path.area")[0], 3);
    },
    'correctly draw stack 0 area': function (chart) {
        assert.equal(d3.select("#stacked-area-chart g._0 path.area").attr("d"), "M58.62068965517241,159L222.75862068965515,157L246.20689655172413,150L492.41379310344826,158L597.9310344827586,151L961.3793103448276,153L961.3793103448276,160L597.9310344827586,160L492.41379310344826,160L246.20689655172413,160L222.75862068965515,160L58.62068965517241,160Z");
    },
    'correctly draw stack 1 area': function (chart) {
        assert.equal(d3.select("#stacked-area-chart g._1 path.area").attr("d"), "M58.62068965517241,134L222.75862068965515,119L246.20689655172413,75L492.41379310344826,133L597.9310344827586,120L961.3793103448276,109L961.3793103448276,153L597.9310344827586,151L492.41379310344826,158L246.20689655172413,150L222.75862068965515,157L58.62068965517241,159Z");
    },
    'correctly draw stack 2 area': function (chart) {
        assert.equal(d3.select("#stacked-area-chart g._2 path.area").attr("d"), "M58.62068965517241,109L222.75862068965515,81L246.20689655172413,0L492.41379310344826,108L597.9310344827586,89L961.3793103448276,65L961.3793103448276,109L597.9310344827586,120L492.41379310344826,133L246.20689655172413,75L222.75862068965515,119L58.62068965517241,134Z");
    }
}});

suite.addBatch({
    'renderlet': {
        topic: function () {
            var chart = buildChart("chart-renderlet");
            chart.renderlet(function (chart) {
                chart.selectAll("path").attr("fill", "red");
            });
            return chart;
        },
        'custom renderlet should be invoked with render': function (chart) {
            chart.render();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        'custom renderlet should be invoked with redraw': function (chart) {
            chart.redraw();
            assert.equal(chart.selectAll("path").attr("fill"), "red");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'horizontal grid lines drawing': {
        topic: function () {
            var chart = buildChart("chart-grid-line");
            chart.renderHorizontalGridLines(true);
            chart.render();
            return chart;
        },
        'horizontal grid line g should be generated': function (chart) {
            assert.lengthOf(chart.selectAll("g.horizontal")[0], 1);
        },
        'horizontal grid lines should be generated': function (chart) {
            assert.lengthOf(d3.selectAll("#chart-grid-line g.horizontal line")[0], 7);
        },
        'horizontal grid line x,y should be generated correctly': function (chart) {
            var e1 = d3.selectAll("#chart-grid-line g.horizontal line")[0][0];
            assert.equal(e1.getAttribute("x1"), "1");
            assert.equal(e1.getAttribute("y1"), "160");
            assert.equal(e1.getAttribute("x2"), "1020");
            assert.equal(e1.getAttribute("y2"), "160");

            var e3 = d3.selectAll("#chart-grid-line g.horizontal line")[0][3];
            assert.equal(e3.getAttribute("x1"), "1");
            assert.equal(e3.getAttribute("y1"), "80");
            assert.equal(e3.getAttribute("x2"), "1020");
            assert.equal(e3.getAttribute("y2"), "80");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'horizontal grid lines drawing w/ custom ticks': {
        topic: function () {
            var chart = buildChart("chart-grid-line-custom-ticks");
            chart.yAxis().tickValues([0, 1, 2]);
            chart.renderHorizontalGridLines(true);
            chart.render();
            return chart;
        },
        'horizontal grid line g should be generated': function (chart) {
            assert.lengthOf(chart.selectAll("g.horizontal")[0], 1);
        },
        'horizontal grid lines should be generated': function (chart) {
            assert.lengthOf(d3.selectAll("#chart-grid-line-custom-ticks g.horizontal line")[0], 3);
        },
        'horizontal grid line x,y should be generated correctly': function (chart) {
            var e0 = d3.selectAll("#chart-grid-line-custom-ticks g.horizontal line")[0][0];
            assert.equal(e0.getAttribute("x1"), "1");
            assert.equal(e0.getAttribute("y1"), "160");
            assert.equal(e0.getAttribute("x2"), "1020");
            assert.equal(e0.getAttribute("y2"), "160");

            var e1 = d3.selectAll("#chart-grid-line-custom-ticks g.horizontal line")[0][1];
            assert.equal(e1.getAttribute("x1"), "1");
            assert.equal(e1.getAttribute("y1"), "107");
            assert.equal(e1.getAttribute("x2"), "1020");
            assert.equal(e1.getAttribute("y2"), "107");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({
    'vertical grid lines drawing': {
        topic: function () {
            var chart = buildChart("chart-grid-line-vertical");
            chart.renderVerticalGridLines(true);
            chart.render();
            return chart;
        },
        'vertical grid line g should be generated': function (chart) {
            assert.lengthOf(chart.selectAll("g.vertical")[0], 1);
        },
        'vertical grid lines should be generated': function (chart) {
            assert.lengthOf(d3.selectAll("#chart-grid-line-vertical g.vertical line")[0], 12);
        },
        'vertical grid line x,y should be generated correctly': function (chart) {
            var e1 = d3.selectAll("#chart-grid-line-vertical g.vertical line")[0][1];
            assert.matches(e1.getAttribute("x1"), /86.\d+/);
            assert.equal(e1.getAttribute("y1"), "160");
            assert.matches(e1.getAttribute("x2"), /86.\d+/);
            assert.equal(e1.getAttribute("y2"), 0);

            var e3 = d3.selectAll("#chart-grid-line-vertical g.vertical line")[0][3];
            assert.matches(e3.getAttribute("x1"), /254.\d+/);
            assert.equal(e3.getAttribute("y1"), "160");
            assert.matches(e3.getAttribute("x2"), /254.\d+/);
            assert.equal(e3.getAttribute("y2"), 0);
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});


suite.addBatch({
    'tooltip and data point highlight': {
        topic: function () {
            var chart = buildChart("chart-tooltip");
            chart.brushOn(false)
                .title(function (d) {
                    return d.data.value;
                })
                .dotRadius(10)
                .render();
            return chart;
        },
        'g.brush should not be generated': function (chart) {
            assert.lengthOf(chart.selectAll("g.brush")[0], 0);
        },
        'circle.dot should be generated per data point': function (chart) {
            assert.lengthOf(chart.selectAll("circle.dot")[0], 6);
        },
        'circle.dot radius should be configurable': function (chart) {
            chart.selectAll("circle.dot").each(function () {
                assert.equal(d3.select(this).attr("r"), 10);
            });
        },
        'circle.dot should be almost invisible by default': function (chart) {
            chart.selectAll("circle.dot").each(function () {
                assert.equal(d3.select(this).style("fill-opacity"), 1e-6);
                assert.equal(d3.select(this).style("stroke-opacity"), 1e-6);
            });
        },
        'circle.dot title should be generated per data point': function (chart) {
            chart.selectAll("circle.dot").each(function (d) {
                assert.equal(d3.select(this).select("title").text(), d.data.value);
            });
        },
        'hidden ref lines should be generated': function (chart) {
            assert.equal(chart.select("path.xRef").style("display"), "none");
            assert.equal(chart.select("path.yRef").style("display"), "none");
        },
        'ref lines should be generated as dash path': function (chart) {
            assert.equal(chart.select("path.xRef").attr("stroke-dasharray"), "5,5");
            assert.equal(chart.select("path.yRef").attr("stroke-dasharray"), "5,5");
        },
        teardown: function (topic) {
            resetAllFilters();
            resetBody();
        }
    }
});

suite.addBatch({'ordinal line chart': {
    topic: function () {
        var chart = buildOrdinalChart("line-chart-ordinal");
        return chart;
    },
    'should have brush turned off': function (chart) {
        assert.isFalse(chart.brushOn());
    },
    'should generate correct line path': function (chart) {
        assert.match(chart.select("path.line").attr("d"), /M72.\d+,0L218.\d+,107L364.\d+,107L510.\d+,53L655.\d+,107L801.\d+,53/);
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'negative bar chart': {
    topic: function () {
        return buildNegativeChart("line-chart-negative");
    },
    'should generate correct number of lines': function (chart) {
        assert.lengthOf(chart.selectAll("path.line")[0], 3);
        assert.lengthOf(chart.selectAll("path.area")[0], 3);
    },
    'should generate correct bars in stack 0': function (chart) {
        assert.match(d3.select(chart.selectAll("g._0 path.line")[0][0]).attr("d"), /M58.\d+,81L222.\d+,81L246.\d+,92L492.\d+,79L597.\d+,52L961.\d+,67/);
        assert.match(d3.select(chart.selectAll("g._0 path.area")[0][0]).attr("d"), /M58.\d+,81L222.\d+,81L246.\d+,92L492.\d+,79L597.\d+,52L961.\d+,67L961.\d+,73L597.\d+,73L492.\d+,73L246.\d+,73L222.\d+,73L58.\d+,73Z/);
    },
    'should generate correct bars in stack 1': function (chart) {
        assert.match(d3.select(chart.selectAll("g._1 path.line")[0][0]).attr("d"), /M58.\d+,88L222.\d+,88L246.\d+,111L492.\d+,84L597.\d+,31L961.\d+,61/);
        assert.match(d3.select(chart.selectAll("g._1 path.area")[0][0]).attr("d"), /M58.\d+,88L222.\d+,88L246.\d+,111L492.\d+,84L597.\d+,31L961.\d+,61L961.\d+,67L597.\d+,52L492.\d+,79L246.\d+,92L222.\d+,81L58.\d+,81Z/);
    },
    'should generate y axis domain dynamically': function (chart) {
        assert.match(d3.select(chart.selectAll("g.y text")[0][0]).text(), /[−-]20/);
        assert.equal(d3.select(chart.selectAll("g.y text")[0][1]).text(), "0");
        assert.equal(d3.select(chart.selectAll("g.y text")[0][2]).text(), "20");
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.addBatch({'clip path': {
    topic: function () {
        var chart = buildChart("chart-clip-path");
        return chart;
    },
    'only one defs should be created': function (chart) {
        assert.lengthOf(chart.selectAll("defs")[0], 1);
    },
    'only one clip path should be created': function (chart) {
        assert.lengthOf(chart.selectAll("defs clipPath")[0], 1);
    },
    'only one clip rect should be created': function (chart) {
        assert.lengthOf(chart.selectAll("defs clipPath rect")[0], 1);
    },
    'clip rect size should be correct': function (chart) {
        var rect = chart.select("defs clipPath rect");
        assert.equal(rect.attr("width"), 1020);
        assert.equal(rect.attr("height"), 160);
    },
    'clip id should be correct': function (chart) {
        assert.equal(chart.select("defs clipPath").attr("id"), "chart-clip-path-clip");
    },
    'chart body g should have clip path refs': function (chart) {
        chart.selectAll("g.chart-body").each(function () {
            assert.equal(d3.select(this).attr("clip-path"), "url(#chart-clip-path-clip)");
        });
    },
    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
}});

suite.export(module);
