const { config } = require('./wdio.BASE.conf.ts');

config.capabilities = [
    {
        browserName: 'chrome',
        platform: 'WIN10',
        version: '90',
        build: config.build,
    },
    {
        browserName: 'internet explorer',
        platform: 'WIN10',
        version: '11',
        build: config.build,
        // Default scroll behaviour led IE11 to get super confused and despite it supposedly
        // scrolling to where an element was clickable, we would hit cases where it was 'behind'
        // the nav bar (which is fixed position), leading the test to click a link and navigate to
        // an unrelated page. Modifying this flag seems to resolve this so far.
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
