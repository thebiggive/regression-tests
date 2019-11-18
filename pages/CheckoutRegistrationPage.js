import { wait } from '../support/util';
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
const btnNextSelector = 'button=Next';
const emailErrorSelector = 'span.ut-email-error';
const countrySelector = '#country-select';
const formTitleSelector = '#title-select';
const firstNameSelector = '#first-name';
const lastNameSelector = "input[name='last-name']";
const addressSelector = '#paf_addr';
const addressAutoCompleteSelector = 'li[title*="WC2B 5LX, Reed Online,"';
const agreeCheckboxSelector = 'label[for=agree-check]';
const submitBtnSelector = '.js-next-button';
const proceedAsGuestSelector = 'a*=Proceed as guest';
const guestEmail = 'regression-test@example.org';

// checks
const urlCheck = 'payments-.*\\.thebiggivetest\\.org\\.uk\\/api\\/.*\\/'
                + 'checkout';
const titleCheck = 'You are donating to ChoraChori';
const pageHeadingCheck = 'You are donating to ChoraChori';
const emailErrorCheck = 'This email is already in use. Please Sign In to your '
+ 'existing account or use another email address.';

// inputs
const countryInput = 'string:GB';
const formTitleInput = 'string:Dr';
const firstNameInput = 'Regression';
const lastNameInput = 'Test';
const addressInput = 'WC2B 5LX';

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
        inputSelectorValue(emailInputSelector, guestEmail);
        clickSelector(btnNextSelector);
        // checkSelectorContent(emailErrorSelector, emailErrorCheck);
        // clickSelector(proceedAsGuestSelector);
    }

    /**
     * fill all form elements
     */
    static fillForm() {
        setSelectOption(countrySelector, countryInput);
        // setSelectOption(formTitleSelector, formTitleInput);
        inputSelectorValue(firstNameSelector, firstNameInput);
        inputSelectorValue(lastNameSelector, lastNameInput);
        inputSelectorValue(addressSelector, addressInput);
        checkIfElementExists(
            addressAutoCompleteSelector
        );
        sendKeys('\ue015'); // ARROW_DOWN
        sendKeys('\uE007'); // press enter to select address
        wait(3);
        clickSelector(agreeCheckboxSelector, { x: -50 }); // click left side
    }

    /**
     * submit registration
     */
    static submitForm() {
        wait(3);
        clickSelector(submitBtnSelector);
    }
}
