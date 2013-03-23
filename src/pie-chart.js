dc.pieChart = function(parent, chartGroup) {
    var DEFAULT_MIN_ANGLE_FOR_LABEL = 0.5;

    var _sliceCssClass = "pie-slice";

    var _radius = 90, _innerRadius = 0;

    var _g;

    var _minAngleForLabel = DEFAULT_MIN_ANGLE_FOR_LABEL;
    
    var _hasLabelsOutside = false;

    var _chart = dc.singleSelectionChart(dc.colorChart(dc.baseChart({})));

    _chart.label(function(d) {
        return _chart.keyAccessor()(d.data);
    });

    _chart.renderLabel(true);

    _chart.title(function(d) {
        return _chart.keyAccessor()(d.data) + ": " + _chart.valueAccessor()(d.data);
    });

    _chart.transitionDuration(350);

    _chart.doRender = function() {
        _chart.resetSvg();

        _g = _chart.svg()
            .append("g")
            .attr("transform", "translate(" + _chart.cx() + "," + _chart.cy() + ")");

        drawChart();

        return _chart;
    };

    function drawChart() {
        if (_chart.dataSet()) {
            var pie = calculateDataPie();

            var arc = _chart.buildArcs();

            var pieData = pie(_chart.orderedGroup().top(Infinity));

            var slices = _g.selectAll("g." + _sliceCssClass)
                .data(pieData);

            createElements(slices, arc, pieData);

            updateElements(pieData, arc);

            removeElements(slices);

            highlightFilter();
        }
    }

    function createElements(slices, arc, pieData) {
        var slicesEnter = createSliceNodes(slices);

        createSlicePath(slicesEnter, arc);

        createTitles(slicesEnter);

        createLabels(pieData, arc);
    }

    function createSliceNodes(slices) {
        var slicesEnter = slices
            .enter()
            .append("g")
            .attr("class", function(d, i) {
                return _sliceCssClass + " _" + i;
            });
        return slicesEnter;
    }

    function createSlicePath(slicesEnter, arc) {
        var slicePath = slicesEnter.append("path")
            .attr("fill", function(d, i) {
                return _chart.getColor(d, i);
            })
            .on("click", onClick)
            .attr("d", function(d, i) {
                return safeArc(d, i, arc);
            });
        slicePath.transition()
            .duration(_chart.transitionDuration())
            .attrTween("d", tweenPie);
    }

    function createTitles(slicesEnter) {
        if (_chart.renderTitle()) {
            slicesEnter.append("title").text(function(d) {
                return _chart.title()(d);
            });
        }
    }

    function createLabels(pieData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll("text." + _sliceCssClass)
                .data(pieData);

            var labelsEnter = labels
                .enter()
                .append("text")
                .attr("class", function(d, i) {
                    return _sliceCssClass + " _" + i;
                })
                .on("click", onClick);
            
            if(_hasLabelsOutside)
            {
                var labelr = _radius;
                
	            dc.transition(labelsEnter, _chart.transitionDuration())
                .attr("x", function(d) {
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      
                      approxTextWidth = 20;
                      if(_chart.label()(d).length > 10)
                      approxTextWidth = 40;
                      
                      w = _chart.width() / 2 - approxTextWidth;
                      return (d.endAngle + d.startAngle)/2 > Math.PI ? -w : w;
                      })
                .attr("y", function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      return (y/h * labelr);
                      })
                .attr("text-anchor", function(d) {
                      // are we past the center?
                      return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
                      })
                .attr("class",function(d){
                      var data = d.data;
                      if (sliceHasNoData(data) || sliceTooSmall(d))
                      return $(this).attr("class") + " tooSmall";
                      else
                      return $(this).attr("class") + " outside";
                      })
                .text(function(d) {
                      return  _chart.label()(d);
                      });
	            
                
                //Draw the lines for the labels
	            var labelsPathEnter = labels
                    .enter()
                    .append("line")
                    .attr("class", function(d, i) {
                          var tooSmall = "";
                          if(sliceTooSmall(d))
                            tooSmall = " tooSmall"
                          return _sliceCssClass + " _" + i + " titleLine" + tooSmall;
                          })
	            
	            dc.transition(labelsPathEnter, _chart.transitionDuration())
                .attr('x1',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      
                      return (x/h * labelr);
                      })
                .attr('y1',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      return (y/h * labelr);
                      })
                .attr('x2',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      w = _chart.width() / 2 - 20;
                      x2 = (d.endAngle + d.startAngle)/2 > Math.PI ? -w : w;
                      x1 = (x/h * labelr);
                      if(x1 < x2)
                      return x1;
                      else
                      return x2;
                      })
                .attr('y2',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      return (y/h * labelr);
                      });
	            
	        }
            else
        	{
                dc.transition(labelsEnter, _chart.transitionDuration())
                    .attr("transform", function(d) {
                        d.innerRadius = _chart.innerRadius();
                        d.outerRadius = _radius;
                        var centroid = arc.centroid(d);
                        if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                            return "translate(0,0)";
                        } else {
                            return "translate(" + centroid + ")";
                        }
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        var data = d.data;
                        if (sliceHasNoData(data) || sliceTooSmall(d))
                            return "";
                        return _chart.label()(d);
                    });
            }
        }
    }

    function updateElements(pieData, arc) {
        updateSlicePaths(pieData, arc);
        updateLabels(pieData, arc);
        updateTitles(pieData);
    }

    function updateSlicePaths(pieData, arc) {
        var slicePaths = _g.selectAll("g." + _sliceCssClass)
            .data(pieData)
            .select("path")
            .attr("d", function(d, i) {
                return safeArc(d, i, arc);
            });
        dc.transition(slicePaths, _chart.transitionDuration(),
            function(s) {
                s.attrTween("d", tweenPie);
            }).attr("fill", function(d, i) {
                return _chart.getColor(d, i);
            });
    }

    function updateLabels(pieData, arc) {
        if (_chart.renderLabel()) {
            var labels = _g.selectAll("text." + _sliceCssClass)
                .data(pieData);
            
            if(_hasLabelsOutside)
            {
                var labelr = _radius;
                
	            dc.transition(labels, _chart.transitionDuration())
                .attr("x", function(d) {
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      w = _chart.width() / 2 - 10; //10 for the margin
                      return (d.endAngle + d.startAngle)/2 > Math.PI ?
                      -w : w;
                      })
                .attr("y", function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      return (y/h * labelr) + 3;
                      })
                .attr("text-anchor", function(d) {
                      if(d.startAngle == 0)
                        return "end";
                      // are we past the center?
                      return (d.endAngle + d.startAngle)/2 < Math.PI ?
                      "end" : "start";
                      })
                .attr("class",function(d){
                      var data = d.data;
                      if (sliceHasNoData(data) || sliceTooSmall(d))
                        return $(this).attr("class") + " tooSmall";
                      else
                        return $(this).attr("class") + " outside";
                      })
                .text(function(d) {
                      return _chart.label()(d);
                      });
	            
	            var lines = _g.selectAll("line." + _sliceCssClass).data(pieData);
	            
	            dc.transition(lines, _chart.transitionDuration())
                .attr('x1',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      
                      return (x/h * labelr);
                      })
                .attr('y1',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      return (y/h * labelr);
                      })
                .attr('x2',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      
                      //We have to cheat and put the text into the box before it was ready
                      //Then we get the width. Give it a bonus of 20 because it was a bit off :)
                      var className = $(this).attr('class').split(' ');
                      slice = $("text.pie-slice." + className[1]);
                      slice.text(_chart.label()(d));
                      width = slice.width() + 20;
                      
                      w = _chart.width() / 2 - width;
                      onLeft = (d.endAngle + d.startAngle)/2 > Math.PI
                      x2 = onLeft ? -w : w;
                      x1 = (x/h * labelr);
                      
                      //This prevents the line from being drawn from the outside of the chart to the inside
                      //In that case that the text was too long and had to be rendered on the chart itself
                      if( (x1 < x2 && onLeft)  || (x1 > x2 && !onLeft) )
                        return x1;
                      else
                        return x2;
                      })
                .attr('y2',function(d){
                      var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                      return (y/h * labelr);
                      });
	        }
            else
        	{
                dc.transition(labels, _chart.transitionDuration())
                    .attr("transform", function(d) {
                        d.innerRadius = _chart.innerRadius();
                        d.outerRadius = _radius;
                        var centroid = arc.centroid(d);
                        if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                            return "translate(0,0)";
                        } else {
                            return "translate(" + centroid + ")";
                        }
                    })
                    .attr("text-anchor", "middle")
                    .text(function(d) {
                        var data = d.data;
                        if (sliceHasNoData(data) || sliceTooSmall(d))
                            return "";
                        return _chart.label()(d);
                    });
            }
        }
    }

    function updateTitles(pieData) {
        if (_chart.renderTitle()) {
            _g.selectAll("g." + _sliceCssClass)
                .data(pieData)
                .select("title")
                .text(function(d) {
                    return _chart.title()(d);
                });
        }
    }

    function removeElements(slices) {
        slices.exit().remove();
    }

    function highlightFilter() {
        if (_chart.hasFilter()) {
            _chart.selectAll("g." + _sliceCssClass).each(function(d) {
                if (_chart.isSelectedSlice(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll("g." + _sliceCssClass).each(function(d) {
                _chart.resetHighlight(this);
            });
        }
    }

    _chart.innerRadius = function(r) {
        if (!arguments.length) return _innerRadius;
        _innerRadius = r;
        return _chart;
    };

    _chart.radius = function(r) {
        if (!arguments.length) return _radius;
        _radius = r;
        return _chart;
    };

    _chart.cx = function() {
        return _chart.width() / 2;
    };

    _chart.cy = function() {
        return _chart.height() / 2;
    };

    _chart.buildArcs = function() {
        return d3.svg.arc().outerRadius(_radius).innerRadius(_innerRadius);
    };

    _chart.isSelectedSlice = function(d) {
        return _chart.filter() == _chart.keyAccessor()(d.data);
    };

    _chart.doRedraw = function() {
        drawChart();
        return _chart;
    };

    _chart.minAngleForLabel = function(_) {
        if (!arguments.length) return _minAngleForLabel;
        _minAngleForLabel = _;
        return _chart;
    };
    
    _chart.hasLabelsOutside = function (_){
        if (!arguments.length) return _hasLabelsOutside;
        _hasLabelsOutside = _;
        return _chart;
    }

    function calculateDataPie() {
        return d3.layout.pie().sort(null).value(function(d) {
            return _chart.valueAccessor()(d);
        });
    }

    function sliceTooSmall(d) {
        var angle = (d.endAngle - d.startAngle);
        return isNaN(angle) || angle < _minAngleForLabel;
    }

    function sliceHasNoData(data) {
        return _chart.valueAccessor()(data) == 0;
    }

    function tweenPie(b) {
        b.innerRadius = _chart.innerRadius();
        var current = this._current;
        if (isOffCanvas(current))
            current = {startAngle: 0, endAngle: 0};
        var i = d3.interpolate(current, b);
        this._current = i(0);
        return function(t) {
            return safeArc(i(t), 0, _chart.buildArcs());
        };
    }

    function isOffCanvas(current) {
        return current == null || isNaN(current.startAngle) || isNaN(current.endAngle);
    }

    function onClick(d) {
        _chart.onClick(d.data);
    }

    function safeArc(d, i, arc) {
        var path = arc(d, i);
        if(path.indexOf("NaN") >= 0)
            path = "M0,0";
        return path;
    }

    return _chart.anchor(parent, chartGroup);
};
