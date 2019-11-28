import { checkTitle, checkUrl, checkIfElementExists } from '../support/check';
import { clickSelector } from '../support/action';
import { wait } from '../support/util';

// selectors
const popUpSelector = 'button[title="Close this window"]';
const balanceSelector = '.lf-dash-number=2';

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
     * assert that donation incremented
     */
    static checkBalance() {
        checkIfElementExists(balanceSelector);
        this.downloadCsvFile(); // download the csv file
        // this.parseCsvFile(); // check if amount raised
    }

    /**
     * Download Csv file
     */
    static downloadCsvFile() {
        // TODO
    }

    /**
     * check if donation raised
     */
    static parseCsvFile() {
        const fs = require('fs');
        const csv = require('csv-parser');

        fs.createReadStream('Campaign_Donations.csv')
            .pipe(csv())
            .on('data', (data) => {
                try {
                    console.log(`Row: ${data.Amount}`);
                // perform the operation
                } catch (err) {
                // error handler
                }
            })
            .on('end', () => {
            // some final operation
            });
    }
}
