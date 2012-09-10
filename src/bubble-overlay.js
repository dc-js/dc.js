dc.bubbleOverlay = function(root, chartGroup) {
    var BUBBLE_OVERLAY_CLASS = "bubble-overlay";
    var BUBBLE_NODE_CLASS = "node";
    var BUBBLE_CLASS = "bubble";

    var _chart = dc.abstractBubbleChart(dc.baseChart({}));
    var _g;
    var _points = [];

    _chart.transitionDuration(750);

    _chart.radiusValueAccessor(function(d) {
        return d.value;
    });

    _chart.point = function(name, x, y) {
        _points.push({name: name, x: x, y: y});
        return _chart;
    };

    _chart.doRender = function() {
        _g = initOverlayG();

        _chart.r().range([_chart.MIN_RADIUS, _chart.width() * _chart.maxBubbleRelativeSize()]);

        initializeBubbles();

        _chart.fadeDeselectedArea();

        return _chart;
    };

    function initOverlayG() {
        _g = _chart.select("g." + BUBBLE_OVERLAY_CLASS);
        if (_g.empty())
            _g = _chart.svg().append("g").attr("class", BUBBLE_OVERLAY_CLASS);
        return _g;
    }

    function initializeBubbles() {
        var data = mapData();

        _points.forEach(function(point) {
            var nodeG = getNodeG(point, data);

            var circle = nodeG.select("circle." + BUBBLE_CLASS);

            if (circle.empty())
                circle = nodeG.append("circle")
                    .attr("class", BUBBLE_CLASS)
                    .attr("r", 0)
                    .attr("fill", _chart.initBubbleColor)
                    .on("click", _chart.onClick);

            dc.transition(circle, _chart.transitionDuration())
                .attr("r", function(d) {
                    return _chart.bubbleR(d);
                });

            _chart.doRenderLabel(nodeG);

            _chart.doRenderTitles(nodeG);
        });
    }

    function mapData() {
        var data = {};
        _chart.group().all().forEach(function(datum) {
            data[_chart.keyAccessor()(datum)] = datum;
        });
        return data;
    }

    function getNodeG(point, data) {
        var bubbleNodeClass = BUBBLE_NODE_CLASS + " " + dc.utils.nameToId(point.name);

        var nodeG = _g.select("g." + dc.utils.nameToId(point.name));

        if (nodeG.empty()) {
            nodeG = _g.append("g")
                .attr("class", bubbleNodeClass)
                .attr("transform", "translate(" + point.x + "," + point.y + ")");
        }

        nodeG.datum(data[point.name]);

        return nodeG;
    }

    _chart.doRedraw = function() {
        updateBubbles();

        _chart.fadeDeselectedArea();

        return _chart;
    };

    function updateBubbles() {
        var data = mapData();

        _points.forEach(function(point) {
            var nodeG = getNodeG(point, data);

            var circle = nodeG.select("circle." + BUBBLE_CLASS);

            dc.transition(circle, _chart.transitionDuration())
                .attr("r", function(d) {
                    return _chart.bubbleR(d);
                })
                .attr("fill", _chart.updateBubbleColor);

            _chart.doUpdateLabels(nodeG);

            _chart.doUpdateTitles(nodeG);
        });
    }

    _chart.debug = function(flag) {
        if(flag){
            var debugG = _chart.select("g." + dc.constants.DEBUG_GROUP_CLASS);

            if(debugG.empty())
                debugG = _chart.svg()
                    .append("g")
                    .attr("class", dc.constants.DEBUG_GROUP_CLASS);

            var debugText = debugG.append("text")
                .attr("x", 10)
                .attr("y", 20);

            debugG
                .append("rect")
                .attr("width", _chart.width())
                .attr("height", _chart.height())
                .on("mousemove", function() {
                    var position = d3.mouse(debugG.node());
                    var msg = position[0] + ", " + position[1];
                    debugText.text(msg);
                });
        }else{
            _chart.selectAll(".debug").remove();
        }

        return _chart;
    };

    _chart.anchor(root, chartGroup);

    return _chart;
};