import { checkSelectorContent } from '../support/check';
import { clickSelector } from '../support/action';
import { wait } from '../support/util';

// selectors
const pageHeadingSelector = '#main h2';
const submitBtnSelector = 'a.btn=Confirm donation';

// checks
const pageHeadingCheck = 'Confirm your donation';

/**
 * confirm step page object
 */
export default class CheckoutConfirmPage {
    /**
     * check if page ready
     */
    static checkReady() {
        wait(10); // fix for Element "#main h2" is not displayed in CI
        checkSelectorContent(
            pageHeadingSelector,
            pageHeadingCheck
        );
    }

    /**
     * press next button
     */
    static submitForm() {
        clickSelector(submitBtnSelector);
    }
}
