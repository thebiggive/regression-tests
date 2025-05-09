const { config } = require('./wdio.BASE.conf.cjs');

config.capabilities[0]['goog:chromeOptions'].args = [
    '--disable-infobars',
    '--window-size=1280,800',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
];
config.services.push('chromedriver');

exports.config = config;
