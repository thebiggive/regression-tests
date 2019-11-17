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
const titleSelector = '#title-select';
const firstNameSelector = '#first-name';
const lastNameSelector = "input[name='last-name']";
const addressSelector = '#paf_addr';
const addressAutoCompleteSelector = 'li[title*="WC2B 5LX, Reed Online,"';
const agreeCheckboxSelector = 'label[for=agree-check]';
const submitBtnSelector = '.js-next-button';
const proceedAsGuestSelector = 'a*=Proceed as guest';
const guestEmail = 'regression-test@example.org';


/**
 * checkout Registration page
 */
export default class CheckoutRegistrationPage {
    /**
     * confirm that I'm on the right place
     */
    static checkReady() {
        wait();
        checkUrlMatch(
            'payments-.*\\.thebiggivetest\\.org\\.uk\\/api\\/.*\\/checkout'
        );
        checkTitle('You are donating to ChoraChori', 8);
        checkSelectorContent(
            headingSelector,
            'You are donating to ChoraChori', 2
        );
    }

    /**
     * checkout registration form
     */
    static register() {
        wait(5);
        inputSelectorValue(emailInputSelector, guestEmail);
        clickSelector(btnNextSelector);
        checkSelectorContent(
            emailErrorSelector,
            'This email is already in use. Please Sign In to your '
            + 'existing account or use another email address.'
        );
        clickSelector(proceedAsGuestSelector);

        setSelectOption(countrySelector, 'string:GB');
        setSelectOption(titleSelector, 'string:Dr');
        inputSelectorValue(firstNameSelector, 'Regression');
        inputSelectorValue(lastNameSelector, 'Test');
        inputSelectorValue(addressSelector, 'WC2B 5LX');
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
