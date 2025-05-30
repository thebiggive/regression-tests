const { config } = require('./wdio.BASE.conf.cjs');

config.capabilities = [{
    browserName: 'chrome',
    platform: 'WIN11',
    version: 'latest',
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
