describe('dc.filters', function () {
    describe('RangedFilter', function () {
        var filter;
        beforeEach(function () {
            filter = dc.filters.RangedFilter(0, 10);
        });

        it('should act like an array', function () {
            expect([filter[0], filter[1]]).toEqual([0, 10]);
        });

        describe("isFiltered", function () {
            it('should return false when the number is out of range', function () {
                expect(filter.isFiltered(1234)).toBeFalsy();
            });

            it('should return true when the number is in range', function () {
                expect(filter.isFiltered(8.1)).toBeTruthy();
            });

            it('should include the left bounds', function () {
                expect(filter.isFiltered(0)).toBeTruthy();
            });

            it('should exclude the right bounds', function () {
                expect(filter.isFiltered(10)).toBeFalsy();
            });
        });
    });

    describe('TwoDimensionalFilter', function () {
        var filter;
        beforeEach(function () {
            filter = dc.filters.TwoDimensionalFilter([1,2]);
        });

        describe('isFiltered', function () {
            it('should return true if both dimensions are equal', function () {
                expect(filter.isFiltered([1,2])).toBeTruthy();
            });

            it('should return false if either dimension is not equal to the filter', function () {
                expect(filter.isFiltered([1,5])).toBeFalsy();
            });

            it('should return false if the dimensionality is less', function () {
                expect(filter.isFiltered([1])).toBeFalsy();
            });

            it('should return false if the dimensionality is more', function () {
                expect(filter.isFiltered([1,2,3])).toBeFalsy();
            });

            it('should return false if the value is not an array', function () {
                expect(filter.isFiltered(1)).toBeFalsy();
            });
        });
    });
});
