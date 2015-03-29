module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'app/*.js',
            'app/valueObjects/*.js',
            'test/*.js',
            'lib/*.js'
        ],
        plugins: ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-coverage'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            "app/*.js": "coverage"
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
};
