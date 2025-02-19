import { generateIdentifier, goToUrl } from '../support/util';
import { clickSelector, inputSelectorValue, setSelectOption } from '../support/action';
import { checkSelectorContent, checkTitle } from '../support/check';

const startUrl = `${
    process.env.WEBSITE_COMMUNITY_URL
}pledge?campaignId=${process.env.PLEDGE_CAMPAIGN_ID}`;

/**
 * Unauthentiacted pledge submission form page for charity to share.
 */
export default class PledgeFormPage {
    /**
     * Set up page with browser object.
     * @param {WebdriverIO.Browser} browser   Global object for pauses.
     */
    constructor(browser) {
        this.browser = browser;
        // Needed for Safari to find the terms checkbox seemingly, even though the click helper
        // is meant to scroll it into view.
        this.browser.maximizeWindow();
    }

    /**
     * Get the input field corresponding to the given label text.
     * @param {string} label    Full or partial label text. No single quotes.
     * @returns {Promise<string>}   Input selector
     */
    async getCommunitiesInputForLabel(label) {
        const inputId = $(`label*='${label}'`).getAttribute('for');
        return `input[id='${inputId}']`;
    }

    /**
     * Get the select field corresponding to the given label text. For `lightning:select` SF
     * seems to put the label text in an inner <span>.
     *
     * @param {string} label    Full or partial label text. No single quotes.
     * @returns {Promise<string>}   Select selector
     */
    async getCommunitiesSelectForLabel(label) {
        const selectId = $(`label*='${label}'`).getAttribute('for');
        return `select[id='${selectId}']`;
    }

    async open() {
        await goToUrl(startUrl);
        await checkTitle('Pledge');
        await this.browser.pause(500); // Give Communities time to load selects etc.
    }

    /**
     * Confirm Communities banner small title text contains `title`.
     * @param {string}  title   Expected title contents
     */
    async checkBannerSays(title) {
        await checkSelectorContent(
            'div.hero-banner.cCmpNewPledge h2.slds-m-bottom_small',
            title
        );
    }

    /**
     * Enter the given number of pounds.
     * @param {string}  amount  Whole number of pounds
     */
    async setPledgeAmount(amount) {
        await inputSelectorValue(await this.getCommunitiesInputForLabel('Pledge amount'), amount);
    }

    /**
     * Sets the pledge payment method
     * @param {string}  method  Select option from form
     */
    async setPaymentMethod(method) {
        await setSelectOption(
            await this.getCommunitiesSelectForLabel('I will pay by the following method'),
            method,
        );
    }

    async acceptTerms() {
        // Hack for now as the input isn't properly labelled. We should fix this for a11y too.
        // The slightly more specfic commented selector worked for Chromium but not Safari.
        // Deep selector with `name=iAccept` found the element but it wasn't interactible.
        // This also seems to be Safari-reliable only when we maximise the window.
        // await clickSelector("//span[@class='slds-checkbox']//span[@class='slds-checkbox_faux']");
        await clickSelector('lightning-input.slds-m-bottom_large');
    }

    /**
     * Sets the pledger type select box to Individual.
     */
    async setIndividualType() {
        const text = 'Are you making the pledge as an individual';
        await setSelectOption(await this.getCommunitiesSelectForLabel(text), 'Individual');
    }

    /**
     * Sets the pledger relationship to the charity
     * @param {string}  relationship  Select option from form
     */
    async setRelationship(relationship) {
        await setSelectOption(
            await this.getCommunitiesSelectForLabel('What is your relationship with the charity?'),
            relationship,
        );
    }

    async setGiftAidToYes() {
        // Hack for now to avoid unsupported xpath; first inner span should be 'Yes'?
        await clickSelector('span.slds-radio span');
    }

    async setPledgerTitle() {
        await inputSelectorValue(
            await this.getCommunitiesInputForLabel('Title'),
            generateIdentifier('Title-'), // Todo use Faker or similar
        );
    }

    async setPledgerFirstName() {
        await inputSelectorValue(
            await this.getCommunitiesInputForLabel('First name'),
            generateIdentifier('PF-'),
        );
    }

    async setPledgerLastName() {
        await inputSelectorValue(
            await this.getCommunitiesInputForLabel('Last name'),
            generateIdentifier('PL-'),
        );
    }

    /**
     * Populates 'Email' or 'Confirm Email'.
     * @param {string} label        Field label
     * @param {string} emailAddress Value to enter
     */
    async setPledgerEmail(label, emailAddress) {
        await inputSelectorValue(await this.getCommunitiesInputForLabel(label), emailAddress);
    }

    /**
     * Clicks a <button>
     * @param {string}  buttonText  Button text to find. No single quotes.
     */
    async clickButton(buttonText) {
        await clickSelector(`//button[contains(text(), '${buttonText}')]`);
    }

    /**
     * Checks if a Communities card heading has this copy.
     *
     * @param {string} heading Expected heading.
     */
    async checkForCardWithHeading(heading) {
        // .slds-card__header
        await checkSelectorContent(
            'h2.slds-card__header-title span.slds-text-heading_small.slds-truncate',
            heading,
        );
    }

    /**
     * Checks if a Communities card contains this copy, ignoring formatting and
     * checking child elements.
     *
     * @param {string} text Expected copy.
     */
    async checkForCardWithCopy(text) {
        await checkSelectorContent('div.slds-card__body', text);
    }
}
