import { checkSelectorContent } from '../support/check';
import {
    inputSelectorValue,
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
        inputSelectorValue(cardNumberSelector, cardNumberInput);
        inputSelectorValue(cardExpirySelector, cardExpiryInput);
        inputSelectorValue(cardCvcSelector, cardCvcInput);
        clickSelector(submitBtnSelector);
    }

    /**
     * skip password step
     */
    static skipPassword() {
        clickSelector(noThanksSelector);
    }
}
