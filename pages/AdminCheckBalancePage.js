import {
    checkTitle, checkUrl
} from '../support/check';
import { clickSelector, getSelectorText } from '../support/action';

// selectors
const popUpSelector = 'button[title="Close this window"]';
const balanceCountSelector = 'div:nth-child(5) > div > div.lf-dash-number';
const myCampaignSelector = 'a=My campaigns';
const manageCampaignSelector = 'button=Manage Campaign';
const donationSelector = 'a=Donations';
const downloadCSVSelector = 'button=Download CSV data';

// checks
const titleCheck = 'The Big Give - Dashboard';
const urlCheck = 'charities/s/';

// inputs
const csvFileNameInput = '/Campaign_Donations.csv';
const csvFileEncodingInput = 'utf-8';

/**
 * Admin check balance
 */
export default class AdminCheckBalancePage {
    /**
     * check if page ready && close overlay modal
     */
    static checkReady() {
        checkUrl(urlCheck);
        checkTitle(titleCheck);
        clickSelector(popUpSelector);
    }

    /**
     * Download Csv file
     */
    static downloadCsvFile() {
        clickSelector(myCampaignSelector);
        clickSelector(myCampaignSelector); // workaround to click on nav link
        clickSelector(manageCampaignSelector);
        clickSelector(donationSelector);
        clickSelector(downloadCSVSelector);
    }

    /**
     * check if donation raised
     * @param { donationCheck } donationCheck value to be checked
     */
    static async parseCsvFile(donationCheck) {
        console.log('Start parsing file', global.downloadDir);
        const fs = require('fs');
        const assert = require('assert');
        const filePath = `${global.downloadDir}${csvFileNameInput}`;
        const fileContents = await fs.readFileSync(
            filePath, csvFileEncodingInput
        );
        console.log(
            'CHECK: check if donation exist via last name unique value:',
            donationCheck
        );
        assert.ok(fileContents.includes(donationCheck));
    }

    /**
     * check donation count value
     * @returns {int} current donation number
     */
    static getDonationCount() {
        return getSelectorText(balanceCountSelector);
    }
}
