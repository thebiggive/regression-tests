/**
 * Calls the provided callback function, and if it throws or the given predicate returns false on the result retries
 * up to four times, with pauses in between of 1s, 2s, 4s and 8s, for a total of up to 15.
 *
 * @template T
 * @param {{callback: function():T, predicate?: function(T): boolean, label: string}} args
 * @returns {Promise<T>}
 */
export default async function withPauseAndRetry({ callback, predicate, label }) {
    const maxTries = 4;
    let result;
    let retryCount = 0;
    let lastError;
    let badResult;

    while (retryCount < maxTries) {
        lastError = undefined;
        badResult = undefined;
        result = undefined;

        try {
            // eslint-disable-next-line no-await-in-loop
            result = await callback();
            if (!predicate) {
                break;
            }
            if (!predicate(result)) {
                badResult = result;
            }
            break;
        } catch (error) {
            lastError = error;
        }
        const delaySeconds = 2 ** retryCount;
        console.log(`${label} failed, pausing ${delaySeconds} seconds before retry`);
        // eslint-disable-next-line no-await-in-loop,wdio/no-pause
        await browser.pause(delaySeconds * 1000);
        retryCount += 1;
    }

    if (result !== undefined) {
        return result;
    }

    console.log(`${label} failed ${retryCount} times, giving up,`);

    if (badResult !== undefined) {
        return badResult;
    }

    throw lastError;
}
