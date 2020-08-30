// Karma configuration
// Generated on Thu Jul 05 2018 16:43:26 GMT+0530 (IST)

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('@chiragrupani/karma-chromium-edge-launcher'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-firefox-launcher'),
            require('karma-jasmine'),
            require('karma-safari-launcher'),
            require('karma-summary-reporter'),
        ],
        files: [
            // CSS files
            'dist/style/dc.css',
            // Helpers
            'spec/helpers/*.js',
            // JS code dependencies
            'spec/3rd-party/*.js',
            // Code to be tested
            'dist/dc.js',
            // Jasmine spec files
            'spec/*spec.js'
        ],
        exclude: [],
        preprocessors: {},
        // possible values: 'dots', 'progress'
        reporters: ['progress', 'summary'],
        summaryReporter: {
            // 'failed', 'skipped' or 'all'
            show: 'failed',
            // Limit the spec label to this length
            specLength: 100,
            // Show an 'all' column as a summary
            overviewColumn: true
        },
        customLaunchers: {
            // See https://github.com/karma-runner/karma/issues/2603
            // This is used by grunt:ci task, so, do not remove
            ChromeNoSandboxHeadless: {
                base: 'Chrome',
                flags: [
                    '--no-sandbox',
                    // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
                    '--headless',
                    '--disable-gpu',
                    // Without a remote debugging port, Google Chrome exits immediately.
                    ' --remote-debugging-port=9222'
                ]
            },
            FirefoxHeadless: {
                base: 'Firefox',
                flags: ['-headless']
            }
        },
        port: 9876,
        colors: true,
        logLevel: 'INFO',
        autoWatch: false,
        browsers: ['FirefoxHeadless'],
        browserConsoleLogOptions: {level: 'error'},
        singleRun: true,
        concurrency: Infinity
    })
};
