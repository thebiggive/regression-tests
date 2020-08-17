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
 * Charity portal user: check balance
 */
export default class CharityPortalCheckBalancePage {
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
    static parseCsvFile(donationCheck) {
        console.log('Start parsing file', global.downloadDir);
        const fs = require('fs');
        const filePath = `${global.downloadDir}${csvFileNameInput}`;
        fs.readFile(filePath, csvFileEncodingInput).then((fileContents) => {
            console.log(
                'CHECK: check if donation exist via last name unique value:',
                donationCheck
            );
            assert.ok(fileContents.includes(donationCheck));
        }, (reason) => {
            console.log(`CSV file read failed: ${reason}`);
            throw new Error('CSV read failed');
        });
    }

    /**
     * check donation count value
     * @returns {int} current donation number
     */
    static getDonationCount() {
        return getSelectorText(balanceCountSelector);
    }
}
