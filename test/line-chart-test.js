require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Line chart');

var width = 900;
var height = 350;

function buildChart(id) {
	d3.select("body").append("div").attr("id", id);
	var data = [
		{date: "2011-11-14T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
		{date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
		{date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
		{date: "2011-11-14T16:30:43Z", quantity: 2, total: 90, tip: 0, type: "tab"},
		{date: "2011-11-14T16:48:46Z", quantity: 2, total: 90, tip: 0, type: "tab"},
		{date: "2011-11-14T16:53:41Z", quantity: 2, total: 90, tip: 0, type: "tab"},
		{date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0, type: "cash"},
		{date: "2011-11-14T16:58:03Z", quantity: 2, total: 90, tip: 0, type: "tab"},
		{date: "2011-11-14T17:07:21Z", quantity: 2, total: 90, tip: 0, type: "tab"},
		{date: "2011-11-14T17:22:59Z", quantity: 2, total: 90, tip: 0, type: "tab"},
		{date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0, type: "cash"},
		{date: "2011-11-14T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"}
	];
	var cf = crossfilter(data);

	var timeDimension = cf.dimension(function(d){ return new Date(d.date); });
	var totalGroup = timeDimension.group().reduceSum(function(d){ return d.total; });

	var chart = dc.lineChart("#"+id)
		.brushOn(false)
		.width(width)
		.height(height)
		.x(d3.time.scale().domain(d3.extent(data, function(d){ return new Date(d.date); })))
		.dimension(timeDimension)
		.group(totalGroup)
		.render();
		
	return chart;
}

suite.addBatch({
	'line chart': {
		topic: function () {
			var chart = buildChart("chart");
			chart.ordinalColors(['#FF0000'])
                        .colorAccessor(function(){ return 0; }).redraw();
			return chart;
		},
		'dots colour should update on redraw': function (chart) {
				assert.equal(chart.select("circle.dot")[0][0].attributes.fill.nodeValue, '#FF0000');
		},
		teardown: function (topic) {
			resetAllFilters();
			resetBody();
		}
	}
});

suite.export(module);

