import { generateIdentifier } from '../support/util';
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
const subHeadingSelector = '#main h2';
const emailInputSelector = '#email-field';
const countrySelector = '#country-select';
const firstNameSelector = '#first-name';
const lastNameSelector = "input[name='last-name']";
const addressSelector = '#paf_addr';
const addressAutoCompleteSelector = 'li[title*="WC2B 5LX, Reed Online,"';

// Use the T&Cs label. The checkbox is not directly interactable because of the
// use of a hidden native element + visible psuedo-element.
const agreeCheckboxSelector = 'label[for=agree-check]';
const submitBtnSelector = '.js-next-button';

// checks
const urlCheck = 'payments-.*\\.thebiggivetest\\.org\\.uk\\/api\\/.*\\/'
    + 'checkout';
const titleCheck = 'You are donating to Regression Test Charity';
const pageHeadingCheck = 'You are donating to Regression Test Charity';
const pageSubHeadingCheck = 'Donated before?';

// inputs
export const countryInput = 'string:GB';
export const firstNameInput = generateIdentifier('Firstname-');
export const lastNameInput = generateIdentifier('Lastname-');
export const addressInput = 'WC2B 5LX';
export const guestEmailInput = 'tech+regression+tests@thebiggive.org.uk';

/**
 * checkout Registration page
 */
export default class EnthuseRegistrationPage {
    /**
     * check if page ready
     */
    static checkReady() {
        checkUrlMatch(urlCheck);
        checkTitle(titleCheck);
        checkSelectorContent(headingSelector, pageHeadingCheck);
        checkSelectorContent(subHeadingSelector, pageSubHeadingCheck, 45);
    }

    /**
     * fill all form elements
     */
    static fillForm() {
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

        // Clicking the label at the default position breaks (at least
        // sometimes) because it contains links we don't want to click.
        // (-250, 0) seemed to work in both Chrome + IE11 with the
        // Charity Checkout brand in the copy.
        // (-300, 0) passes locally in Chrome with the Enthuse brand
        // but has not yet been tested cross-browser.
        clickSelector(agreeCheckboxSelector, { x: -300, y: 0 });
    }

    /**
     * submit registration
     */
    static submitForm() {
        clickSelector(submitBtnSelector);
    }
}
