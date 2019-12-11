require('dotenv').config(); // load process.env from ".env" file for local
const { TimelineService } = require('wdio-timeline-reporter/timeline-service');
// Load the libraries we need for path/filesystem manipulation
const path = require('path');
const fs = require('fs');

// Store the directory path in a global,
// which allows us to access this path inside our tests
global.downloadDir = path.join(__dirname, 'build/downloads');

exports.config = {
    onPrepare() {
        // make sure download directory exists
        if (!fs.existsSync(global.downloadDir)) {
        // if it doesn't exist, create it
            fs.mkdirSync(global.downloadDir);
        }
    },
    runner: 'local',
    path: '/',
    specs: [
        './features/**/*.feature',
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            prefs: {
                directory_upgrade: true,
                prompt_for_download: false,
                'safebrowsing.enabled': false,
                'download.default_directory': global.downloadDir,
            },
        }, // see wdio.*.conf.js
    }],
    logLevel: process.env.LOG_LEVEL || 'warn',
    coloredLogs: true,
    screenshotPath: './build/screenshots/',
    baseUrl: process.env.BASE_URL,
    waitforTimeout: 60000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    specFileRetries: 2,
    services: [
        [TimelineService],
    ], // see wdio.*.conf.js for additional entries
    framework: 'cucumber',
    reporters: [
        'spec',
        ['timeline', {
            outputDir: './build',
            embedImages: true,
            screenshotStrategy: 'before:click',
        }],
        ['junit', {
            outputDir: './build/wdio',
            outputFileFormat(options) {
                return `results-${options.cid}.${options.capabilities}.xml`;
            },
        }],
    ],
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
        timeout: 60000,
    },
    before: function before() {
        const chai = require('chai');
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();
    },
};
