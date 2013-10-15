require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Coordinate grid chart');

suite.addBatch({
    'missing x': {
        topic: function () {
            return dc.coordinateGridChart({})
                .group(valueGroup)
                .dimension(valueGroup);
        },

        'should trigger descriptive exception': function (chart) {
            try{
                chart.render();
                assert.fail("Exception should have been triggered");
            }catch(e){
                assert.isTrue(e instanceof dc.errors.InvalidStateException);
                assert.match(e.toString(), /Mandatory attribute chart.x is missing on chart\[#\d+\]/);
            }
        }
    },

    'brushing with equal dates': {
        topic: function () {
            var chart = dc.coordinateGridChart({});
            sinon.spy(chart, "filter");
            sinon.stub(chart, "redrawBrush");
            sinon.stub(chart, "extendBrush").returns([new Date("2013/1/1"), new Date("2013/1/1")]);
            return chart;
        },

        'should not trigger a filter event': function(chart) {
            chart._brushing();
            assert.isTrue(chart.filter.calledWith(null));
        }
    }
});

suite.addBatch({
    'mouse zooming': {
        topic: function () {
            d3.select("body").append("div").attr("id", "ele");
            var chart = dc.coordinateGridChart({})
                .anchor("#ele")
                .dimension(valueDimension)
                .group(valueGroup)
                .x(d3.scale.linear().domain([0,1]));
            // Define plotData to allow rendering
            chart.plotData = function () {};
            sinon.spy(chart.root(), "call");
            return chart;
        },
        'when zoom is enabled': {
            'a zoom behavior that does something should be applied on render': function (chart) {
                chart.mouseZoomable(true);
                chart.render();
                var zooms = chart.root().call.args.filter(function (a) { return a[0].name === "zoom"; });
                assert.equal(zooms.length, 1);
                assert.typeOf(zooms[0][0].on('zoom'), 'function');
            },

            'zooming should be disabled during brushing and enabled afterwards': function (chart) {
                chart.mouseZoomable(true);
                chart.render();
                chart.root().call.reset();
                chart.brush().event(chart.root());
                var zooms = chart.root().call.args.filter(function (a) { return a[0].name === "zoom"; });
                var firstZoom = zooms[0][0];
                var lastZoom = zooms[zooms.length-1][0];
                assert.equal(firstZoom.on('zoom'), undefined);
                assert.typeOf(lastZoom.on('zoom'), 'function');
            }
        },

        'when zoom is disabled': {
            topic: function () {
                d3.select("body").append("div").attr("id", "ele");
                var chart = dc.coordinateGridChart({})
                    .anchor("#ele")
                    .dimension(valueDimension)
                    .group(valueGroup)
                    .x(d3.scale.linear().domain([0,1]));
                // Define plotData to allow rendering
                chart.plotData = function () {};
                chart.mouseZoomable(false);
                sinon.spy(chart.root(), "call");
                chart.render();
                return chart;
            },

            'a do-nothing null zoom behavior should be applied on render': function (chart) {
                var callArgs = chart.root().call.args;
                var zooms = chart.root().call.args.filter(function (a) { return a[0].name === "zoom"; });
                assert.equal(zooms.length, 1);
                assert.equal(zooms[0][0].on('zoom'), undefined);
            },

            'zooming should be disabled both during brushing and afterwards': function (chart) {
                chart.root().call.reset();
                chart.brush().event(chart.root());
                var zooms = chart.root().call.args.filter(function (a) { return a[0].name === "zoom"; });
                var firstZoom = zooms[0];
                var lastZoom = zooms[zooms.length-1];
                assert.equal(firstZoom[0].on('zoom'), undefined);
                assert.equal(lastZoom[0].on('zoom'), undefined);
            }
        },
    },

    teardown: function (topic) {
        resetAllFilters();
        resetBody();
        dc.chartRegistry.clear();
    }
});

suite.export(module);
