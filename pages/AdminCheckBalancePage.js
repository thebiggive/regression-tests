import {
    checkTitle, checkUrl, checkSelectorContent
} from '../support/check';
import { clickSelector } from '../support/action';
import { wait } from '../support/util';

// selectors
const popUpSelector = 'button[title="Close this window"]';

// checks
const titleCheck = 'The Big Give - Dashboard';
const urlCheck = 'charities/s/';

/**
 * Admin check balance
 */
export default class AdminCheckBalancePage {
    /**
     * check if page ready && close overlay modal
     */
    static checkReady() {
        wait(3);
        checkUrl(urlCheck);
        checkTitle(titleCheck);
        clickSelector(popUpSelector);
    }

    /**
     * Download Csv file
     * TODO will move this method to a separate page object later
     */
    static downloadCsvFile() {
        wait(4);
        clickSelector('a=My campaigns');
        wait(3);
        clickSelector('button=Manage Campaign');
        wait(3);
        clickSelector('a=Donations');
        wait(2);
        clickSelector('button=Download CSV data');
        wait(5);
    }

    /**
     * check if donation raised
     * @param { donationCheck } donationCheck value to be checked
     */
    static parseCsvFile(donationCheck) {
        console.log('Start parsing file', global.downloadDir);
        const fs = require('fs');
        const assert = require('assert');
        const filePath = `${global.downloadDir}/Campaign_Donations.csv`;
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        console.log(
            'CHECK: check if donation exist via last name unique value:',
            donationCheck
        );
        assert.ok(fileContents.includes(donationCheck));
    }

    /**
     * check if donation count raised
     * @param {int} donationCount to be checked
     */
    static checkDonationCount(donationCount) {
        checkSelectorContent(
            'div:nth-child(5) > div > div.lf-dash-number', donationCount
        );
    }
}
