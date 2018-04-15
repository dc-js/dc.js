// Significant changes in d3.layout.stack - copying from D3v3 for now
d3.stackD3v3 = function () {
    function d3_layout_stackOrderDefault(data) {
        return d3.range(data.length);
    }

    function d3_layout_stackOffsetZero(data) {
        var j = -1, m = data[0].length, y0 = [];
        while (++j < m) y0[j] = 0;
        return y0;
    }

    function d3_layout_stackOut(d, y0, y) {
        d.y0 = y0;
        d.y = y;
    }

    function d3_layout_stackX(d) {
        return d.x;
    }

    function d3_layout_stackY(d) {
        return d.y;
    }

    function d3_identity(d) {
        return d;
    }

    return function () {
        var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero,
            out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;

        function stack(data, index) {
            if (!(n = data.length)) return data;
            var series = data.map(function (d, i) {
                return values.call(stack, d, i);
            });
            var points = series.map(function (d) {
                return d.map(function (v, i) {
                    return [x.call(stack, v, i), y.call(stack, v, i)];
                });
            });
            var orders = order.call(stack, points, index);
            series = d3.permute(series, orders);
            points = d3.permute(points, orders);
            var offsets = offset.call(stack, points, index);
            var m = series[0].length, n, i, j, o;
            for (j = 0; j < m; ++j) {
                out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
                for (i = 1; i < n; ++i) {
                    out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
                }
            }
            return data;
        }

        stack.values = function (x) {
            if (!arguments.length) return values;
            values = x;
            return stack;
        };
        stack.order = function (x) {
            if (!arguments.length) return order;
            order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
            return stack;
        };
        stack.offset = function (x) {
            if (!arguments.length) return offset;
            offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
            return stack;
        };
        stack.x = function (z) {
            if (!arguments.length) return x;
            x = z;
            return stack;
        };
        stack.y = function (z) {
            if (!arguments.length) return y;
            y = z;
            return stack;
        };
        stack.out = function (z) {
            if (!arguments.length) return out;
            out = z;
            return stack;
        };
        return stack;
    }
}();

// d3v4 Compat
if (!d3.schemeCategory20c) {
    d3.schemeCategory20c = [
        '#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d',
        '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476',
        '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc',
        '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9'];
}
