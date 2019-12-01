require('dotenv').config(); // load process.env from ".env" file for local
const { TimelineService } = require('wdio-timeline-reporter/timeline-service');
// Load the libraries we need for path/filesystem manipulation
const path = require('path');
const fs = require('fs');

// Store the directory path in a global,
// which allows us to access this path inside our tests
const downloadDir = path.join(__dirname, 'tempDownload');

/**
  Pulled from https://gist.github.com/tkihira/2367067
  this could be moved to a separate file if we wanted
  @param {string} dir directory path
 */
function rmdir(dir) {
    const list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i += 1) {
        const filename = path.join(dir, list[i]);
        const stat = fs.statSync(filename);

        if (filename === '.' || filename === '..') {
        // pass these files
        } else if (stat.isDirectory()) {
        // rmdir recursively
            rmdir(filename);
        } else {
        // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
}

exports.config = {
    onPrepare() {
        console.log('Download Dir: ', downloadDir);
        // make sure download directory exists
        if (!fs.existsSync(downloadDir)) {
        // if it doesn't exist, create it
            fs.mkdirSync(downloadDir);
        }
    },
    onComplete() {
        // rmdir(downloadDir);
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
                'download.default_directory': downloadDir,
            },
        }, // see wdio.*.conf.js
    }],
    logLevel: process.env.LOG_LEVEL || 'warn',
    coloredLogs: true,
    screenshotPath: './build/screenshots/',
    baseUrl: process.env.BASE_URL,
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
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
        timeout: 30000,
    },
    before: function before() {
        const chai = require('chai');
        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();
    },
};
