document.write([
    '<div id="header">',
    '<a href="http://dc-js.github.io/dc.js"><img src="../dc.logo.png" style="float:left; padding-right: 1em" width=50 height=50></img></a>',
    '<div id="links" style="padding:10px 0px 0px 10px">',
    '<a href=".">all examples</a>&nbsp;&nbsp;<a href="',
    document.location.pathname.replace(/^.*\/examples/, 'https://github.com/dc-js/dc.js/tree/master/web/examples'),
    '">source</a>',
    '</div>',
    '<hr>',
    '</div>'
].join(''));
