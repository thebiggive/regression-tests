const { config } = require('./wdio.BASE.conf.js');

config.capabilities[0]['goog:chromeOptions'].args = [
    '--disable-infobars',
    '--window-size=1280,800',
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
];

config.reporters.push(['junit', {
    outputDir: './build/wdio',
    outputFileFormat(options) {
        return `results-${options.cid}.${options.capabilities}.xml`;
    },
}]);

exports.config = config;
