import { checkSelectorContent } from '../support/check';
import {
    clickSelector
} from '../support/action';

// constants
const pageHeadingSelector = '#js-payment-form h2';
const cardNumberSelector = '#st-card-number-input';
const cardExpirySelector = '#st-expiration-date-input';
const cardCvcSelector = '#st-security-code-input';
const submitBtnSelector = 'button[type="submit"]';
const noThanksSelector = 'a=No thanks';

// checks
const pageHeadingCheck = 'Please select a payment method:';

// inputs
const cardNumberInput = '4111110000000211';
const cardExpiryInput = '10/26';
const cardCvcInput = '123';

/**
 * checkout payment page
 */
export default class EnthusePaymentPage {
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
     * checkout payment form
     */
    static checkout() {
        // NOTE: in this method we call $(selector).setValue(value) directly
        // instead of using inputSelectorValue(selector, value). This is because
        // the latter checks for the existence of the selector. However, this
        // specifically seems to fail when working with iframes, like this scenario.
        // Here, the bank detail fields are all inside their respective iframe. Even after
        // we use browse.switchToFrame(), the checkIfElementExists() method called inside
        // inputSelectorValue(selector, value) still fails. Therefore we directly set the
        // values using $(selector).setValue(value) instead of going via
        // inputSelectorValue(selector, value).

        console.log('Pausing for 5 seconds so the payment form is loaded...');
        // the payment form takes a few seconds to load, wait for it.
        browser.pause(5000);

        browser.switchToFrame($('#st-card-number-iframe'));
        $(cardNumberSelector).setValue(cardNumberInput);
        browser.switchToParentFrame();

        browser.switchToFrame($('#st-expiration-date-iframe'));
        $(cardExpirySelector).setValue(cardExpiryInput);
        browser.switchToParentFrame();

        browser.switchToFrame($('#st-security-code-iframe'));
        $(cardCvcSelector).setValue(cardCvcInput);
        browser.switchToParentFrame();

        clickSelector(submitBtnSelector);
    }

    /**
     * skip password step
     */
    static skipPassword() {
        clickSelector(noThanksSelector);
    }
}
