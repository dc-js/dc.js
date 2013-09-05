var gainOrLossChart = dc.pieChart("#gain-loss-chart");
var fluctuationChart = dc.barChart("#fluctuation-chart");
var quarterChart = dc.pieChart("#quarter-chart");
var dayOfWeekChart = dc.rowChart("#day-of-week-chart");
var moveChart = dc.compositeChart("#monthly-move-chart");
var volumeChart = dc.barChart("#monthly-volume-chart");
var yearlyBubbleChart = dc.bubbleChart("#yearly-bubble-chart");

var g;

// set dc.js version in title
d3.selectAll("#version").text(dc.version);

// load data from a csv file
d3.csv("ndx.csv", function (data) {
            // since its a csv file we need to format the data a bit
            var dateFormat = d3.time.format("%m/%d/%Y");
            var numberFormat = d3.format(".2f");

            data.forEach(function (e) {
                e.dd = dateFormat.parse(e.date);
                e.month = d3.time.month(e.dd); // pre-calculate month for better performance
            });

            // feed it through crossfilter
            var ndx = crossfilter(data);
            var all = ndx.groupAll();

            var yearlyDimension = ndx.dimension(function (d) {
                return d3.time.year(d.dd).getFullYear();
            });
            var yearlyPerformanceGroup = yearlyDimension.group().reduce(
                    //add
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
                    //remove
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
                    //init
                    function () {
                        return {count: 0, absGain: 0, fluctuation: 0, fluctuationPercentage: 0, sumIndex: 0, avgIndex: 0, percentageGain: 0};
                    }
            );

            var dateDimension = ndx.dimension(function (d) {
                return d.dd;
            });

            // monthly index avg fluctuation in percentage
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

            gainOrLossChart.width(180)
                    .height(180)
                    .radius(80)
                    .dimension(gainOrLoss)
                    .group(gainOrLossGroup)
                    .label(function (d) {
                        if (gainOrLossChart.hasFilter() && !gainOrLossChart.hasFilter(d.data.key))
                            return d.data.key + "(0%)";
                        return d.data.key + "(" + Math.floor(d.data.value / all.value() * 100) + "%)";
                    });

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
                    .group(indexAvgByMonthGroup, "Monthly Index Average")
                    .valueAccessor(function (d) {
                        return d.value.avg;
                    })
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
                        dc.lineChart(moveChart).group(indexAvgByMonthGroup)
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

            g = monthlyMoveGroup;


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
