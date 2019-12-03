/* global loadDateFixture */
describe('dc.core', () => {
    let valueDimension, valueGroup;

    beforeEach(() => {
        const data = crossfilter(loadDateFixture());
        valueDimension = data.dimension(d => d.value);
        valueGroup = valueDimension.group();
    });

    describe('version', () => {
        it('should use semantic versions', () => {
            // from https://raw.github.com/coolaj86/semver-utils/v1.0.3/semver-utils.js
            //               |optional 'v'
            //               | | 3 segment version
            //               | |                    |optional release prefixed by '-'
            //               | |                    |                                        |optional build prefixed by '+'
            const reSemver = /^v?((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/;
            expect(dc.version).toMatch(reSemver);
        });
    });

    describe('charts', () => {
        let chart;
        beforeEach(() => {
            chart = new dc.PieChart('#id')
                    .dimension(valueDimension)
                    .group(valueGroup);
            spyOn(chart, 'filterAll');
            spyOn(chart, 'render');
            spyOn(chart, 'redraw');
            return chart;
        });

        it('should register chart object', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });

        it('filterAll should invoke filter on each chart', () => {
            dc.filterAll();
            expect(chart.filterAll).toHaveBeenCalled();
        });

        it('renderAll should invoke filter on each chart', () => {
            dc.renderAll();
            expect(chart.render).toHaveBeenCalled();
        });

        it('should be gone after remove all', () => {
            dc.deregisterAllCharts();
            expect(dc.hasChart(chart)).toBeFalsy();
        });
    });

    describe('chartsRegistry', () => {
        let chart;
        let chartGrouped;
        const chartGroup = 'testChartGroup';
        beforeEach(() => {
            chart = new dc.PieChart('#id')
                    .dimension(valueDimension)
                    .group(valueGroup);
            chartGrouped = new dc.PieChart('#id2', chartGroup)
                    .dimension(valueDimension)
                    .group(valueGroup);
            return chart;
        });

        it('should register chart object', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });

        it('should not have ungrouped chart after remove', () => {
            dc.deregisterChart(chart);
            expect(dc.hasChart(chart)).toBeFalsy();
        });

        it('should not have grouped chart after remove', () => {
            dc.deregisterChart(chartGrouped, chartGroup);
            expect(dc.hasChart(chartGrouped)).toBeFalsy();
        });

        it('should have switched to an existing group', () => {
            chart.chartGroup(chartGroup);
            expect(dc.hasChart(chart)).toBeTruthy();
            expect(dc.chartRegistry.list(chartGroup).indexOf(chart) > -1).toBeTruthy();
            expect(dc.chartRegistry.list(null).indexOf(chart) > -1).toBeFalsy();
        });

        it('should have switched to the global group', () => {
            chart.chartGroup(null);
            expect(dc.hasChart(chart)).toBeTruthy();
            expect(dc.chartRegistry.list(chartGroup).indexOf(chart) > -1).toBeFalsy();
            expect(dc.chartRegistry.list(null).indexOf(chart) > -1).toBeTruthy();
        });
    });

    describe('transition', () => {
        let selections;

        beforeEach(() => {
            selections = {
                transition: function () {
                    return this;
                },
                duration: function () {
                    return this;
                },
                delay: function () {
                    return this;
                }
            };
            spyOn(selections, 'transition').and.callThrough();
            spyOn(selections, 'duration').and.callThrough();
            spyOn(selections, 'delay').and.callThrough();
        });

        describe('normal', () => {
            it('transition should be activated with duration', () => {
                dc.transition(selections, 100, 100);
                expect(selections.transition).toHaveBeenCalled();
                expect(selections.duration).toHaveBeenCalled();
                expect(selections.delay).toHaveBeenCalled();
                expect(selections.duration).toHaveBeenCalledWith(100);
                expect(selections.delay).toHaveBeenCalledWith(100);
            });
            it('with name', () => {
                dc.transition(selections, 100, 100, 'transition-name');
                expect(selections.transition).toHaveBeenCalled();
                expect(selections.transition).toHaveBeenCalledWith('transition-name');
            });
        });

        describe('skip', () => {
            it('transition should not be activated with 0 duration', () => {
                dc.transition(selections, 0, 0);
                expect(selections.transition).not.toHaveBeenCalled();
                expect(selections.duration).not.toHaveBeenCalled();
                expect(selections.delay).not.toHaveBeenCalled();
            });

            it('transition should not be activated with dc.disableTransitions', () => {
                dc.config.disableTransitions = true;
                dc.transition(selections, 100);
                expect(selections.transition).not.toHaveBeenCalled();
                expect(selections.duration).not.toHaveBeenCalled();
            });

            afterEach(() => {
                dc.config.disableTransitions = false;
            });
        });

        describe('parameters', () => {
            it('duration should not be called if skipped', () => {
                dc.transition(selections);
                expect(selections.duration).not.toHaveBeenCalled();
            });

            it('delay should not be called if skipped', () => {
                dc.transition(selections, 100);
                expect(selections.delay).not.toHaveBeenCalled();
            });
        });
    });

    describe('units', () => {
        describe('.integers', () => {
            let result;
            beforeEach(() => {
                result = dc.units.integers(0, 100);
            });
            it('units should be based on subtraction', () => {
                expect(result).toEqual(100);
            });
        });

        describe('.float', () => {
            let result;
            beforeEach(() => {
                result = dc.units.fp.precision(0.001)(0.49999, 1.0);
            });
            it('units should be generated according to the precision', () => {
                expect(result).toEqual(501);
            });
        });

        describe('.ordinal', () => {
            it('should throw - it\'s a placeholder only', () => {
                expect(dc.units.ordinal).toThrow(new Error('dc.units.ordinal should not be called - it is a placeholder'));
            });
        });
    });

    describe('charts w/ grouping', () => {
        let chart;

        beforeEach(() => {
            chart = new dc.PieChart('#a', 'groupA').dimension(valueDimension).group(valueGroup);
            spyOn(chart, 'filterAll');
            spyOn(chart, 'render');
            new dc.PieChart('#b', 'groupA').dimension(valueDimension).group(valueGroup);
            new dc.BubbleChart('#c', 'groupB').dimension(valueDimension).group(valueGroup);
            new dc.BarChart('#b1', 'groupB').dimension(valueDimension).group(valueGroup);
            new dc.LineChart('#b2', 'groupB').dimension(valueDimension).group(valueGroup);
            new dc.DataCount('#b3', 'groupB').dimension(valueDimension).group(valueGroup);
            new dc.DataTable('#b4', 'groupB').dimension(valueDimension).group(valueGroup);
            return chart;
        });

        it('should register chart object', () => {
            expect(dc.hasChart(chart)).toBeTruthy();
        });

        it('filterAll by group should invoke filter on each chart within the group', () => {
            dc.filterAll('groupA');
            expect(chart.filterAll).toHaveBeenCalled();
        });

        it('renderAll by group should invoke filter on each chart within the group', () => {
            dc.renderAll('groupA');
            expect(chart.render).toHaveBeenCalled();
        });

        it('filterAll should not invoke filter on chart in groupA', () => {
            dc.filterAll();
            expect(chart.filterAll).not.toHaveBeenCalled();
        });

        it('renderAll should not invoke filter on chart in groupA', () => {
            dc.renderAll();
            expect(chart.render).not.toHaveBeenCalled();
        });

        it('should be gone after remove all', () => {
            dc.deregisterAllCharts();
            expect(dc.hasChart(chart)).toBeFalsy();
        });
    });

    describe('render/redraw all call back', () => {
        let result;

        beforeEach(() => {
            dc.renderlet(group => {
                result.called = group ? group : true;
            });
            result = {called: false};
        });

        it('renderAll call back should be triggered', () => {
            dc.renderAll();
            expect(result.called).toBeTruthy();
        });

        it('redrawAll call back should be triggered', () => {
            dc.redrawAll();
            expect(result.called).toBeTruthy();
        });

        it('renderAll by group call back should be triggered', () => {
            dc.renderAll('group');
            expect('group').toEqual(result.called);
        });

        it('redrawAll by group call back should be triggered', () => {
            dc.redrawAll('group');
            expect('group').toEqual(result.called);
        });
    });
});
