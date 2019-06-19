# dc.js

Welcome to the dc.js documentation.

The entire library is scoped under {@link dc the dc namespace}. Its child namespaces contain utilities.

A class diagram is shown below - mixins are blue and chart classes are green. (Relations between mixins are somewhat subjective.)

<a id="insert-svg-here" />
<script src="../../js/promise-polyfill.js"></script>
<script src="../../js/fetch.umd.js"></script>
<script>
window.fetch("../../img/class-hierarchy.svg").then(function(result) {
    result.text().then(function(content) {
    document.getElementById('insert-svg-here').outerHTML = content;
    });
    });
</script>
