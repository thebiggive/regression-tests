const { config } = require('./wdio.BASE.conf.ts');

// For possible browsers see https://testingbot.com/support/getting-started/browsers.html
config.capabilities = [
    {
        browserName: 'chrome',
        platform: 'WIN11',
        version: 'latest',
        build: config.build,
    },
    {
        browserName: 'safari',
        platform: 'VENTURA',
        version: '16',
        build: config.build,
    },
    {
        browserName: 'microsoftedge',
        platform: 'WIN11',
        version: 'latest',
        build: config.build,
        // MS Edge, like IE, seems to also have problems with scroll mgmt behaviour.
        // https://stackoverflow.com/questions/52276194
        // Modifying this flag resolved wrong elements getting some clicks in IE11.
        elementScrollBehavior: 1, // from bottom.
    },
];
config.maxInstances = 2;
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
