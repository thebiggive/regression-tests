import { Before as before, After as after } from '@cucumber/cucumber';

before(async (scenario) => {
    console.log(`INFO: Starting scenario "${scenario.pickle.name}"`);
});

after(async (scenarioResult) => {
    // Here it is added to a failed step, but each time you call
    // `browser.saveScreenshot()` it will automatically be added to the report
    const status = scenarioResult && scenarioResult.result && scenarioResult.result.status;
    if (status !== 'PASSED') {
        // It will add the screenshot to the JSON
        await console.warn('WARNING: Step Failed - screenshot being taken...');

        const datetime = encodeURIComponent((new Date()).toISOString());
        const filePath = `build/failure-${datetime}.png`;
        await browser.saveScreenshot(filePath);
    }
    return status;
});
