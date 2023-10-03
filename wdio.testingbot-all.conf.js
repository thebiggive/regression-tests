const { config } = require('./wdio.BASE.conf.ts');

config.capabilities = [
    {
        browserName: 'chrome',
        platform: 'WIN10',
        version: '117',
        build: config.build,
    },
    {
        browserName: 'microsoftedge',
        platform: 'WIN10',
        version: '111',
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
