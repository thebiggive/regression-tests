import { generateIdentifier, goToUrl } from '../support/util';
import { clickSelector, inputSelectorValue, setSelectOption } from '../support/action';
import { checkSelectorContent, checkTitle } from '../support/check';

// eslint-disable-next-line max-len
const startUrl = `${process.env.WEBSITE_COMMUNITY_URL}pledge?campaignId=${process.env.PLEDGE_CAMPAIGN_ID}`;

/**
 * Unauthentiacted pledge submission form page for charity to share.
 */
export default class PledgeFormPage {
    /**
     * Set up page with browser object.
     * @param {WebdriverIO.BrowserObject} browser   Global object for pauses.
     */
    constructor(browser) {
        this.browser = browser;
    }

    /**
     * Get the input field corresponding to the given label text.
     * @param {string} label    Full or partial label text. No single quotes.
     * @returns {string}   Input selector
     */
    getCommunitiesInputForLabel(label) {
        return `//label[contains(text(), '${label}')]//..//input`;
    }

    /**
     * Get the select field corresponding to the given label text. For `lightning:select` SF
     * seems to put the label text in an inner <span>.
     *
     * @param {string} label    Full or partial label text. No single quotes.
     * @returns {string}   Select selector
     */
    getCommunitiesSelectForLabel(label) {
        return `//span[contains(text(), '${label}')]//..//..//select`;
    }

    /**
     * Open pledge form.
     */
    open() {
        goToUrl(startUrl);
        checkTitle('Pledge');
        this.browser.pause(500); // Give Communities time to load selects etc.
    }

    /**
     * Confirm Communities banner small title text contains `title`.
     * @param {string}  title   Expected title contents
     */
    checkBannerSays(title) {
        checkSelectorContent(
            "//div[@class='hero-banner cCmpNewPledge']//h2[@class='slds-m-bottom_small']",
            title
        );
    }

    /**
     * Enter the given number of pounds.
     * @param {string}  amount  Whole number of pounds
     */
    setPledgeAmount(amount) {
        inputSelectorValue(this.getCommunitiesInputForLabel('Pledge amount'), amount);
    }

    /**
     * Sets the pledge payment method
     * @param {string}  method  Select option from form
     */
    setPaymentMethod(method) {
        setSelectOption(
            this.getCommunitiesSelectForLabel('I will pay by the following method'),
            method,
        );
    }

    /**
     * Check the T&Cs box.
     */
    acceptTerms() {
        // Hack for now as the input isn't properly labelled. We should fix this for a11y too.
        clickSelector("//span[@class='slds-checkbox']//span[@class='slds-checkbox_faux']");
    }

    /**
     * Sets the pledger type select box to Individual.
     */
    setIndividualType() {
        const text = 'Are you making the pledge as an individual';
        setSelectOption(this.getCommunitiesSelectForLabel(text), 'Individual');
    }

    /**
     * Sets the pledger relationship to the charity
     * @param {string}  relationship  Select option from form
     */
    setRelationship(relationship) {
        setSelectOption(
            this.getCommunitiesSelectForLabel('What is your relationship with the charity?'),
            relationship,
        );
    }

    /**
     * Clicks the Gift Aid radio button labelled 'Yes'.
     */
    setGiftAidToYes() {
        clickSelector("//span[@class='slds-radio']//span[contains(text(), 'Yes')]");
    }

    /**
     * Populates 'Title'.
     */
    setPledgerTitle() {
        inputSelectorValue(
            this.getCommunitiesInputForLabel('Title'),
            generateIdentifier('Title-'), // Todo use Faker or similar
        );
    }

    /**
     * Populates 'First name'.
     */
    setPledgerFirstName() {
        inputSelectorValue(
            this.getCommunitiesInputForLabel('First name'),
            generateIdentifier('PF-'),
        );
    }

    /**
     * Populates 'Last name'.
     */
    setPledgerLastName() {
        inputSelectorValue(
            this.getCommunitiesInputForLabel('Last name'),
            generateIdentifier('PL-'),
        );
    }

    /**
     * Populates 'Email' or 'Confirm Email'.
     * @param {string} label        Field label
     * @param {string} emailAddress Value to enter
     */
    setPledgerEmail(label, emailAddress) {
        inputSelectorValue(this.getCommunitiesInputForLabel(label), emailAddress);
    }

    /**
     * Clicks a <button>
     * @param {string}  buttonText  Button text to find. No single quotes.
     */
    clickButton(buttonText) {
        clickSelector(`//button[contains(text(), '${buttonText}')]`);
    }

    /**
     * Checks if a Communities card heading has this copy.
     *
     * @param {string} heading Expected heading.
     */
    checkForCardWithHeading(heading) {
        // .slds-card__header
        checkSelectorContent(
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
    checkForCardWithCopy(text) {
        checkSelectorContent("//div[@class='slds-card__body']", text);
    }
}
