import { checkSelectorContent } from '../support/check';
import { wait } from '../support/util';
import { clickSelector } from '../support/action';
import { WAIT_SECONDS } from '../support/constants';

// selectors
const pageHeadingSelector = 'main h2';
const submitBtnSelector = 'a.btn=Next';

// checks
const pageHeadingCheck = 'Please check the details of your donation';

/**
 * confirm step page object
 */
export default class CheckoutConfirmPage {
    /**
     * check if page ready
     */
    static checkReady() {
        wait(WAIT_SECONDS);
        checkSelectorContent(
            pageHeadingSelector,
            pageHeadingCheck
        );
    }

    /**
     * press next button
     */
    static submitForm() {
        wait(1);
        clickSelector(submitBtnSelector);
        wait(3);
    }
}
