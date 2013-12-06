// Merge jasmine and vows coverage objects

var istanbul = require('istanbul');

var jasmineCoverageJSON = '../coverage/jasmine/coverage.json';
var vowsCoverageJSON = '../coverage/vows/coverage.json';
var mergedOutputDir = './coverage/merged';


var jasmineFileCoverage = getDCFileCoverage(require(jasmineCoverageJSON));
var vowsFileCoverage = getDCFileCoverage(require(vowsCoverageJSON));

var mergedFileCoverage = istanbul.utils.mergeFileCoverage(jasmineFileCoverage, vowsFileCoverage);
mergedFileCoverage.path = './dc.js';
var mergedCoverage = { './dc.js/dc.js': mergedFileCoverage };

var collector = new istanbul.Collector();
collector.add(mergedCoverage);

var htmlReport = istanbul.Report.create('html', { dir: mergedOutputDir });
htmlReport.writeReport(collector, false);

var textSummaryReport = istanbul.Report.create('text-summary');
textSummaryReport.writeReport(collector, false);

function getDCFileCoverage(coverage) {
    return coverage[
        Object.keys(coverage).filter(function(k) {
            return /dc\.js$/.test(k);
        })[0]
    ];
}
