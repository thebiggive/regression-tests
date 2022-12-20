import { goToUrl } from '../support/util';
import { inputSelectorValue, clickSelector } from '../support/action';
import { checkTitle } from '../support/check';

// routes
const charityPortalUrl = process.env.CHARITY_PORTAL_URL;

// selectors
const usernameSelector = 'input[placeholder=Username]';
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
    static async open() {
        await goToUrl(charityPortalUrl);
    }

    static async checkReady() {
        await checkTitle(titleCheck);
    }

    /**
     * fill login credentials
     */
    static async fillForm() {
        await inputSelectorValue(
            usernameSelector,
            emailInput
        );
        await inputSelectorValue(passwordSelector, passwordInput);
    }

    static async submitForm() {
        await clickSelector(loginBtnSelector);
    }
}
