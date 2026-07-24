# Usual page load wait seems not to be quite enough for the cards in Safari, skipping it for now.
@skip(browserName="safari")
Feature: Read the homepage

    As someone interested in understand Big Give, I should be able to read the homepage.

    Scenario: Reading the homepage
      Given I am on the home page
      Then there should be no accessibility violations detected
