/* global loadDateFixture */
describe('dc.capMixin', function () {
    var data, dimension, group;
    var mixin, total;

    beforeEach(function () {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(function (d) { return +d.value; });
        group = dimension.group().reduceSum(function (d) {return Math.abs(+d.nvalue);});
        total = d3.sum(group.all().map(dc.pluck('value')));

        mixin = dc.capMixin(dc.baseMixin({}));

        mixin.dimension(dimension)
            .group(group);
    });

    describe('with no capping and default ordering', function () {
        it('should include everything', function () {
            expect(mixin.data().length).toBe(5);
        });
        it('should be in descending value order', function () {
            expect(mixin.data().map(dc.pluck('value'))).toEqual([12, 9, 8, 4, 2]);
        });
        it('should sum to total', function () {
            expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
        });
    });

    describe('with no capping and descending key ordering', function () {
        beforeEach(function () {
            mixin.ordering(function (kv) { return -kv.key; });
        });
        it('should include everything', function () {
            expect(mixin.data().length).toBe(5);
        });
        it('should be in reverse key order', function () {
            expect(mixin.data().map(dc.pluck('key'))).toEqual([66, 55, 44, 33, 22]);
        });
    });

    describe('with descending value ordering', function () {
        beforeEach(function () {
            mixin.ordering(function (kv) { return -kv.value; });
        });
        describe('and no capping', function () {
            it('should include everything', function () {
                expect(mixin.data().length).toBe(5);
            });
            it('should be in reverse key order', function () {
                expect(mixin.data().map(dc.pluck('key'))).toEqual([22, 44, 55, 66, 33]);
            });
            it('should sum to total', function () {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });
        });
        describe('and cap(3)', function () {
            beforeEach(function () {
                mixin.cap(3);
            });
            it('should have 3 front elements plus others element', function () {
                expect(mixin.data().length).toBe(4);
                expect(mixin.data().map(dc.pluck('key'))).toEqual([22, 44, 55, 'Others']);
            });
            it('should sum to total', function () {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });

            describe('and taking from back', function () {
                beforeEach(function () {
                    mixin.takeFront(false);
                });
                it('should have 3 back elements plus others element', function () {
                    expect(mixin.data().length).toBe(4);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([55, 66, 33, 'Others']);
                });
                it('should sum to total', function () {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
                });
            });

            describe('and no othersGrouper', function () {
                beforeEach(function () {
                    mixin.othersGrouper(null);
                });
                it('should have 3 front elements', function () {
                    expect(mixin.data().length).toBe(3);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([22, 44, 55]);
                });
                it('should sum to correct number', function () {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(29);
                });
            });
        });
    });

    describe('with ascending value ordering', function () {
        beforeEach(function () {
            mixin.ordering(function (kv) { return kv.value; });
        });
        describe('and no capping', function () {
            it('should include everything', function () {
                expect(mixin.data().length).toBe(5);
            });
            it('should be in reverse key order', function () {
                expect(mixin.data().map(dc.pluck('key'))).toEqual([33, 66, 55, 44, 22]);
            });
            it('should sum to total', function () {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });
        });
        describe('and cap(3)', function () {
            beforeEach(function () {
                mixin.cap(3);
            });
            it('should have 3 front elements plus others element', function () {
                expect(mixin.data().length).toBe(4);
                expect(mixin.data().map(dc.pluck('key'))).toEqual([33, 66, 55, 'Others']);
            });
            it('should sum to total', function () {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });

            describe('and taking from back', function () {
                beforeEach(function () {
                    mixin.takeFront(false);
                });
                it('should have 3 back elements plus others element', function () {
                    expect(mixin.data().length).toBe(4);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([55, 44, 22, 'Others']);
                });
                it('should sum to total', function () {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
                });
            });

            describe('and no othersGrouper', function () {
                beforeEach(function () {
                    mixin.othersGrouper(null);
                });
                it('should have 3 front elements', function () {
                    expect(mixin.data().length).toBe(3);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([33, 66, 55]);
                });
                it('should sum to correct number', function () {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(14);
                });
            });
        });
    });
});

