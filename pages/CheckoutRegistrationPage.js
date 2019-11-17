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
import { WAIT_SECONDS } from '../support/constants';

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
const countryCheck = 'string:GB';
const formTitleCheck = 'string:Dr';
const firstNameCheck = 'Regression';
const lastNameCheck = 'Test';
const addressCheck = 'WC2B 5LX';

/**
 * checkout Registration page
 */
export default class CheckoutRegistrationPage {
    /**
     * check if page ready
     */
    static checkReady() {
        wait(WAIT_SECONDS);
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
     * checkout registration form
     */
    static register() {
        wait(5);
        inputSelectorValue(emailInputSelector, guestEmail);
        clickSelector(btnNextSelector);
        checkSelectorContent(emailErrorSelector, emailErrorCheck);
        clickSelector(proceedAsGuestSelector);

        setSelectOption(countrySelector, countryCheck);
        setSelectOption(formTitleSelector, formTitleCheck);
        inputSelectorValue(firstNameSelector, firstNameCheck);
        inputSelectorValue(lastNameSelector, lastNameCheck);
        inputSelectorValue(addressSelector, addressCheck);
        checkIfElementExists(
            addressAutoCompleteSelector
        );
        sendKeys('\ue015'); // ARROW_DOWN
        sendKeys('\uE007'); // press enter to select address
        wait(3);
        clickSelector(agreeCheckboxSelector, { x: 50 }); // click left side
        wait(3);
        clickSelector(submitBtnSelector);
    }
}
