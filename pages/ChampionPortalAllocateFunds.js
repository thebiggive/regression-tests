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
    async open() {
        await goToUrl(championPortalUrl);
        await checkSelectorContent(
            "//div[@class='uiOutputRichText']//p//b",
            'Welcome to The Big Give Champion portal'
        );
    }

    /**
     * Fill in credentials and log in
     */
    async fillInFormAndLogin() {
        await inputSelectorValue(usernameSelector, emailInput);
        await inputSelectorValue(passwordSelector, passwordInput);
        await clickSelector(loginBtnSelector);
        await checkSelectorContent(
            "//div[@class='uiOutputRichText']//h1",
            'Dashboard'
        );
    }

    /**
     * Navigate to campaigns page
     */
    async navigateToCampaignsPage() {
        await clickSelector(
            "//a[@class='slds-button slds-button_brand'][contains(text(), 'Campaigns')]",
        );
    }

    /**
     * Check 'Regression Test Master Campaign' exists in the data table
     */
    async checkListOfFundedCampaigns() {
        await checkSelectorContent(
            // eslint-disable-next-line max-len
            "//th[@data-label='Campaign Title']//lightning-primitive-cell-factory//span//div//lightning-base-formatted-text",
            'Regression Test Master Campaign'
        );
    }

    /**
     * Click 'Continue Draft' button
     */
    async clickContinueDraft() {
        await clickSelector(continueDraftBtnSelector);
    }

    /**
     * Check 'Regression Test Child Campaign' exists in the data table
     */
    async checkListOfCharities() {
        await checkSelectorContent(
            // eslint-disable-next-line max-len
            "//td[@data-label = 'Title']//lightning-primitive-cell-factory//span//div//lightning-base-formatted-text",
            'Regression Test Child Campaign'
        );
    }

    /**
     * Click pencil edit icon next to the first row in the data table,
     * this test assumes only 1 charity is assigned to this champion.
     */
    async clickPencilIcon() {
        await clickSelector("//td[@data-label = 'Fund this Charity?']//span//button");
    }

    /**
     * Set offer funds checkbox
     */
    async setOfferFundsCheckbox() {
        await clickSelector(
            "//label[@class='slds-checkbox__label']//span[@class='slds-checkbox_faux']",
        );
    }

    /**
     * Hack to unfocus from checkbox selection.
     * A mini modal with a checkbox inside appears,
     * this ensures 'handleOnCellChange' event is triggered after the checkbox has been selected.
     */
    async unfocusFromSelection() {
        await clickSelector('//html');
    }

    /**
     * Click save button
     */
    async clickSaveButton() {
        await checkSelectorContent(
            "//button[@class='slds-button slds-button_brand save-btn']",
            'Save'
        );
        // eslint-disable-next-line max-len
        await clickSelector("//button[@class='slds-button slds-button_brand save-btn'][contains(text(), 'Save')]");
        await this.browser.pause(500); // Wait for submission to succeed
    }

    /**
     * Check allocated amount after successfully saving allocation
     */
    async checkAllocatedAmount() {
        await this.checkChampionFundingAmount('£12,500.00');
    }

    /**
     * Click confirm offers button appearance
     */
    async clickConfirmOffersButton() {
        // eslint-disable-next-line max-len
        await clickSelector(confirmOffersBtnSelector);
    }

    /**
     * Check data shown in modal pop up
     */
    async checkModalData() {
        await checkSelectorContent(
            // eslint-disable-next-line max-len
            "//div[@class='slds-p-around_medium slds-border_bottom']//h3//lightning-formatted-number",
            '£12,500.00'
        );
    }

    /**
     * De-allocate the funding the test just made,
     * so the next regression run can start from the beginning
     */
    async deallocateFunding() {
        // eslint-disable-next-line max-len
        await clickSelector(cancelBtnSelector);
        await this.clickPencilIcon();
        await this.setOfferFundsCheckbox(); // In this transaction, this will set checkbox to false
        await this.unfocusFromSelection();
        await this.clickSaveButton();
    }

    /**
     * Check the current amount of funding against a charity
     * @param {string} amount Value to check against
     */
    async checkChampionFundingAmount(amount) {
        await checkSelectorContent(
            "//td[@data-label = 'Championed']",
            amount
        );
    }
}
