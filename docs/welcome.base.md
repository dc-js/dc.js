# dc.js

Welcome to the dc.js documentation.

This library id developed using Typescript and may be used as ES6 modules or as a JS file (UMD) in your webpage.
Type definitions are included with the distribution.

When used as UMD in your webpage, the entire library is scoped under `dc` namespace.

When used as modules you will see the classes and functions as per your import
statements.

A class diagram is shown below - mixins are blue and chart classes are green.
Users if this library will usually be using the Chart classes.
The documentation includes all methods and properties supported by a chart including inherited ones.

<div>
<span id="insert-svg-here"></span>
</div>

<script type="application/javascript">
window.fetch("../img/class-hierarchy.svg").then(result => {
    result.text().then(content => document.getElementById('insert-svg-here').outerHTML = content);
});
</script>
