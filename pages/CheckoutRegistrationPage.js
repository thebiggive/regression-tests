import { wait, generateIdentifier } from '../support/util';
import {
    checkUrlMatch, checkTitle, checkSelectorContent, checkIfElementExists
} from '../support/check';
import {
    inputSelectorValue,
    clickSelector,
    setSelectOption,
    sendKeys
} from '../support/action';

// selectors
const headingSelector = '#main h1';
const emailInputSelector = '#email-field';
const countrySelector = '#country-select';
const firstNameSelector = '#first-name';
const lastNameSelector = "input[name='last-name']";
const addressSelector = '#paf_addr';
const addressAutoCompleteSelector = 'li[title*="WC2B 5LX, Reed Online,"';
const agreeCheckboxSelector = 'label[for=agree-check]';
const submitBtnSelector = '.js-next-button';

// checks
const urlCheck = 'payments-.*\\.thebiggivetest\\.org\\.uk\\/api\\/.*\\/'
    + 'checkout';
const titleCheck = 'You are donating to ChoraChori';
const pageHeadingCheck = 'You are donating to ChoraChori';

// inputs
export const countryInput = 'string:GB';
export const firstNameInput = 'Regression';
export const lastNameInput = generateIdentifier('Lastname-');
export const addressInput = 'WC2B 5LX';
export const guestEmailInput = 'regression-test@example.org';

/**
 * checkout Registration page
 */
export default class CheckoutRegistrationPage {
    /**
     * check if page ready
     */
    static checkReady() {
        wait(10);
        checkUrlMatch(
            urlCheck
        );
        checkTitle(titleCheck, 8);
        checkSelectorContent(
            headingSelector,
            pageHeadingCheck,
            2
        );
    }

    /**
     * register as guest
     */
    static proceedAsGuest() {
        wait(5);
    }

    /**
     * fill all form elements
     */
    static fillForm() {
        wait(5);
        // workaround to prepare the form
        clickSelector(submitBtnSelector);
        setSelectOption(countrySelector, countryInput);
        inputSelectorValue(firstNameSelector, firstNameInput);
        inputSelectorValue(lastNameSelector, lastNameInput);
        inputSelectorValue(emailInputSelector, guestEmailInput);
        inputSelectorValue(addressSelector, addressInput);
        checkIfElementExists(
            addressAutoCompleteSelector
        );
        sendKeys('\ue015'); // ARROW_DOWN
        sendKeys('\uE007'); // press enter to select address
        wait(3);
        // workaround
        // the normal click will click on links of terms & privacy
        // inject js snippet to be able to click the checkbox
        browser.execute(() => {
            document.querySelector('[for="agree-check"]')
                .innerHTML = 'I have read and agree to the Charity'
                + 'Checkout terms & conditions and privacy policy.';
        });
        wait(2);
        clickSelector(agreeCheckboxSelector); // click left side
    }

    /**
     * submit registration
     */
    static submitForm() {
        wait(3);
        clickSelector(submitBtnSelector);
    }
}
