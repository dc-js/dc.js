/* global appendChartID, loadDateFixture, makeDate, cleanDateRange, simulateChartBrushing */
describe('dc.BarChart', () => {
    let id, chart, data;
    let dimension, group;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(d => d3.utcDay(d.dd));
        group = dimension.group();

        id = 'bar-chart';
        appendChartID(id);

        chart = new dc.BarChart(`#${id}`);
        chart.dimension(dimension).group(group)
            .width(1100).height(200)
            .x(d3.scaleUtc().domain([makeDate(2012, 0, 1), makeDate(2012, 11, 31)]))
            .transitionDuration(0)
            .controlsUseVisibility(true);
    });

    describe('rendering', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should set bar height using y-values from data', () => {
            forEachBar((bar, datum) => {
                expect(+bar.attr('y')).toBe(chart.y()(datum.data.value));
            });
        });

        it('should set bar width to the minimum for a relatively small chart', () => {
            forEachBar(bar => {
                expect(+bar.attr('width')).toBe(1);
            });
        });

        it('should preserve method chaining', () => {
            expect(chart.render()).toEqual(chart);
        });

        it('should not display bar labels without setting renderLabel(true)', () => {
            expect(chart.selectAll('text.barLabel').size()).toBe(0);
        });

        describe('with centered bars', () => {
            beforeEach(() => {
                chart.centerBar(true).render();
            });

            it('should position bars centered around their data points', () => {
                const halfBarWidth = 0.5;
                forEachBar((bar, datum) => {
                    const barPosition = chart.x()(datum.data.key);
                    expect(+bar.attr('x')).toBeCloseTo(barPosition - halfBarWidth, 3);
                });
            });
        });

        describe('without centered bars', () => {
            it('should position bars starting at their data points', () => {
                forEachBar((bar, datum) => {
                    const barPosition = chart.x()(datum.data.key);
                    expect(+bar.attr('x')).toBeCloseTo(barPosition, 3);
                });
            });
        });

        describe('with bar labels', () => {
            beforeEach(() => {
                chart.renderLabel(true).render();
            });

            it('should generate a label for each datum', () => {
                expect(chart.selectAll('text.barLabel').size()).toBe(6);
            });

            it('should generate labels with positions corresponding to their data', () => {
                expect(nthStack(0).nthLabel(0).attr('x')).toBeWithinDelta(405, 1);
                expect(nthStack(0).nthLabel(0).attr('y')).toBeWithinDelta(104, 1);
                expect(nthStack(0).nthLabel(0).text()).toBe('1');

                expect(nthStack(0).nthLabel(3).attr('x')).toBeWithinDelta(509, 1);
                expect(nthStack(0).nthLabel(3).attr('y')).toBeWithinDelta(104, 1);
                expect(nthStack(0).nthLabel(3).text()).toBe('1');

                expect(nthStack(0).nthLabel(5).attr('x')).toBeWithinDelta(620, 1);
                expect(nthStack(0).nthLabel(5).attr('y')).toBeWithinDelta(50, 1);
                expect(nthStack(0).nthLabel(5).text()).toBe('2');
            });
        });

        describe('with custom bar labels', () => {
            beforeEach(() => {
                chart.label(() => 'custom label').render();
            });

            it('should render a label for each datum', () => {
                expect(chart.selectAll('text.barLabel').size()).toBe(6);
            });

            it('should use the custom function for each label', () => {
                chart.selectAll('text.barLabel').each(function () {
                    expect(d3.select(this).text()).toBe('custom label');
                });
            });

            describe('with labels disabled', () => {
                beforeEach(() => {
                    chart.renderLabel(false).render();
                });

                it('should not display labels', () => {
                    expect(chart.selectAll('text.barLabel').size()).toBe(0);
                });
            });
        });

        describe('and then switching the group at runtime', () => {
            beforeEach(() => {
                chart.rescale(); // BUG: barWidth cannot change after initial rendering

                const domain = [makeDate(2012, 4, 20), makeDate(2012, 7, 15)];

                chart.x(d3.scaleUtc().domain(domain))
                    .group(dimension.group().reduceSum(d => +d.nvalue))
                    .elasticY(true)
                    .centerBar(false)
                    .xUnits(d3.utcDays)
                    .yAxis().ticks(5);

                chart.render();
            });

            it('should generate a bar for each datum', () => {
                expect(chart.selectAll('rect.bar').size()).toBe(6);
            });

            it('should automatically resize the bar widths', () => {
                forEachBar(bar => {
                    expect(bar.attr('width')).toBe('9');
                });
            });
            function nthYAxisText (n) {
                return d3.select(chart.selectAll('g.y text').nodes()[n]);
            }
            it('should generate bars with positions corresponding to their data', () => {
                expect(nthStack(0).nthBar(0).attr('x')).toBeWithinDelta(58, 1);
                expect(nthStack(0).nthBar(0).attr('y')).toBeWithinDelta(84, 1);
                expect(nthStack(0).nthBar(0).attr('height')).toBeWithinDelta(30, 1);

                expect(nthStack(0).nthBar(3).attr('x')).toBeWithinDelta(492, 1);
                expect(nthStack(0).nthBar(3).attr('y')).toBeWithinDelta(84, 1);
                expect(nthStack(0).nthBar(3).attr('height')).toBeWithinDelta(23, 1);

                expect(nthStack(0).nthBar(5).attr('x')).toBeWithinDelta(961, 1);
                expect(nthStack(0).nthBar(5).attr('y')).toBeWithinDelta(61, 1);
                expect(nthStack(0).nthBar(5).attr('height')).toBeWithinDelta(23, 1);
            });

            it('should generate the y-axis domain dynamically', () => {
                expect(nthYAxisText(0).text()).toMatch(/-10/);
                expect(nthYAxisText(1).text()).toMatch(/-5/);
                expect(nthYAxisText(2).text()).toBe('0');
            });

        });

        describe('with an ordinal x domain', () => {
            let stateDimension;

            beforeEach(() => {
                stateDimension = data.dimension(d => d.state);
                const stateGroup = stateDimension.group();
                const ordinalDomainValues = ['California', 'Colorado', 'Delaware', 'Ontario', 'Mississippi', 'Oklahoma'];

                chart.rescale(); // BUG: barWidth cannot change after initial rendering

                chart.dimension(stateDimension)
                    .group(stateGroup)
                    .xUnits(dc.units.ordinal)
                    .x(d3.scaleBand().domain(ordinalDomainValues))
                    .barPadding(0)
                    .outerPadding(0.1)
                    .render();
            });

            it('should automatically disable the brush', () => {
                expect(chart.brushOn()).toBeFalsy();
            });

            it('should generate a bar for each ordinal domain value', () => {
                expect(chart.selectAll('rect.bar').size()).toBe(6);
            });

            it('should size the bars proportionally to the graph', () => {
                expect(+chart.select('rect.bar').attr('width')).toBe(164);
            });

            it('should position the bar based on the ordinal range', () => {
                expect(nthStack(0).nthBar(0).attr('x')).toBeWithinDelta(16, 1);
                expect(nthStack(0).nthBar(3).attr('x')).toBeWithinDelta(674, 1);
                expect(nthStack(0).nthBar(5).attr('x')).toBeWithinDelta(509, 1);
            });

            it('should fade deselected bars', () => {
                chart.filter('Ontario').filter('Colorado').redraw();
                expect(nthStack(0).nthBar(0).classed('deselected')).toBeTruthy();
                expect(nthStack(0).nthBar(1).classed('deselected')).toBeFalsy();
                expect(nthStack(0).nthBar(5).classed('deselected')).toBeFalsy();
                expect(stateDimension.top(Infinity).length).toBe(3);
            });

            it('should respect the ordering of the specified domain', () => {
                // Note that bar chart works differently from pie chart.  The bar objects (the
                // actual DOM nodes) don't get reordered by the custom ordering, but they are
                // placed so that they are drawn in the order specified.
                const ontarioXPos = nthStack(0).nthBar(5).attr('x');
                const mississippiXPos = nthStack(0).nthBar(3).attr('x');
                const oklahomaXPos = nthStack(0).nthBar(4).attr('x');

                expect(ontarioXPos).toBeLessThan(mississippiXPos);
                expect(mississippiXPos).toBeLessThan(oklahomaXPos);
            });

            describe('with elasticY enabled', () => {
                beforeEach(() => {
                    chart.elasticY(true).render();
                });

                it('should use all ordinal keys to determine the maximum y', () => {
                    expect(chart.y().domain()).toEqual([0, 3]);
                });
            });

            describe('with an unspecified domain', () => {
                beforeEach(() => {
                    chart.x(d3.scaleBand()).render();
                });

                it('should use alphabetical ordering', () => {
                    const data02 = chart.selectAll('rect.bar').data();
                    const expectedData = ['California', 'Colorado', 'Delaware', 'Mississippi', 'Oklahoma', 'Ontario'];

                    expect(data02.map(datum => datum.x)).toEqual(expectedData);

                    let oldX = -Infinity;
                    forEachBar(bar => {
                        expect(bar.attr('x')).toBeGreaterThan(oldX);
                        oldX = bar.attr('x');
                    });
                });
            });

            describe('redrawing after changing the value accessor', () => {
                beforeEach(() => {
                    chart.valueAccessor(() => 30);
                    chart.redraw();
                });

                it('should position bars based on ordinal range', () => {
                    expect(nthStack(0).nthBar(0).attr('height')).toBe('1600');
                    expect(nthStack(0).nthBar(1).attr('height')).toBe('1600');
                    expect(nthStack(0).nthBar(2).attr('height')).toBe('1600');
                });
            });

            describe('clicking', () => {
                it('causes other dimension to be filtered', () => {
                    expect(dimension.top(Infinity).length).toEqual(10);
                    // fake a click
                    const abar = chart.selectAll('rect.bar:nth-child(3)');
                    abar.on('click')(abar.datum());
                    expect(dimension.top(Infinity).length).toEqual(1);
                });
            });

            describe('clicking bar labels', () => {
                beforeEach(() => {
                    chart.renderLabel(true).render();
                });

                it('causes other dimension to be filtered', () => {
                    expect(dimension.top(Infinity).length).toEqual(10);
                    // fake a click
                    const alabel = chart.select('text.barLabel');
                    alabel.on('click')(alabel.datum());
                    expect(dimension.top(Infinity).length).toEqual(3);
                });
            });
        });

        describe('d3.scaleOrdinal() deprecation for ordinal x domain', () => {
            let stateDimension;

            beforeEach(() => {
                spyOn(dc.logger, 'warn');

                stateDimension = data.dimension(d => d.state);
                const stateGroup = stateDimension.group();
                const ordinalDomainValues = ['California', 'Colorado', 'Delaware', 'Ontario', 'Mississippi', 'Oklahoma'];

                chart.rescale(); // BUG: barWidth cannot change after initial rendering

                chart.dimension(stateDimension)
                    .group(stateGroup)
                    .xUnits(dc.units.ordinal)
                    .x(d3.scaleOrdinal().domain(ordinalDomainValues))
                    .barPadding(0)
                    .outerPadding(0.1)
                    .render();
            });

            it('should work with a warning', () => {
                expect(dc.logger.warn).toHaveBeenCalled();

                expect(typeof chart.x().bandwidth).toEqual('function');
                expect(nthStack(0).nthBar(0).attr('x')).toBeWithinDelta(16, 1);
                expect(nthStack(0).nthBar(3).attr('x')).toBeWithinDelta(674, 1);
                expect(nthStack(0).nthBar(5).attr('x')).toBeWithinDelta(509, 1);
            });
        });

        describe('with a linear x domain', () => {
            beforeEach(() => {
                const linearDimension = data.dimension(d => +d.value);
                const linearGroup = linearDimension.group();

                chart.rescale(); // BUG: barWidth cannot change after initial rendering

                chart.dimension(linearDimension)
                    .group(linearGroup)
                    .xUnits(dc.units.integers)
                    .x(d3.scaleLinear().domain([20, 70]))
                    .render();
            });

            it('should generate the correct number of bars', () => {
                expect(chart.selectAll('rect.bar').size()).toBe(5);
            });

            it('should auto size bar width', () => {
                forEachBar(bar => {
                    expect(bar.attr('width')).toBe('18');
                });
            });

            it('should position bars based on linear range', () => {
                expect(nthStack(0).nthBar(0).attr('x')).toBeWithinDelta(40, 1);
                expect(nthStack(0).nthBar(2).attr('x')).toBeWithinDelta(489, 1);
                expect(nthStack(0).nthBar(4).attr('x')).toBeWithinDelta(938, 1);
            });

            describe('with a custom click handler', () => {
                beforeEach(() => {
                    chart.brushOn(false)
                        .on('renderlet', _chart => {
                            _chart.selectAll('rect.bar').on('click', d => _chart.onClick(d));
                        })
                        .render();
                });
                it('clicking causes another dimension to be filtered', () => {
                    expect(dimension.top(Infinity).length).toEqual(10);
                    const abar = chart.selectAll('rect.bar:nth-child(3)');
                    abar.on('click')(abar.datum());
                    expect(dimension.top(Infinity).length).toEqual(3);
                });
            });
        });

        describe('with stacked data', () => {
            describe('with positive data', () => {
                beforeEach(() => {
                    const idGroup = dimension.group().reduceSum(d => d.id);
                    const sumGroup = dimension.group().reduceSum(d => d.value);

                    chart
                        .brushOn(false)
                        .x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]))
                        .group(idGroup, 'stack 0')
                        .title('stack 0', d => `stack 0: ${d.value}`)
                        .stack(sumGroup, 'stack 1')
                        .title('stack 1', d => `stack 1: ${d.value}`)
                        .stack(sumGroup, 'stack 2', d => 3)
                        .elasticY(true)
                        .renderLabel(true)
                        .render();
                });

                it('should set the y domain to encompass all stacks', () => {
                    expect(chart.y().domain()).toEqual([0, 152]);
                });

                it('should generate each stack using its associated group', () => {
                    expect(nthStack(0).selectAll('rect.bar').size()).toBe(6);
                    expect(nthStack(1).selectAll('rect.bar').size()).toBe(6);
                    expect(nthStack(2).selectAll('rect.bar').size()).toBe(6);
                });

                it('should render the correct number of stacks', () => {
                    expect(chart.selectAll('.stack').size()).toBe(3);
                });

                it('should display one label for each stack', () => {
                    expect(chart.selectAll('text.barLabel').size()).toBe(6);
                });

                it('should generate labels with total value of stack', () => {
                    expect(nthStack(2).nthLabel(0).text()).toBe('48');
                    expect(nthStack(2).nthLabel(3).text()).toBe('51');
                    expect(nthStack(2).nthLabel(5).text()).toBe('92');
                });

                it('should stack the bars', () => {
                    expect(+nthStack(0).nthBar(2).attr('y')).toBe(142);
                    expect(+nthStack(0).nthBar(4).attr('y')).toBe(144);

                    expect(+nthStack(1).nthBar(2).attr('y')).toBe(3);
                    expect(+nthStack(1).nthBar(4).attr('y')).toBe(86);

                    expect(+nthStack(2).nthBar(2).attr('y')).toBe(0);
                    expect(+nthStack(2).nthBar(4).attr('y')).toBe(83);
                });

                it('should have its own title accessor', () => {
                    expect(chart.title()({value: 1})).toBe('stack 0: 1');
                    expect(chart.title('stack 0')({value: 2})).toBe('stack 0: 2');
                    expect(chart.title('stack 1')({value: 3})).toBe('stack 1: 3');
                });

                it('should have titles rendered for extra stacks', () => {
                    nthStack(1).forEachBar((bar, datum) => {
                        expect(bar.selectAll('title').nodes().length).toBe(1);
                        expect(bar.select('title').text()).toBe(`stack 1: ${datum.data.value}`);
                    });
                });

                it('should default to first stack title for untitled stacks', () => {
                    nthStack(2).forEachBar((bar, datum) => {
                        expect(bar.select('title').text()).toBe(`stack 0: ${datum.data.value}`);
                    });
                });

                describe('extra redraws', () => {
                    beforeEach(() => {
                        chart.redraw();
                        chart.redraw();
                    });

                    it('should not create extra title elements', () => {
                        nthStack(1).forEachBar((bar, datum) => {
                            expect(bar.selectAll('title').nodes().length).toBe(1);
                        });
                    });
                });

                describe('with title rendering disabled', () => {
                    beforeEach(() => {
                        chart.renderTitle(false).render();
                    });

                    it('should not generate title elements', () => {
                        expect(chart.selectAll('rect.bar title').empty()).toBeTruthy();
                    });
                });

                describe('stack hiding', () => {
                    describe('first stack', () => {
                        beforeEach(() => {
                            chart.hideStack('stack 0').render();
                        });

                        it('should hide the stack', () => {
                            expect(nthStack(0).nthBar(0).attr('height')).toBe('52');
                            expect(nthStack(0).nthBar(1).attr('height')).toBe('78');
                        });

                        it('should show the stack', () => {
                            chart.showStack('stack 0').render();
                            expect(nthStack(0).nthBar(0).attr('height')).toBe('1');
                            expect(nthStack(0).nthBar(1).attr('height')).toBe('6');
                        });
                    });

                    describe('any other stack', () => {
                        beforeEach(() => {
                            chart.title('stack 2', d => `stack 2: ${d.value}`);
                            chart.hideStack('stack 1').render();
                        });

                        it('should hide the stack', () => {
                            expect(nthStack(1).nthBar(0).attr('height')).toBe('24');
                            expect(nthStack(1).nthBar(1).attr('height')).toBe('24');
                        });

                        it('should show the stack', () => {
                            chart.showStack('stack 1').render();
                            expect(nthStack(1).nthBar(0).attr('height')).toBe('46');
                            expect(nthStack(1).nthBar(1).attr('height')).toBe('70');
                        });

                        it('should still show the title for a visible stack', () => {
                            nthStack(1).forEachBar((bar, datum) => {
                                expect(bar.select('title').text()).toBe(`stack 2: ${datum.data.value}`);
                            });
                        });
                    });

                    describe('hiding all the stacks', () => {
                        beforeEach(() => {
                            chart.hideStack('stack 0')
                                .hideStack('stack 1')
                                .hideStack('stack 2')
                                .render();
                        });

                        it('should show a blank graph', () => {
                            expect(chart.selectAll('rect.bar').size()).toBe(0);
                        });
                    });
                });
            });

            describe('with mixed positive and negative data', () => {
                beforeEach(() => {
                    const mixedGroup = dimension.group().reduceSum(d => d.nvalue);

                    chart.group(mixedGroup).stack(mixedGroup).stack(mixedGroup);
                    chart.x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]));

                    chart.margins({top: 30, right: 50, bottom: 30, left: 30})
                        .yAxisPadding(5)
                        .elasticY(true)
                        .xUnits(d3.utcDays)
                        .yAxis().ticks(5);

                    chart.rescale(); // BUG: barWidth cannot change after initial rendering

                    chart.render();
                });

                it('should generate a bar for each datum across all stacks', () => {
                    expect(chart.selectAll('rect.bar').size()).toBe(18);
                });

                it('should automatically size the bar widths', () => {
                    forEachBar(bar => {
                        expect(bar.attr('width')).toBe('9');
                    });
                });

                it('should generate negative bars for stack 0', () => {
                    expect(nthStack(0).nthBar(0).attr('x')).toBeWithinDelta(58, 1);
                    expect(nthStack(0).nthBar(0).attr('y')).toBeWithinDelta(73, 1);
                    expect(nthStack(0).nthBar(0).attr('height')).toBeWithinDelta(8, 1);

                    expect(nthStack(0).nthBar(3).attr('x')).toBeWithinDelta(492, 1);
                    expect(nthStack(0).nthBar(3).attr('y')).toBeWithinDelta(73, 1);
                    expect(nthStack(0).nthBar(3).attr('height')).toBeWithinDelta(6, 1);

                    expect(nthStack(0).nthBar(5).attr('x')).toBeWithinDelta(961, 1);
                    expect(nthStack(0).nthBar(5).attr('y')).toBeWithinDelta(67, 1);
                    expect(nthStack(0).nthBar(5).attr('height')).toBeWithinDelta(6, 1);
                });

                it('should generate negative bar for stack 1', () => {
                    expect(nthStack(1).nthBar(0).attr('x')).toBeWithinDelta(58, 1);
                    expect(nthStack(1).nthBar(0).attr('y')).toBeWithinDelta(81, 1);
                    expect(nthStack(1).nthBar(0).attr('height')).toBeWithinDelta(7, 1);

                    expect(nthStack(1).nthBar(3).attr('x')).toBeWithinDelta(492, 1);
                    expect(nthStack(1).nthBar(3).attr('y')).toBeWithinDelta(79, 1);
                    expect(nthStack(1).nthBar(3).attr('height')).toBeWithinDelta(5, 1);

                    expect(nthStack(1).nthBar(5).attr('x')).toBeWithinDelta(961, 1);
                    expect(nthStack(1).nthBar(5).attr('y')).toBeWithinDelta(61, 1);
                    expect(nthStack(1).nthBar(5).attr('height')).toBeWithinDelta(6, 1);
                });

                it('should generate y axis domain dynamically', () => {
                    const nthText = function (n) {
                        return d3.select(chart.selectAll('g.axis.y .tick text').nodes()[n]);
                    };

                    expect(nthText(0).text()).toBe('-20');
                    expect(nthText(1).text()).toBe('0');
                    expect(nthText(2).text()).toBe('20');
                });
            });

            describe('with negative data', () => {
                beforeEach(() => {
                    const negativeGroup = dimension.group().reduceSum(d => -Math.abs(d.nvalue));

                    chart.group(negativeGroup).stack(negativeGroup).stack(negativeGroup);
                    chart.x(d3.scaleUtc().domain([makeDate(2012, 4, 20), makeDate(2012, 7, 15)]));

                    chart.margins({top: 30, right: 50, bottom: 30, left: 30})
                        .elasticY(true)
                        .xUnits(d3.utcDays)
                        .yAxis().ticks(3);

                    chart.render();
                });

                it('should generate y axis domain dynamically', () => {
                    const nthText = function (n) {
                        return d3.select(chart.selectAll('g.axis.y .tick text').nodes()[n]);
                    };

                    expect(nthText(0).text()).toBe('-30');
                    expect(nthText(1).text()).toBe('-20');
                    expect(nthText(2).text()).toBe('-10');
                    expect(nthText(3).text()).toBe('0');
                });
            });
        });

        it('should not be focused by default', () => {
            expect(chart.refocused()).toBeFalsy();
        });

        describe('when focused', () => {
            beforeEach(() => {
                chart.elasticY(true).gap(1).xUnits(d3.utcDays);
                chart.focus([makeDate(2012, 5, 11), makeDate(2012, 6, 9)]);
            });

            it('should render the one (focused) bar', () => {
                expect(chart.selectAll('rect.bar').size()).toBe(1);
            });

            it('should resize the bar width according to the focused width', () => {
                expect(chart.select('rect.bar').attr('width')).toBe('35');
            });

            it('should reset the y-axis domain based on the focus range', () => {
                expect(chart.y().domain()).toEqual([0, 1]);
            });

            it('should redraw the x-axis scale and ticks', () => {
                expect(xAxisText().slice(0, 4)).toEqual(['Mon 11', 'Wed 13', 'Fri 15', 'Jun 17']);
            });

            it('should set its focus flag', () => {
                expect(chart.refocused()).toBeTruthy();
            });

            describe('with evadeDomainFilter', () => {
                beforeEach(() => {
                    chart.evadeDomainFilter(true).redraw();
                });
                it('should still reset the y-axis domain based on the focus range', () => {
                    expect(chart.y().domain()).toEqual([0, 1]);
                });
            });

            it('should reset the focus when focused to null', () => {
                chart.focus(null);
                itBehavesLikeItWasReset();
            });

            it('should reset the focus when focused to []', () => {
                chart.focus([]);
                itBehavesLikeItWasReset();
            });

            function itBehavesLikeItWasReset () {
                expect(chart.refocused()).toBeFalsy();
                expect(chart.x().domain()).toEqual([makeDate(2012, 0, 1), makeDate(2012, 11, 31)]);

                expect(xAxisText().slice(0, 4)).toEqual(['2012', 'February', 'March', 'April']);
            }

            function xAxisText () {
                return chart.selectAll('g.x text').nodes().map(x => d3.select(x).text());
            }
        });

        describe('legend hovering', () => {
            let firstItem;

            beforeEach(() => {
                chart.stack(group)
                    .legend(new dc.Legend().x(400).y(10).itemHeight(13).gap(5))
                    .render();

                firstItem = chart.select('g.dc-legend g.dc-legend-item');
                firstItem.on('mouseover')(firstItem.datum());
            });

            describe('when a legend item is hovered over', () => {
                it('should highlight corresponding lines and areas', () => {
                    nthStack(0).forEachBar(bar => {
                        expect(bar.classed('highlight')).toBeTruthy();
                    });
                });

                it('should fade out non-corresponding lines and areas', () => {
                    nthStack(1).forEachBar(bar => {
                        expect(bar.classed('fadeout')).toBeTruthy();
                    });
                });
            });

            describe('when a legend item is hovered out', () => {
                it('should remove highlighting from corresponding lines and areas', () => {
                    firstItem.on('mouseout')(firstItem.datum());
                    nthStack(0).forEachBar(bar => {
                        expect(bar.classed('highlight')).toBeFalsy();
                    });
                });

                it('should fade in non-corresponding lines and areas', () => {
                    firstItem.on('mouseout')(firstItem.datum());
                    nthStack(1).forEachBar(bar => {
                        expect(bar.classed('fadeout')).toBeFalsy();
                    });
                });
            });
        });

        describe('filtering', () => {
            beforeEach(() => {
                d3.select(`#${id}`).append('span').attr('class', 'filter').style('visibility', 'hidden');
                d3.select(`#${id}`).append('a').attr('class', 'reset').style('visibility', 'hidden');
                chart.filter([makeDate(2012, 5, 1), makeDate(2012, 5, 30)]).redraw();
                dc.config.dateFormat = d3.utcFormat('%m/%d/%Y');
                chart.redraw();
            });

            it('should set the chart filter', () => {
                expect(chart.filter()).toEqual([makeDate(2012, 5, 1), makeDate(2012, 5, 30)]);
            });

            it('should enable the reset link after rendering', () => {
                expect(chart.select('a.reset').style('visibility')).not.toBe('none');
            });

            it('should set the filter printer', () => {
                expect(chart.filterPrinter()).not.toBeNull();
            });

            it('should show the filter info', () => {
                expect(chart.select('span.filter').style('visibility')).toBe('visible');
            });

            it('should set filter text after slice selection', () => {
                expect(chart.select('span.filter').text()).toBe('[06/01/2012 -> 06/30/2012]');
            });

            describe('when a brush is defined', () => {
                it('should position the brush with an offset', () => {
                    expect(chart.select('g.brush').attr('transform')).toMatchTranslate(chart.margins().left, 10);
                });

                it('should create a fancy brush resize handle', () => {
                    const selectAll = chart.select('g.brush').selectAll('path.custom-brush-handle');
                    expect(selectAll.size()).toBe(2);
                    selectAll.each(function (d, i) {
                        if (i === 0) {
                            expect(d3.select(this).attr('d'))
                                .toMatchPath('M-0.5,53 A6,6 0 0 0 -6.5,59 V100 A6,6 0 0 0 -0.5,106 ZM-2.5,61 V98 M-4.5,61 V98');
                        } else {
                            expect(d3.select(this).attr('d'))
                                .toMatchPath('M0.5,53 A6,6 0 0 1 6.5,59 V100 A6,6 0 0 1 0.5,106 ZM2.5,61 V98 M4.5,61 V98');
                        }
                    });
                });

                it('should stretch the background', () => {
                    expect(+chart.select('g.brush rect.overlay').attr('width')).toBe(1020);
                });

                it('should set the background height to the chart height', () => {
                    expect(+chart.select('g.brush rect.overlay').attr('height')).toBe(160);
                });

                it('should set extent height to the chart height', () => {
                    expect(+chart.select('g.brush rect.selection').attr('height')).toBe(160);
                });

                it('should set extent width based on filter set', () => {
                    expect(chart.select('g.brush rect.selection').attr('width')).toBeWithinDelta(81, 1);
                });

                it('should push unselected bars to the background', () => {
                    expect(nthStack(0).nthBar(0).classed('deselected')).toBeTruthy();
                    expect(nthStack(0).nthBar(1).classed('deselected')).toBeFalsy();
                    expect(nthStack(0).nthBar(3).classed('deselected')).toBeTruthy();
                });

                it('should push the selected bars to the foreground', () => {
                    expect(nthStack(0).nthBar(1).classed('deselected')).toBeFalsy();
                });

                describe('after reset', () => {
                    beforeEach(() => {
                        chart.filterAll();
                        chart.redraw();
                    });

                    it('should push all bars to the foreground', () => {
                        chart.selectAll('rect.bar').each(function () {
                            const bar = d3.select(this);
                            expect(bar.classed('deselected')).toBeFalsy();
                        });
                    });
                });
            });
        });

        describe('a chart with a large domain', () => {
            beforeEach(() => {
                chart.x(d3.scaleUtc().domain([makeDate(2000, 0, 1), makeDate(2012, 11, 31)]));
            });

            describe('when filters are applied', () => {
                beforeEach(() => {
                    data.dimension(d => d.value).filter(66);
                    chart.redraw();
                });

                it('should not deselect any bars', () => {
                    forEachBar(bar => {
                        expect(bar.classed('deselected')).toBeFalsy();
                    });
                });

                it('should set the bars to the minimum bar width', () => {
                    forEachBar(bar => {
                        expect(+bar.attr('width')).toBe(1);
                    });
                });
            });
        });

        describe('a chart with a linear numerical domain', () => {
            beforeEach(() => {
                const numericalDimension = data.dimension(d => +d.value);
                chart.dimension(numericalDimension).group(numericalDimension.group());
                chart.x(d3.scaleLinear().domain([10, 80])).elasticY(true);
                chart.render();
            });

            it('should base the y-axis height on the maximum value in the data', function () {
                const yAxisMax = 3.0;
                const ticks = chart.selectAll('g.y g.tick');
                const tickValues = ticks.nodes().map(tick => +d3.select(tick).text());
                const maxTickValue = Math.max.apply(this, tickValues);
                expect(maxTickValue).toBe(yAxisMax);
            });

            describe('when filters are applied', () => {
                beforeEach(() => {
                    data.dimension(d => d.countrycode).filter('CA');
                    chart.redraw();
                });

                it('should rescale the y-axis after applying a filter', function () {
                    const yAxisMax = 1.0;
                    const ticks = chart.selectAll('g.y g.tick');
                    const tickValues = ticks.nodes().map(tick => +d3.select(tick).text());
                    const maxTickValue = Math.max.apply(this, tickValues);
                    expect(maxTickValue).toBe(yAxisMax);
                });
            });
        });
    });

    describe('with another ordinal domain', () => {
        beforeEach(() => {
            const rows = [];
            rows.push({State: 'CA', 'Population': 2704659});
            rows.push({State: 'TX', 'Population': 1827307});
            data = crossfilter(rows);
            dimension  = data.dimension(dc.pluck('State'));
            group = dimension.group().reduceSum(dc.pluck('Population'));

            chart = new dc.BarChart(`#${id}`);
            chart.xUnits(dc.units.ordinal)
                .x(d3.scaleBand())
                .transitionDuration(0)
                .dimension(dimension)
                .group(group, 'Population');
            chart.render();
        });
        it('should not overlap bars', () => {
            const x = numAttr('x'), wid = numAttr('width');
            expect(x(nthStack(0).nthBar(0)) + wid(nthStack(0).nthBar(0)))
                .toBeLessThan(x(nthStack(0).nthBar(1)));
        });
    });

    describe('with yetnother ordinal domain', () => {
        beforeEach(() => {
            const rows = [{
                name: 'Venezuela',
                sale: 300
            }, {
                name: 'Saudi',
                sale: 253
            }, {
                name: 'Canada',
                sale: 150
            }, {
                name: 'Iran',
                sale: 125
            }, {
                name: 'Russia',
                sale: 110
            }, {
                name: 'UAE',
                sale: 90
            }, {
                name: 'US',
                sale: 40
            }, {
                name: 'China',
                sale: 37
            }];
            data = crossfilter(rows);
            dimension  = data.dimension(d => d.name);
            group = dimension.group().reduceSum(d => d.sale);
            chart = new dc.BarChart(`#${id}`);
            chart.transitionDuration(0)
                .outerPadding(0)
                .dimension(dimension)
                .group(group)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal);
            chart.render();
        });
        it('should not overlap bars', () => {
            for (let i = 0; i < 7; ++i) {
                checkBarOverlap(i);
            }
        });
    });

    describe('with changing number of bars', () => {
        beforeEach(() => {
            const rows1 = [
                {x: 1, y: 3},
                {x: 2, y: 9},
                {x: 5, y: 10},
                {x: 6, y: 7}
            ];

            data = crossfilter(rows1);
            dimension = data.dimension(d => d.x);
            group = dimension.group().reduceSum(d => d.y);

            chart = new dc.BarChart(`#${id}`);
            chart.width(500).transitionDuration(0)
                .x(d3.scaleLinear().domain([0,7]))
                .elasticY(true)
                .dimension(dimension)
                .group(group);
            chart.render();
        });
        it('should not overlap bars', () => {
            for (let i = 0; i < 3; ++i) {
                checkBarOverlap(i);
            }
        });
        describe('with bars added', () => {
            beforeEach(() => {
                const rows2 = [
                    {x: 7, y: 4},
                    {x: 12, y: 9}
                ];

                data.add(rows2);
                chart.x().domain([0,13]);
                chart.render();
            });
            it('should not overlap bars', () => {
                for (let i = 0; i < 5; ++i) {
                    checkBarOverlap(i);
                }
            });
        });
    });
    describe('with elasticX and x-axis padding', () => {
        const date = makeDate(2012, 5, 1);
        beforeEach(() => {
            const rows = [
                {x: date, y: 4},
            ];
            data = crossfilter(rows);
            dimension = data.dimension(d => d.x);
            group = dimension.group().reduceSum(d => d.y);
            chart = new dc.BarChart(`#${id}`);
            chart.width(500)
                .transitionDuration(0)
                .x(d3.scaleUtc())
                .elasticY(true).elasticX(true)
                .dimension(dimension)
                .group(group);
            chart.render();
        });
        // note: these tests assume that the bar width is not included in the
        // chart width, so they should be broken when #792 is fixed
        it('should render the right xAxisMax/Min when no padding', () => {
            expect(chart.xAxisMin()).toEqual(date);
            expect(chart.xAxisMax()).toEqual(date);
        });
        it('should render the right xAxisMax/Min when 10 day padding', () => {
            chart.xAxisPadding(10)
                .render();
            const expectedStartDate = d3.utcDay.offset(date, -10);
            const expectedEndDate = d3.utcDay.offset(date, 10);
            expect(chart.xAxisMin()).toEqual(expectedStartDate);
            expect(chart.xAxisMax()).toEqual(expectedEndDate);
        });
        it('should render the right xAxisMax/Min when 2 month padding', () => {
            chart.xAxisPaddingUnit('month')
                .xAxisPadding(2)
                .render();
            const expectedStartDate = d3.utcMonth.offset(date, -2);
            const expectedEndDate = d3.utcMonth.offset(date, 2);
            expect(chart.xAxisMin()).toEqual(expectedStartDate);
            expect(chart.xAxisMax()).toEqual(expectedEndDate);
        });
    });
    describe('with changing number of bars and elasticX', () => {
        beforeEach(() => {
            const rows1 = [
                {x: 1, y: 3},
                {x: 2, y: 9},
                {x: 5, y: 10},
                {x: 6, y: 7}
            ];

            data = crossfilter(rows1);
            dimension = data.dimension(d => d.x);
            group = dimension.group().reduceSum(d => d.y);

            chart = new dc.BarChart(`#${id}`);
            chart.width(500).transitionDuration(0)
                .x(d3.scaleLinear())
                .elasticY(true).elasticX(true)
                .dimension(dimension)
                .group(group);
            chart.render();
        });
        it('should not overlap bars', () => {
            for (let i = 0; i < 3; ++i) {
                checkBarOverlap(i);
            }
        });
        describe('with bars added', () => {
            beforeEach(() => {
                const rows2 = [
                    {x: 7, y: 4},
                    {x: 12, y: 9}
                ];

                data.add(rows2);
                chart.render();
            });
            it('should not overlap bars', () => {
                for (let i = 0; i < 5; ++i) {
                    checkBarOverlap(i);
                }
            });
        });
    });

    describe('with changing number of ordinal bars and elasticX', () => {
        beforeEach(() => {
            const rows1 = [
                {x: 'a', y: 3},
                {x: 'b', y: 9},
                {x: 'e', y: 10},
                {x: 'f', y: 7}
            ];

            data = crossfilter(rows1);
            dimension = data.dimension(d => d.x);
            group = dimension.group().reduceSum(d => d.y);

            chart = new dc.BarChart(`#${id}`);
            chart.width(500).transitionDuration(0)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .elasticY(true).elasticX(true)
                .dimension(dimension)
                .group(group);
            chart.render();
        });
        it('should not overlap bars', () => {
            for (let i = 0; i < 3; ++i) {
                checkBarOverlap(i);
            }
        });
        describe('with bars added', () => {
            beforeEach(() => {
                const rows2 = [
                    {x: 'g', y: 4},
                    {x: 'l', y: 9}
                ];

                data.add(rows2);
                chart.render();
            });
            it('should not overlap bars', () => {
                for (let i = 0; i < 5; ++i) {
                    checkBarOverlap(i);
                }
            });
        });
    });

    describe('brushing with bars centered and rounding enabled', () => {
        beforeEach(() => {
            chart
                .brushOn(true)
                .round(d3.utcMonth.round)
                .centerBar(true);
        });

        describe('with alwaysUseRounding disabled', () => {
            let consoleWarnSpy;

            beforeEach(() => {
                chart.alwaysUseRounding(false);
                consoleWarnSpy = spyOn(console, 'warn');
                chart.render();

                simulateChartBrushing(chart, [makeDate(2012, 6, 1), makeDate(2012, 7, 15)]);
            });

            it('should log a warning indicating that brush rounding was disabled', () => {
                expect(consoleWarnSpy.calls.mostRecent().args[0]).toMatch(/brush rounding is disabled/);
            });

            it('should not round the brush', () => {
                jasmine.clock().tick(100);
                const filter = cleanDateRange(chart.filter());
                expect(filter).toEqual([makeDate(2012, 6, 1), makeDate(2012, 7, 15)]);
            });
        });

        describe('with alwaysUseRounding enabled', () => {
            beforeEach(() => {
                chart.alwaysUseRounding(true);
                chart.render();

                simulateChartBrushing(chart, [makeDate(2012, 6, 1), makeDate(2012, 7, 15)]);
            });

            it('should round the brush', () => {
                jasmine.clock().tick(100);
                const filter = cleanDateRange(chart.filter());
                expect(filter).toEqual([makeDate(2012, 6, 1), makeDate(2012, 7, 1)]);
            });
        });
    });

    describe('check ordering option of the x axis', () => {
        beforeEach(() => {
            const rows = [
                {x: 'a', y: 1},
                {x: 'b', y: 3},
                {x: 'd', y: 4},
                {x: 'c', y: 2}
            ];

            id = 'bar-chart';
            appendChartID(id);
            data = crossfilter(rows);
            dimension = data.dimension(d => d.x);
            group = dimension.group().reduceSum(d => d.y);

            chart = new dc.BarChart(`#${id}`);
            chart.width(500).transitionDuration(0)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .elasticY(true).elasticX(true)
                .dimension(dimension)
                .group(group);
            chart.render();
        });

        it('should be ordered by default alphabetical order', () => {
            const data02 = chart.data()['0'].values;
            const expectedData = ['a', 'b', 'c', 'd'];
            expect(data02.map(d => d.x)).toEqual(expectedData);
        });

        it('should be ordered by value increasing', () => {
            chart.ordering(d => d.value);
            chart.redraw();
            expect(xAxisText()).toEqual(['a', 'c', 'b', 'd']);
        });

        it('should be ordered by value decreasing', () => {
            chart.ordering(d => -d.value);
            chart.redraw();
            expect(xAxisText()).toEqual(['d', 'b', 'c', 'a']);
        });

        it('should be ordered by alphabetical order', () => {
            chart.ordering(d => d.key);
            chart.redraw();
            expect(xAxisText()).toEqual(['a', 'b', 'c', 'd']);
        });

        function xAxisText () {
            return chart.selectAll('g.x text').nodes().map(x => d3.select(x).text());
        }
    });

    describe('ordering with stacks', () => {
        beforeEach(() => {
            const rows = [
                {x: 'a', y: 1, z: 10},
                {x: 'b', y: 3, z: 20},
                {x: 'd', y: 4, z: 30},
                {x: 'c', y: 2, z: 40}
            ];

            id = 'bar-chart';
            appendChartID(id);
            data = crossfilter(rows);
            dimension = data.dimension(d => d.x);
            group = dimension.group().reduceSum(d => d.y);
            const group2 = dimension.group().reduceSum(d => d.z);

            chart = new dc.BarChart(`#${id}`);
            chart.width(500).transitionDuration(0)
                .x(d3.scaleBand())
                .xUnits(dc.units.ordinal)
                .elasticY(true).elasticX(true)
                .dimension(dimension)
                .group(group)
                .stack(group2);
            chart.render();
        });

        it('should be ordered by default alphabetical order', () => {
            const data02 = chart.data()['0'].values;
            const expectedData = ['a', 'b', 'c', 'd'];
            expect(data02.map(d => d.x)).toEqual(expectedData);
        });

        // note: semantics are kind of screwy here: which stack do you want to sort
        // by when you order by value? right now it's all of them together.
        it('should be ordered by value increasing', () => {
            chart.ordering(d => d.value);
            chart.redraw();
            expect(xAxisText()).toEqual(['a', 'c', 'b', 'd']);
        });

        it('should be ordered by value decreasing', () => {
            chart.ordering(d => -d.value);
            chart.redraw();
            expect(xAxisText()).toEqual(['c', 'd', 'b', 'a']);
        });

        it('should be ordered by alphabetical order', () => {
            chart.ordering(d => d.key);
            chart.redraw();
            expect(xAxisText()).toEqual(['a', 'b', 'c', 'd']);
        });

        function xAxisText () {
            return chart.selectAll('g.x text').nodes().map(x => d3.select(x).text());
        }
    });

    function nthStack (n) {
        const stack = d3.select(chart.selectAll('.stack').nodes()[n]);

        stack.nthBar = function (i) {
            return d3.select(this.selectAll('rect.bar').nodes()[i]);
        };

        stack.nthLabel = function (i) {
            return d3.select(this.selectAll('text.barLabel').nodes()[i]);
        };

        stack.forEachBar = function (assertions) {
            this.selectAll('rect.bar').each(function (d) {
                assertions(d3.select(this), d);
            });
        };

        return stack;
    }

    function forEachBar (assertions) {
        chart.selectAll('rect.bar').each(function (d) {
            assertions(d3.select(this), d);
        });
    }

    // mostly because jshint complains about the +
    function numAttr (attr) {
        return function (selection) {
            return +selection.attr(attr);
        };
    }

    function checkBarOverlap (n) {
        const x = numAttr('x'), wid = numAttr('width');
        expect(x(nthStack(0).nthBar(n)) + wid(nthStack(0).nthBar(n)))
            .toBeLessThan(x(nthStack(0).nthBar(n + 1)));
    }
});
