/* global appendChartID, makeDate */
describe('dc.filter-dates', () => {
    // do date filters work correctly?
    // adapted from a fiddle demonstrating the problem by Matt Traynham
    // see it fail with 1.7.1: http://jsfiddle.net/gordonwoodhull/Q2H9C/4/
    // see it win with 2.0: http://jsfiddle.net/gordonwoodhull/Q2H9C/3/
    // (Thanks!!)

    let dateDim1, dateDim2, group1, group2, row1, row2;
    const width = 400;
    const height = 200;
    const margins = {top: 15, right: 10, bottom: 20, left: 40};
    beforeEach(() => {
        // Months are 0 indexed...
        const start = makeDate(2013, 10, 1);
        const end = makeDate(2013, 11, 1);
        const stringLength = 2;

        // Generate Random Data [Date, VowelString, Random Number, Random Measure]
        const data = [];
        for (let i = 0; i < 2000; i++) {
            data[i] = [
                randomDate(start, end),
                randomVowelString(stringLength),
                Math.floor(Math.random() * 20),
                Math.floor(Math.random() * 30000)
            ];
        }

        const ndx = crossfilter(data);
        dateDim1 = ndx.dimension(d => d[0]);
        dateDim2 = ndx.dimension(d => d[0]);

        group1 = dateDim1.group().reduceSum(d => d[3]);
        group2 = dateDim2.group().reduceSum(d => d[3]);

        appendChartID(row1);
        appendChartID(row2);

        row1 = new dc.RowChart('row1')
            .width(width)
            .height(height)
            .margins(margins)
            .dimension(dateDim1)
            .group(group1)
            .gap(1)
            .render();

        row2 = new dc.RowChart('row2')
            .width(width)
            .height(height)
            .margins(margins)
            .dimension(dateDim2)
            .group(group2)
            .gap(1)
            .render();
    });

    it('filtering on 11/8 should keep only that row', () => {
        row1.filter(makeDate(2013, 10, 8));
        expect(group1.all()[6].value).not.toEqual(0);
        expect(group2.all()[6].value).toEqual(0);
        expect(group2.all()[7]).toEqual(group1.all()[7]);
        expect(group2.all()[8].value).toEqual(0);
    });

    it('filtering on 11/17 should keep only that row', () => {
        row1.filter(makeDate(2013, 10, 17));
        expect(group1.all()[15].value).not.toEqual(0);
        expect(group2.all()[15].value).toEqual(0);
        expect(group2.all()[16]).toEqual(group1.all()[16]);
        expect(group2.all()[17].value).toEqual(0);
    });

    // Create a Random Date
    function randomDate (start, end) {
        const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        d.setUTCHours(0, 0, 0, 0);
        return d;
    }

    // Create a Random String of vowels
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

    function randomVowelString (length) {
        let val = '';
        for (let i = 0; i < length; i++) {
            val = val + vowels[Math.floor(Math.random() * (vowels.length - 1))];
        }
        return val;
    }
});
