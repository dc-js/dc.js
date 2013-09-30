//# dc.js Getting Started and How-To Guide
'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter */

// ### Create Chart Objects
// Create chart objects assocated with the container elements identified by the css selector.
// Note: It is often a good idea to have these objects accessible at the global scope so that they can be modified or filtered by other page controls.
var gainOrLossChart = dc.pieChart("#gain-loss-chart");
var fluctuationChart = dc.barChart("#fluctuation-chart");
var quarterChart = dc.pieChart("#quarter-chart");
var dayOfWeekChart = dc.rowChart("#day-of-week-chart");
var moveChart = dc.compositeChart("#monthly-move-chart");
var volumeChart = dc.barChart("#monthly-volume-chart");
var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");

// ### Anchor Div for Charts
/*
// A div anchor that can be identified by id
    <div id="your-chart"></div>
// Title or anything you want to add above the chart
    <div id="chart"><span>Days by Gain or Loss</span></div>
// #### .turnOnControls()
// If a link with css class "reset" is present then the chart
// will automatically turn it on/off based on whether there is filter
// set on this chart (slice selection for pie chart and brush
// selection for bar chart)
     <div id="chart">
       <a class="reset" href="javascript:myChart.filterAll();dc.redrawAll();" style="display: none;">reset</a>
     </div>
// dc.js will also automatically inject applied current filter value into
// any html element with css class set to "filter"
    <div id="chart">
        <span class="reset" style="display: none;">Current filter: <span class="filter"></span></span>
    </div>
*/

//### Load your data
//Data can be loaded through regular means with your
//favorite javascript library
//
//```javascript
//d3.csv("data.csv", function(data) {...};
//d3.json("data.json", function(data) {...};
//jQuery.getJson("data.json", function(data){...});
//```
d3.csv("ndx.csv", function (data) {
            /* since its a csv file we need to format the data a bit */
            var dateFormat = d3.time.format("%m/%d/%Y");
            var numberFormat = d3.format(".2f");

            data.forEach(function (e) {
                e.dd = dateFormat.parse(e.date);
                e.month = d3.time.month(e.dd); // pre-calculate month for better performance
            });

            //### Create Crossfilter Dimensions and Groups
            //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
            var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var yearlyDimension = ndx.dimension(function (d) {
                return d3.time.year(d.dd).getFullYear();
            });
            var yearlyPerformanceGroup = yearlyDimension.group().reduce(
                    /* callback for when data is added to the current filter results */
                    function (p, v) {
                        ++p.count;
                        p.absGain += +v.close - +v.open;
                        p.fluctuation += Math.abs(+v.close - +v.open);
                        p.sumIndex += (+v.open + +v.close) / 2;
                        p.avgIndex = p.sumIndex / p.count;
                        p.percentageGain = (p.absGain / p.avgIndex) * 100;
                        p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
                        return p;
                    },
                    /* callback for when data is removed from the current filter results */
                    function (p, v) {
                        --p.count;
                        p.absGain -= +v.close - +v.open;
                        p.fluctuation -= Math.abs(+v.close - +v.open);
                        p.sumIndex -= (+v.open + +v.close) / 2;
                        p.avgIndex = p.sumIndex / p.count;
                        p.percentageGain = (p.absGain / p.avgIndex) * 100;
                        p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
                        return p;
                    },
                    /* initialize p */
                    function () {
                        return {count: 0, absGain: 0, fluctuation: 0, fluctuationPercentage: 0, sumIndex: 0, avgIndex: 0, percentageGain: 0};
                    }
            );

            var dateDimension = ndx.dimension(function (d) {
                return d.dd;
            });

            /* monthly index avg fluctuation in percentage */
            var moveMonths = ndx.dimension(function (d) {
                return d.month;
            });
            var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {
                return Math.abs(+d.close - +d.open);
            });
            var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
                return d.volume / 500000;
            });
            var indexAvgByMonthGroup = moveMonths.group().reduce(
                    function (p, v) {
                        ++p.days;
                        p.total += (+v.open + +v.close) / 2;
                        p.avg = Math.round(p.total / p.days);
                        return p;
                    },
                    function (p, v) {
                        --p.days;
                        p.total -= (+v.open + +v.close) / 2;
                        p.avg = (p.days == 0) ? 0 : Math.round(p.total / p.days);
                        return p;
                    },
                    function () {
                        return {days: 0, total: 0, avg: 0};
                    }
            );

            var gainOrLoss = ndx.dimension(function (d) {
                return +d.open > +d.close ? "Loss" : "Gain";
            });
            var gainOrLossGroup = gainOrLoss.group();

            var fluctuation = ndx.dimension(function (d) {
                return Math.round((d.close - d.open) / d.open * 100);
            });
            var fluctuationGroup = fluctuation.group();

            var quarter = ndx.dimension(function (d) {
                var month = d.dd.getMonth();
                if (month <= 2)
                    return "Q1";
                else if (month > 3 && month <= 5)
                    return "Q2";
                else if (month > 5 && month <= 8)
                    return "Q3";
                else
                    return "Q4";
            });
            var quarterGroup = quarter.group().reduceSum(function (d) {
                return d.volume;
            });

            var dayOfWeek = ndx.dimension(function (d) {
                var day = d.dd.getDay();
                switch (day) {
                    case 0:
                        return "0.Sun";
                    case 1:
                        return "1.Mon";
                    case 2:
                        return "2.Tue";
                    case 3:
                        return "3.Wed";
                    case 4:
                        return "4.Thu";
                    case 5:
                        return "5.Fri";
                    case 6:
                        return "6.Sat";
                }
            });
            var dayOfWeekGroup = dayOfWeek.group();

            //### Define Chart Attributes
            //Define chart attributes using fluent methods. See the [dc API Reference](https://github.com/NickQiZhu/dc.js/blob/master/web/docs/api-1.6.0.md) for more information
            //

            //#### Bubble Chart
            yearlyBubbleChart.width(990)
                    .height(250)
                    .margins({top: 10, right: 50, bottom: 30, left: 40})
                    .dimension(yearlyDimension)
                    .group(yearlyPerformanceGroup)
                    .transitionDuration(1500)
                    .colors(["#a60000", "#ff0000", "#ff4040", "#ff7373", "#67e667", "#39e639", "#00cc00"])
                    .colorDomain([-12000, 12000])
                    .colorAccessor(function (d) {
                        return d.value.absGain;
                    })
                    .keyAccessor(function (p) {
                        return p.value.absGain;
                    })
                    .valueAccessor(function (p) {
                        return p.value.percentageGain;
                    })
                    .radiusValueAccessor(function (p) {
                        return p.value.fluctuationPercentage;
                    })
                    .maxBubbleRelativeSize(0.3)
                    .x(d3.scale.linear().domain([-2500, 2500]))
                    .y(d3.scale.linear().domain([-100, 100]))
                    .r(d3.scale.linear().domain([0, 4000]))
                    .elasticY(true)
                    .yAxisPadding(100)
                    .elasticX(true)
                    .xAxisPadding(500)
                    .renderHorizontalGridLines(true)
                    .renderVerticalGridLines(true)
                    .renderLabel(true)
                    .renderTitle(true)
                    .xAxisLabel('Index Gain')
                    .yAxisLabel('Index Gain %')
                    .label(function (p) {
                        return p.key;
                    })
                    .title(function (p) {
                        return p.key
                                + "\n"
                                + "Index Gain: " + numberFormat(p.value.absGain) + "\n"
                                + "Index Gain in Percentage: " + numberFormat(p.value.percentageGain) + "%\n"
                                + "Fluctuation / Index Ratio: " + numberFormat(p.value.fluctuationPercentage) + "%";
                    })
                    .yAxis().tickFormat(function (v) {
                        return v + "%";
                    });

            // #### Pie/Donut Chart
            // Create a pie chart and use the given css selector as anchor. You can also specify
            // an optional chart group for this chart to be scoped within. When a chart belongs
            // to a specific group then any interaction with such chart will only trigger redraw
            // on other charts within the same chart group.

            gainOrLossChart
                    .width(180) // (optional) define chart width, :default = 200
                    .height(180) // (optional) define chart height, :default = 200
                    .radius(80) // define pie radius
                    .dimension(gainOrLoss) // set dimension
                    .group(gainOrLossGroup) // set group
                    /* (optional) by default pie chart will use group.key as it's label
                     * but you can overwrite it with a closure */
                    .label(function (d) {
                        if (gainOrLossChart.hasFilter() && !gainOrLossChart.hasFilter(d.data.key))
                            return d.data.key + "(0%)";
                        return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
                    }) /*
                    // (optional) whether chart should render labels, :default = true
                    .renderLabel(true)
                    // (optional) if inner radius is used then a donut chart will be generated instead of pie chart
                    .innerRadius(40)
                    // (optional) define chart transition duration, :default = 350
                    .transitionDuration(500)
                    // (optional) define color array for slices
                    .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
                    // (optional) define color domain to match your data domain if you want to bind data or color
                    .colorDomain([-1750, 1644])
                    // (optional) define color value accessor
                    .colorAccessor(function(d, i){return d.value;})
                    */;

            quarterChart.width(180)
                    .height(180)
                    .radius(80)
                    .innerRadius(30)
                    .dimension(quarter)
                    .group(quarterGroup);

            dayOfWeekChart.width(180)
                    .height(180)
                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                    .group(dayOfWeekGroup)
                    .dimension(dayOfWeek)
                    .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
                    .label(function (d) {
                        return d.key.split(".")[1];
                    })
                    .title(function (d) {
                        return d.value;
                    })
                    .elasticX(true)
                    .xAxis().ticks(4);

            fluctuationChart.width(420)
                    .height(180)
                    .margins({top: 10, right: 50, bottom: 30, left: 40})
                    .dimension(fluctuation)
                    .group(fluctuationGroup)
                    .elasticY(true)
                    .centerBar(true)
                    .gap(1)
                    .round(dc.round.floor)
                    .x(d3.scale.linear().domain([-25, 25]))
                    .renderHorizontalGridLines(true)
                    .filterPrinter(function (filters) {
                        var filter = filters[0], s = "";
                        s += numberFormat(filter[0]) + "% -> " + numberFormat(filter[1]) + "%";
                        return s;
                    })
                    .xAxis()
                    .tickFormat(function (v) {
                        return v + "%";
                    });

            fluctuationChart.yAxis().ticks(5);

            moveChart.width(990)
                    .height(200)
                    .transitionDuration(1000)
                    .margins({top: 30, right: 50, bottom: 25, left: 40})
                    .dimension(moveMonths)
                    .mouseZoomable(true)
                    .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months)
                    .elasticY(true)
                    .renderHorizontalGridLines(true)
                    .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                    .brushOn(false)
                    .rangeChart(volumeChart)
                    .compose([
                        dc.lineChart(moveChart)
                                .group(indexAvgByMonthGroup, "Monthly Index Average")
                                .valueAccessor(function (d) {
                                    return d.value.avg;
                                })
                                .renderArea(true)
                                .stack(monthlyMoveGroup, "Monthly Index Move", function (d) {
                                    return d.value;
                                })
                                .title(function (d) {
                                    var value = d.data.value.avg ? d.data.value.avg : d.data.value;
                                    if (isNaN(value)) value = 0;
                                    return dateFormat(d.data.key) + "\n" + numberFormat(value);
                                })
                    ])
                    .xAxis();

            volumeChart.width(990)
                    .height(40)
                    .margins({top: 0, right: 50, bottom: 20, left: 40})
                    .dimension(moveMonths)
                    .group(volumeByMonthGroup)
                    .centerBar(true)
                    .gap(1)
                    .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
                    .round(d3.time.month.round)
                    .xUnits(d3.time.months);

            dc.dataCount(".dc-data-count")
                    .dimension(ndx)
                    .group(all);

            dc.dataTable(".dc-data-table")
                    .dimension(dateDimension)
                    .group(function (d) {
                        var format = d3.format("02d");
                        return d.dd.getFullYear() + "/" + format((d.dd.getMonth() + 1));
                    })
                    .size(10)
                    .columns([
                        function (d) {
                            return d.date;
                        },
                        function (d) {
                            return d.open;
                        },
                        function (d) {
                            return d.close;
                        },
                        function (d) {
                            return numberFormat(d.close - d.open);
                        },
                        function (d) {
                            return d.volume;
                        }
                    ])
                    .sortBy(function (d) {
                        return d.dd;
                    })
                    .order(d3.ascending)
                    .renderlet(function (table) {
                        table.selectAll(".dc-table-group").classed("info", true);
                    });

            dc.renderAll();
        }
);

// Determine the current version of dc with `dc.version`
d3.selectAll("#version").text(dc.version);
