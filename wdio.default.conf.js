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
config.services.push('docker');
config.dockerOptions = {
    image: 'blueimp/chromedriver',
    healthCheck: {
        url: 'http://localhost:4444',
        maxRetries: 3,
        inspectInterval: 1000,
        startDelay: 2000,
    },
    options: {
        p: ['4444:4444'],
        init: true,
        shmSize: '2g',
    },
    command: 'sudo docker run --workdir ~/app',
};

exports.config = config;
