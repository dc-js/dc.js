/* global loadDateFixture */
describe('dc.capMixin', () => {
    let data, dimension, group;
    let mixin, total;

    beforeEach(() => {
        data = crossfilter(loadDateFixture());
        dimension = data.dimension(d => +d.value);
        group = dimension.group().reduceSum(d => Math.abs(+d.nvalue));
        total = d3.sum(group.all().map(dc.pluck('value')));

        const CapMixinTester = dc.CapMixin(dc.BaseMixin);
        mixin = new CapMixinTester();

        mixin.dimension(dimension)
            .group(group);
    });

    describe('with no capping and default ordering', () => {
        it('should include everything', () => {
            expect(mixin.data().length).toBe(5);
        });
        it('should be in descending value order', () => {
            expect(mixin.data().map(dc.pluck('value'))).toEqual([12, 9, 8, 4, 2]);
        });
        it('should sum to total', () => {
            expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
        });
    });

    describe('with no capping and descending key ordering', () => {
        beforeEach(() => {
            mixin.ordering(kv => -kv.key);
        });
        it('should include everything', () => {
            expect(mixin.data().length).toBe(5);
        });
        it('should be in reverse key order', () => {
            expect(mixin.data().map(dc.pluck('key'))).toEqual([66, 55, 44, 33, 22]);
        });
    });

    describe('with descending value ordering', () => {
        beforeEach(() => {
            mixin.ordering(kv => -kv.value);
        });
        describe('and no capping', () => {
            it('should include everything', () => {
                expect(mixin.data().length).toBe(5);
            });
            it('should be in reverse key order', () => {
                expect(mixin.data().map(dc.pluck('key'))).toEqual([22, 44, 55, 66, 33]);
            });
            it('should sum to total', () => {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });
        });
        describe('and cap(3)', () => {
            beforeEach(() => {
                mixin.cap(3);
            });
            it('should have 3 front elements plus others element', () => {
                expect(mixin.data().length).toBe(4);
                expect(mixin.data().map(dc.pluck('key'))).toEqual([22, 44, 55, 'Others']);
            });
            it('should sum to total', () => {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });

            describe('and taking from back', () => {
                beforeEach(() => {
                    mixin.takeFront(false);
                });
                it('should have 3 back elements plus others element', () => {
                    expect(mixin.data().length).toBe(4);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([55, 66, 33, 'Others']);
                });
                it('should sum to total', () => {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
                });
            });

            describe('and no othersGrouper', () => {
                beforeEach(() => {
                    mixin.othersGrouper(null);
                });
                it('should have 3 front elements', () => {
                    expect(mixin.data().length).toBe(3);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([22, 44, 55]);
                });
                it('should sum to correct number', () => {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(29);
                });
            });
        });
    });

    describe('with ascending value ordering', () => {
        beforeEach(() => {
            mixin.ordering(kv => kv.value);
        });
        describe('and no capping', () => {
            it('should include everything', () => {
                expect(mixin.data().length).toBe(5);
            });
            it('should be in reverse key order', () => {
                expect(mixin.data().map(dc.pluck('key'))).toEqual([33, 66, 55, 44, 22]);
            });
            it('should sum to total', () => {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });
        });
        describe('and cap(3)', () => {
            beforeEach(() => {
                mixin.cap(3);
            });
            it('should have 3 front elements plus others element', () => {
                expect(mixin.data().length).toBe(4);
                expect(mixin.data().map(dc.pluck('key'))).toEqual([33, 66, 55, 'Others']);
            });
            it('should sum to total', () => {
                expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
            });

            describe('and taking from back', () => {
                beforeEach(() => {
                    mixin.takeFront(false);
                });
                it('should have 3 back elements plus others element', () => {
                    expect(mixin.data().length).toBe(4);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([55, 44, 22, 'Others']);
                });
                it('should sum to total', () => {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(total);
                });
            });

            describe('and no othersGrouper', () => {
                beforeEach(() => {
                    mixin.othersGrouper(null);
                });
                it('should have 3 front elements', () => {
                    expect(mixin.data().length).toBe(3);
                    expect(mixin.data().map(dc.pluck('key'))).toEqual([33, 66, 55]);
                });
                it('should sum to correct number', () => {
                    expect(d3.sum(mixin.data().map(dc.pluck('value')))).toEqual(14);
                });
            });
        });
    });
});

