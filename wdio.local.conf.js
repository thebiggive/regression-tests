const { config } = require('./wdio.BASE.conf.js');

config.capabilities[0]['goog:chromeOptions'].args = [
    '--disable-infobars',
    '--window-size=1280,800',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
];
config.services = ['chromedriver'];

exports.config = config;
