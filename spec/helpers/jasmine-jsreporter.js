/*
  This file is part of the Jasmine JSReporter project from Ivan De Marino.

  Copyright (C) 2011 Ivan De Marino (aka detro, aka detronizator), http://blog.ivandemarino.me, ivan.de.marino@gmail.com

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the <organization> nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL IVAN DE MARINO BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    var finalResults;

    // Ensure that Jasmine library is loaded first
    if (!jasmine) {
        throw new Exception("[Jasmine JSReporter] 'Jasmine' library not found");
    }

    /**
     * Round an amount to the given number of Digits.
     * If no number of digits is given, than '2' is assumed.
     * @param amount Amount to round
     * @param numOfDecDigits Number of Digits to round to. Default value is '2'.
     * @return Rounded amount */
    function round (amount, numOfDecDigits) {
        numOfDecDigits = numOfDecDigits || 2;
        return Math.round(amount * Math.pow(10, numOfDecDigits)) / Math.pow(10, numOfDecDigits);
    }

    /**
     * Collect information about a Suite, recursively, and return a JSON result.
     * @param suite The Jasmine Suite to get data from
     */
    function getSuiteData (suite) {
        var suiteData = {
                passed: true,
                durationSec : 0,
                suites: [],
                description : suite.description,
                specs: []
            };

        for (var i = 0; i < suite.children.length; ++i) {
            var childFailed = false;

            if (suite.children[i] instanceof jasmine.Spec) {
                var specResult = suite.children[i].result;
                childFailed = specResult.status === "failed";

                // TEMPORARY PATCH FOR SAUCE LABS LENGTH ISSUES
                if (!childFailed) continue;

                suiteData.specs.push({
                    description : specResult.description,
                    durationSec : specResult.duration / 1000,
                    passed : specResult.status === "passed",
                    skipped : specResult.status === "disabled" || specResult.status === "pending",
                    passedCount : specResult.status === "passed" ? 1 : 0,
                    failedCount : childFailed ? 1 : 0,
                    totalCount : specResult.status !== "disabled" ? 1 : 0
                });
            } else if (suite.children[i] instanceof jasmine.Suite) {
                var childSuiteData = getSuiteData(suite.children[i]);
                childFailed = !childSuiteData.passed;

                // TEMPORARY PATCH FOR SAUCE LABS LENGTH ISSUES
                if (!childFailed) continue;

                suiteData.suites.push(childSuiteData);
            }

            suiteData.passed = childFailed ? false : suiteData.passed;
        }

        // Rounding duration numbers to 3 decimal digits
        suiteData.durationSec = round(suite.result.duration / 1000, 4);

        return suiteData;
    }

    jasmine.getJSReport = function () {
        if (finalResults) {
            return finalResults;
        }

        return null;
    };

    jasmine.getJSReportAsString = function () {
        return JSON.stringify(jasmine.getJSReport());
    };

    var JSReporter =  function () {};
    JSReporter.prototype = {
        jasmineDone: function () {
            // Attach results to the "jasmine" object to make those results easy to scrap/find
            var results = getSuiteData(jasmine.getEnv().topSuite());
            var totalDuration = 0;

            var specs = results.specs;
            for (var i = 0; i < specs.length; ++i) {
                totalDuration += specs[i].durationSec;
            }

            var suites = results.suites;
            for (i = 0; i < suites.length; ++i) {
                totalDuration += suites[i].durationSec;
            }

            results.durationSec = round(totalDuration, 4);

            finalResults = results;
        }
    };

    // export public
    jasmine.JSReporter = JSReporter;
    jasmine.getEnv().addReporter(new jasmine.JSReporter());
})();

