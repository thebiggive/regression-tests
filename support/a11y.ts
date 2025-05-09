// eslint-disable-next-line import/no-named-as-default
import AxeBuilder from '@axe-core/webdriverio';

/**
 * Run Axe on the current page. Fail tests if there are unexpected violations. Log
 * incompletes.
 */
export async function checkNoAccessibilityViolations(){
    console.log('Running Axe accessibility check...');

    const builder = new AxeBuilder({ client: browser }).withTags(['wcag2a']);

    // Suppress known Angular Material vertical stepper ARIA role error. Using rule
    // suppression as we don't want to exclude the whole #stepper.
    // https://github.com/angular/components/issues/26444
    builder.disableRules(['aria-required-children']);

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
            // eslint-disable-next-line max-len
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
