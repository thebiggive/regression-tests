import { Before as before, After as after } from 'cucumber';

before((scenario) => {
    console.log(`INFO: Starting scenario "${scenario.pickle.name}"`);
});

after((scenarioResult) => {
    // Here it is added to a failed step, but each time you call
    // `browser.saveScreenshot()` it will automatically be added to the report
    if (scenarioResult.result.status !== 'passed') {
        // It will add the screenshot to the JSON
        console.warn('WARNING: Step Failed - screenshot being taken...');

        const datetime = encodeURIComponent((new Date()).toISOString());
        const filePath = `build/failure-${datetime}.png`;
        browser.saveScreenshot(filePath);
    }
    return scenarioResult.status;
});
