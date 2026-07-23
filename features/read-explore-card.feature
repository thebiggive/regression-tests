Feature: Read an Explore card's title

  As someone interested in available campaigns, I should be able to see a working grid with first card.

  Scenario: Read Explore
    Given I am on the Explore page
    # (typo matches the current long-lived campaign on Regression, don't want to edit and possibly affect anything else)
    Then I should see an explore grid containing text "Fund some charitiable work"
