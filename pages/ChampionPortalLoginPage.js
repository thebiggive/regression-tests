import { goToUrl } from '../support/util';
import { clickSelector, inputSelectorValue } from '../support/action';
import { checkSelectorContent } from '../support/check';

// Routes
const championPortalUrl = process.env.CHAMPION_PORTAL_URL;

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
 * Login page for Champion users
 */
export default class ChampionPortalLoginPage {
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
        this.browser.pause(500);
    }

    /**
     * Fill in credentials and log in
     */
    fillInFormAndLogin() {
        inputSelectorValue(usernameSelector, emailInput);
        inputSelectorValue(passwordSelector, passwordInput);
        clickSelector(loginBtnSelector);
        this.browser.pause(500); // Wait for successful login redirect
        checkSelectorContent(
            "//div[@class='uiOutputRichText']//h1",
            'Dashboard'
        );
    }

    /**
     * Navigate to campaigns using nav item
     */
    clickNavItem() {
        // eslint-disable-next-line max-len
        clickSelector("//a[@class='slds-container_fluid slds-truncate']//span[contains(text(), 'Campaigns')]");
    }

    /**
     * Check the correct master campaign is showing
     */
    checkListOfFundedCampaigns() {
        checkSelectorContent(
            "//div[@class='slds-truncate']//lightning-base-formatted-text",
            'Regression Test Master Campaign'
        );
    }

    /**
     * Click 'Continue Draft' button
     */
    clickContinueDraft() {
        clickSelector(continueDraftBtnSelector);
        this.browser.pause(500); // Wait for portfolio page to finish loading
    }

    /**
     * Check the list of charities within the data table
     */
    checkListOfCharities() {
        checkSelectorContent(
            // eslint-disable-next-line max-len
            "//div[@class='slds-hyphenate']//lightning-formatted-url//a",
            'Regression Test Charity'
        );
    }

    /**
     * Click pencil edit icon
     */
    clickPencilIcon() {
        // eslint-disable-next-line max-len
        clickSelector("//td[@class='slds-color__background_gray-5']//lightning-primitive-cell-factory//span/button");
    }

    /**
     * Set offer funds checkbox
     */
    setOfferFundsCheckbox() {
        clickSelector("//label[@class='slds-checkbox__label']//span[@class='slds-checkbox_faux']");
    }

    /**
     * Hack to unfocus from checkbox selection,
     * switchToParentFrame() and elementSendKeys() doesn't seem to unfocus correctly
     */
    unfocusFromSelection() {
        // eslint-disable-next-line max-len
        clickSelector('//html');
    }

    /**
     * Check save button appearance
     */
    checkSaveButton() {
        checkSelectorContent(
            "//button[@class='slds-button slds-button_brand save-btn']",
            'Save'
        );
    }

    /**
     * Click save button
     */
    clickSaveButton() {
        // eslint-disable-next-line max-len
        clickSelector("//button[@class='slds-button slds-button_brand save-btn'][contains(text(), 'Save')]");
        this.browser.pause(500); // Wait for submission to succeed
    }

    /**
     * Check allocated amount after successfully saving allocation
     */
    checkAllocatedAmount() {
        checkSelectorContent(
            '//lightning-formatted-number',
            '£12,500.00'
        );
        this.browser.pause(300); // Wait for everything to finish processing
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
     * Reset funding
     */
    resetFunding() {
        // eslint-disable-next-line max-len
        clickSelector(cancelBtnSelector);
        this.clickPencilIcon();
        this.setOfferFundsCheckbox();
        this.unfocusFromSelection();
        this.checkSaveButton();
        this.clickSaveButton();
    }
}
