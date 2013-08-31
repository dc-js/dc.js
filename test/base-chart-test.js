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

suite.export(module);

