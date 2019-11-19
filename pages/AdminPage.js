import { goToUrl } from '../support/util';

/**
 * Charity Admin Page
 */
export default class AdminPage {
    /**
     * open login page
     */
    static open() {
        goToUrl('https://regtest1-thebiggive.cs105.force.com/charities/s/');
    }
}
