import { goToUrl } from '../support/util';
import { inputSelectorValue, clickSelector } from '../support/action';
import { checkTitle } from '../support/check';

// routes
const charityPortalUrl = process.env.CHARITY_PORTAL_URL;

// selectors
const emailSelector = 'input[placeholder=Email]';
const passwordSelector = 'input[placeholder=Password]';
const loginBtnSelector = 'button=Log in';

// checks
const titleCheck = 'The Big Give – Charity Login';

// inputs
const emailInput = process.env.CHARITY_PORTAL_EMAIL;
const passwordInput = process.env.CHARITY_PORTAL_PASSWORD;

/**
 * Login page for charity portal / Community users
 */
export default class CharityPortalLoginPage {
    /**
     * open login page
     */
    static open() {
        goToUrl(charityPortalUrl);
    }

    /**
     * check if page ready
     */
    static checkReady() {
        checkTitle(titleCheck);
    }

    /**
     * fill login credentials
     */
    static fillForm() {
        inputSelectorValue(
            emailSelector,
            emailInput
        );
        inputSelectorValue(passwordSelector, passwordInput);
    }

    /**
     * submit login form
     */
    static submitForm() {
        clickSelector(loginBtnSelector);
    }
}
