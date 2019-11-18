import { checkSelectorContent } from '../support/check';
import {
    inputSelectorValue,
    setSelectOption,
    clickSelector
} from '../support/action';

// constants
const pageHeadingSelector = '#js-payment-form h2';
const cardNumberSelector = 'input#stPan';
const cardExpireMonthSelector = '#st-month';
const cardExpireYearSelector = '#st-year';
const cardCvcSelector = 'input#stSc';
const submitBtnSelector = '#st-submit-btn';

// checks
const pageHeadingCheck = 'Please select a payment method';

// inputs
const cardNumberInput = '4111110000000211';
const cardExpireYearInput = '2023';
const cardExpireMonthInput = '10';
const cardCvcInput = '456';

/**
 * checkout payment page
 */
export default class CheckoutPaymentPage {
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
        setSelectOption(cardExpireMonthSelector, cardExpireMonthInput);
        setSelectOption(cardExpireYearSelector, cardExpireYearInput);
        inputSelectorValue(cardCvcSelector, cardCvcInput);
        clickSelector(submitBtnSelector);
    }
}
