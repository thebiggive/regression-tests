Feature: Demo

  I want to demo WDIO cucumber style tests

  Scenario: Search for demo
    Given I am on the Google homepage
    When I search for "demo wikipedia"
    And the URL is "https://www.google.com/search"
    And I click on the first search result
    Then the URL is "https://en.wikipedia.org/wiki/Demo"
    And the page title is "Demo"
    And the heading is "Demo"
