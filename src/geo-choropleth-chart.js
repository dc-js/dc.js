/**
 * The geo choropleth chart is designed as an easy way to create a crossfilter driven choropleth map
 * from GeoJson data. This chart implementation was inspired by
 * {@link http://bl.ocks.org/4060606 the great d3 choropleth example}.
 *
 * Examples:
 * - {@link http://dc-js.github.com/dc.js/vc/index.html US Venture Capital Landscape 2011}
 * @class geoChoroplethChart
 * @memberof dc
 * @mixes dc.colorMixin
 * @mixes dc.baseMixin
 * @example
 * // create a choropleth chart under '#us-chart' element using the default global chart group
 * var chart1 = dc.geoChoroplethChart('#us-chart');
 * // create a choropleth chart under '#us-chart2' element using chart group A
 * var chart2 = dc.compositeChart('#us-chart2', 'chartGroupA');
 * @param {String|node|d3.selection} parent - Any valid
 * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Selections.md#selecting-elements d3 single selector} specifying
 * a dom block element such as a div; or a dom element or d3 selection.
 * @param {String} [chartGroup] - The name of the chart group this chart instance should be placed in.
 * Interaction with a chart will only trigger events and redraws within the chart's group.
 * @returns {dc.geoChoroplethChart}
 */
dc.geoChoroplethChart = function (parent, chartGroup) {
    var _chart = dc.colorMixin(dc.baseMixin({}));

    // PROPERTIES
    var _allFeatures = {type: 'FeatureCollection', features: []},
        _layers = {},
        _layeredData = function (data) {
            return data.reduce(function (previous, current) {
                previous[_chart.keyAccessor()(current)] = _chart.valueAccessor()(current);
                return previous;
            }, {});
        },
        _graticule = d3.geo.graticule(),
        _projection = d3.geo.mercator(),
        _path = d3.geo.path().projection(_projection),
        _projectionChanged = false,
        _projectionZoom = function (path, features, width, height, scale) {
            var projection = path.projection();
            projection.scale(1).translate([0, 0]);
            if (projection.rotate) {
                projection.rotate([0, 0]);
            }
            if (projection.center) {
                projection.center([0, 0]);
            }
            var b = path.bounds(features),
                s = (scale || 0.95) / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
            if (!projection.rotate || !projection.center) {
                if (s !== 0) {
                    projection
                        .translate([(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2])
                        .scale(s);
                } else {
                    projection
                        .translate([width / 2, height / 2])
                        .scale(Math.min(width, height)  * 2);
                }
            } else {
                var bounds = d3.geo.bounds(features);
                projection
                    .rotate([-(bounds[0][0] + bounds[1][0]) / 2, 0])
                    .center([0, (bounds[0][1] + bounds[1][1]) / 2])
                    .translate([width / 2, height / 2])
                    .scale(s);
            }
        },
        _projectionZoomScale = 0.95,
        _showGraticule = false,
        _showSphere = false,
        _zoom = d3.geo.zoom().projection(_projection),
        _zoomable = false;

    // DEFAULTS
    _chart.colorAccessor(function (d) {
        return d || 0;
    });

    /**
     * Returns all GeoJson layers currently registered with this chart. The returned object is a
     * reference to this chart's internal data structure, so any modification to this object will also
     * modify this chart's internal registration.
     * @method layers
     * @memberof dc.geoChoroplethChart
     * @instance
     * @returns {{name: String, features: Object, keyAccessor: Function, titleAccessor: Function}}
     */
    _chart.layers = function () {
        return _layers;
    };

    /**
     * Use this function to insert a new GeoJson map layer. This function can be invoked multiple times
     * if you have multiple GeoJson data layers to render on top of each other. If you overlay multiple
     * layers with the same name the new overlay will override the existing one.
     * @method addLayer
     * @memberof dc.geoChoroplethChart
     * @instance
     * @see {@link http://geojson.org/ GeoJSON}
     * @see {@link https://github.com/topojson/topojson/wiki TopoJSON}
     * @see {@link https://github.com/topojson/topojson-1.x-api-reference/blob/master/API-Reference.md#wiki-feature topojson.feature}
     * @example
     * // insert a layer for rendering US states
     * chart.addLayer(statesJson.features, 'state', function(d) {
     *     return d.properties.name;
     * }, function(d) {
     *     return 'State: ' + d.properties.name;
     * });
     * @param {Object} features the GeoJSON features
     * @param {String} name to give this layer
     * @param {Function} keyAccessor accessor function used to extract 'key' from the GeoJson data. The key extracted by
     * this function should match the keys returned by the crossfilter groups.
     * @param {Function} titleAccessor accessor function used to extract a 'title' from the GeoJson data.  GeoJson data typically
     * contains a properties attribute that describes the contents of the generated path.  This function can be used to
     * pull data specifically for that object.
     * @returns {dc.geoChoroplethChart}
     */
    _chart.addLayer = function (features, name, keyAccessor, titleAccessor) {
        _layers[name] = {
            features: features,
            name: name,
            keyAccessor: keyAccessor,
            titleAccessor: titleAccessor
        };
        _allFeatures.features = _allFeatures.features.concat(features);
        return _chart;
    };

    /**
     * Remove a GeoJson layer from this chart by name.
     * @method removeLayer
     * @memberof dc.geoChoroplethChart
     * @instance
     * @param {String} name
     * @return {dc.geoChoroplethChart}
     */
    _chart.removeLayer = function (name) {
        delete _layers[name];
        _allFeatures.features = Object.keys(_layers).reduce(function (prev, key) {
            return prev.concat(_layers[key].features);
        }, []);
        return _chart;
    };

    // PROJECTION & PATH
    /**
     * Returns the {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Paths.md#path d3.geo.path} object used to
     * render the projection and features.  Can be useful for figuring out the bounding box of the
     * feature set and thus a way to calculate scale and translation for the projection.
     * @method path
     * @memberof dc.geoChoroplethChart
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Paths.md#path d3.geo.path}
     * @returns {d3.geo.path}
     */
    _chart.path = function () {
        return _path;
    };

    /**
     * Set custom geo projection function. See the available
     * {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md d3 geo projection functions}.
     * @method projection
     * @memberof dc.geoChoroplethChart
     * @instance
     * @see {@link https://github.com/d3/d3-3.x-api-reference/blob/master/Geo-Projections.md d3.geo.projection}
     * @see {@link https://github.com/d3/d3-geo-projection Extended d3.geo.projection}
     * @param {d3.projection} [projection=d3.geo.albersUsa()]
     * @returns {dc.geoChoroplethChart}
     */
    _chart.projection = function (projection) {
        if (!arguments.length) {
            return _projection;
        }
        _projectionChanged = true;
        _projection = projection;
        _path.projection(_projection);
        _zoom.projection(_projection);
        return _chart;
    };

    /**
     * Set custom geo projection zoom function. This function should be used to calculate the bounding box of a the full
     * set of current features
     * @method projectionZoom
     * @memberof dc.geoChoroplethChart
     * @instance
     * @example
     * // default projectionZoom
     * function (path, features, width, height, scale) {
     *     var projection = path.projection();
     *     projection.scale(1).translate([0, 0]);
     *     if (projection.rotate) {
     *         projection.rotate([0, 0]);
     *     }
     *     if (projection.center) {
     *         projection.center([0, 0]);
     *     }
     *     var b = path.bounds(features),
     *         s = (scale || 0.95) / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
     *     if (!projection.rotate || !projection.center) {
     *         if (s !== 0) {
     *             projection
     *                 .translate([(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2])
     *                 .scale(s);
     *         } else {
     *             projection
     *                 .translate([width / 2, height / 2])
     *                 .scale(Math.min(width, height)  * 2);
     *         }
     *     } else {
     *         var bounds = d3.geo.bounds(features);
     *         projection
     *             .rotate([-(bounds[0][0] + bounds[1][0]) / 2, 0])
     *             .center([0, (bounds[0][1] + bounds[1][1]) / 2])
     *             .translate([width / 2, height / 2])
     *             .scale(s);
     *     }
     * }
     * @param {Function} [projectionZoom=Function]
     * @returns {Function|dc.geoChoroplethChart}
     */
    _chart.projectionZoom = function (projectionZoom) {
        if (!arguments.length) {
            return _projectionZoom;
        }
        _projectionZoom = projectionZoom;
        return _chart;
    };

    /**
     * Set a numerical geo projection scale value to be used when zooming in on a set of features.
     * @method projectionZoomScale
     * @memberof dc.geoChoroplethChart
     * @instance
     * @param {Number} [projectionZoomScale=0.95]
     * @returns {Number|dc.geoChoroplethChart}
     */
    _chart.projectionZoomScale = function (projectionZoomScale) {
        if (!arguments.length) {
            return _projectionZoomScale;
        }
        _projectionZoomScale = projectionZoomScale;
        return _chart;
    };

    /**
     * Render graticules.
     * @method showGraticule
     * @memberof dc.geoChoroplethChart
     * @instance
     * @param {Boolean} [showGraticule=false]
     * @return {Boolean|dc.geoChoroplethChart}
     */
    _chart.showGraticule = function (showGraticule) {
        if (!arguments.length) {
            return _showGraticule;
        }
        _showGraticule = showGraticule;
        return _chart;
    };

    /**
     * Render sphere.
     * @method showSphere
     * @memberof dc.geoChoroplethChart
     * @instance
     * @param {Boolean} [showSphere=false]
     * @returns {Boolean|dc.geoChoroplethChart}
     */
    _chart.showSphere = function (showSphere) {
        if (!arguments.length) {
            return _showSphere;
        }
        _showSphere = showSphere;
        return _chart;
    };

    /**
     * Enable a interactive mouse zoom with the current projection.
     * Uses a modified d3.zoom from: {@link http://www.jasondavies.com/maps/rotate/d3.geo.zoom.js d3.geo.zoom.js}
     * @method zoomable
     * @memberof dc.geoChoroplethChart
     * @instance
     * @param {Boolean} [zoomable=false]
     * @returns {Boolean|dc.geoChoroplethChart}
     */
    _chart.zoomable = function (zoomable) {
        if (!arguments.length) {
            return _zoomable;
        }
        _zoomable = zoomable;
        return _chart;
    };

    // PLOT
    _chart._doRedraw = function () {
        var data = _layeredData(_chart.data()),
            layers = _chart.svg().select('g.layers').selectAll('g.feature')
                .data(d3.values(_layers), dc.pluck('name'));

        layers.enter()
            .append('g')
            .attr('class', function (d) { return 'feature layer-' + d.name; })
            .selectAll('path')
            .data(dc.pluck('features')).enter()
            .append('path')
            .attr('fill', 'white')
            .attr('d', _path)
            .on('click', function (d) {
                var parent = d3.select(this.parentNode).datum();
                if (parent.keyAccessor) {
                    dc.events.trigger(function () {
                        _chart.filter(parent.keyAccessor(d));
                        _chart.redrawGroup();
                    });
                }
            }).append('title');

        var paths = layers.selectAll('path')
            .classed('selected', function (d) {
                var parent = d3.select(this.parentNode).datum();
                return _chart.hasFilter() && parent.keyAccessor && _chart.hasFilter(parent.keyAccessor(d));
            })
            .classed('deselected', function (d) {
                var parent = d3.select(this.parentNode).datum();
                return _chart.hasFilter() && parent.keyAccessor && !_chart.hasFilter(parent.keyAccessor(d));
            });
        dc.transition(paths, _chart.transitionDuration(), _chart.transitionDelay()).attr('fill', function (d, i) {
            var parent = d3.select(this.parentNode).datum();
            return _chart.getColor(parent.keyAccessor ? data[parent.keyAccessor(d)] : '', i);
        });
        paths.selectAll('title').text(function (d) {
            var parent = d3.select(this.parentNode.parentNode).datum();
            if (parent.keyAccessor && _chart.renderTitle()) {
                var key = parent.keyAccessor && parent.keyAccessor(d);
                return _chart.title()({
                    key: key,
                    title: parent.titleAccessor ? parent.titleAccessor(d) : '',
                    value: key ? data[key] : null
                });
            }
            return '';
        });

        layers.exit().remove();

        // Update the projection
        if (_projectionChanged) {
            _projectionZoom(_path, _allFeatures, _chart.width(), _chart.height());
            _chart.svg().selectAll('g path').attr('d', _path);
            _projectionChanged = false;
        }

        return _chart;
    };

    _chart._doRender = function () {
        var svg = _chart.resetSvg();

        if (_zoomable) {
            svg.call(_zoom
                .translate(_projection.translate())
                .scale(_projection.scale())
                .on('zoom.redraw', function () {
                    if (d3.event.sourceEvent) {
                        d3.event.sourceEvent.preventDefault();
                    }
                    svg.selectAll('path').attr('d', _path);
                }));
        } else {
            svg.call(_zoom
                .translate(_projection.translate())
                .scale(_projection.scale())
                .on('zoom.redraw', function () {
                    d3.event.sourceEvent.preventDefault();
                }));
        }

        // Since we are rendering, no need to transform the projection
        _projectionChanged = false;

        // Zoom on the current features
        _projectionZoom(_path, _allFeatures, _chart.width(), _chart.height());

        // The layers
        svg.append('g').attr('class', 'layers');

        // Add graticule
        if (_showGraticule) {
            svg.append('path').attr('class', 'graticule').datum(_graticule).attr('d', _path);
        }

        // Add sphere
        if (_showSphere) {
            svg.append('path').attr('class', 'sphere').datum({type: 'Sphere'}).attr('d', _path);
        }

        return _chart._doRedraw();
    };

    return _chart.anchor(parent, chartGroup);
};

var radians = Math.PI / 180,
    degrees = 180 / Math.PI;

function cartesian (spherical) {
    var λ = spherical[0] * radians,
        φ = spherical[1] * radians,
        cosφ = Math.cos(φ);
    return [
        cosφ * Math.cos(λ),
        cosφ * Math.sin(λ),
        Math.sin(φ)
    ];
}

function dot (a, b) {
    for (var i = 0, n = a.length, s = 0; i < n; ++i) {
        s += a[i] * b[i];
    }
    return s;
}

function cross (a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

function bank (projection, p0, p1) {
    var t = projection.translate(),
        angle = Math.atan2(p0[1] - t[1], p0[0] - t[0]) - Math.atan2(p1[1] - t[1], p1[0] - t[0]);
    return [Math.cos(angle / 2), 0, 0, Math.sin(angle / 2)];
}

function position (projection, point) {
    var spherical = projection.invert(point);
    return spherical && isFinite(spherical[0]) && isFinite(spherical[1]) && cartesian(spherical);
}

function quaternionFromEuler (euler) {
    var λ = 0.5 * euler[0] * radians,
        φ = 0.5 * euler[1] * radians,
        γ = 0.5 * euler[2] * radians,
        sinλ = Math.sin(λ), cosλ = Math.cos(λ),
        sinφ = Math.sin(φ), cosφ = Math.cos(φ),
        sinγ = Math.sin(γ), cosγ = Math.cos(γ);
    return [
        cosλ * cosφ * cosγ + sinλ * sinφ * sinγ,
        sinλ * cosφ * cosγ - cosλ * sinφ * sinγ,
        cosλ * sinφ * cosγ + sinλ * cosφ * sinγ,
        cosλ * cosφ * sinγ - sinλ * sinφ * cosγ
    ];
}

function multiply (a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    return [
        a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3,
        a0 * b1 + a1 * b0 + a2 * b3 - a3 * b2,
        a0 * b2 - a1 * b3 + a2 * b0 + a3 * b1,
        a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0
    ];
}

function rotateBetween (a, b) {
    if (!a || !b) {
        return;
    }
    var axis = cross(a, b),
        norm = Math.sqrt(dot(axis, axis)),
        halfγ = 0.5 * Math.acos(Math.max(-1, Math.min(1, dot(a, b)))),
        k = Math.sin(halfγ) / norm;
    return norm && [Math.cos(halfγ), axis[2] * k, -axis[1] * k, axis[0] * k];
}

function eulerFromQuaternion (q) {
    return [
        Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), 1 - 2 * (q[1] * q[1] + q[2] * q[2])) * degrees,
        Math.asin(Math.max(-1, Math.min(1, 2 * (q[0] * q[2] - q[3] * q[1])))) * degrees,
        Math.atan2(2 * (q[0] * q[3] + q[1] * q[2]), 1 - 2 * (q[2] * q[2] + q[3] * q[3])) * degrees
    ];
}

/**
 * http://www.jasondavies.com/maps/rotate/d3.geo.zoom.js
 * http://www.jasondavies.com/LICENSE.txt
 */
d3.geo.zoom = function () {
    var projection,
        zoomPoint,
        event = d3.dispatch('zoomstart', 'zoom', 'zoomend'),
        zoom = d3.behavior.zoom()
            .on('zoomstart', function () {
                if (!projection.rotate) {
                    return;
                }
                var mouse0 = d3.mouse(this),
                    rotate = quaternionFromEuler(projection.rotate()),
                    point = position(projection, mouse0);
                if (point) {
                    zoomPoint = point;
                }
                zoomOn.call(zoom, 'zoom', function () {
                    projection.scale(d3.event.scale);
                    var mouse1 = d3.mouse(this),
                        between = rotateBetween(zoomPoint, position(projection, mouse1));
                    projection.rotate(eulerFromQuaternion(
                        rotate = between ? multiply(rotate, between) :
                            multiply(bank(projection, mouse0, mouse1), rotate)));
                    mouse0 = mouse1;
                    event.zoom.apply(this, arguments);
                });
                event.zoomstart.apply(this, arguments);
            })
            .on('zoomend', function () {
                zoomOn.call(zoom, 'zoom', null);
                event.zoomend.apply(this, arguments);
            }),
    /*jshint -W003 */
    zoomOn = zoom.on;
    /*jshint +W003 */

    zoom.projection = function (_) {
        return arguments.length ? zoom.scale((projection = _).scale()) : projection;
    };

    return d3.rebind(zoom, event, 'on');
};
