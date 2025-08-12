# No need to do this one in all browsers
@skip(browserName="safari")
Feature: The site is rendered server side

  We use server side rendering to make the site faster to use for people and easier for search engines to index.

  Scenario: Homepage is server side rendered
    Given I am loading the site without Javascript
    When I view the homepage
    Then I should see in the source "Hi. We’re Big Give."
