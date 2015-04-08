describe('dc.sunChart', function() {
    var width = 200;
    var height = 200;
    var radius = 100;
    var defaultCenter = {x: width / 2, y: height / 2};
    var newCenter = {x: 101, y: 99};
    var innerRadius = 30;
    var data, valueDimension, valueGroup;
    var countryRegionStateDimension, countryRegionStateGroup;
    var statusDimension;
    var dateDimension;
    var statusGroup, statusMultiGroup;
  
    beforeEach(function() {
        data = crossfilter(loadDateFixture());
        valueDimension = data.dimension(function(d) {
            return d.value;
        });
        valueGroup = valueDimension.group();

        countryRegionStateDimension = data.dimension(function(d) {
            return [d.country,d.region,d.state];
        });
      
        countryRegionStateGroup = countryRegionStateDimension.group();
      
        statusDimension = data.dimension(function(d) {
            return d.status;
        });
      
        dateDimension = data.dimension(function(d) {
            return d3.time.day.utc(d.dd);
        });
      
        statusGroup = statusDimension.group();
        statusMultiGroup = statusGroup.reduce(
            //add
            function(p, v) {
                ++p.count;
                p.value += +v.value;
                return p;
            },
            //remove
            function(p, v) {
                --p.count;
                p.value -= +v.value;
                return p;
            },
            //init
            function() {
                return {count:0, value:0};
            }
        );
    });

    function buildChart(id) {
        var div = appendChartID(id);
        div.append("a").attr("class", "reset").style("display", "none");
        div.append("span").attr("class", "filter").style("display", "none");
        var chart = dc.sunburstChart("#" + id);
        chart.dimension(countryRegionStateDimension).group(countryRegionStateGroup)
            .width(width)
            .height(height)
            .transitionDuration(0);
        chart.render();
        return chart;
    }

    describe('generation', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("pie-chart-age");
            chart.render();
        });
        it('we get something', function() {
            expect(chart).not.toBeNull();
        });
        it('should be registered', function() {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('dc-chart class should be turned on for parent div', function() {
            expect(d3.select("#pie-chart-age").attr("class")).toEqual("dc-chart");
        });
        it('inner radius can be set', function() {
            expect(chart.innerRadius()).toEqual(innerRadius);
        });
        it('svg should be created', function() {
            expect(chart.select("svg").empty()).toBeFalsy();
        });
        it('default color scheme should be created', function() {
            expect(chart.colors().length > 0).toBeTruthy();
        });
        it('dimension should be set', function() {
            expect(chart.dimension()).toBe(countryRegionStateDimension);
        });
        it('group should be set', function() {
            expect(chart.group()).toEqual(countryRegionStateGroup);
        });
        it('width should be set', function() {
            expect(chart.width()).toEqual(width);
        });
        it('height should be set', function() {
            expect(chart.height()).toEqual(height);
        });
        it('radius should be set', function() {
            expect(chart.radius()).toEqual(radius);
        });
        it('cx should be set', function() {
            expect(chart.cx()).toEqual(defaultCenter.x);
        });
        it('cy should be set', function() {
            expect(chart.cy()).toEqual(defaultCenter.y);
        });
        it('height should be used for svg', function() {
            expect(chart.select("svg").attr("height")).toEqual(String(height));
        });
        it('root g should be created', function() {
            expect(chart.select("svg g").empty()).toBeFalsy();
        });
        it('root g should be translated to center', function() {
            expect(chart.select("svg g").attr("transform")).toMatchTranslate(defaultCenter.x, defaultCenter.y);
        });
        it('slice g should be created with class', function() {
            expect(chart.selectAll("svg g g.pie-slice").data().length).toEqual(5);
        });
        it('slice path should be created', function() {
            expect(chart.selectAll("svg g g.pie-slice path").data().length).toEqual(5);
        });
        it('slice css class should be numbered with index', function() {
            chart.selectAll("g.pie-slice").each(function(p, i) {
                expect(d3.select(this).attr("class")).toEqual("pie-slice _" + i);
            });
        });
        it('slice path should be filled', function() {
            chart.selectAll("svg g g.pie-slice path").each(function(p) {
                expect(d3.select(this).attr("fill") !== "").toBeTruthy();
            });
        });
        it('slice path d should be created', function() {
            chart.selectAll("svg g g.pie-slice path").each(function(p) {
                expect(d3.select(this).attr("d") !== "").toBeTruthy();
            });
        });
        it('slice path fill should be set correctly', function() {
            expect(d3.select(chart.selectAll("g.pie-slice path")[0][0]).attr("fill")).toEqual("#3182bd");
            expect(d3.select(chart.selectAll("g.pie-slice path")[0][1]).attr("fill")).toEqual("#6baed6");
            expect(d3.select(chart.selectAll("g.pie-slice path")[0][2]).attr("fill")).toEqual("#9ecae1");
            expect(d3.select(chart.selectAll("g.pie-slice path")[0][3]).attr("fill")).toEqual("#c6dbef");
        });
        it('slice label should be created', function() {
            expect(chart.selectAll("svg text.pie-slice").data().length).toEqual(5);
        });
        it('slice label transform to centroid', function() {
            expect(chart.selectAll("svg g text.pie-slice").attr("transform"))
                .toMatchTranslate(38.20604139901076, -52.58610463437158, 3);
        });
        it('slice label text should be set', function() {
            chart.selectAll("svg g text.pie-slice").call(function(p) {
                expect(p.text()).toEqual(p.datum().data.key);
            });
        });
        it('slice label should be middle anchored', function() {
            chart.selectAll("svg g text.pie-slice").each(function(p) {
                expect(d3.select(this).attr("text-anchor")).toEqual("middle");
            });
        });
        it('reset link hidden after init rendering', function() {
            expect(chart.select("a.reset").style("display")).toEqual("none");
        });
        it('filter printer should be set', function() {
            expect(chart.filterPrinter()).not.toBeNull();
        });
        it('filter info should be hidden after init rendering', function() {
            expect(chart.select("span.filter").style("display")).toEqual("none");
        });
        describe('center positioning', function() {
            beforeEach(function() {
                chart
                    .cx(newCenter.x)
                    .cy(newCenter.y)
                    .render();
                return chart;
            });
            afterEach(function() {
                chart
                    .cx(defaultCenter.x)
                    .cy(defaultCenter.y)
                    .render();
                return chart;
            });
            it('root g should be translated to ' + newCenter.x + ',' + newCenter.y, function() {
                expect(chart.select("svg g").attr("transform")).toMatchTranslate(newCenter.x, newCenter.y);
            });
        });

        describe('re-render', function() {
            beforeEach(function() {
                chart.render();
                return chart;
            });
            it('multiple invocation of render should update chart', function() {
                expect(d3.selectAll("#pie-chart-age svg")[0].length).toEqual(1);
            });
        });
        describe('filter', function() {
            beforeEach(function() {
                regionDimension.filter("East");
                chart.render();
            });
            it('label should be hidden if filtered out', function() {
                expect(chart.selectAll("svg g text.pie-slice")[0][0].textContent).toEqual("22");
                expect(chart.selectAll("svg g text.pie-slice")[0][1].textContent).toEqual("");
            });
            afterEach(function() {
                regionDimension.filterAll();
            });
        });
        describe('n/a filter', function() {
            beforeEach(function() {
                statusDimension.filter("E");
                chart.render();
                return chart;
            });
            it('should draw an empty chart', function() {
                expect(chart.select('g').classed('empty-chart')).toBeTruthy();
            });
            it('should have one slice', function() {
                expect(chart.selectAll("svg g text.pie-slice").length).toBe(1);
            });
            afterEach(function() {
                statusDimension.filterAll();
            });
        });
        describe('slice selection', function() {
            it('on click function should be defined', function() {
                expect(chart.selectAll("svg g g.pie-slice path").on("click") !== undefined).toBeTruthy();
            });
            it('by default no slice should be selected', function() {
                expect(chart.hasFilter()).toBeFalsy();
            });
            it('be able to set selected slice', function() {
                expect(chart.filter("66").filter()).toEqual("66");
                expect(chart.hasFilter()).toBeTruthy();
                chart.filterAll();
            });
            it('should filter dimension by single selection', function() {
                chart.filter("22");
                expect(countryGroup.all()[0].value).toEqual(1);
                expect(countryGroup.all()[1].value).toEqual(1);
                chart.filterAll();
            });
            it('should filter dimension by multiple selections', function() {
                chart.filter("66");
                chart.filter("22");
                expect(countryGroup.all()[0].value).toEqual(1);
                expect(countryGroup.all()[1].value).toEqual(2);
                chart.filterAll();
            });
            it('should filter dimension with deselection', function() {
                chart.filter("22");
                chart.filter("66");
                chart.filter("22");
                expect(countryGroup.all()[0].value).toEqual(0);
                expect(countryGroup.all()[1].value).toEqual(1);
                chart.filterAll();
            });
            it('should highlight selected slices', function() {
                chart.filter("66");
                chart.filter("22");
                chart.render();
                chart.selectAll("g.pie-slice").each(function(d) {
                    if (d.data.key === "66" || d.data.key === "22")
                        expect(d3.select(this).attr("class").indexOf("selected") > 0).toBeTruthy();
                    else
                        expect(d3.select(this).attr("class").indexOf("deselected") > 0).toBeTruthy();
                });
                chart.filterAll();
            });
            it('reset link generated after slice selection', function() {
                chart.filter("66");
                expect(chart.select("a.reset").style("display")).not.toEqual('none');
            });
            it('filter info generated after slice selection', function() {
                chart.filter(null);
                chart.filter("66");
                expect(chart.select("span.filter").style("display")).not.toEqual('none');
                expect(chart.select("span.filter").text()).toEqual("66");
            });
            it('should remove highlight if no slice selected', function() {
                chart.filterAll();
                chart.redraw();
                chart.selectAll(".pie-slice path").each(function(d) {
                    var cls = d3.select(this).attr("class");
                    expect(cls === null || cls === "").toBeTruthy();
                });
            });
        });
        describe('filter through clicking', function() {
            it('onClick should trigger filtering of according group', function() {
                chart.onClick(chart.group().all()[0]);
                expect(chart.filter()).toEqual("22");
            });
            it('onClick should reset filter if clicked twice', function() {
                chart.onClick(chart.group().all()[0]);
                chart.onClick(chart.group().all()[0]);
                expect(chart.filter()).toEqual(null);
            });
            it('multiple onClick should trigger filtering of according groups', function() {
                chart.onClick(chart.group().all()[0]);
                chart.onClick(chart.group().all()[1]);
                expect(chart.hasFilter("22")).toBeTruthy();
                expect(chart.hasFilter("33")).toBeTruthy();
            });
        });
        describe('group order', function() {
            beforeEach(function() {
                chart.cap(4).ordering(dc.pluck('value'));
            });
            it('group should be orderd', function() {
                expect([ '33','55','22','44','Others']).toEqual(chart.data().map(dc.pluck('key')));
                chart.ordering(dc.pluck('key'));
                expect([ '22','33','44','55','Others']).toEqual(chart.data().map(dc.pluck('key')));
            });
            afterEach(function() {
                chart.cap(Infinity).ordering(dc.pluck('key'));
            });
        });
    });

    describe('redraw after empty selection', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("pie-chart2");
            dateDimension.filter([makeDate(2010, 0, 1), makeDate(2010, 0, 3)]);
            chart.redraw();
            dateDimension.filter([makeDate(2012, 0, 1), makeDate(2012, 11, 30)]);
            chart.redraw();
        });
        it('pie chart should be restored', function() {
            chart.selectAll("g.pie-slice path").each(function(p) {
                expect(d3.select(this).attr("d").indexOf("NaN") < 0).toBeTruthy();
            });
        });
        afterEach(function() {
            dateDimension.filterAll();
        });
    });

    describe('custom label & title generation', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("pie-chart3");
            chart.label(function(d) {
                return "custom";
            })
                .title(function(d) {
                    return "custom";
                })
                .minAngleForLabel(1)
                .renderTitle(true);
            chart.render();
        });
        it('should render correct number of text', function() {
            expect(chart.selectAll("text.pie-slice")[0].length).toEqual(5);
        });
        it('custom function should be used to dynamically generate label', function() {
            expect(d3.select(chart.selectAll("text.pie-slice")[0][0]).text()).toEqual("custom");
        });
        it('label should not be generated if the slice is too small', function() {
            // slice '66'
            expect(d3.select(chart.selectAll("text.pie-slice")[0][4]).text()).toEqual("");
        });
        it('should render correct number of title', function() {
            expect(chart.selectAll("g.pie-slice title")[0].length).toEqual(5);
        });
        it('custom function should be used to dynamically generate title', function() {
            chart.selectAll("g.pie-slice title").each(function(p) {
                expect(d3.select(this).text()).toEqual("custom");
            });
        });
    });

    describe('pie chart wo/ label', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("pie-chart4");
            chart.innerRadius(innerRadius);
            chart.renderLabel(false);
            chart.render();
        });
        it('slice label should not be created', function() {
            expect(chart.selectAll("svg g text.pie-slice").data().length).toEqual(0);
        });
    });

    describe('renderlet', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("chart-renderlet");
            chart.renderlet(function() {
                chart.selectAll("path").attr("fill", "red");
            });
        });
        it('custom renderlet should be invoked with render', function() {
            chart.render();
            expect(chart.selectAll("path").attr("fill")).toEqual("red");
        });
        it('custom renderlet should be invoked with redraw', function() {
            chart.redraw();
            expect(chart.selectAll("path").attr("fill")).toEqual("red");
        });
    });

    describe('pie chart label and title w/ value accessor', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("pie-chart-default-label-title");
            chart.dimension(statusGroup)
                .group(statusMultiGroup)
                .valueAccessor(function(d) {
                    return d.value.count;
                })
                .renderLabel(true).renderTitle(true);
            chart.render();
            return chart;
        });
        it('default function should be used to dynamically generate label', function() {
            expect(d3.select(chart.selectAll("text.pie-slice")[0][0]).text()).toEqual("F");
        });
        it('default function should be used to dynamically generate title', function() {
            expect(d3.select(chart.selectAll("g.pie-slice title")[0][0]).text()).toEqual("F: 5");
        });
        describe('with n/a filter', function() {
            beforeEach(function() {
                countryRegionStateDimension.filter(['no country','no region','no state']);
                chart.render();
                return chart;
            });
            it('should draw an empty chart', function() {
                expect(chart.select('g').classed('empty-chart')).toBeTruthy();
            });
            it('should have one slice', function() {
                expect(chart.selectAll("svg g text.pie-slice").length).toBe(1);
            });
            it('should have slice labeled empty', function() {
                expect(d3.select(chart.selectAll("text.pie-slice")[0][0]).text()).toEqual("empty");
            });
            describe('with emptyTitle', function() {
                beforeEach(function() {
                    chart.emptyTitle('nothing').render();
                });
                it('should respect the emptyTitle', function() {
                    expect(d3.select(chart.selectAll("text.pie-slice")[0][0]).text()).toEqual("nothing");
                });
                afterEach(function() {
                    chart.emptyTitle('empty');
                });
            });
            afterEach(function() {
                regionDimension.filterAll();
            });
        });
    });

    describe('custom filter handler', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("pie-chart-filter-handler");
            chart.filterHandler(function(dimension, filters) {
                dimension.filter("66");
                return ["66"];
            });
            return chart;
        });
        it('default function should be used to dynamically generate label', function() {
            chart.filter(6);
            expect(chart.filter()).toEqual('66');
        });
        afterEach(function() {
            valueDimension.filterAll();
        });
    });

    describe('external labeling', function() {
        var chart;
        beforeEach(function() {
            chart = buildChart("pie-chart-external-labeling")
                .externalLabels(10)
                .render();
        });
        it('should place labels outside of pie offset by given radius', function() {
            var label = d3.select("#pie-chart-external-labeling svg g text.pie-slice");

            var centroid = d3.svg.arc()
                .outerRadius(chart.radius() + 10)
                .innerRadius(chart.radius() + 10)
                .centroid(label.datum());

            expect(label.attr("transform")).toMatchTranslate(centroid[0], centroid[1], 3);
        });
        it('gives labels class "external"', function() {
            d3.selectAll("#pie-chart-external-labeling svg g text.pie-slice").each(function() {
                expect(d3.select(this).classed("external")).toBeTruthy();
            });
        });
        it('returns radius when given no arguments', function() {
            expect(chart.externalLabels()).toEqual(10);
        });
        it('resets to default when given falsey argument', function() {
            chart.externalLabels(false).render();

            d3.selectAll("#pie-chart-external-labeling svg g text.pie-slice").each(function() {
                var label = d3.select(this);

                var centroid = d3.svg.arc()
                    .outerRadius(chart.radius())
                    .innerRadius(chart.innerRadius())
                    .centroid(label.datum());

                expect(label.attr("transform")).toMatchTranslate(centroid[0], centroid[1], 3);
                expect(label.classed("external")).toBeFalsy();
            });
        });
    });

});


