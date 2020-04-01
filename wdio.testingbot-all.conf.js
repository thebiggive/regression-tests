const { config } = require('./wdio.BASE.conf.js');

config.capabilities = [{
    browserName: 'chrome',
    platform: 'WIN10',
    version: '79',
    build: config.build,
},
{
    browserName: 'internet explorer',
    platform: 'WIN10',
    version: '11',
    build: config.build,
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
