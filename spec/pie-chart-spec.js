/* global appendChartID, loadDateFixture, makeDate */
describe('dc.pieChart', () => {
    const width = 200;
    const height = 200;
    const radius = 100;
    const defaultCenter = {x: width / 2, y: height / 2};
    const newCenter = {x: 101, y: 99};
    const innerRadius = 30;
    let data, valueDimension, valueGroup;
    let regionDimension, statusDimension;
    let countryDimension, countryGroup, dateDimension;
    let statusGroup, statusMultiGroup;
    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        valueDimension = data.dimension(d => d.value);
        valueGroup = valueDimension.group();
        regionDimension = data.dimension(d => d.region);
        statusDimension = data.dimension(d => d.status);
        countryDimension = data.dimension(d => d.countrycode);
        countryGroup = countryDimension.group();
        dateDimension = data.dimension(d => d3.utcDay(d.dd));
        statusGroup = statusDimension.group();
        statusMultiGroup = statusGroup.reduce(
            //add
            (p, v) => {
                ++p.count;
                p.total += +v.value;
                return p;
            },
            //remove
            (p, v) => {
                --p.count;
                p.total -= +v.value;
                return p;
            },
            //init
            () => ({count: 0, total: 0, getTotal: function () { return this.total; }})
        );
    });

    function buildChart (id) {
        const div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        const chart = new dc.PieChart(`#${id}`);
        chart.dimension(valueDimension).group(valueGroup)
            .width(width)
            .height(height)
            .radius(radius)
            .transitionDuration(0);
        chart.render();
        return chart;
    }

    function buildCountryChart (id) {
        const div = appendChartID(id);
        div.append('a').attr('class', 'reset').style('display', 'none');
        div.append('span').attr('class', 'filter').style('display', 'none');
        const chart = new dc.PieChart(`#${id}`);
        chart.dimension(countryDimension).group(countryGroup)
            .width(width)
            .height(height)
            .radius(radius)
            .transitionDuration(0);
        chart.render();
        return chart;
    }

    describe('generation', () => {
        let chart,
            countryChart;

        beforeEach(() => {
            chart = buildChart('pie-chart-age');
            chart.innerRadius(innerRadius);
            chart.render();
        });
        it('we get something', () => {
            expect(chart).not.toBeNull();
        });
        it('should be registered', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });
        it('dc-chart class should be turned on for parent div', () => {
            expect(d3.select('#pie-chart-age').attr('class')).toEqual('dc-chart');
        });
        it('inner radius can be set', () => {
            expect(chart.innerRadius()).toEqual(innerRadius);
        });
        it('svg should be created', () => {
            expect(chart.select('svg').empty()).toBeFalsy();
        });
        it('default color scheme should be created', () => {
            expect(chart.colors().length > 0).toBeTruthy();
        });
        it('dimension should be set', () => {
            expect(chart.dimension()).toBe(valueDimension);
        });
        it('group should be set', () => {
            expect(chart.group()).toEqual(valueGroup);
        });
        it('width should be set', () => {
            expect(chart.width()).toEqual(width);
        });
        it('height should be set', () => {
            expect(chart.height()).toEqual(height);
        });
        it('radius should be set', () => {
            expect(chart.radius()).toEqual(radius);
        });
        it('cx should be set', () => {
            expect(chart.cx()).toEqual(defaultCenter.x);
        });
        it('cy should be set', () => {
            expect(chart.cy()).toEqual(defaultCenter.y);
        });
        it('height should be used for svg', () => {
            expect(chart.select('svg').attr('height')).toEqual(String(height));
        });
        it('root g should be created', () => {
            expect(chart.select('svg g').empty()).toBeFalsy();
        });
        it('root g should be translated to center', () => {
            expect(chart.select('svg g').attr('transform')).toMatchTranslate(defaultCenter.x, defaultCenter.y);
        });
        it('slice g should be created with class', () => {
            expect(chart.selectAll('svg g g.pie-slice').data().length).toEqual(5);
        });
        it('slice path should be created', () => {
            expect(chart.selectAll('svg g g.pie-slice path').data().length).toEqual(5);
        });
        it('slice css class should be numbered with index', () => {
            chart.selectAll('g.pie-slice').each(function (p, i) {
                expect(d3.select(this).attr('class')).toEqual(`pie-slice _${i}`);
            });
        });
        it('slice path should be filled', () => {
            chart.selectAll('svg g g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('fill') !== '').toBeTruthy();
            });
        });
        it('slice path d should be created', () => {
            chart.selectAll('svg g g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('d') !== '').toBeTruthy();
            });
        });
        it('slice path fill should be set correctly', () => {
            const numSlices = 5;
            for (let i = 0; i < numSlices; i++) {
                expect(d3.select(chart.selectAll('g.pie-slice path').nodes()[i]).attr('fill'))
                    .toMatchColor(dc.config.defaultColors()[i]);
            }
        });
        it('slice label should be created', () => {
            expect(chart.selectAll('svg text.pie-slice').data().length).toEqual(5);
        });
        it('slice label transform to centroid', () => {
            expect(chart.selectAll('svg g text.pie-slice').attr('transform'))
                .toMatchTranslate(52.58610463437159, -38.20604139901075, 3);
        });
        it('slice label text should be set', () => {
            chart.selectAll('svg g text.pie-slice').call(p => {
                expect(p.text()).toEqual(p.datum().data.key);
            });
        });
        it('slice label should be middle anchored', () => {
            chart.selectAll('svg g text.pie-slice').each(function (p) {
                expect(d3.select(this).attr('text-anchor')).toEqual('middle');
            });
        });
        it('reset link hidden after init rendering', () => {
            expect(chart.select('a.reset').style('display')).toEqual('none');
        });
        it('filter printer should be set', () => {
            expect(chart.filterPrinter()).not.toBeNull();
        });
        it('filter info should be hidden after init rendering', () => {
            expect(chart.select('span.filter').style('display')).toEqual('none');
        });
        describe('center positioning', () => {
            beforeEach(() => {
                chart
                    .cx(newCenter.x)
                    .cy(newCenter.y)
                    .render();
                return chart;
            });
            afterEach(() => {
                chart
                    .cx(defaultCenter.x)
                    .cy(defaultCenter.y)
                    .render();
                return chart;
            });
            it(`root g should be translated to ${newCenter.x},${newCenter.y}`, () => {
                expect(chart.select('svg g').attr('transform')).toMatchTranslate(newCenter.x, newCenter.y);
            });
        });
        describe('with radius padding', () => {
            beforeEach(() => {
                chart.externalRadiusPadding(17)
                    .render();
                return chart;
            });
            it('should not change center', () => {
                expect(chart.select('svg g').attr('transform')).toMatchTranslate(defaultCenter.x, defaultCenter.y);
            });
            it('should decrease outer radius', () => {
                expect(chart.select('svg g.pie-slice path').attr('d')).toMatch(/83[, ]83/); // i.e. 100-17
            });
        });

        describe('re-render', () => {
            beforeEach(() => {
                chart.render();
                return chart;
            });
            it('multiple invocation of render should update chart', () => {
                expect(d3.selectAll('#pie-chart-age svg').nodes().length).toEqual(1);
            });
        });
        describe('filter', () => {
            beforeEach(() => {
                regionDimension.filter('East');
                chart.render();
            });
            it('label should be hidden if filtered out', () => {
                expect(chart.selectAll('svg g text.pie-slice').nodes()[0].textContent).toEqual('22');
                expect(chart.selectAll('svg g text.pie-slice').nodes()[1].textContent).toEqual('');
            });
            afterEach(() => {
                regionDimension.filterAll();
            });
        });
        describe('n/a filter', () => {
            beforeEach(() => {
                statusDimension.filter('E');
                chart.render();
                return chart;
            });
            it('should draw an empty chart', () => {
                expect(chart.select('g').classed('empty-chart')).toBeTruthy();
            });
            it('should have one slice', () => {
                expect(chart.selectAll('svg g text.pie-slice').nodes().length).toBe(1);
            });
            afterEach(() => {
                statusDimension.filterAll();
            });
        });
        describe('slice selection', () => {
            it('on click function should be defined', () => {
                expect(chart.selectAll('svg g g.pie-slice path').on('click') !== undefined).toBeTruthy();
            });
            it('by default no slice should be selected', () => {
                expect(chart.hasFilter()).toBeFalsy();
            });
            it('be able to set selected slice', () => {
                expect(chart.filter('66').filter()).toEqual('66');
                expect(chart.hasFilter()).toBeTruthy();
                chart.filterAll();
            });
            it('should filter dimension by single selection', () => {
                chart.filter('22');
                expect(countryGroup.all()[0].value).toEqual(1);
                expect(countryGroup.all()[1].value).toEqual(1);
                chart.filterAll();
            });
            it('should filter dimension by multiple selections', () => {
                chart.filter('66');
                chart.filter('22');
                expect(countryGroup.all()[0].value).toEqual(1);
                expect(countryGroup.all()[1].value).toEqual(2);
                chart.filterAll();
            });
            it('should filter dimension with deselection', () => {
                chart.filter('22');
                chart.filter('66');
                chart.filter('22');
                expect(countryGroup.all()[0].value).toEqual(0);
                expect(countryGroup.all()[1].value).toEqual(1);
                chart.filterAll();
            });
            it('should highlight selected slices', () => {
                chart.filter('66');
                chart.filter('22');
                chart.render();
                chart.selectAll('g.pie-slice').each(function (d) {
                    if (d.data.key === '66' || d.data.key === '22') {
                        expect(d3.select(this).attr('class').indexOf('selected') > 0).toBeTruthy();
                    } else {
                        expect(d3.select(this).attr('class').indexOf('deselected') > 0).toBeTruthy();
                    }
                });
                chart.filterAll();
            });
            it('reset link shown after slice selection', () => {
                chart.filter('66');
                expect(chart.select('a.reset').style('display')).not.toEqual('none');
            });
            it('filter info shown after slice selection', () => {
                chart.filter(null);
                chart.filter('66');
                expect(chart.select('span.filter').style('display')).not.toEqual('none');
                expect(chart.select('span.filter').text()).toEqual('66');
            });
            it('should remove highlight if no slice selected', () => {
                chart.filterAll();
                chart.redraw();
                chart.selectAll('.pie-slice path').each(function (d) {
                    const cls = d3.select(this).attr('class');
                    expect(cls === null || cls === '').toBeTruthy();
                });
            });
        });

        describe('filter through clicking', () => {
            it('onClick should trigger filtering of according group', () => {
                chart.onClick(chart.group().all()[0]);
                expect(chart.filter()).toEqual('22');
            });
            it('onClick should reset filter if clicked twice', () => {
                chart.onClick(chart.group().all()[0]);
                chart.onClick(chart.group().all()[0]);
                expect(chart.filter()).toEqual(null);
            });
            it('multiple onClick should trigger filtering of according groups', () => {
                chart.onClick(chart.group().all()[0]);
                chart.onClick(chart.group().all()[1]);
                expect(chart.hasFilter('22')).toBeTruthy();
                expect(chart.hasFilter('33')).toBeTruthy();
            });
        });
        describe('group order with capping', () => {
            beforeEach(() => {
                chart.cap(4);
            });
            // group.all starts with 22 -> 2, 33 -> 2, 44 -> 3, 55 -> 2, 66 -> 1
            describe('with usual top->bottom sorting and cap', () => {
                beforeEach(() => {
                    chart.cap(4).ordering(kv => -kv.value).redraw();
                });
                it('should show top 4 groups and others', () => {
                    // crossfilter's quicksort is stable for < 32 elements, so the value:2's are still in alphabetical order
                    expect(['44', '22', '33', '55', 'Others']).toEqual(chart.data().map(dc.pluck('key')));
                });
            });
            describe('with key ordering', () => {
                beforeEach(() => {
                    chart
                        .ordering(dc.pluck('key'))
                        .redraw();
                });
                it('should show lowest 4 groups by key and others', () => {
                    expect(['22', '33', '44', '55', 'Others']).toEqual(chart.data().map(dc.pluck('key')));
                });
            });
        });
        describe('comparing crossfilter and chart ordering', () => {
            let crossfilterOrder,
                crossfilterTop2;
            beforeEach(() => {
                countryChart = buildCountryChart('country-chart');
                countryChart.innerRadius(innerRadius);

                // group.all returns array sorted in ascending key order.
                // [{"key":"CA","value":2},{"key":"US","value":8}]
                crossfilterOrder = countryGroup.all();

                // group.top returns array sorted in descending value order
                // [{"key":"US","value":8}]
                crossfilterTop2 = countryGroup.top(2);
            });
            describe('with ordering and capping not set', () => {
                it('should match the crossfilter top 2', () => {
                    expect(countryChart.data()).toEqual(crossfilterTop2);
                });
            });
            describe('with ordering by key', () => {
                beforeEach(() => {
                    countryChart.ordering(kv => kv.key).redraw();
                });
                it('should should match crossfilter top(2)', () => {
                    expect(countryChart.data()).toEqual(crossfilterOrder);
                });
                describe('with cap(1)', () => {
                    beforeEach(() => {
                        countryChart.cap(1).redraw();
                    });
                    it('should show the top value, and others', () => {
                        expect(countryChart.data().map(dc.pluck('key'))).toEqual(['CA', 'Others']);
                    });
                });

            });
            describe('with default ordering and cap(1)', () => {
                beforeEach(() => {
                    countryChart.cap(1).redraw();
                });
                it('should show the largest value\'s key, and others', () => {
                    expect(['US', 'Others']).toEqual(countryChart.data().map(dc.pluck('key')));
                });
                describe('and takeFront(false)', () => {
                    beforeEach(() => {
                        countryChart.takeFront(false).redraw();
                    });
                    it('should show the smallest value\'s key, and others', () => {
                        expect(['CA','Others']).toEqual(countryChart.data().map(dc.pluck('key')));
                    });
                });
            });
        });
    });

    describe('redraw after empty selection', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart2');
            dateDimension.filter([makeDate(2010, 0, 1), makeDate(2010, 0, 3)]);
            chart.redraw();
            dateDimension.filter([makeDate(2012, 0, 1), makeDate(2012, 11, 30)]);
            chart.redraw();
        });
        it('pie chart should be restored', () => {
            chart.selectAll('g.pie-slice path').each(function (p) {
                expect(d3.select(this).attr('d').indexOf('NaN') < 0).toBeTruthy();
            });
        });
        afterEach(() => {
            dateDimension.filterAll();
        });
    });

    describe('small slices', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart3');
            chart.minAngleForLabel(1)
                .renderTitle(true);
            chart.render();
        });
        it('label should not be generated if the slice is too small', () => {
            // slice '66'
            expect(d3.select(chart.selectAll('text.pie-slice').nodes()[4]).text()).toEqual('');
        });
        describe('selected', () => {
            beforeEach(() => {
                chart.filter('66').redraw();
            });
            it('a small slice should be labelled if it is selected', () => {
                expect(d3.select(chart.selectAll('text.pie-slice').nodes()[4]).text()).toEqual('66');
            });
            afterEach(() => {
                chart.filter(null);
            });
        });
    });

    describe('custom label & title generation', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart3');
            chart.label(d => 'custom')
                .title(d => 'custom')
                .minAngleForLabel(1)
                .renderTitle(true);
            chart.render();
        });
        it('should render correct number of text', () => {
            expect(chart.selectAll('text.pie-slice').nodes().length).toEqual(5);
        });
        it('custom function should be used to dynamically generate label', () => {
            expect(d3.select(chart.selectAll('text.pie-slice').nodes()[0]).text()).toEqual('custom');
        });
        it('label should not be generated if the slice is too small', () => {
            // slice '66'
            expect(d3.select(chart.selectAll('text.pie-slice').nodes()[4]).text()).toEqual('');
        });
        it('should render correct number of title', () => {
            expect(chart.selectAll('g.pie-slice title').nodes().length).toEqual(5);
        });
        it('custom function should be used to dynamically generate title', () => {
            chart.selectAll('g.pie-slice title').each(function (p) {
                expect(d3.select(this).text()).toEqual('custom');
            });
        });
    });

    describe('pie chart slices cap and group switching', () => {
        // again, group.all starts with 22 -> 2, 33 -> 2, 44 -> 3, 55 -> 2, 66 -> 1
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart4');
            chart.slicesCap(2)
                .renderTitle(true)
                .othersLabel('small');
            chart.render();
        });
        describe('with normal valueAccessor and descending value ordering', () => {
            beforeEach(() => {
                chart.dimension(valueDimension).group(valueGroup)
                    .valueAccessor(dc.pluck('value'))
                    .ordering(kv => -kv.value)
                    .render();
            });
            it('produce expected number of slices', () => {
                expect(chart.selectAll('text.pie-slice').nodes().length).toEqual(3);
            });
            it('others slice should use custom name', () => {
                expect(d3.select(chart.selectAll('text.pie-slice').nodes()[2]).text()).toEqual('small');
            });
            it('remaining slices should be in descending value order', () => {
                expect(chart.selectAll('text.pie-slice').data().map(dc.pluck('value')))
                    .toEqual([3,2,5]);
            });
            describe('clicking others slice', () => {
                let event;
                beforeEach(() => {
                    event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    chart.selectAll('.pie-slice path').nodes()[2].dispatchEvent(event);
                });
                it('should filter three smallest', () => {
                    expect(chart.filters()).toEqual(['33', '55', '66','small']);
                });
                describe('clicking again', () => {
                    beforeEach(() => {
                        chart.selectAll('.pie-slice path').nodes()[2].dispatchEvent(event);
                    });
                    it('should reset filter', () => {
                        expect(chart.filters()).toEqual([]);
                    });
                });
            });
        });
        describe('with custom valueAccessor', () => {
            // statusMultiGroup has
            // [{"key":"F","value":{"count":5,"total":220}},{"key":"T","value":{"count":5,"total":198}}]
            beforeEach(() => {
                chart.dimension(statusDimension).group(statusMultiGroup)
                    .valueAccessor(d => d.value.total)
                    .ordering(d => -d.value.total)
                    .render();
                return chart;
            });
            it('correct values, no others slice', () => {
                expect(chart.selectAll('g.pie-slice').data().map(dc.pluck('value')))
                    .toEqual([220, 198]);
            });
            describe('with cap(1)', () => {
                beforeEach(() => {
                    chart.cap(1).render();
                });
                it('correct values, others slice', () => {
                    expect(chart.selectAll('title').nodes().map(t => d3.select(t).text()))
                        .toEqual(['F: 220', 'small: 198']);
                });
            });
        });
        describe('with custom valueAccessor calling function', () => {
            // statusMultiGroup has
            // [{"key":"F","value":{"count":5,"total":220}},{"key":"T","value":{"count":5,"total":198}}]
            beforeEach(() => {
                chart.dimension(statusDimension).group(statusMultiGroup)
                    .valueAccessor(d => d.value.getTotal())
                    .ordering(d => -d.value.getTotal())
                    .render();
                return chart;
            });
            it('correct values, no others slice', () => {
                expect(chart.selectAll('g.pie-slice').data().map(dc.pluck('value')))
                    .toEqual([220, 198]);
            });
            describe('with cap(1)', () => {
                beforeEach(() => {
                    chart.cap(1).render();
                });
                it('correct values, others slice', () => {
                    expect(chart.selectAll('title').nodes().map(t => d3.select(t).text()))
                        .toEqual(['F: 220', 'small: 198']);
                });
            });
        });
        afterEach(() => {
            valueDimension.filterAll();
        });
    });

    describe('pie chart w/o label', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart4');
            chart.innerRadius(innerRadius);
            chart.renderLabel(false);
            chart.render();
        });
        it('slice label should not be created', () => {
            expect(chart.selectAll('svg g text.pie-slice').data().length).toEqual(0);
        });
    });

    describe('renderlet', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('chart-renderlet');
            chart.on('renderlet', () => {
                chart.selectAll('path').attr('fill', 'red');
            });
        });
        it('custom renderlet should be invoked with render', () => {
            chart.render();
            expect(chart.selectAll('path').attr('fill')).toEqual('red');
        });
        it('custom renderlet should be invoked with redraw', () => {
            chart.redraw();
            expect(chart.selectAll('path').attr('fill')).toEqual('red');
        });
    });

    describe('pie chart label and title w/ value accessor', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart-default-label-title');
            chart.dimension(statusGroup)
                .group(statusMultiGroup)
                .valueAccessor(d => d.value.count)
                .renderLabel(true).renderTitle(true);
            chart.render();
            return chart;
        });
        it('default function should be used to dynamically generate label', () => {
            expect(d3.select(chart.selectAll('text.pie-slice').nodes()[0]).text()).toEqual('F');
        });
        it('default function should be used to dynamically generate title', () => {
            expect(d3.select(chart.selectAll('g.pie-slice title').nodes()[0]).text()).toEqual('F: 5');
        });
        describe('with n/a filter', () => {
            beforeEach(() => {
                regionDimension.filter('nowhere');
                chart.render();
                return chart;
            });
            it('should draw an empty chart', () => {
                expect(chart.select('g').classed('empty-chart')).toBeTruthy();
            });
            it('should have one slice', () => {
                expect(chart.selectAll('svg g text.pie-slice').nodes().length).toBe(1);
            });
            it('should have slice labeled empty', () => {
                expect(d3.select(chart.selectAll('text.pie-slice').nodes()[0]).text()).toEqual('empty');
            });
            describe('with emptyTitle', () => {
                beforeEach(() => {
                    chart.emptyTitle('nothing').render();
                });
                it('should respect the emptyTitle', () => {
                    expect(d3.select(chart.selectAll('text.pie-slice').nodes()[0]).text()).toEqual('nothing');
                });
                afterEach(() => {
                    chart.emptyTitle('empty');
                });
            });
            afterEach(() => {
                regionDimension.filterAll();
            });
        });
    });

    describe('custom filter handler', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart-filter-handler');
            chart.filterHandler((dimension, filters) => {
                dimension.filter('66');
                return ['66'];
            });
            return chart;
        });
        it('default function should be used to dynamically generate label', () => {
            chart.filter(6);
            expect(chart.filter()).toEqual('66');
        });
        afterEach(() => {
            valueDimension.filterAll();
        });
    });

    describe('external labeling', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart-external-labeling')
                .externalLabels(10)
                .drawPaths(true)
                .render();
        });
        it('should place labels outside of pie offset by given radius', () => {
            const label = d3.select('#pie-chart-external-labeling svg g text.pie-slice');

            const centroid = d3.arc()
                .outerRadius(chart.radius() + 10)
                .innerRadius(chart.radius() + 10)
                .centroid(label.datum());

            expect(label.attr('transform')).toMatchTranslate(centroid[0], centroid[1], 3);
        });
        it('gives labels class "external"', () => {
            d3.selectAll('#pie-chart-external-labeling svg g text.pie-slice').each(function () {
                expect(d3.select(this).classed('external')).toBeTruthy();
            });
        });
        it('returns radius when given no arguments', () => {
            expect(chart.externalLabels()).toEqual(10);
        });
        it('resets to default when given falsey argument', () => {
            chart.externalLabels(false).render();

            d3.selectAll('#pie-chart-external-labeling svg g text.pie-slice').each(function () {
                const label = d3.select(this);

                const centroid = d3.arc()
                    .outerRadius(chart.radius())
                    .innerRadius(chart.innerRadius())
                    .centroid(label.datum());

                expect(label.attr('transform')).toMatchTranslate(centroid[0], centroid[1], 3);
                expect(label.classed('external')).toBeFalsy();
            });
        });
        it('hovering on label should highlight corresponding slice', () => {
            chart.selectAll('#pie-chart-external-labeling text.pie-slice').each(function (d, i) {
                const legendItem = d3.select(this);
                legendItem.on('mouseover')(legendItem.datum(), i);

                expect(chart.select(`g.pie-slice._${i}`).classed('highlight')).toBeTruthy();
                legendItem.on('mouseout')(legendItem.datum());
            });
        });
        it('unhovering label removes highlight from corresponding slice', () => {
            chart.selectAll('#pie-chart-external-labeling text.pie-slice').each(function (d, i) {
                const legendItem = d3.select(this);
                legendItem.on('mouseover')(legendItem.datum(), i);
                legendItem.on('mouseout')(legendItem.datum(), i);

                expect(chart.select(`.pie-slice._${i}`).classed('highlight')).toBeFalsy();
            });
        });

        it('hovering on path should highlight corresponding slice', () => {
            chart.selectAll('#pie-chart-external-labeling polyline.pie-path').each(function (d, i) {
                const legendItem = d3.select(this);
                legendItem.on('mouseover')(legendItem.datum(), i);

                expect(chart.select(`g.pie-slice._${i}`).classed('highlight')).toBeTruthy();
                legendItem.on('mouseout')(legendItem.datum());
            });
        });
        it('unhovering label removes highlight from corresponding slice', () => {
            chart.selectAll('#pie-chart-external-labeling polyline.pie-path').each(function (d, i) {
                const legendItem = d3.select(this);
                legendItem.on('mouseover')(legendItem.datum(), i);
                legendItem.on('mouseout')(legendItem.datum(), i);

                expect(chart.select(`.pie-slice._${i}`).classed('highlight')).toBeFalsy();
            });
        });
    });

    describe('legends', () => {
        let chart;
        beforeEach(() => {
            chart = buildChart('pie-chart-legend')
                .cap(3)
                .legend(new dc.Legend())
                .render();
        });
        it('should generate items for each slice', () => {
            expect(chart.selectAll('g.dc-legend g.dc-legend-item').size()).toEqual(chart.data().length);
        });
        it('should include "others" item', () => {
            const numOthersGroups = chart.selectAll('g.dc-legend g.dc-legend-item text').filter((d, i) => d.name === 'Others').size();

            expect(numOthersGroups).toEqual(1);
        });
        it('items should be colored', () => {
            chart.selectAll('g.dc-legend g.dc-legend-item').each(function () {
                expect(d3.select(this).select('rect').attr('fill')).not.toEqual(undefined);
            });
        });
        it('hovering on items should highlight corresponding slice', () => {
            chart.selectAll('g.dc-legend g.dc-legend-item').each(function (d, i) {
                const legendItem = d3.select(this);
                legendItem.on('mouseover')(legendItem.datum());

                expect(chart.select(`g.pie-slice._${i}`).classed('highlight')).toBeTruthy();
                legendItem.on('mouseout')(legendItem.datum());
            });
        });
        it('unhovering removes highlight from corresponding slice', () => {
            chart.selectAll('g.dc-legend g.dc-legend-item').each(function (d, i) {
                const legendItem = d3.select(this);
                legendItem.on('mouseover')(legendItem.datum());
                legendItem.on('mouseout')(legendItem.datum());

                expect(chart.select(`g.pie-slice._${i}`).classed('highlight')).toBeFalsy();
            });
        });
        it('clicking on items filters them', () => {
            chart.selectAll('g.dc-legend g.dc-legend-item').each(function (d, i) {
                const legendItem = d3.select(this);
                legendItem.on('click')(legendItem.datum());

                expect(chart.hasFilter(d.name)).toBeTruthy();

            });
        });
        afterEach(() => {
            valueDimension.filterAll();
        });
    });
});

