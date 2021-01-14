@skip(browserName="internet explorer")
Feature: Log in as a Champion user and distribute funds to a charity

  As a Champion
  I want to be able to log in successfully to the champion portal
  So that I allocate funds to charities that have been shortlisted against my funding

  Scenario: Master Campaign portfolio deadline is in the future and successfully allocating funds to a charity
    Given I open the Champion Portal log in page successfully
    Then I should be able to fill in my log in credentials and successfully log in
    When I click on Campaigns
    Then I should see a list of Master Campaigns I have intended to fund
    When I click Continue Draft next to a campaign
    Then I should see a list of charities I am able to fund
    When I click on the pencil icon
    And I tick the "Offer Funds?" checkbox
    And I unfocus from this selection
    And I click on the save button
    Then I should see the full amount allocated to the selected charity
    And I click the "Confirm Offers" button
    Then I should see a modal with a breakdown of my current funding
    When I de-allocate the funding I have just made
    Then I should see £0.00 allocated against the charity
