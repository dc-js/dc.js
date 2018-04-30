/* global loadDateFixture, compareVersions */
describe('dc.colorMixin', function () {
    function colorTest (chart, domain, test) {
        chart.colorDomain(domain);
        return (test || domain).map(chart.getColor);
    }

    function identity (d) { return d; }

    describe('deprecation', function () {
        it('issues a one time warning when using default color scheme', function () {
            spyOn(dc.logger, 'warnOnce');

            dc.colorMixin({});

            expect(dc.logger.warnOnce).toHaveBeenCalled();
        });

        it('does not issue a warning when default color scheme has been changed', function () {
            var origColors = dc.config.defaultColors();

            spyOn(dc.logger, 'warnOnce');

            dc.config.defaultColors(d3.schemeSet1);
            dc.colorMixin({});

            expect(dc.logger.warnOnce).not.toHaveBeenCalled();

            // Restore original colors
            dc.config.defaultColors(origColors);
        });
    });

    describe('with ordinal domain' , function () {
        var chart, domain;

        beforeEach(function () {
            chart = dc.colorMixin({});
            chart.colorAccessor(identity);
            domain = ['a','b','c','d','e'];
        });

        it('default', function () {
            expect(colorTest(chart, domain))
                .toMatchColors(dc.config.defaultColors().slice(0, 5));
        });

        it('custom', function () {
            chart.colors(d3.scaleOrdinal(d3.schemeCategory10));
            expect(colorTest(chart, domain)).toMatchColors(['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd']);
        });

        it('ordinal', function () {
            chart.ordinalColors(['red','green','blue']);
            expect(colorTest(chart, domain)).toMatchColors(['red','green','blue','red','green']);
        });

        it('linear', function () {
            // GIGO: mapping ordinal domain to linear scale is nonsensical
            // actually it gets scaled to NaN and then d3 corrects it
            chart.linearColors(['#ff0000','#00ff00']);
            expect(colorTest(chart, domain)).toMatchColors(['#000000', '#000000', '#000000', '#000000', '#000000']);
        });
    });
    describe('with numeric domain' , function () {
        // These tests try to validate an interesting case. In an Ordinal scale if we try to map a key
        // that is not there, it is added to the domain.
        // Please see https://github.com/d3/d3-scale/blob/master/README.md#_ordinal
        // Linear scales work differently.
        var chart, domain, test, expectedColorIndices;

        beforeEach(function () {
            chart = dc.colorChart({});
            chart.colorAccessor(identity);
            domain = [1, 100];
            // It has items that are not part of the domain.
            // domain would get modified when all these values are mapped
            test = [0, 1, 50, 100, 101, 1];

            // Expected color indices corresponding to test values based on the final domain
            expectedColorIndices = [2, 0, 3, 1, 4, 0];
        });

        it('updates the domain corresponding to unknown values', function () {
            colorTest(chart, domain, test);
            expect(chart.colors().domain()).toEqual([1, 100, 0, 50, 101]);
        });

        it('default', function () {
            var expected = expectedColorIndices.map(function (c) {
                return dc.config.defaultColors()[c];
            });
            expect(colorTest(chart, domain, test)).toMatchColors(expected);
        });

        it('custom', function () {
            chart.colors(d3.scaleOrdinal(d3.schemeCategory10));
            var expected = expectedColorIndices.map(function (c) {
                return d3.schemeCategory10[c];
            });
            expect(colorTest(chart, domain, test)).toMatchColors(expected);
        });

        it('ordinal', function () {
            chart.ordinalColors(['red','green','blue']);
            // If there are lesser number of colors in range than the number of domain items, it starts reusing
            expect(colorTest(chart, domain, test)).toMatchColors(['blue', 'red', 'red', 'green', 'green', 'red']);
        });

        it('linear', function () {
            // interpolateHcl (note the adjustment for one changed value for d3 5.1)
            chart.linearColors(['#4575b4','#ffffbf']);

            var changedInD3v51 = 'rgb(88, 198, 186)';
            // https://github.com/omichelsen/compare-versions
            if (compareVersions(d3.version, '5.1') === -1) {
                // d3 is older than v5.1
                changedInD3v51 = 'rgb(77, 198, 193)';
            }

            expect(colorTest(chart, domain, test))
                .toMatchColors(['#4773b3', '#4575b4', changedInD3v51, '#ffffbf', '#ffffc0', '#4575b4']);
        });
    });
    describe('calculateColorDomain' , function () {
        var chart;

        beforeEach(function () {
            var data = crossfilter(loadDateFixture());
            var valueDimension = data.dimension(function (d) {
                return d.value;
            });
            var valueGroup = valueDimension.group();
            chart = dc.colorChart(dc.baseChart({}))
                .colorAccessor(function (d) {return d.value;})
                .group(valueGroup);
        });

        it('check domain', function () {
            chart.calculateColorDomain();
            expect(chart.colorDomain()).toEqual([1,3]);
        });
    });
});

