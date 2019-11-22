/* global loadDateFixture, compareVersions */
describe('dc.colorMixin', () => {
    function colorTest (chart, domain, test) {
        chart.colorDomain(domain);
        return (test || domain).map(chart.getColor);
    }

    function identity (d) { return d; }

    const ColorMixinTester = dc.ColorMixin(dc.BaseMixin);

    describe('deprecation', () => {
        it('issues a one time warning when using default color scheme', () => {
            spyOn(dc.logger, 'warnOnce');

            new ColorMixinTester(); // eslint-disable-line no-new

            expect(dc.logger.warnOnce).toHaveBeenCalled();
        });

        it('does not issue a warning when default color scheme has been changed', () => {
            const origColors = dc.config.defaultColors();

            spyOn(dc.logger, 'warnOnce');

            dc.config.defaultColors(d3.schemeSet1);
            new ColorMixinTester(); // eslint-disable-line no-new

            expect(dc.logger.warnOnce).not.toHaveBeenCalled();

            // Restore original colors
            dc.config.defaultColors(origColors);
        });
    });

    describe('with ordinal domain' , () => {
        let chart, domain;

        beforeEach(() => {
            chart = new ColorMixinTester();
            chart.colorAccessor(identity);
            domain = ['a','b','c','d','e'];
        });

        it('default', () => {
            expect(colorTest(chart, domain))
                .toMatchColors(dc.config.defaultColors().slice(0, 5));
        });

        it('custom', () => {
            chart.colors(d3.scaleOrdinal(d3.schemeCategory10));
            expect(colorTest(chart, domain)).toMatchColors(['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd']);
        });

        it('ordinal', () => {
            chart.ordinalColors(['red','green','blue']);
            expect(colorTest(chart, domain)).toMatchColors(['red','green','blue','red','green']);
        });

        it('linear', () => {
            // GIGO: mapping ordinal domain to linear scale is nonsensical
            // d3 pre-5.8: scaled to NaN and corrected to black; 5.8+: scale returns undefined
            chart.linearColors(['#ff0000','#00ff00']);
            if (compareVersions(d3.version, '5.8') === -1) {
                expect(colorTest(chart, domain)).toMatchColors(['#000000', '#000000', '#000000', '#000000', '#000000']);
            } else {
                expect(colorTest(chart, domain)).toEqual([undefined, undefined, undefined, undefined, undefined]);
            }
        });
    });
    describe('with numeric domain' , () => {
        // These tests try to validate an interesting case. In an Ordinal scale if we try to map a key
        // that is not there, it is added to the domain.
        // Please see https://github.com/d3/d3-scale/blob/master/README.md#_ordinal
        // Linear scales work differently.
        let chart, domain, test, expectedColorIndices;

        beforeEach(() => {
            chart = new ColorMixinTester();
            chart.colorAccessor(identity);
            domain = [1, 100];
            // It has items that are not part of the domain.
            // domain would get modified when all these values are mapped
            test = [0, 1, 50, 100, 101, 1];

            // Expected color indices corresponding to test values based on the final domain
            expectedColorIndices = [2, 0, 3, 1, 4, 0];
        });

        it('updates the domain corresponding to unknown values', () => {
            colorTest(chart, domain, test);
            expect(chart.colors().domain()).toEqual([1, 100, 0, 50, 101]);
        });

        it('default', () => {
            const expected = expectedColorIndices.map(c => dc.config.defaultColors()[c]);
            expect(colorTest(chart, domain, test)).toMatchColors(expected);
        });

        it('custom', () => {
            chart.colors(d3.scaleOrdinal(d3.schemeCategory10));
            const expected = expectedColorIndices.map(c => d3.schemeCategory10[c]);
            expect(colorTest(chart, domain, test)).toMatchColors(expected);
        });

        it('ordinal', () => {
            chart.ordinalColors(['red','green','blue']);
            // If there are lesser number of colors in range than the number of domain items, it starts reusing
            expect(colorTest(chart, domain, test)).toMatchColors(['blue', 'red', 'red', 'green', 'green', 'red']);
        });

        it('linear', () => {
            // interpolateHcl (note the adjustment for one changed value for d3 5.1)
            chart.linearColors(['#4575b4','#ffffbf']);

            let changedInD3v51 = 'rgb(88, 198, 186)';
            // https://github.com/omichelsen/compare-versions
            if (compareVersions(d3.version, '5.1') === -1) {
                // d3 is older than v5.1
                changedInD3v51 = 'rgb(77, 198, 193)';
            }

            expect(colorTest(chart, domain, test))
                .toMatchColors(['#4773b3', '#4575b4', changedInD3v51, '#ffffbf', '#ffffc0', '#4575b4']);
        });
    });
    describe('calculateColorDomain' , () => {
        let chart;

        beforeEach(() => {
            const data = crossfilter(loadDateFixture());
            const valueDimension = data.dimension(d => d.value);
            const valueGroup = valueDimension.group();
            chart = new ColorMixinTester()
                .colorAccessor(d => d.value)
                .group(valueGroup);
        });

        it('check domain', () => {
            chart.calculateColorDomain();
            expect(chart.colorDomain()).toEqual([1,3]);
        });
    });
});

