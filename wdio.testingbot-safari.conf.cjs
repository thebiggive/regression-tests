const { config } = require('./wdio.BASE.conf.ts');

config.capabilities = [{
    browserName: 'safari',
    platform: 'VENTURA',
    version: '16', // 16.3 – older than the point releases which last reached iOS – as of April 2025
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
