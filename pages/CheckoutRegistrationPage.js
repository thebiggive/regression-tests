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
const agreeCheckboxSelector = 'label[for=agree-check]';
const submitBtnSelector = '.js-next-button';

// checks
const urlCheck = 'payments-.*\\.thebiggivetest\\.org\\.uk\\/api\\/.*\\/'
    + 'checkout';
const titleCheck = 'You are donating to ChoraChori';
const pageHeadingCheck = 'You are donating to ChoraChori';
const pageSubHeadingCheck = 'Donated before?';

// inputs
export const countryInput = 'string:GB';
export const firstNameInput = 'Regression';
export const lastNameInput = generateIdentifier('Lastname-');
export const addressInput = 'WC2B 5LX';
export const guestEmailInput = 'tech+regression+tests@thebiggive.org.uk';

/**
 * checkout Registration page
 */
export default class CheckoutRegistrationPage {
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

        // Work around an issue clicking the label when it has links in, by
        // hacking the label to replace its copy with plain text.
        browser.execute(() => {
            document.getElementsByClassName('agree-box')[0]
                .getElementsByTagName('label')[0]
                .innerHTML = 'native terms label e2e test replacement copy';
        });

        clickSelector(agreeCheckboxSelector);
    }

    /**
     * submit registration
     */
    static submitForm() {
        clickSelector(submitBtnSelector);
    }
}
