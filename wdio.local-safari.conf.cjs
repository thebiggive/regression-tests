const { config } = require('./wdio.BASE.conf.cjs');

config.capabilities[0].browserName = 'safari';
delete config.capabilities[0]['goog:chromeOptions'];

exports.config = config;
