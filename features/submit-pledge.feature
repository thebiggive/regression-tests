@skip(browserName=/i.*explorer/
Feature: Submit a pledge of funds for a charity's planned standalone matched campaign

  As a pledger
  I want to be able to commit funds for a future matched campaign
  So that the charity can set an achievable target and promote public donations effectively

  Scenario: Campaign is in the future and pledge form is submitted successfully
    Given I open the pledge campaign's pledge form
    Then I should see a Communities hero banner saying "Thank you for choosing to pledge to Exempt Stripe Test Charity"
    When I enter a pledge amount between £100 and £110
    And I choose to pay my pledge by Bank Transfer
    And I accept the pledge Terms & Conditions
    And I opt to pledge as an Individual
    And I state my pledger relationship as Friend
    And I opt to claim Gift Aid
    And I give a valid pledger title
    And I give a valid pledger first name
    And I give a valid pledger last name
    And I give a valid pledger email address
    And I confirm my pledger email address
    When I click "Submit Pledge"
    Then I should see a Communities card with heading "Thank you!"
    And the main card text should start with confirmation of my chosen pledge amount and the correct charity name
    When I wait a few seconds for email processing
    Then my last email subject should contain "Thank you for your pledge"
    And my last email should contain my pledged amount
