/* global makeDate */
describe('dc utils', () => {
    describe('dc.printer.filters', () => {
        let printer;
        beforeEach(() => {
            printer = dc.printers.filters;
        });
        it('print simple string', () => {
            expect(printer(['a'])).toEqual('a');
        });
        it('print range', () => {
            expect(printer([[10, 30]])).toEqual('[10 -> 30]');
        });
        it('print simple string and a range', () => {
            expect(printer(['a', [10, 30]])).toEqual('a, [10 -> 30]');
        });
    });

    describe('dc.printer.filter', () => {
        let printer;
        beforeEach(() => {
            printer = dc.printers.filter;
            dc.config.dateFormat = d3.utcFormat('%m/%d/%Y');
        });
        it('print simple string', () => {
            expect(printer('a')).toEqual('a');
        });
        it('print date string', () => {
            expect(printer(makeDate(2012, 1, 1))).toEqual('02/01/2012');
        });
        it('print int range', () => {
            expect(printer([10, 30])).toEqual('[10 -> 30]');
        });
        it('print float range', () => {
            expect(printer([10.124244, 30.635623])).toEqual('[10.12 -> 30.64]');
        });
        it('print date range', () => {
            expect(printer([makeDate(2012, 1, 1), makeDate(2012, 1, 15)])).toEqual('[02/01/2012 -> 02/15/2012]');
        });
        it('print single element array', () => {
            expect(printer([makeDate(2012, 1, 1)])).toEqual('02/01/2012');
        });
        it('print null', () => {
            expect(printer(null)).toEqual('');
        });
        it('print zero', () => {
            expect(printer(0)).toEqual(0);
        });
        it('print a multi-element array', () => {
            expect(printer(['this', 'that', 'and', 'the', 'other'])).toEqual('[this -> that -> and -> the -> other]');
        });
    });

    describe('dc.utils.nameToId', () => {
        it('id should be escaped properly', () => {
            expect(dc.utils.nameToId('St. John\'s')).toEqual('st_johns');
        });
    });

    describe('dc.utils.add', () => {
        let add;
        beforeEach(() => {
            add = dc.utils.add;
        });
        it('should be able to add days', () => {
            const date = add(makeDate(2012, 0, 1), 10);
            expect(date.toString()).toEqual((makeDate(2012, 0, 11)).toString());
        });
        it('should be able to add numbers', () => {
            const num = add(10, 10);
            expect(num).toEqual(20);
        });
        it('should be able to add numbers w/ %', () => {
            const num = add(10, '10%');
            expect(num).toEqual(11);
        });
        it('should be able to add negative numbers w/ %', () => {
            const num = add(-10, '10%');
            expect(num).toEqual(-9);
        });
        it('should ignore % when adding dates', () => {
            const date = add(makeDate(2012, 0, 1), '10%');
            expect(date.toString()).toEqual(makeDate(2012, 0, 11).toString());
        });
        it('should be able to add hours to dates', () => {
            const date = add(makeDate(2012, 0, 1), '24', 'hour');
            expect(date.toString()).toEqual(makeDate(2012, 0, 2).toString());
        });
        it('should be able to add weeks to dates', () => {
            const date = add(makeDate(2012, 0, 1), '1', 'week');
            expect(date.toString()).toEqual(makeDate(2012, 0, 8).toString());
        });
        it('should be able to add month to dates', () => {
            const date = add(makeDate(2012, 0, 1), '1', 'month');
            expect(date.toString()).toEqual(makeDate(2012, 1, 1).toString());
        });
    });
    describe('dc.utils.subtract', () => {
        let subtract;
        beforeEach(() => {
            subtract = dc.utils.subtract;
        });
        it('should be able to subtract dates', () => {
            const date = subtract(makeDate(2012, 0, 11), 10);
            expect(date.toString()).toEqual((makeDate(2012, 0, 1)).toString());
        });
        it('should be able to subtract numbers', () => {
            const num = subtract(10, 10);
            expect(num).toEqual(0);
        });
        it('should be able to subtract numbers w/ %', () => {
            const num = subtract(10, '10%');
            expect(num).toEqual(9);
        });
        it('should be able to subtract negative numbers w/ %', () => {
            const num = subtract(-10, '10%');
            expect(num).toEqual(-11);
        });
        it('should ignore % when subtracting dates', () => {
            const date = subtract(makeDate(2012, 0, 11), '10%');
            expect(date.toString()).toEqual(makeDate(2012, 0, 1).toString());
        });
        it('should be able to subtract hours from dates', () => {
            const date = subtract(makeDate(2012, 0, 2), '24', 'hour');
            expect(date.toString()).toEqual(makeDate(2012, 0, 1).toString());
        });
        it('should be able to subtract week from dates', () => {
            const date = subtract(makeDate(2012, 0, 8), '1', 'week');
            expect(date.toString()).toEqual(makeDate(2012, 0, 1).toString());
        });
        it('should be able to subtract month from dates', () => {
            const date = subtract(makeDate(2012, 1, 1), '1', 'month');
            expect(date.toString()).toEqual(makeDate(2012, 0, 1).toString());
        });
    });
    describe('dc.utils.arraysEqual', () => {
        it('nulls should be equal', () => {
            const a1 = null;
            const a2 = null;
            expect(dc.utils.arraysEqual(a1, a2)).toBe(true);
        });
        it('null and undefined should be equal', () => {
            const a1 = null;
            let a2; // undefined
            expect(dc.utils.arraysEqual(a1, a2)).toBe(true);
        });
        it('null should not be equal to any array', () => {
            const a1 = null;
            const a2 = [];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(false);
        });
        it('any array should not be equal to null', () => {
            const a1 = null;
            const a2 = [];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(false);
        });
        it('empty arrays should be', () => {
            const a1 = [];
            const a2 = [];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(true);
        });
        it('should identify equal arrays - numbers', () => {
            const a1 = [1, 2, 3];
            const a2 = [1, 2, 3];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(true);
        });
        it('should identify equal arrays - strings', () => {
            const a1 = ['apple', 'mangoes', 'oranges', 'bananas'];
            const a2 = ['apple', 'mangoes', 'oranges', 'bananas'];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(true);
        });
        it('should identify equal arrays - dates', () => {
            const a1 = [makeDate(2012, 1, 1), makeDate(2013, 10, 15)];
            const a2 = [makeDate(2012, 1, 1), makeDate(2013, 10, 15)];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(true);
        });
        it('should identify unequal arrays - numbers', () => {
            const a1 = [4, 2, 3];
            const a2 = [1, 2, 3];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(false);
        });
        it('should identify unequal arrays - strings', () => {
            const a1 = ['apple', 'cherries', 'oranges', 'bananas'];
            const a2 = ['apple', 'mangoes', 'oranges', 'bananas'];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(false);
        });
        it('should identify unequal arrays - dates', () => {
            const a1 = [makeDate(2012, 1, 1), makeDate(2013, 10, 15)];
            const a2 = [makeDate(2012, 1, 1), makeDate(2013, 10, 16)];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(false);
        });
        it('should identify equal arrays with one of the elements as 0', () => {
            const a1 = [0, 20];
            const a2 = [0, 20];
            expect(dc.utils.arraysEqual(a1, a2)).toBe(true);
        });
    });
});
