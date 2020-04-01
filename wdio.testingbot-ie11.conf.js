const { config } = require('./wdio.BASE.conf.js');

config.capabilities = [{
    browserName: 'internet explorer',
    platform: 'WIN10',
    version: '11',
    build: `${process.env.CIRCLE_BRANCH}-${process.env.CIRCLE_BUILD_NUM}`,
}];
config.services.push('testingbot');

config.path = '/wd/hub';
config.user = process.env.TESTINGBOT_KEY;
config.key = process.env.TESTINGBOT_SECRET;

config.reporters.push(['junit', {
    outputDir: './build/wdio',
    outputFileFormat(options) {
        return `results-${options.cid}.${options.capabilities}.xml`;
    },
}]);

exports.config = config;
