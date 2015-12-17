describe('dc.pairedRowChart', function() {
    var id, chart;
    var data, dimension, group, dummyGroup;

    beforeEach(function () {
        genderFixture = loadGenderFixture();
        data = crossfilter(genderFixture);
        dimension = data.dimension(function(d) {
            var age_range = 'Unknown';

            if (d.age <= 9) {
                age_range = '0 - 9';
            } else if (d.age <= 19) {
                age_range = '10 - 19';
            } else if (d.age <= 29) {
                age_range = '20 - 29';
            } else if (d.age <= 39) {
                age_range = '30 - 39';
            } else if (d.age <= 49) {
                age_range = '40 - 49';
            } else if (d.age <= 59) {
                age_range = '50 - 59';
            } else if (d.age <= 69) {
                age_range = '60 - 69';
            } else if (d.age <= 79) {
                age_range = '70 - 79';
            } else if (d.age <= 89) {
                age_range = '80 - 89';
            } else if (d.age <= 99) {
                age_range = '90 - 99';
            } else if (d.age >= 100) {
                age_range = '100+';
            }

            return [d.gender, age_range];
        }),
        group = dimension.group().reduceCount();

        dummyGroup = {
            all: function() {
                var ageRanges = ['0 - 9', '10 - 19', '20 - 29', '30 - 39', '40 - 49', '50 - 59', '60 - 69', '70 - 79', '80 - 89', '90 - 99', '100+'];

                // convert to object so we can easily tell if a key exists
                var values = {};
                group.all().forEach(function(d) {
                    values[d.key[0] + '.' + d.key[1]] = d.value;
                });

                // convert back into an array for the chart, making sure that all ageRanges exist
                var g = [];
                ageRanges.forEach(function(age_range) {
                    g.push({
                        key: ['Male', age_range],
                        value: values['Male.' + age_range] || 0
                    });
                    g.push({
                        key: ['Female', age_range],
                        value: values['Female.' + age_range] || 0
                    });
                });

                return g;
            }
        };

        id = 'paired-row-chart';
        appendChartID(id);

        chart = dc.pairedRowChart("#" + id);
        chart.dimension(dimension)
            .group(dummyGroup)
            .width(600).height(200).gap(10)
            .leftKeyFilter(function(d) {
              return d.key[0] === 'Male';
            })
            .rightKeyFilter(function(d) {
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

        describe('calculateAxisScaleData', function() {
            it('should equal the group data', function() {
                expect(chart.leftChart().calculateAxisScaleData().length).toBe(dummyGroup.all().length);
            })
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

        describe('calculateAxisScaleData', function() {
            it('should equal the group data', function() {
                expect(chart.rightChart().calculateAxisScaleData().length).toBe(dummyGroup.all().length);
            })
        });
    });
});
