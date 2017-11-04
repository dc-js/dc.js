import * as d3 from 'd3';

// https://github.com/d3/d3-plugins/blob/master/box/box.js
(function () {
    // Inspired by http://informationandvisualization.de/blog/box-plot
    d3.box = function () {
        const delay = 0;
        let width = 1,
            height = 1,
            duration = 0,
            domain = null,
            value = Number,
            whiskers = boxWhiskers,
            quartiles = boxQuartiles,
            tickFormat = null;

        // For each small multiple…
        function box (graph) {
            graph.each(function (data, index) {
                data = data.map(value).sort(d3.ascending);
                const g = d3.select(this),
                    n = data.length,
                    min = data[0],
                    max = data[n - 1];

                // Compute quartiles. Must return exactly 3 elements.
                data.quartiles = quartiles(data);
                const quartileData = data.quartiles;

                // Compute whiskers. Must return exactly 2 elements, or null.
                const whiskerIndices = whiskers && whiskers.call(this, data, index),
                    whiskerData = whiskerIndices && whiskerIndices.map(i => data[i]);

                // Compute outliers. If no whiskers are specified, all data are 'outliers'.
                // We compute the outliers as indices, so that we can join across transitions!
                const outlierIndices = whiskerIndices ?
                    d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n)) : d3.range(n);

                // Compute the new x-scale.
                const x1 = d3.scale.linear()
                    .domain(domain && domain.call(this, data, index) || [min, max])
                    .range([height, 0]);

                // Retrieve the old x-scale, if this is an update.
                const x0 = this.__chart__ || d3.scale.linear()
                    .domain([0, Infinity])
                    .range(x1.range());

                // Stash the new scale.
                this.__chart__ = x1;

                // Note: the box, median, and box tick elements are fixed in number,
                // so we only have to handle enter and update. In contrast, the outliers
                // and other elements are variable, so we need to exit them! Variable
                // elements also fade in and out.

                // Update center line: the vertical line spanning the whiskers.
                const center = g.selectAll('line.center')
                    .data(whiskerData ? [whiskerData] : []);

                center.enter().insert('line', 'rect')
                    .attr('class', 'center')
                    .attr('x1', width / 2)
                    .attr('y1', d => x0(d[0]))
                    .attr('x2', width / 2)
                    .attr('y2', d => x0(d[1]))
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .style('opacity', 1)
                    .attr('y1', d => x1(d[0]))
                    .attr('y2', d => x1(d[1]));

                center.transition()
                    .duration(duration)
                    .delay(delay)
                    .style('opacity', 1)
                    .attr('x1', width / 2)
                    .attr('x2', width / 2)
                    .attr('y1', d => x1(d[0]))
                    .attr('y2', d => x1(d[1]));

                center.exit().transition()
                    .duration(duration)
                    .delay(delay)
                    .style('opacity', 1e-6)
                    .attr('y1', d => x1(d[0]))
                    .attr('y2', d => x1(d[1]))
                    .remove();

                // Update innerquartile box.
                const boxes = g.selectAll('rect.box')
                    .data([quartileData]);

                boxes.enter().append('rect')
                    .attr('class', 'box')
                    .attr('x', 0)
                    .attr('y', d => x0(d[2]))
                    .attr('width', width)
                    .attr('height', d => x0(d[0]) - x0(d[2]))
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('y', d => x1(d[2]))
                    .attr('height', d => x1(d[0]) - x1(d[2]));

                boxes.transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('width', width)
                    .attr('y', d => x1(d[2]))
                    .attr('height', d => x1(d[0]) - x1(d[2]));

                // Update median line.
                const medianLine = g.selectAll('line.median')
                    .data([quartileData[1]]);

                medianLine.enter().append('line')
                    .attr('class', 'median')
                    .attr('x1', 0)
                    .attr('y1', x0)
                    .attr('x2', width)
                    .attr('y2', x0)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('y1', x1)
                    .attr('y2', x1);

                medianLine.transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('x1', 0)
                    .attr('x2', width)
                    .attr('y1', x1)
                    .attr('y2', x1);

                // Update whiskers.
                const whisker = g.selectAll('line.whisker')
                    .data(whiskerData || []);

                whisker.enter().insert('line', 'circle, text')
                    .attr('class', 'whisker')
                    .attr('x1', 0)
                    .attr('y1', x0)
                    .attr('x2', width)
                    .attr('y2', x0)
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('y1', x1)
                    .attr('y2', x1)
                    .style('opacity', 1);

                whisker.transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('x1', 0)
                    .attr('x2', width)
                    .attr('y1', x1)
                    .attr('y2', x1)
                    .style('opacity', 1);

                whisker.exit().transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('y1', x1)
                    .attr('y2', x1)
                    .style('opacity', 1e-6)
                    .remove();

                // Update outliers.
                const outlier = g.selectAll('circle.outlier')
                    .data(outlierIndices, Number);

                outlier.enter().insert('circle', 'text')
                    .attr('class', 'outlier')
                    .attr('r', 5)
                    .attr('cx', width / 2)
                    .attr('cy', i => x0(data[i]))
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cy', i => x1(data[i]))
                    .style('opacity', 1);

                outlier.transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cx', width / 2)
                    .attr('cy', i => x1(data[i]))
                    .style('opacity', 1);

                outlier.exit().transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('cy', i => x1(data[i]))
                    .style('opacity', 1e-6)
                    .remove();

                // Compute the tick format.
                const format = tickFormat || x1.tickFormat(8);

                // Update box ticks.
                const boxTick = g.selectAll('text.box')
                    .data(quartileData);

                boxTick.enter().append('text')
                    .attr('class', 'box')
                    .attr('dy', '.3em')
                    .attr('dx', (d, i) => (i & 1 ? 6 : -6))
                    .attr('x', (d, i) => (i & 1 ? width : 0))
                    .attr('y', x0)
                    .attr('text-anchor', (d, i) => (i & 1 ? 'start' : 'end'))
                    .text(format)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('y', x1);

                boxTick.transition()
                    .duration(duration)
                    .delay(delay)
                    .text(format)
                    .attr('x', (d, i) => (i & 1 ? width : 0))
                    .attr('y', x1);

                // Update whisker ticks. These are handled separately from the box
                // ticks because they may or may not exist, and we want don't want
                // to join box ticks pre-transition with whisker ticks post-.
                const whiskerTick = g.selectAll('text.whisker')
                    .data(whiskerData || []);

                whiskerTick.enter().append('text')
                    .attr('class', 'whisker')
                    .attr('dy', '.3em')
                    .attr('dx', 6)
                    .attr('x', width)
                    .attr('y', x0)
                    .text(format)
                    .style('opacity', 1e-6)
                    .transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('y', x1)
                    .style('opacity', 1);

                whiskerTick.transition()
                    .duration(duration)
                    .delay(delay)
                    .text(format)
                    .attr('x', width)
                    .attr('y', x1)
                    .style('opacity', 1);

                whiskerTick.exit().transition()
                    .duration(duration)
                    .delay(delay)
                    .attr('y', x1)
                    .style('opacity', 1e-6)
                    .remove();
            });
            d3.timer.flush();
        }

        box.width = function (x) {
            if (!arguments.length) {
                return width;
            }
            width = x;
            return box;
        };

        box.height = function (x) {
            if (!arguments.length) {
                return height;
            }
            height = x;
            return box;
        };

        box.tickFormat = function (x) {
            if (!arguments.length) {
                return tickFormat;
            }
            tickFormat = x;
            return box;
        };

        box.duration = function (x) {
            if (!arguments.length) {
                return duration;
            }
            duration = x;
            return box;
        };

        box.domain = function (x) {
            if (!arguments.length) {
                return domain;
            }
            domain = x === null ? x : d3.functor(x);
            return box;
        };

        box.value = function (x) {
            if (!arguments.length) {
                return value;
            }
            value = x;
            return box;
        };

        box.whiskers = function (x) {
            if (!arguments.length) {
                return whiskers;
            }
            whiskers = x;
            return box;
        };

        box.quartiles = function (x) {
            if (!arguments.length) {
                return quartiles;
            }
            quartiles = x;
            return box;
        };

        return box;
    };

    function boxWhiskers (d) {
        return [0, d.length - 1];
    }

    function boxQuartiles (d) {
        return [
            d3.quantile(d, 0.25),
            d3.quantile(d, 0.5),
            d3.quantile(d, 0.75)
        ];
    }
}());

export default d3.box;
