require('dotenv').config(); // load process.env from ".env" file for local

exports.config = {
    runner: 'local',
    path: '/',
    specs: [
        './features/**/*.feature',
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {}, // see wdio.*.conf.js
    }],
    logLevel: 'warn',
    coloredLogs: true,
    screenshotPath: './build/screenshots/',
    baseUrl: 'https://donate-staging.thebiggivetest.org.uk/',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [], // see wdio.*.conf.js
    framework: 'cucumber',
    reporters: ['spec'],
    cucumberOpts: {
        backtrace: false,
        requireModule: ['@babel/register'],
        failAmbiguousDefinitions: true,
        failFast: false,
        ignoreUndefinedDefinitions: false,
        name: [],
        snippets: true,
        source: true,
        profile: [],
        require: [
            './steps/**/*.js',
        ],
        snippetSyntax: undefined,
        strict: true,
        tagExpression: 'not @Pending',
        tagsInTitle: false,
        timeout: 20000,
    },
    before: function before() {
        const chai = require('chai');
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();
    },
};
