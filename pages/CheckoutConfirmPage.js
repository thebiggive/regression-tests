import { checkSelectorContent } from '../support/check';
import { clickSelector } from '../support/action';

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
