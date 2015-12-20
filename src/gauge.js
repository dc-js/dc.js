/**
 ## Gauge Chart
 Includes: [Color Mixin](#color-mixin), [Margin Mixin](#margin-mixin), [Base Mixin](#base-mixin)

 The gauge chart is designed as an univariate measure chart.  Almost every aspect of the chart is
 configurable.

 When using Crossfilter, the data is typically generated as rows.  This chart only displays one row,
 the first row.  It is expected, to be used with Crossfilter's groupAll.  If no data was generated,
 you may optional set a needleValue.
 The min/max values of the needle value are expected to be known before hand.
 By default they are 0 (at the -90 degree angle) and 100 (at the 90 degree angle).
 ```

 **/
dc.gaugeChart = function (parent, chartGroup) {
    var _chart = dc.colorMixin(dc.marginMixin(dc.baseMixin({})));

    var GAUGE_CLASS = 'gauge',
        SLICE_CLASS = 'pie-slice',
        SLICE_LABEL_CLASS = 'pie-slice-labels',
        NEEDLE_CIRCLE_CLASS = 'needle-center',
        NEEDLE_CLASS = 'needle',
        GAUGE_TEXT_CLASS = 'gauge-text';

    [
        {name: 'radius'},
        {name: 'domain', defaultValue: [0, 100]},
        {name: 'externalRadiusPadding', defaultValue: 30},
        {name: 'gap', defaultValue: 3},
        {name: 'innerRadiusPercentage', defaultValue: 0.9},
        {name: 'labelPadding', defaultValue: 5},
        {name: 'maxAngle', defaultValue: 90},
        {name: 'minAngle', defaultValue: -90},
        {name: 'needleColor', defaultValue: '#000000'},
        {name: 'needleLengthPercentage', defaultValue: 0.9},
        {name: 'needleRadius', defaultValue: 15},
        {name: 'needleValue', defaultValue: 0},
        {name: 'slices', defaultValue: 5},
        {name: 'text', defaultValue: ''},
        {name: 'textColor', defaultValue: '#000000'},
        {name: 'textX', defaultValue: 0},
        {name: 'textY', defaultValue: 30},
        {name: 'textRotation', defaultValue: 0},
        {name: 'numberFormat', defaultValue: d3.format('s')}
    ].forEach(function (property) {
        dc.utils.constructGetterSetter(_chart, property.name, property.defaultValue);
    });

    _chart.margins({top: 0, left: 0, right: 0, bottom: 35});
    _chart.label(function (d) { return _chart.numberFormat()(d); });
    _chart.data(null);

    function fill (d, i) {
        return _chart.getColor(d.data, i);
    }

    function tweenPie (radius, innerRadius) {
        return function (b) {
            b.innerRadius = innerRadius;
            var current = this._current;
            if (!current || isNaN(current.startAngle) || isNaN(current.endAngle)) {
                current = {
                    startAngle : 0,
                    endAngle : 0
                };
            }
            var i = d3.interpolate(current, b);
            this._current = i(0);
            return function (t) {
                return dc.utils.safeArc(i(t), 0, d3.svg.arc().outerRadius(radius).innerRadius(innerRadius));
            };
        };
    }

    function needlePath (value, domain, minAngle, maxAngle, length, radius) {
        var thetaRadian = dc.utils.deg2rad((maxAngle - minAngle) *  (value - domain[0]) / (domain[1] - domain[0]));

        var topX = -length * Math.cos(thetaRadian),
            topY = -length * Math.sin(thetaRadian),
            leftX = -radius * Math.cos(thetaRadian - Math.PI / 2),
            leftY = -radius * Math.sin(thetaRadian - Math.PI / 2),
            rightX = -radius * Math.cos(thetaRadian + Math.PI / 2),
            rightY = -radius * Math.sin(thetaRadian + Math.PI / 2);
        //M #{leftX} #{leftY} L #{topX} #{topY} L #{rightX} #{rightY}'
        return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
    }

    function drawChart (_g) {
        var width = _chart.width() / 2 - _chart.margins().left - _chart.margins().right;
        var height = _chart.height() - _chart.margins().top - _chart.margins().bottom;
        var radius = (_chart.radius() || Math.min(width, height)) - _chart.externalRadiusPadding();

        // TODO Smarter centering?
        _g.attr('transform', 'translate(' + (_chart.width() / 2 + _chart.margins().left - _chart.margins().right) +
        ', ' + (_chart.height() + _chart.margins().top - _chart.margins().bottom) + ')');

        var innerRadius = radius *
            (_chart.innerRadiusPercentage() !== null ?
                Math.max(Math.min(_chart.innerRadiusPercentage(), 1), 0) :
                0.5);
        var startRadian = dc.utils.deg2rad(_chart.minAngle());
        var endRadian = dc.utils.deg2rad(_chart.maxAngle());

        var gauge = _g.select('g.' + GAUGE_CLASS);

        /*****************************************************************
         * Slices
         *****************************************************************/
        var pie = d3.layout.pie()
            .sort(null)
            .startAngle(startRadian)
            .endAngle(endRadian)
            .value(dc.pluck('value'));
        var pieData = pie(d3.range(_chart.slices())
            .map(function (d, i) {
                return {key: i, value: 1 / _chart.slices()};
            }));
        if (_chart.gap()) {
            // TODO Even padding?
            //var padding = (_maxAngle - _minAngle)/_slices -
            //  (_maxAngle - _minAngle - _gap * (_slices - 1)) / _slices;
            var padding = dc.utils.deg2rad(_chart.gap() / 2);
            pieData = pieData.map(function (datum, index, array) {
                if (index !== 0) {
                    datum.startAngle += padding;
                }
                if (index !== array.length - 1) {
                    datum.endAngle -= padding;
                }
                return datum;
            });
        }
        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(innerRadius);

        // Get slices
        var slices = gauge
            .selectAll('g.' + SLICE_CLASS)
            .data(pieData);

        // Create elements
        var slicesEnter = slices
            .enter()
            .append('g')
            .attr('class', function (d, i) {
                return SLICE_CLASS + ' _' + i;
            });
        var slicePath = slicesEnter
            .append('path')
            .attr('fill', fill)
            .attr('d', function (d, i) {
                return dc.utils.safeArc(d, i, arc);
            });
        dc.transition(slicePath, _chart.transitionDuration(), function (s) {
            s.attrTween('d', tweenPie(radius, innerRadius, endRadian, endRadian));
        });

        // Update elements
        var slicePaths = gauge.selectAll('g.' + SLICE_CLASS)
            .data(pieData).select('path').attr('d', function (d, i) {
                return dc.utils.safeArc(d, i, arc);
            });
        dc.transition(slicePaths, _chart.transitionDuration(), function (s) {
            s.attrTween('d', tweenPie(radius, innerRadius));
        }).attr('fill', fill);

        // Remove elements
        slices.exit().remove();

        /*****************************************************************
         * Labels
         *****************************************************************/
        var labelScale = d3.scale.linear()
            .range([0, 1])
            .domain(_chart.domain());
        var labelData = labelScale
            .ticks(_chart.slices());

        // Update Labels
        var labels = gauge
            .selectAll('text.' + SLICE_LABEL_CLASS)
            .data(_chart.renderLabel() ? labelData : []);
        labels.enter()
            .append('text')
            .attr('class', function (d, i) {
                return SLICE_LABEL_CLASS + ' _' + i;
            });
        dc.transition(labels, _chart.transitionDuration())
            .attr('transform', function (d) {
                var newAngle = _chart.minAngle() + ((_chart.maxAngle() - _chart.minAngle()) * labelScale(d));
                return 'rotate(' + newAngle + ') translate(0,' + -(radius + _chart.labelPadding()) + ')';
            }).attr('text-anchor', 'middle').text(function (d) {
                return _chart.label()(d);
            });
        labels.exit().remove();

        /*****************************************************************
         * Needle
         *****************************************************************/
        var needleValue = _chart.data();
        if (needleValue) {
            needleValue = _chart.valueAccessor()(Array.isArray(needleValue) ? needleValue[0] : needleValue);
        }
        if (!needleValue) {
            needleValue = _chart.needleValue();
        }

        // Update needle
        _g.select('circle.' + NEEDLE_CIRCLE_CLASS)
            .attr('r', _chart.needleRadius())
            .attr('fill', _chart.needleColor());

        // TODO Tween?
        _g.select('path.' + NEEDLE_CLASS)
            .attr('fill', _chart.needleColor())
            .attr('d', needlePath(
                needleValue,
                _chart.domain(),
                _chart.minAngle(),
                _chart.maxAngle(),
                _chart.needleLengthPercentage() * radius,
                _chart.needleRadius()));

        /*****************************************************************
         * Text
         *****************************************************************/
        // Update text
        var text = _g.select('text.' + GAUGE_TEXT_CLASS);
        dc.transition(text, _chart.transitionDuration())
            .attr('transform', 'rotate(' + _chart.textRotation() + ') ' +
                               'translate(' + _chart.textX() + ',' + _chart.textY() + ')')
            .attr('text-anchor', 'middle')
            .attr('fill', _chart.textColor())
            .text(_chart.text());
    }

    _chart._doRender = function () {
        var _g = _chart.resetSvg().append('g');
        _g.append('g')
            .attr('class', GAUGE_CLASS);
        _g.append('circle')
            .attr('class', NEEDLE_CIRCLE_CLASS)
            .attr('cx', 0)
            .attr('cy', 0);
        _g.append('path')
            .attr('class', NEEDLE_CLASS);
        _g.append('text')
            .attr('class', GAUGE_TEXT_CLASS)
            .attr('cx', 0)
            .attr('cy', 0);
        return _chart._doRedraw();
    };

    _chart._doRedraw = function () {
        var _g = _chart.svg().select('g');
        if (!_g) {
            return;
        }
        drawChart(_g);
        return _chart;
    };

    return _chart.anchor(parent, chartGroup);
};
