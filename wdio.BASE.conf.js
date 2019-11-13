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
    logLevel: process.env.LOG_LEVEL || 'warn',
    coloredLogs: true,
    screenshotPath: './build/screenshots/',
    baseUrl: process.env.BASE_URL,
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
        tagExpression: 'not @ignore',
        tagsInTitle: false,
        timeout: 30000,
    },
    before: function before() {
        const chai = require('chai');
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();
    },
};
