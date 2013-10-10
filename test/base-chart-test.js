require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Base chart');

suite.addBatch({
    'renderlet': {
        topic: function () {
            return dc.baseChart({}).renderlet(function (chart) {
            });
        },

        'should be set': function (chart) {
            assert.isNotNull(chart.renderlet());
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'render listeners': {
        topic: function () {
            var chart = dc.baseChart({out: ""});
            chart.dimension(valueDimension)
                .group(valueGroup)
                .transitionDuration(0)
                .on("preRender", function (chart) {
                    chart.out += "preRender";
                })
                .on("postRender", function (chart) {
                    chart.out += ":postRender";
                });
            chart.render();
            return chart;
        },

        'listeners invocation': function (chart) {
            assert.equal(chart.out, "preRender:postRender");
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'filter listeners': {
        topic: function () {
            var chart = dc.baseChart({out: ""});
            chart.dimension(valueDimension)
                .group(valueGroup)
                .on("filtered", function (chart, filter) {
                    chart.out = filter;
                });
            chart.render().filter(11);
            return chart;
        },

        'listeners invocation': function (chart) {
            assert.equal(chart.out, "11");
        },

        'should not be invoked for read operation': function (chart) {
            chart.filter();
            assert.equal(chart.out, "11");
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'redraw listeners': {
        topic: function () {
            var chart = dc.baseChart({out: ""});
            chart.dimension(valueDimension)
                .group(valueGroup)
                .transitionDuration(0)
                .on("preRedraw", function (chart) {
                    chart.out += "preRedraw";
                })
                .on("postRedraw", function (chart) {
                    chart.out += ":postRedraw";
                });
            chart.render();
            chart.redraw();
            return chart;
        },

        'listeners invocation': function (chart) {
            assert.equal(chart.out, "preRedraw:postRedraw");
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'missing dimension': {
        topic: function () {
            return dc.baseChart({}).group(valueGroup);
        },

        'should trigger descriptive exception': function (chart) {
            try {
                chart.render();
                assert.fail("Exception should have been triggered");
            } catch (e) {
                assert.isTrue(e instanceof dc.errors.InvalidStateException);
                assert.equal("Mandatory attribute chart.dimension is missing on chart[#]", e.toString());
            }
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'missing group': {
        topic: function () {
            return dc.baseChart({}).dimension(valueDimension);
        },

        'should trigger descriptive exception': function (chart) {
            try {
                chart.render();
                assert.fail("Exception should have been triggered");
            } catch (e) {
                assert.isTrue(e instanceof dc.errors.InvalidStateException);
                assert.equal("Mandatory attribute chart.group is missing on chart[#]", e.toString());
            }
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
    }
});

suite.addBatch({
    'anchor grabs the correct dom': {
        topic: function () { return dc.baseChart({}); },

        'anchor name from element id': function (chart) {
            var div = d3.select("body").append("div").attr("id", "ele").node();
            chart.anchor(div);
            assert.equal('ele',chart.anchorName());
        },

        'anchor name from string': function (chart) {
            d3.select("body").append("div").attr("id", "strele");
            chart.anchor('#strele');
            assert.equal('strele',chart.anchorName());
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
        dc.chartRegistry.clear();
    }
});

suite.addBatch({
    'calculation of dimensions': {
        topic: function () {
            var chart = dc.baseChart({});
            d3.select("body").append("div").attr("id", "ele").node();
            chart.anchor("#ele").dimension(valueDimension).group(valueGroup);
            return chart;
        },

        'height is determined using supplied function when height calculation is enabled': function (chart) {
            var calculation = sinon.stub().returns(800);
            chart.calculateHeight(true).heightCalculation(calculation);
            chart.render();

            assert.isTrue(calculation.called)
            assert.equal(chart.height(), 800);
        },

        'width is determined using supplied function when width calculation is enabled': function (chart) {
            var calculation = sinon.stub().returns(800);
            chart.calculateWidth(true).widthCalculation(calculation);
            chart.render();

            assert.isTrue(calculation.called)
            assert.equal(chart.width(), 800);
        },

        'height not calculated when height calculation is disabled': function (chart) {
            var calculation = sinon.stub().returns(800);
            chart.height(400);
            chart.calculateHeight(false).heightCalculation(calculation);
            chart.render();

            assert.isFalse(calculation.called)
            assert.equal(chart.height(), 400);
        },

        'width not calculated when width calculation is disabled': function (chart) {
            var calculation = sinon.stub().returns(800);
            chart.width(400);
            chart.calculateWidth(false).widthCalculation(calculation);
            chart.render();

            assert.isFalse(calculation.called)
            assert.equal(chart.width(), 400);
        }
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
        dc.chartRegistry.clear();
    }
});

suite.export(module);

