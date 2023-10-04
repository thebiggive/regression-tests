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
    }

    /**
     * Get the input field corresponding to the given label text.
     * @param {string} label    Full or partial label text. No single quotes.
     * @returns {string}   Input selector
     */
    async getCommunitiesInputForLabel(label) {
        return `//label[contains(text(), '${label}')]//..//input`;
    }

    /**
     * Get the select field corresponding to the given label text. For `lightning:select` SF
     * seems to put the label text in an inner <span>.
     *
     * @param {string} label    Full or partial label text. No single quotes.
     * @returns {string}   Select selector
     */
    async getCommunitiesSelectForLabel(label) {
        return `//span[contains(text(), '${label}')]//..//..//select`;
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
            "//div[@class='hero-banner cCmpNewPledge']//h2[@class='slds-m-bottom_small']",
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
        await clickSelector("//span[@class='slds-checkbox']//span[@class='slds-checkbox_faux']");
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
        await clickSelector("//span[@class='slds-radio']//span[contains(text(), 'Yes')]");
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
            // eslint-disable-next-line max-len
            "//h2[@class='slds-card__header-title']//span[@class='slds-text-heading_small slds-truncate']",
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
        await checkSelectorContent("//div[@class='slds-card__body']", text);
    }
}
