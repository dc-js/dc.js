/**
## Geo Bubble Overlay Chart

Includes: [Base Mixin](#base-mixin)

The Geo Bubble Overlay chart is a mix of the Geo Choropleth chart and the Bubble Graph chart.
This chart puts bubbles over the centroid of each defined area. 

#### dc.geoBubbleOverlayChart(parent[, chartGroup])
Parameters:
* parent : string | node | selection - any valid
 [d3 single selector](https://github.com/mbostock/d3/wiki/Selections#selecting-elements) specifying
 a dom block element such as a div; or a dom element or d3 selection.

* chartGroup : string (optional) - name of the chart group this chart instance should be placed in.
 Interaction with a chart will only trigger events and redraws within the chart's group.
 
 Returns:
A newly created choropleth chart instance

```js
map = dc.geoBubbleOverlayChart('#map')
      .width(width)
      .height(height)
      .dimension(countryDimension)
      .group(countryGroup)
      .projection(projection)
      .setGeoJson(countriesJson.features, 'country', function (d) {
        return d.id;
      })
      .radiusValueAccessor(function(d){
        var r = Math.sqrt(d.value/1000000);
        if (r < 0) return 0;
        return Math.abs(r);
      });
```
**/
dc.geoBubbleOverlayChart = function (parent, chartGroup) {
    var _chart = dc.bubbleMixin(dc.baseMixin({}));

    var _elasticRadius = false;

    _chart.transitionDuration(750); //default transition

    var _geoPath = d3.geo.path();
    var _projectionFlag;
    _chart.GEO_LAYER_CLASS = 'geoLayer';
    var _geoFill = '#ccc';

    var _geoJson;

    var _bubbleG;

    _chart.geoPath = function(){
        return _geoPath;
    };

    /**
        #### bubbleLocator(number)
        Finds the centroid(like a 2d Center of Mass) or the geometric region. 
    **/
    var _bubbleLocator = function(d) {
        var centroid;
        if (d.key === "" || d.key === undefined || d.key === null || d.key === 0 || d.key === '0'){
            centroid = [-500,-500];            
        }else{
            var selector = "g."+ _chart.GEO_LAYER_CLASS +" g."+ dc.utils.nameToId(d.key);
            var region = _chart.svg().select(selector); 
            try {
                centroid = _geoPath.centroid(region.datum());
            }catch(err){
                centroid = [-500,-500]; 
            }
        }
        return "translate(" + (centroid[0]) + "," + (centroid[1]) + ")";
    };

    _chart.bubbleLocator = function(_) {
        if (!arguments.length) return _elasticRadius;
        _elasticRadius = _;
        return _chart;
    };

    _chart.elasticRadius = function(_) {
        if (!arguments.length) return _elasticRadius;
        _elasticRadius = _;
        return _chart;
    };

    _chart._doRender = function () {
        plotGeo();
        
        _projectionFlag = false;
        plotData();
    };

    _chart._doRedraw = function () {
        _bubbleG = _chart.svg().selectAll("g." + _chart.BUBBLE_NODE_CLASS)
            .data(_chart.data(), function (d) { return d.key; });
        updateNodes(_bubbleG);
        if(_projectionFlag) {
            _chart.svg().selectAll("g." + geoJson().name + " path").attr("d", _geoPath);
        }
        _projectionFlag = false;
        _chart.fadeDeselectedArea();
    };

    //_chart.on("postRender", plotData);

    function plotData() {
        if (_elasticRadius)
            _chart.r().domain([_chart.rMin(), _chart.rMax()]);

        _chart.r().range([_chart.MIN_RADIUS/2, (_chart.width()/10) *  _chart.maxBubbleRelativeSize()]);

        _bubbleG = _chart.svg().selectAll("g." + _chart.BUBBLE_NODE_CLASS)
            .data(_chart.data(), function (d) { return d.key; });

        renderNodes(_bubbleG);

        updateNodes(_bubbleG);

        removeNodes(_bubbleG);

        _chart.fadeDeselectedArea();
    }

    function renderNodes(bubbleG) {
        var bubbleGEnter = bubbleG.enter().append("g");

        bubbleGEnter
            .attr("class", function(d) {
                return _chart.BUBBLE_NODE_CLASS + ' ' + dc.utils.nameToId(d.key);
            }) 
            .attr("transform", _bubbleLocator)
            .append("circle").attr("class", function(d, i) {
                return _chart.BUBBLE_CLASS + " _" + i;
            })
            .on("click", _chart.onClick)
            .attr("fill", _chart.getColor)
            .attr("r", 0);
        dc.transition(bubbleG, _chart.transitionDuration())
            .selectAll("circle." + _chart.BUBBLE_CLASS)
            .attr("r", function(d) {
                return _chart.bubbleR(d);
            })
            .attr("opacity", function(d) {
                return (_chart.bubbleR(d) > 0) ? 1 : 0;
            });

        _chart._doRenderLabel(bubbleGEnter);

        _chart._doRenderTitles(bubbleGEnter);
    }

    function updateNodes(bubbleG) {
        dc.transition(bubbleG, _chart.transitionDuration())
            .attr("transform", _bubbleLocator)
            .selectAll("circle." + _chart.BUBBLE_CLASS)
            .attr("fill", _chart.getColor)
            .attr("r", function(d) {
                return _chart.bubbleR(d);
            })
            .attr("opacity", function(d) {
                return (_chart.bubbleR(d) > 0) ? 1 : 0;
            });

        _chart.doUpdateLabels(bubbleG);
        _chart.doUpdateTitles(bubbleG);
    }

    function removeNodes(bubbleG) {
        bubbleG.exit().remove();
    }

    function bubbleX(d) {
        var x = _chart.x()(_chart.keyAccessor()(d));
        if (isNaN(x))
            x = 0;
        return x;
    }

    function bubbleY(d) {
        var y = _chart.y()(_chart.valueAccessor()(d));
        if (isNaN(y))
            y = 0;
        return y;
    }

    _chart.renderBrush = function(g) {
        // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function(g) {
        // override default x axis brush from parent chart
        _chart.fadeDeselectedArea();
    };

    function plotGeo() {
        _chart.resetSvg();

        var states = _chart.svg().append("g")
            .attr("class", _chart.GEO_LAYER_CLASS);

        var regionG = states.selectAll("g." + geoJson().name)
            .data(geoJson().data)
            .enter()
            .append("g")
            .attr("class", geoJson().name);

        regionG
            .append("path")
            .attr("fill", _geoFill)
            .attr("d", _geoPath);

        renderRegionG();

    }

    function renderRegionG() {
        _chart.svg()
            .selectAll("g." + _chart.GEO_LAYER_CLASS + " g." + geoJson().name)
            .attr("class", function (d) {
                var layerNameClass = geoJson().name;
                var regionClass = dc.utils.nameToId(geoJson().keyAccessor(d));
                var baseClasses = layerNameClass + " " + regionClass;
                return baseClasses;
            });
    }


    function getKey(d) {
        return geoJson().keyAccessor(d);
    }

    function geoJson() {
        return _geoJson;
    }

    _chart.onClick = function (d) {
        var filter = d.key;
        dc.events.trigger(function () {
            _chart.filter(filter);
            dc.redrawAll(_chart.chartGroup());
        });
    };


    /**
        #### .setGeoJson(json, string, key)
        Set the geometric map features from the Geo Json data. 
    **/
    _chart.setGeoJson = function (json, name, keyAccessor) {
        _geoJson = {name: name, data: json, keyAccessor: keyAccessor};
        return _chart;
    };

    /**
        #### .projection(MapProjection)
        Use a different map projection with this bubble chart. 
    **/
    _chart.projection = function (projection) {
        _geoPath.projection(projection);
        _projectionFlag = true;
        return _chart;
    };

    _chart.geoJson = function () {
        return _geoJson;
    };

    return _chart.anchor(parent, chartGroup);
};
