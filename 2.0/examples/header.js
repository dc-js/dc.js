!function() {
    var path = document.location.pathname;
    var dir = /^.*\/([a-z]+)\//.exec(path)[1];
    var filename = path.substring(path.lastIndexOf('/')+1);
    document.write([
        '<div id="header">',
        '<a href="http://dc-js.github.io/dc.js"><img src="../dc.logo.png" style="float:left; padding-right: 1em" width=50 height=50></img></a>',
        '<div id="links" style="padding:10px 0px 0px 10px">',
        '<a href=".">all ' + dir + '</a>&emsp;<a href="',
        'https://github.com/dc-js/dc.js/tree/master/web/' + dir + '/' + filename,
        '">source</a>',
        '<div style="float:right"><span id="version"></span></div>',
        '</div>',
        '<hr>',
        '</div>'
    ].join(''));
    window.onload = function() {
        d3.select('#version').text('v' + dc.version);
    };
}();
