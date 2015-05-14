
// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf
// dc.js plugin for WordClouds by Joe Nudell
;


// d3.layout.cloud
// Jason Davies
(function(exports) {
  function cloud() {
    var size = [256, 256],
        text = cloudText,
        font = cloudFont,
        fontSize = cloudFontSize,
        fontStyle = cloudFontNormal,
        fontWeight = cloudFontNormal,
        rotate = cloudRotate,
        padding = cloudPadding,
        spiral = archimedeanSpiral,
        words = [],
        timeInterval = Infinity,
        event = d3.dispatch("word", "end"),
        timer = null,
        cloud = {};

    cloud.start = function() {
      var board = zeroArray((size[0] >> 5) * size[1]),
          bounds = null,
          n = words.length,
          i = -1,
          tags = [],
          data = words.map(function(d, i) {
            d.text = text.call(this, d, i);
            d.font = font.call(this, d, i);
            d.style = fontStyle.call(this, d, i);
            d.weight = fontWeight.call(this, d, i);
            d.rotate = rotate.call(this, d, i);
            d.size = ~~fontSize.call(this, d, i);
            d.padding = padding.call(this, d, i);
            return d;
          }).sort(function(a, b) { return b.size - a.size; });

      if (timer) clearInterval(timer);
      timer = setInterval(step, 0);
      step();

      return cloud;

      function step() {
        var start = +new Date,
            d;
        while (+new Date - start < timeInterval && ++i < n && timer) {
          d = data[i];
          d.x = (size[0] * (Math.random() + .5)) >> 1;
          d.y = (size[1] * (Math.random() + .5)) >> 1;
          cloudSprite(d, data, i);
          if (d.hasText && place(board, d, bounds)) {
            tags.push(d);
            event.word(d);
            if (bounds) cloudBounds(bounds, d);
            else bounds = [{x: d.x + d.x0, y: d.y + d.y0}, {x: d.x + d.x1, y: d.y + d.y1}];
            // Temporary hack
            d.x -= size[0] >> 1;
            d.y -= size[1] >> 1;
          }
        }
        if (i >= n) {
          cloud.stop();
          event.end(tags, bounds);
        }
      }
    }

    cloud.stop = function() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return cloud;
    };

    cloud.timeInterval = function(x) {
      if (!arguments.length) return timeInterval;
      timeInterval = x == null ? Infinity : x;
      return cloud;
    };

    function place(board, tag, bounds) {
      var perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}],
          startX = tag.x,
          startY = tag.y,
          maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
          s = spiral(size),
          dt = Math.random() < .5 ? 1 : -1,
          t = -dt,
          dxdy,
          dx,
          dy;

      while (dxdy = s(t += dt)) {
        dx = ~~dxdy[0];
        dy = ~~dxdy[1];

        if (Math.min(dx, dy) > maxDelta) break;

        tag.x = startX + dx;
        tag.y = startY + dy;

        if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
            tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
        // TODO only check for collisions within current bounds.
        if (!bounds || !cloudCollide(tag, board, size[0])) {
          if (!bounds || collideRects(tag, bounds)) {
            var sprite = tag.sprite,
                w = tag.width >> 5,
                sw = size[0] >> 5,
                lx = tag.x - (w << 4),
                sx = lx & 0x7f,
                msx = 32 - sx,
                h = tag.y1 - tag.y0,
                x = (tag.y + tag.y0) * sw + (lx >> 5),
                last;
            for (var j = 0; j < h; j++) {
              last = 0;
              for (var i = 0; i <= w; i++) {
                board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
              }
              x += sw;
            }
            delete tag.sprite;
            return true;
          }
        }
      }
      return false;
    }

    cloud.words = function(x) {
      if (!arguments.length) return words;
      words = x;
      return cloud;
    };

    cloud.size = function(x) {
      if (!arguments.length) return size;
      size = [+x[0], +x[1]];
      return cloud;
    };

    cloud.font = function(x) {
      if (!arguments.length) return font;
      font = d3.functor(x);
      return cloud;
    };

    cloud.fontStyle = function(x) {
      if (!arguments.length) return fontStyle;
      fontStyle = d3.functor(x);
      return cloud;
    };

    cloud.fontWeight = function(x) {
      if (!arguments.length) return fontWeight;
      fontWeight = d3.functor(x);
      return cloud;
    };

    cloud.rotate = function(x) {
      if (!arguments.length) return rotate;
      rotate = d3.functor(x);
      return cloud;
    };

    cloud.text = function(x) {
      if (!arguments.length) return text;
      text = d3.functor(x);
      return cloud;
    };

    cloud.spiral = function(x) {
      if (!arguments.length) return spiral;
      spiral = spirals[x + ""] || x;
      return cloud;
    };

    cloud.fontSize = function(x) {
      if (!arguments.length) return fontSize;
      fontSize = d3.functor(x);
      return cloud;
    };

    cloud.padding = function(x) {
      if (!arguments.length) return padding;
      padding = d3.functor(x);
      return cloud;
    };

    return d3.rebind(cloud, event, "on");
  }

  function cloudText(d) {
    return d.text;
  }

  function cloudFont() {
    return "serif";
  }

  function cloudFontNormal() {
    return "normal";
  }

  function cloudFontSize(d) {
    return Math.sqrt(d.value);
  }

  function cloudRotate() {
    return (~~(Math.random() * 6) - 3) * 30;
  }

  function cloudPadding() {
    return 1;
  }

  // Fetches a monochrome sprite bitmap for the specified text.
  // Load in batches for speed.
  function cloudSprite(d, data, di) {
    if (d.sprite) return;
    c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
    var x = 0,
        y = 0,
        maxh = 0,
        n = data.length;
    --di;
    while (++di < n) {
      d = data[di];
      c.save();
      c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
      var w = c.measureText(d.text + "m").width * ratio,
          h = d.size << 1;
      if (d.rotate) {
        var sr = Math.sin(d.rotate * cloudRadians),
            cr = Math.cos(d.rotate * cloudRadians),
            wcr = w * cr,
            wsr = w * sr,
            hcr = h * cr,
            hsr = h * sr;
        w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
        h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
      } else {
        w = (w + 0x1f) >> 5 << 5;
      }
      if (h > maxh) maxh = h;
      if (x + w >= (cw << 5)) {
        x = 0;
        y += maxh;
        maxh = 0;
      }
      if (y + h >= ch) break;
      c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
      if (d.rotate) c.rotate(d.rotate * cloudRadians);
      c.fillText(d.text, 0, 0);
      if (d.padding) c.lineWidth = 2 * d.padding, c.strokeText(d.text, 0, 0);
      c.restore();
      d.width = w;
      d.height = h;
      d.xoff = x;
      d.yoff = y;
      d.x1 = w >> 1;
      d.y1 = h >> 1;
      d.x0 = -d.x1;
      d.y0 = -d.y1;
      d.hasText = true;
      x += w;
    }
    var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
        sprite = [];
    while (--di >= 0) {
      d = data[di];
      if (!d.hasText) continue;
      var w = d.width,
          w32 = w >> 5,
          h = d.y1 - d.y0;
      // Zero the buffer
      for (var i = 0; i < h * w32; i++) sprite[i] = 0;
      x = d.xoff;
      if (x == null) return;
      y = d.yoff;
      var seen = 0,
          seenRow = -1;
      for (var j = 0; j < h; j++) {
        for (var i = 0; i < w; i++) {
          var k = w32 * j + (i >> 5),
              m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
          sprite[k] |= m;
          seen |= m;
        }
        if (seen) seenRow = j;
        else {
          d.y0++;
          h--;
          j--;
          y++;
        }
      }
      d.y1 = d.y0 + seenRow;
      d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
    }
  }

  // Use mask-based collision detection.
  function cloudCollide(tag, board, sw) {
    sw >>= 5;
    var sprite = tag.sprite,
        w = tag.width >> 5,
        lx = tag.x - (w << 4),
        sx = lx & 0x7f,
        msx = 32 - sx,
        h = tag.y1 - tag.y0,
        x = (tag.y + tag.y0) * sw + (lx >> 5),
        last;
    for (var j = 0; j < h; j++) {
      last = 0;
      for (var i = 0; i <= w; i++) {
        if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
            & board[x + i]) return true;
      }
      x += sw;
    }
    return false;
  }

  function cloudBounds(bounds, d) {
    var b0 = bounds[0],
        b1 = bounds[1];
    if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
    if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
    if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
    if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
  }

  function collideRects(a, b) {
    return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
  }

  function archimedeanSpiral(size) {
    var e = size[0] / size[1];
    return function(t) {
      return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
    };
  }

  function rectangularSpiral(size) {
    var dy = 4,
        dx = dy * size[0] / size[1],
        x = 0,
        y = 0;
    return function(t) {
      var sign = t < 0 ? -1 : 1;
      // See triangular numbers: T_n = n * (n + 1) / 2.
      switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
        case 0:  x += dx; break;
        case 1:  y += dy; break;
        case 2:  x -= dx; break;
        default: y -= dy; break;
      }
      return [x, y];
    };
  }

  // TODO reuse arrays?
  function zeroArray(n) {
    var a = [],
        i = -1;
    while (++i < n) a[i] = 0;
    return a;
  }

  var cloudRadians = Math.PI / 180,
      cw = 1 << 11 >> 5,
      ch = 1 << 11,
      canvas,
      ratio = 1;

  if (typeof document !== "undefined") {
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
    canvas.width = (cw << 5) / ratio;
    canvas.height = ch / ratio;
  } else {
    // node-canvas support
    var Canvas = require("canvas");
    canvas = new Canvas(cw << 5, ch);
  }

  var c = canvas.getContext("2d"),
      spirals = {
        archimedean: archimedeanSpiral,
        rectangular: rectangularSpiral
      };
  c.fillStyle = c.strokeStyle = "red";
  c.textAlign = "center";

  exports.cloud = cloud;
})(typeof exports === "undefined" ? d3.layout || (d3.layout = {}) : exports);







// dc.js plugin for wordcloud
// Joe Nudell
;
(function(dc, d3){

    dc.wordCloud = function(parent, chartGroup) {
        var WORD_CLASS = "dc-cloud-word",
            _chart = dc.colorChart(dc.baseChart({})),
            _size = [400, 400],
            _padding = 1,
            _timeInterval = 10,
            _duration = 500,
            _font = "Impact",
            _scale = d3.scale.log().range([10, 20]),
            _spiral = 'archimedean',
            _selectedWords = null,
            _fontSize = function(d) { return _scale(+d.value); },
            _text = function(d) { return d.key; },
            _rotate = function(d) { return 0; },
            _onClick = function(d) { 
                _chart.filter(_text(d));
            },
            // Containers
            _g, _fg, _bg, tags,
            // From Jonathan Feinberg's cue.language, see lib/cue.language/license.txt.
            maxLength = 20,
            _maxWords = 200,
            words = [],
            _stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
            _punctuation = /[!"&()*+,-\.\/:;<=>?\[\\\]^`\{|\}~]+/g,
            _wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
            _searchBreak = "("+_punctuation.source+"|"+_wordSeparators.source+")",
            discard = /^(@|https?:)/,
            htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
            _normalize = function(d) { return d; };

        // Note - there's a bug (?) in the d3.layout.wordCloud engine that
        // will lose a word that is disproportionately large for the cloud.
        // It's possible to track when this occurs by checking the length of
        // tags pre-render and post-render
        var _preRenderTagLength = -1;

        _chart.width(_size[0]);
        _chart.height(_size[1]);

        // Accessors
        _chart.size = function(s) {
            if (!arguments.length) return _size;
            _size = s;
            _chart.width(_size[0]);
            _chart.height(_size[1]);
            return _chart;
        };

        _chart.splitAt = function(s) {
            if (!arguments.length) return _wordSeparators;
            _wordSeparators = s;
            return _chart;
        }

        _chart.stopWords = function(s) {
            if (!arguments.length) return _stopWords;
            _stopWords = s;
            return _chart;
        }

        _chart.punctuation = function(p) {
            if (!arguments.length) return _punctuation;
            _punctuation = p;
            return _chart;
        }

        _chart.normalize = function(n) {
            if (!arguments.length) return _normalize;
            _normalize = n;
            return _chart;
        }

        _chart.maxWords = function(w) {
            if (!arguments.length) return _maxWords;
            _maxWords = w;
            return _chart;
        }

        _chart.onClick = function(h) {
            if (!arguments.length) return _onClick;
            _onClick = h;
            return _chart;
        }

        _chart.scale = function(s) {
            if (!arguments.length) return _scale;
            _scale = s;
            return _chart;
        }

        _chart.duration = function(d) {
            if (!arguments.length) return _duration;
            _duration = d;
            return _chart;
        }

        _chart.timeInterval = function(t) {
            if (!arguments.length) return _timeInterval;
            _timeInterval = t;
            return _chart;
        }

        _chart.font = function(f) {
            if (!arguments.length) return _font;
            _font = f;
            return _chart;
        }

        _chart.fontSize = function(f) {
            if (!arguments.length) return _fontSize;
            _fontSize = f;
            return _chart;
        }

        _chart.rotate = function(r) {
            if (!arguments.length) return _rotate;
            _rotate = r;
            return _chart;
        }

        _chart.padding = function(p) {
            if (!arguments.length) return _padding;
            _padding = p;
            return _chart;
        }

        _chart.text = function(t) {
            if (!arguments.length) return _text;
            _text = t;
            return _chart;
        }

        _chart.spiral = function(s) {
            // 'archimedean' or 'rectangular'
            if (!arguments.length) return _spiral;
            _spiral = s;
            return _spiral;
        }

        // Read only properties
        _chart.cx = function () {
            return _chart.width()>>1;
        }

        _chart.cy = function () {
            return _chart.height()>>1;
        }


        // Rendering & Drawing helpers
        function drawChart() {
            getCloudWords();

            _preRenderTagLength = tags.length;

            var cloud = makeCloud();

            words = [];

            cloud.stop()
                .words(tags.slice(0, _maxWords), function(d) {
                    return d.text.toLowerCase();
                })
                .start();

        }

        function makeCloud() {
            return d3.layout.cloud()
                .size(_size)
                .on('end', drawWords)
                .timeInterval(_timeInterval)
                .text(_text)
                .font(_font)
                .fontSize(_fontSize)
                .rotate(_rotate)
                .padding(_padding)
                .spiral(_spiral);
        }

        function drawWords(data, bounds) {
            // Adapted from Jason Davies' demo app
            if(_g) {
                scale = bounds ? Math.min(
                    _size[0] / Math.abs(bounds[1].x - _size[0] / 2),
                    _size[0] / Math.abs(bounds[0].x - _size[0] / 2),
                    _size[1] / Math.abs(bounds[1].y - _size[1] / 2),
                    _size[1] / Math.abs(bounds[0].y - _size[1] / 2)) / 2 : 1;
                words = data;
                
                if(words.length!=_preRenderTagLength) {
                    //console.log( "Tag cloud lost "+
                    //    (_preRenderTagLength-words.length)
                    //    +" words.");
                }

                var text = _fg.selectAll('text')
                    .data(words, function(d) {
                        return d.text.toLowerCase();
                    });

                _translator = function(d) {
                    return 'translate('+ [d.x, d.y] +')rotate('+ d.rotate +')';
                }
                _sizer = function(d) {
                    return _fontSize(d) +"px";
                }

                // New texts
                text.transition()
                    .duration(_duration)
                    .attr('transform', _translator)
                    .style('font-size', _sizer)

                text.enter().append('text')
                        .attr('class', WORD_CLASS)
                        .style('font-size', _sizer)
                        .style('font-family', _font)
                        .style('fill', _chart.getColor)
                        //.style('opacity', 1e-6)
                        .style('cursor', 'pointer')
                        .text(_text)
                        .attr('text-anchor', 'middle')
                        .attr('transform', _translator)
                        .on('click', _onClick)
                    .transition()
                        .duration(_duration)
                        //.style('opacity', 1);

                var exitGroup = _bg.append("g")
                    .attr("transform", _fg.attr("transform"));

                var exitGroupNode = exitGroup.node();
                
                text.exit().each(function() {
                    exitGroupNode.appendChild(this);
                });

                exitGroup.transition()
                    .duration(_duration)
                    .style("opacity", 1e-6)
                    .remove();
                
                _fg.transition()
                    .delay(_duration)
                    .duration(.75*_duration)
                    .attr("transform",
                          "translate("+ [_chart.cx(), _chart.cy()] +")"
                          +"scale("+scale+")");
            }
        }

        function getCloudWords() {
            var texts = _chart.dimension().top(Infinity),
                lump = '',
                _valueAccessor = _chart.valueAccessor();

            texts.forEach(function(text) {
                lump += ',' + _valueAccessor(text);
            });

            parseText(lump);
        }

        function parseText(text) {
            // Thanks to Jason Davies. Stores word counts in `tags`
            tags = {};
            var cases = {};

            text.split(_wordSeparators).forEach(function(word) {
                if (discard.test(word)) {
                    return;
                }

                word = _normalize(word);

                word = word.replace(_punctuation, "");

                if (_stopWords.test(word.toLowerCase())) {
                    return;
                }

                word = word.substr(0, maxLength);

                if(!word.length) {
                    return;
                }

                cases[word.toLowerCase()] = word;
                tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
            });

            tags = d3.entries(tags).sort(function(a, b) {
                return b.value - a.value;
            });

            tags.forEach(function(d) { d.key = cases[d.key]; });
        }



        // Patches to get cloud to play nice with dc
        _chart.filter = function(word) {
            if(word===null) {
                // A null filter is a shortcut for _chart.filterAll() in dc
                return _chart.filterAll();
            }
            if(word===undefined) {
                return false;
            }

            var _filters = _chart.filters(),
                _idx = -1;

            if((_idx=_filters.indexOf(word))<0) {
                // Doesn't have filter yet
                _filters.push(word);
            }else{
                // Has filter. Turn it off.
                _filters.splice(_idx, 1);
            }

            _selectedWords = _filters.join(", ");

            _fs = "(";
            for(var f in _filters) {
                if(_fs.length>1) {
                    _fs+="|"
                }
                _fs += _filters[f].replace(/\s+/, _searchBreak);
            }
            _fs+=")";

            var re = RegExp(_fs, 'ig'),
                _f = function(r) { return re.test(r); };

            _chart.dimension().filterFunction(_f);

            _chart.turnOnControls();
            _chart.invokeFilteredListener(_chart, word);

            dc.redrawAll();
        }

        _chart.filterAll = function() {
            _chart.dimension().filterFunction(function(){
                return 1;
            });
            _chart.turnOffControls();
            dc.redrawAll(); 
            _chart.invokeFilteredListener(_chart, null);
        }

        _chart.turnOnControls = function () {
            _chart.selectAll(".reset")
                .style("display", null);
            _chart.selectAll(".filter")
                .text(_selectedWords)
                .style("display", null);

            return _chart;
        };



        // Make rendering and drawing available to dc.js
        _chart.doRender = function() {
            _chart.resetSvg();

            _g = _chart.svg();
            _fg = _g.append('g')
                    .attr('transform',
                          'translate('+ [_chart.cx(), _chart.cy()] +')');
            _bg = _g.append('g');

            drawChart();
            return _chart;
        };

        _chart.doRedraw = function() {
            drawChart();
            return _chart;
        };

        // Anchor the chart
        return _chart.anchor(parent, chartGroup);
    };

})(dc, d3);