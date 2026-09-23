import {Given, Then} from "@cucumber/cucumber";
import {goToUrl} from "../support/util";
import checkNoAccessibilityViolations from "../support/a11y";
import {checkTitle} from '../support/check';

Given(
    'I am on the home page',
    async () => {
        const baseurl = process.env.BASE_URL;
        if (!baseurl) throw new Error('BASE_URL not defined in enviornment');

        await goToUrl(baseurl + "?noredirect=");
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(1000); // Safari seems to be having trouble with no pause
        await checkTitle('Big Give');
    }
);
Then(
    /^there should be no accessibility violations detected$/,
    async function () {
    await checkNoAccessibilityViolations(
        {withSalesforceHeaderException: false, withContrastRatioException: true}
    );
});
