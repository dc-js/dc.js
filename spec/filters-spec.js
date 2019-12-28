/* global makeDate */

describe('dc.filters', () => {
    describe('RangedFilter', () => {
        let filter;
        beforeEach(() => {
            filter = dc.filters.RangedFilter(0, 10);
        });

        it('should act like an array', () => {
            expect([filter[0], filter[1]]).toEqual([0, 10]);
        });

        describe('isFiltered', () => {
            it('should return false when the number is out of range', () => {
                expect(filter.isFiltered(1234)).toBeFalsy();
            });

            it('should return true when the number is in range', () => {
                expect(filter.isFiltered(8.1)).toBeTruthy();
            });

            it('should include the left bounds', () => {
                expect(filter.isFiltered(0)).toBeTruthy();
            });

            it('should exclude the right bounds', () => {
                expect(filter.isFiltered(10)).toBeFalsy();
            });
        });
    });

    describe('RangedFilter with Dates', () => {
        let filter;
        beforeEach(() => {
            filter = dc.filters.RangedFilter(makeDate(2015, 7, 1), makeDate(2015, 8, 20));
        });

        describe('isFiltered', () => {
            it('should return false when the date is out of range', () => {
                expect(filter.isFiltered(makeDate(2015, 10, 1))).toBeFalsy();
            });

            it('should return true when the date is in range', () => {
                expect(filter.isFiltered(makeDate(2015, 8, 1))).toBeTruthy();
            });

            it('should include the left bounds', () => {
                expect(filter.isFiltered(makeDate(2015, 7, 1))).toBeTruthy();
            });

            it('should exclude the right bounds', () => {
                expect(filter.isFiltered(makeDate(2015, 8, 20))).toBeFalsy();
            });
        });
    });

    describe('TwoDimensionalFilter', () => {
        let filter;
        beforeEach(() => {
            filter = dc.filters.TwoDimensionalFilter([1,2]);
        });

        describe('isFiltered', () => {
            it('should return true if both dimensions are equal', () => {
                expect(filter.isFiltered([1,2])).toBeTruthy();
            });

            it('should return false if either dimension is not equal to the filter', () => {
                expect(filter.isFiltered([1,5])).toBeFalsy();
            });

            it('should return false if the dimensionality is less', () => {
                expect(filter.isFiltered([1])).toBeFalsy();
            });

            it('should return false if the dimensionality is more', () => {
                expect(filter.isFiltered([1,2,3])).toBeFalsy();
            });

            it('should return false if the value is not an array', () => {
                expect(filter.isFiltered(1)).toBeFalsy();
            });
        });
    });

    describe('RangedTwoDimensionalFilter', () => {
        let filter;

        it('should return null if filtered with null', () => {
            expect(dc.filters.RangedTwoDimensionalFilter(null)).toBe(null);
        });

        describe('two-dimensional filtering', () => {
            beforeEach(() => {
                filter = dc.filters.RangedTwoDimensionalFilter([[0, 1],[10, 20]]);
            });

            it('should return true if on bottom left of filter rectangle', () => {
                expect(filter.isFiltered([0,1])).toBeTruthy();
            });

            it('should return false if on bottom right of filter rectangle', () => {
                expect(filter.isFiltered([10,1])).toBeFalsy();
            });

            it('should return false for the top left of filter rectangle', () => {
                expect(filter.isFiltered([0,20])).toBeFalsy();
            });

            it('should return false for the top right of filter rectangle', () => {
                expect(filter.isFiltered([10,20])).toBeFalsy();
            });

            it('should return true for a point inside the filter rectangle', () => {
                expect(filter.isFiltered([5,5])).toBeTruthy();
            });

            it('should return false for a point to the right and above the filter rectangle', () => {
                expect(filter.isFiltered([11,21])).toBeFalsy();
            });

            it('should return false for a point to the left and below the filter rectangle', () => {
                expect(filter.isFiltered([-1,-1])).toBeFalsy();
            });

            describe('when a single value is considered', () => {
                it('should filter that value using only x coordinates', () => {
                    expect(filter.isFiltered(5)).toBeTruthy();
                    expect(filter.isFiltered(0)).toBeTruthy();
                    expect(filter.isFiltered(10)).toBeFalsy();
                });
            });
        });

        describe('one-dimensional filtering', () => {
            beforeEach(() => {
                filter = dc.filters.RangedTwoDimensionalFilter([10, 20]);
            });

            it('should return true while inside the range', () => {
                expect(filter.isFiltered([15,10])).toBeTruthy();
            });

            it('should return false while to the left of the range', () => {
                expect(filter.isFiltered([5,10])).toBeFalsy();
            });

            it('should return true while on the left edge of the range', () => {
                expect(filter.isFiltered([10,10])).toBeTruthy();
            });

            it('should return false while on the right edge of the range', () => {
                expect(filter.isFiltered([20,10])).toBeFalsy();
            });

            describe('when a single value is considered', () => {
                it('should filter that value using only x coordinates', () => {
                    expect(filter.isFiltered(10)).toBeTruthy();
                    expect(filter.isFiltered(15)).toBeTruthy();
                    expect(filter.isFiltered(20)).toBeFalsy();
                });
            });
        });

    });

    describe('RangedTwoDimensionalFilter with Dates', () => {
        let filter;

        describe('two-dimensional filtering', () => {
            beforeEach(() => {
                filter = dc.filters.RangedTwoDimensionalFilter([[makeDate(2014, 5, 1), 1],[makeDate(2014, 5, 20), 20]]);
            });

            it('should return true if on bottom left of filter rectangle', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 1), 1])).toBeTruthy();
            });

            it('should return false if on bottom right of filter rectangle', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 20), 1])).toBeFalsy();
            });

            it('should return false for the top left of filter rectangle', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 1), 20])).toBeFalsy();
            });

            it('should return false for the top right of filter rectangle', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 20), 20])).toBeFalsy();
            });

            it('should return true for a point inside the filter rectangle', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 12), 5])).toBeTruthy();
            });

            it('should return false for a point to the right and above the filter rectangle', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 21), 21])).toBeFalsy();
            });

            it('should return false for a point to the left and below the filter rectangle', () => {
                expect(filter.isFiltered([makeDate(2014, 4, 30), -1])).toBeFalsy();
            });

            describe('when a single value is considered', () => {
                it('should filter that value using only x coordinates', () => {
                    expect(filter.isFiltered(makeDate(2014, 5, 10))).toBeTruthy();
                    expect(filter.isFiltered(makeDate(2014, 5, 1))).toBeTruthy();
                    expect(filter.isFiltered(makeDate(2014, 5, 20))).toBeFalsy();
                });
            });
        });

        describe('one-dimensional filtering', () => {
            beforeEach(() => {
                filter = dc.filters.RangedTwoDimensionalFilter([makeDate(2014, 5, 1), makeDate(2014, 5, 20), 20]);
            });

            it('should return true while inside the range', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 15),10])).toBeTruthy();
            });

            it('should return false while to the left of the range', () => {
                expect(filter.isFiltered([makeDate(2014, 4, 30),10])).toBeFalsy();
            });

            it('should return true while on the left edge of the range', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 1),10])).toBeTruthy();
            });

            it('should return false while on the right edge of the range', () => {
                expect(filter.isFiltered([makeDate(2014, 5, 20),10])).toBeFalsy();
            });

            describe('when a single value is considered', () => {
                it('should filter that value using only x coordinates', () => {
                    expect(filter.isFiltered(makeDate(2014, 5, 10))).toBeTruthy();
                    expect(filter.isFiltered(makeDate(2014, 5, 1))).toBeTruthy();
                    expect(filter.isFiltered(makeDate(2014, 5, 20))).toBeFalsy();
                });
            });
        });

    });
});
