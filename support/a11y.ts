// eslint-disable-next-line import/no-named-as-default
import AxeBuilder from '@axe-core/webdriverio';

/**
 * Run Axe on the current page. Fail tests if there are unexpected violations. Log
 * incompletes.
 */
export default async function checkNoAccessibilityViolations(
    options = {withAngularStepperException: false, withSalesforceHeaderException: false, withContrastRatioException: false}
){
    console.log('Running Axe accessibility check...');

    // We test A and AA levels of WCAG (I think version 2.1) and make only narrow exceptions as the context requires
    // based on the passed `options`. Informational messages about checks that can't be completed don't fail the test
    // but are logged. Known cases on the Donate form are:
    // 1. mat-icon-button has a background image – not sure why exactly
    // 2. our footer campaign theme links have their icons as background images to the main link text – we should be
    //    able to change that quite easily if we want to reduce these info messages.
    const builder = new AxeBuilder({ client: browser }).withTags(['wcag2a', 'wcag2aa']);

    // Suppress known Angular Material vertical stepper ARIA role error. Using rule
    // suppression as we don't want to exclude the whole #stepper.
    // https://github.com/angular/components/issues/26444
    if (options.withAngularStepperException) {
        builder.disableRules(['aria-required-children']);
    }

    // Experience Cloud default nav appears to set an invalid & redundant ARIA role on this element.
    if (options.withSalesforceHeaderException) {
        builder.exclude('header.lf-header_navigation');
    }

    if (options.withContrastRatioException){
        // known issue of low contrast in footer
        builder.exclude('#footer-primary-heading');
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
