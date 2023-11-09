
require('dotenv').config(); // load process.env from ".env" file for local
// Load the libraries we need for path/filesystem manipulation
const path = require('path');
const fs = require('fs');

// Store the directory path in a global,
// which allows us to access this path inside our tests
global.downloadDir = path.join(__dirname, 'build/downloads');

let build = 'local';
if (process.env.CIRCLE_BUILD_NUM && process.env.CIRCLE_BUILD_NUM) {
    build = `${process.env.CIRCLE_BRANCH}-${process.env.CIRCLE_BUILD_NUM}`;
}

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
    build,
    logLevel: process.env.LOG_LEVEL || 'warn',
    coloredLogs: true,
    screenshotPath: './build/screenshots/',
    baseUrl: process.env.BASE_URL,
    waitforTimeout: 90000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    specFileRetries: 2,
    services: [
    ], // see wdio.*.conf.js for additional entries
    framework: 'cucumber',
    reporters: [
        'spec',
        ['junit', {
            outputDir: './build/wdio',
            outputFileFormat(options) {
                return `results-${options.cid}.${options.capabilities}.xml`;
            },
        }],
        ['html-nice', {
            outputDir: './build/wdio/html-reports/',
            filename: 'report.html',
            reportTitle: 'Regression tests report',
            linkScreenshots: true,
            showInBrowser: false,
            collapseTests: false,
            // to turn on screenshots after every test
            useOnAfterCommandForScreenshot: false
        }],
    ],
    cucumberOpts: {
        backtrace: false,
        requireModule: [],
        failAmbiguousDefinitions: true,
        failFast: false,
        ignoreUndefinedDefinitions: false,
        name: [],
        snippets: true,
        source: true,
        profile: [],
        require: ['./steps/**/*.js'],
        snippetSyntax: undefined,
        strict: true,
        tagsInTitle: false,
        timeout: 90000,
    },
};
