/**
 * Magic string recognized by mailer in regtest env to say we don't need the email to be sent. Saves on our monthly
 * testing limits.
 */
const NO_SEND_EMAIL = 'NO_SEND_EMAIL';

export async function goToUrl(url: string) {
    console.log(`ACTION: Change URL to "${url}"`);
    try {
        await browser.url(url);
    } catch (error) {
        throw new Error(`error trying to go to URL: ${url}: ${error}`);
    }
}

/**
 * Generate number between minimum and maximum fixed numbers
 *
 */
export function randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate identifier - date based but with : and . converted
 * to - to keep e.g. QuickBooks happy when the putative data
 * is a name.
 *
 * @param {string} prefix (optional) prefix string
 * @returns {string} generated identifier
 */
export function generateIdentifier(prefix = '') {
    /** @param {string} dateString */
    const dateString = (new Date()).toISOString();
    return `${prefix}${dateString.replace(/[.:-]+/g, '+')}`;
}

export function randomFirstName() {
    return generateIdentifier('Firstname-');
}

export function randomLastName() {
    return generateIdentifier('Lastname-');
}

export function randomEmail(noSend: boolean) {
    if (noSend) {
        return `${generateIdentifier(NO_SEND_EMAIL + '+')}@thebiggivetest.org.uk`;
    } else {
        return `${generateIdentifier('tech+regression+tests+')}@thebiggivetest.org.uk`;
    }
}

export function generateRandomPassword() {
    return Array(20).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');
}
