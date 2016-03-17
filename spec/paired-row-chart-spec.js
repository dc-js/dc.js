/* global appendChartID, loadGenderFixture */
describe('dc.pairedRowChart', function () {
    var id, chart;
    var data, dimension, group, dummyGroup;

    beforeEach(function () {
        var genderFixture = loadGenderFixture();
        data = crossfilter(genderFixture);
        var ageRanges = ['0 - 9', '10 - 19', '20 - 29', '30 - 39', '40 - 49', '50 - 59',
                         '60 - 69', '70 - 79', '80 - 89', '90 - 99', '100+'];

        dimension = data.dimension(function (d) {
            var ageRange = (d.age <= 99) ?
                ageRanges[Math.floor(d.age / 10)] :
                ageRanges[10];

            return [d.gender, ageRange];
        });
        group = dimension.group().reduceCount();

        dummyGroup = {
            all: function () {
                // convert to object so we can easily tell if a key exists
                var values = {};
                group.all().forEach(function (d) {
                    values[d.key[0] + '.' + d.key[1]] = d.value;
                });

                // convert back into an array for the chart, making sure that all ageRanges exist
                var g = [];
                ageRanges.forEach(function (ageRange) {
                    g.push({
                        key: ['Male', ageRange],
                        value: values['Male.' + ageRange] || 0
                    });
                    g.push({
                        key: ['Female', ageRange],
                        value: values['Female.' + ageRange] || 0
                    });
                });

                return g;
            }
        };

        id = 'paired-row-chart';
        appendChartID(id);

        chart = dc.pairedRowChart('#' + id);
        chart.dimension(dimension)
            .group(dummyGroup)
            .width(600).height(200).gap(10)
            .leftKeyFilter(function (d) {
                return d.key[0] === 'Male';
            })
            .rightKeyFilter(function (d) {
                return d.key[0] === 'Female';
            })
            .transitionDuration(0);
    });

    describe('leftChart', function () {
        beforeEach(function () {
            chart.render();
        });

        describe('useRightYAxis', function () {
            it('should use right y axis', function () {
                expect(chart.leftChart().useRightYAxis()).toBe(true);
            });
        });

        describe('key filter', function () {
            it('can get key filter', function () {
                expect(typeof chart.leftKeyFilter()).toBe('function');
            });

            it('should filter data', function () {
                expect(chart.leftChart().data().length < dummyGroup.all().length).toBe(true);
            });
        });

        describe('margins', function () {
            it('should manually set margins', function () {
                var margins = chart.margins(),
                    leftMargins = chart.leftChart().margins();

                expect(leftMargins.top).toBe(margins.top);
                expect(leftMargins.right).toBe(0);
                expect(leftMargins.bottom).toBe(margins.bottom);
                expect(leftMargins.left).toBe(margins.left);
            });
        });

        describe('calculateAxisScaleData', function () {
            it('should equal the group data', function () {
                expect(chart.leftChart().calculateAxisScaleData().length).toBe(dummyGroup.all().length);
            });
        });
    });

    describe('rightChart', function () {
        beforeEach(function () {
            chart.render();
        });

        describe('useRightYAxis', function () {
            it('should not use right y axis', function () {
                expect(chart.rightChart().useRightYAxis()).toBe(false);
            });
        });

        describe('key filter', function () {
            it('can get key filter', function () {
                expect(typeof chart.rightKeyFilter()).toBe('function');
            });

            it('should filter data', function () {
                expect(chart.rightChart().data().length < dummyGroup.all().length).toBe(true);
            });
        });

        describe('margins', function () {
            it('should manually set margins', function () {
                var margins = chart.margins(),
                    rightMargins = chart.rightChart().margins();

                expect(rightMargins.top).toBe(margins.top);
                expect(rightMargins.right).toBe(margins.right);
                expect(rightMargins.bottom).toBe(margins.bottom);
                expect(rightMargins.left).toBe(0);
            });
        });

        describe('calculateAxisScaleData', function () {
            it('should equal the group data', function () {
                expect(chart.rightChart().calculateAxisScaleData().length).toBe(dummyGroup.all().length);
            });
        });
    });
});
