import {Given, Then} from '@cucumber/cucumber';
import {goToUrl} from '../support/util';
import {checkSelectorContent, checkTitle} from '../support/check';
import checkNoAccessibilityViolations from '../support/a11y';

Given(
    'I am on the Explore page',
    async () => {
        const baseurl = process.env.BASE_URL;
        if (!baseurl) {
            throw new Error('BASE_URL not defined in enviornment');
        }

        await goToUrl(baseurl + "/explore");
        await checkTitle('Explore Campaigns - Big Give');

        await checkNoAccessibilityViolations(
            {withSalesforceHeaderException: false, withContrastRatioException: false}
        );
    }
);

Then(
    /I should see an explore grid containing text "(.*)"/,
    async (text: string) => {
        await checkSelectorContent('.campaign-grid', text);
    }
)
