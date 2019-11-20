import { goToUrl } from '../support/util';
import { inputSelectorValue, clickSelector } from '../support/action';
import { checkTitle } from '../support/check';

// routes
const adminPage = process.env.ADMIN_URL;

// selectors
const emailSelector = 'input[placeholder=Email]';
const passwordSelector = 'input[placeholder=Password]';
const loginBtnSelector = 'button=Log in';

// checks
const titleCheck = 'The Big Give – Charity Login';

// inputs
const emailInput = process.env.ADMIN_EMAIL;
const passwordInput = process.env.ADMIN_PASSWORD;

/**
 * Charity Admin Page
 */
export default class AdminPage {
    /**
     * open login page
     */
    static open() {
        goToUrl(adminPage);
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
