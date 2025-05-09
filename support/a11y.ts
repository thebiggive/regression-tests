// eslint-disable-next-line import/no-named-as-default
import AxeBuilder from '@axe-core/webdriverio';

/**
 * Run Axe on the current page. Fail tests if there are unexpected violations. Log
 * incompletes.
 */
export default async function checkNoAccessibilityViolations(options = {withAngularStepperException: false}){
    console.log('Running Axe accessibility check...');

    // Our footer white on blue currently fails AA level checks. For now, we test everything to A level
    // so we can maintain as few exceptions as possible.
    const builder = new AxeBuilder({ client: browser }).withTags(['wcag2a']);

    // Suppress known Angular Material vertical stepper ARIA role error. Using rule
    // suppression as we don't want to exclude the whole #stepper.
    // https://github.com/angular/components/issues/26444
    if (options.withAngularStepperException) {
        builder.disableRules(['aria-required-children']);
    }

    const result = await builder.analyze();

    const violationCount = result.violations.length;
    if (violationCount > 0) {
        console.log(`${violationCount} accessibility violations`);

        result.violations.forEach((violation) => {
            console.log(violation.description);
            violation.nodes.forEach((node) => {
                console.log(node.html);
            });
        });

        throw new Error(
            `Accessibility check failed, ${violationCount} issues:\n\n${JSON.stringify(result.violations, null, '  ')}`
        );
    }

    if (result && result.incomplete.length > 0) {
        console.log(`${result.incomplete.length} accessibility incomplete items`);

        result.incomplete.forEach((incompleteItem) => {
            console.log(incompleteItem.description);
            incompleteItem.nodes.forEach((node) => {
                console.log(node.html);
            });
        });
    } else {
        console.log('No accessibility incomplete items 🎉');
    }
}
