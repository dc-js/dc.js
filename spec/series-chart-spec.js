/* global appendChartID */
describe('dc.seriesChart', () => {

    let chart;
    const colorRows = [
        {colData: 1, rowData: 1, colorData: 1},
        {colData: 1, rowData: 2, colorData: 2},
        {colData: 2, rowData: 1, colorData: 3},
        {colData: 2, rowData: 2, colorData: 4}
    ];
    let colorData;

    beforeEach(() => {
        colorData = crossfilter(colorRows);
        const dimensionColorData = colorData.dimension(d => [+d.colData, +d.rowData]);
        const groupColorData = dimensionColorData.group().reduceSum(d => +d.colorData);

        const id = 'series-chart';
        appendChartID(id);
        chart = new dc.SeriesChart(`#${id}`);

        chart
            .width(210)
            .height(210)
            .x(d3.scaleLinear().domain([1,2]))
            .dimension(dimensionColorData)
            .group(groupColorData)
            .ordinalColors(['#000001', '#000002'])
            .seriesAccessor(d => +d.key[0])
            .keyAccessor(d => +d.key[1])
            .valueAccessor(d => +d.value )
            .childOptions({renderArea: true, dashStyle: [3, 1, 1]})
            .transitionDuration(0);
    });

    describe('#render', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should create the svg', () => {
            expect(chart.svg()).not.toBeNull();
        });

        it('should not allow calling compose', () => {
            expect(chart.compose).toThrowError();
        });

        it('should position generated lineCharts using the data', () => {
            const lines = chart.selectAll('path.line');

            expect(d3.select(lines.nodes()[0]).attr('d')).toMatchPath('M0,128L130,85');
            expect(d3.select(lines.nodes()[1]).attr('d')).toMatchPath('M0,43L130,0');
        });

        it('should color lines using the colors in the data', () => {
            const lines = chart.selectAll('path.line');

            expect(d3.select(lines.nodes()[0]).attr('stroke')).toMatch(/#000001/i);
            expect(d3.select(lines.nodes()[1]).attr('stroke')).toMatch(/#000002/i);
        });

        describe('with brush off', () => {
            it('should create line chart dots', () => {
                chart.brushOn(false).render();
                const dots = chart.selectAll('circle.dot');
                expect(dots.nodes().length).toEqual(4);
                chart.brushOn(true);
            });
        });
    });

    describe('series sorting', () => {
        beforeEach(() => {
            chart
                .seriesSort(d3.descending)
                .render();
        });

        it('should order lineCharts in the order specified', () => {
            const lines = chart.selectAll('path.line');

            expect(d3.select(lines.nodes()[1]).attr('d')).toMatchPath('M0,128L130,85');
            expect(d3.select(lines.nodes()[0]).attr('d')).toMatchPath('M0,43L130,0');
        });
    });

    describe('chart options', () => {
        beforeEach(() => {
            chart.render();
        });

        it('should apply options to all lines in the chart', () => {
            const lines = chart.selectAll('path.line');
            const areas = chart.selectAll('path.area');

            expect(d3.select(lines.nodes()[0]).attr('stroke-dasharray')).toEqualIntOrPixelList('3,1,1');
            expect(d3.select(lines.nodes()[1]).attr('stroke-dasharray')).toEqualIntOrPixelList('3,1,1');

            expect(d3.select(areas.nodes()[0]).attr('fill')).toMatch(/#000001/i);
            expect(d3.select(areas.nodes()[1]).attr('fill')).toMatch(/#000002/i);
        });
    });

    describe('#redraw', () => {
        const colorRows2 = [
            {colData: 1, rowData: 1, colorData: 1},
            {colData: 1, rowData: 2, colorData: 2},
            {colData: 2, rowData: 1, colorData: 3},
            {colData: 2, rowData: 2, colorData: 4},
            {colData: 3, rowData: 1, colorData: 5},
            {colData: 3, rowData: 2, colorData: 6}
        ];
        let colorData2;
        beforeEach(() => {
            colorData2 = crossfilter(colorRows2);
            chart.brushOn(false);
            chart.render();

            const dimensionData = colorData2.dimension(d => [+d.colData, +d.rowData]);
            const groupData = dimensionData.group().reduceSum(d => +d.colorData);

            chart.dimension(dimensionData).group(groupData);

            chart.redraw();
        });

        afterEach(() => {
            chart.brushOn(true);
        });

        it('is redrawn with dots', () => {
            const dots = chart.selectAll('circle.dot');
            expect(dots.nodes().length).toEqual(6);
        });
    });
});
