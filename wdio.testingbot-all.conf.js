const { config } = require('./wdio.BASE.conf.ts');

config.capabilities = [
    {
        browserName: 'safari',
        platform: 'SEQUOIA',
        version: '18',
        build: config.build,
        elementScrollBehavior: 1, // from bottom.
    },
];
config.maxInstances = 1;
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
