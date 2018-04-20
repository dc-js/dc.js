function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value !== 0;
            });
        }
    };
}
function ordinal_filter(bins) {
    return function(d) {
        return bins.indexOf(d) >=0;
    };
}

function startOrdinal(initChart) {
    d3.json('../examples/fruits.json').then(function(counts) {
        var ndx            = crossfilter(counts),
            fruitDimension = ndx.dimension(function(d) {return d.name;}),
            sumGroup       = fruitDimension.group().reduceSum(function(d) {return d.cnt;}),
            sumGroupFiltered = remove_empty_bins(sumGroup),
            fruit2 = ndx.dimension(function(d) {return d.name;});

        var chart = initChart(fruitDimension, sumGroupFiltered);
        chart.render();

        var ordinary_ordering = chart.ordering();
        var reset = function() {
            chart.ordering(ordinary_ordering);
            fruit2.filter(null);
        };
        window.button1 = transitionTest.oscillate(function() {
            fruit2.filter(ordinal_filter(['grapefruit', 'lime', 'orange', 'pomegranate']));
        }, reset);
        window.button2 = transitionTest.oscillate(function() {
            fruit2.filter(ordinal_filter(['apple', 'banana', 'grape', 'grapefruit']));
        }, reset);
        window.button3 = transitionTest.oscillate(function() {
            fruit2.filter(ordinal_filter(['apple', 'banana', 'orange', 'pomegranate']));
        }, reset);
        window.button4 = transitionTest.oscillate(function() {
            // reverse alphabetic sort
            // we don't have complete control over the ordering, because dc.js uses
            // crossfilter.quicksort.by: https://github.com/dc-js/dc.js/issues/1161
            // so append a low character ('`' is before 'a') and then subtract each
            // character from 'z' and add 'a'
            chart.ordering(function(kv) {
                var chars = kv.key.split('');
                chars.push('`');
                return chars.map(function(s) {
                    return String.fromCharCode(122+97-s.charCodeAt(0));
                }).join('');
            });
        }, reset);
        window.button5 = transitionTest.oscillate(function() {
            chart.ordering(function(kv) { return kv.key.split('').reverse().join(''); });
        }, reset);
    });
}
