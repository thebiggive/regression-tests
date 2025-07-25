/**
 * Calls the provided callback function, and if it throws or the given predicate returns false on the result retries
 * up to four times, with pauses in between of 1s, 2s, 4s and 8s.
 */
export default async function withPauseAndRetry<T>(
    { callback, predicate, label }: {callback: () => T, predicate?: (_arg0: T) => boolean, label: string}
) {
    const maxTries = 4;
    let result;
    let retryCount = 0;
    let lastError;
    let lastMessage;
    let badResult;

    while (retryCount < maxTries) {
        lastError = undefined;
        badResult = undefined;
        result = undefined;

        try {
            // eslint-disable-next-line no-await-in-loop
            result = await callback();
            if (!predicate || predicate(result)) {
                return result;
            }

            // result didn't satisfy the predicate, so is bad.
            badResult = result;
            lastMessage = `Bad result: ${badResult}`;
        } catch (error) {
            lastError = error;
            lastMessage = lastError instanceof Error ? lastError.message : JSON.stringify(lastError);
        }

        const delaySeconds = 4 ** retryCount;
        console.log(`${label} failed with ${lastMessage}, pausing ${delaySeconds} seconds before retry`);
        // eslint-disable-next-line no-await-in-loop,wdio/no-pause
        await browser.pause(delaySeconds * 1000);
        retryCount += 1;
    }

    console.log(`${label} failed ${retryCount + 1} times, giving up,`);

    if (badResult !== undefined) {
        return badResult;
    }

    throw lastError;
}
