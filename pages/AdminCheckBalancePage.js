import { checkTitle, checkUrl } from '../support/check';
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
        clickSelector('button=Manage Campaign');
        clickSelector('a=Donations');
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
