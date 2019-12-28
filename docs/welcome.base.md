# dc.js

Welcome to the dc.js documentation.

This library may be used as ES6 modules or as a JS file (UMD) in your webpage.

When used as UMD in your webpage, the entire library is scoped under dc namespace.

When used as modules you will see the classes and functions as per your import
statements.

A class diagram is shown below - mixins are blue and chart classes are green. (Relations between mixins are somewhat subjective.)

<a id="insert-svg-here" />
<script>
window.fetch("../../img/class-hierarchy.svg").then(function(result) {
    result.text().then(function(content) {
    document.getElementById('insert-svg-here').outerHTML = content;
    });
    });
</script>
