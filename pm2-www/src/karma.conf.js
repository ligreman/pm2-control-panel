// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-junit-reporter'),
            require('karma-nyan-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../target/coverage'),
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        junitReporter: {
            outputDir: require('path').join(__dirname, '../target/test-results/'),
            outputFile: 'test-results.xml',
            useBrowserName: false,
            suite: 'mySuite' // suite will become the package name attribute in xml testsuite element
        },
        nyanReporter: {
            // only render the graphic after all tests have finished.
            // This is ideal for using this reporter in a continuous integration environment.
            renderOnRunCompleteOnly: false // default is false
        },
        reporters: ['nyan', 'kjhtml', 'junit'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        // browsers: ['Chrome'],
        browsers: ['ChromeNoSandbox'],
        customLaunchers: {
            ChromeNoSandbox: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false
    });
};
