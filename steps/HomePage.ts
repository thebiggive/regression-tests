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
        await checkTitle('Big Give');
    }
);
Then(
    /^there should be no accessibility violations detected$/,
    async function () {
    await checkNoAccessibilityViolations(
        {withAngularStepperException: false, withSalesforceHeaderException: false, withContrastRatioException: true}
    );
});
