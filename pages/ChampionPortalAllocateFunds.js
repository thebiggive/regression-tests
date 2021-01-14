import { goToUrl } from '../support/util';
import { clickSelector, inputSelectorValue } from '../support/action';
import { checkSelectorContent } from '../support/check';

// Routes
const championPortalUrl = process.env.CHAMPION_PORTAL_URL;
const campaignsPage = `${championPortalUrl}campaigns`;

// Selectors
const usernameSelector = 'input[placeholder=Username]';
const passwordSelector = 'input[placeholder=Password]';
const loginBtnSelector = 'button=Log in';
const continueDraftBtnSelector = 'button=Continue Draft';
const confirmOffersBtnSelector = 'button=Confirm Offers';
const cancelBtnSelector = 'button=Cancel';

// Inputs
const emailInput = process.env.CHAMPION_PORTAL_EMAIL;
const passwordInput = process.env.CHAMPION_PORTAL_PASSWORD;

/**
 * Champion Portal allocation of funds class
 */
export default class ChampionPortalAllocateFunds {
    /**
     * Set up page with browser object.
     * @param {WebdriverIO.BrowserObject} browser   Global object for pauses.
     */
    constructor(browser) {
        this.browser = browser;
    }

    /**
     * Open Champion Portal log in page
     */
    open() {
        goToUrl(championPortalUrl);
        checkSelectorContent(
            "//div[@class='uiOutputRichText']//p//b",
            'Welcome to The Big Give Champion portal'
        );
    }

    /**
     * Fill in credentials and log in
     */
    fillInFormAndLogin() {
        inputSelectorValue(usernameSelector, emailInput);
        inputSelectorValue(passwordSelector, passwordInput);
        clickSelector(loginBtnSelector);
        checkSelectorContent(
            "//div[@class='uiOutputRichText']//h1",
            'Dashboard'
        );
    }

    /**
     * Navigate to campaigns using navigation bar
     */
    navigateToCampaignsPage() {
        // eslint-disable-next-line max-len
        goToUrl(campaignsPage);
    }

    /**
     * Check 'Regression Test Master Campaign' exists in the data table
     */
    checkListOfFundedCampaigns() {
        checkSelectorContent(
            // eslint-disable-next-line max-len
            "//th[@data-label = 'Campaign Title']//lightning-primitive-cell-factory//span//div//lightning-base-formatted-text",
            'Regression Test Master Campaign'
        );
    }

    /**
     * Click 'Continue Draft' button
     */
    clickContinueDraft() {
        clickSelector(continueDraftBtnSelector);
    }

    /**
     * Check 'Regression Test Child Campaign' exists in the data table
     */
    checkListOfCharities() {
        checkSelectorContent(
            // eslint-disable-next-line max-len
            "//td[@data-label = 'Title']//lightning-primitive-cell-factory//span//div//lightning-base-formatted-text",
            'Regression Test Child Campaign'
        );
    }

    /**
     * Click pencil edit icon next to the first row in the data table,
     * this test assumes only 1 charity is assigned to this champion.
     */
    clickPencilIcon() {
        clickSelector("//td[@data-label = 'Offer Funds?']//span//button");
    }

    /**
     * Set offer funds checkbox
     */
    setOfferFundsCheckbox() {
        clickSelector("//label[@class='slds-checkbox__label']//span[@class='slds-checkbox_faux']");
    }

    /**
     * Hack to unfocus from checkbox selection,
     * this ensures the 'handleOnCellChange' event is triggered after the checkbox has been selected
     */
    unfocusFromSelection() {
        clickSelector('//html');
    }

    /**
     * Click save button
     */
    clickSaveButton() {
        checkSelectorContent(
            "//button[@class='slds-button slds-button_brand save-btn']",
            'Save'
        );
        // eslint-disable-next-line max-len
        clickSelector("//button[@class='slds-button slds-button_brand save-btn'][contains(text(), 'Save')]");
        this.browser.pause(500); // Wait for submission to succeed
    }

    /**
     * Check allocated amount after successfully saving allocation
     */
    checkAllocatedAmount() {
        this.checkChampionFundingAmount('£12,500.00');
    }

    /**
     * Click confirm offers button appearance
     */
    clickConfirmOffersButton() {
        // eslint-disable-next-line max-len
        clickSelector(confirmOffersBtnSelector);
    }

    /**
     * Check data shown in modal pop up
     */
    checkModalData() {
        checkSelectorContent(
            // eslint-disable-next-line max-len
            "//div[@class='slds-p-around_medium slds-border_bottom']//h3//lightning-formatted-number",
            '£12,500.00'
        );
    }

    /**
     * De-allocate the funding the test just made,
     * so the next regression run can start from the beginning
     */
    deallocateFunding() {
        // eslint-disable-next-line max-len
        clickSelector(cancelBtnSelector);
        this.clickPencilIcon();
        this.setOfferFundsCheckbox(); // In this transaction, this will set checkbox to false
        this.unfocusFromSelection();
        this.clickSaveButton();
    }

    /**
     * Check the current amount of funding against a charity
     * @param {string} amount Value to check against
     */
    checkChampionFundingAmount(amount) {
        checkSelectorContent(
            "//td[@data-label = 'Championed']",
            amount
        );
    }
}
