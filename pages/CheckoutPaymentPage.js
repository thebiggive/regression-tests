import { checkSelectorContent } from '../support/check';
import {
    inputSelectorValue,
    setSelectOption,
    clickSelector
} from '../support/action';

// constants
const pageHeadingSelector = 'main #js-payment-form h2';
const cardNumberSelector = 'input#stPan';
const cardExpireMonthSelector = '#st-month';
const cardExpireYearSelector = '#st-year';
const cardCvcSelector = 'input#stSc';
const submitBtnSelector = '#st-submit-btn';

// checks
const pageHeadingCheck = 'Please enter your payment details';

// fill
const cardNumber = '4111110000000211';
const cardExpireYear = '2023';
const cardExpireMonth = '10';
const cardCvc = '456';

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
        inputSelectorValue(cardNumberSelector, cardNumber);
        setSelectOption(cardExpireMonthSelector, cardExpireMonth);
        setSelectOption(cardExpireYearSelector, cardExpireYear);
        inputSelectorValue(cardCvcSelector, cardCvc);
        clickSelector(submitBtnSelector);
    }
}
