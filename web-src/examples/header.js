window.onload = function () {
    const path = document.location.pathname;
    const dir = /^.*\/([a-z]+)\//.exec(path)[1];
    const filename = path.substring(path.lastIndexOf('/') + 1);

    document.getElementById(
        'header'
    ).innerHTML = `<a href="//dc-js.github.io/dc.js"><img src="../dc.logo.png" style="float:left; margin-right: 1em" width=50 height=50></img></a>
<div id="links" style="padding:10px 0px 0px 10px">
    <a href=".">all ${dir}</a>
    &emsp;
    <a href="https://github.com/dc-js/dc.js/tree/develop/web-src/${dir}/${filename}">source</a>
    <div style="float:right">
        <span id="version"></span>
    </div>
</div>
<hr>`;

    d3.select('#version').text(`v${dc.version}`);
};
