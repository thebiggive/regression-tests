@skip() #see REG-39
Feature: New donor registers and sets up new Regular Giving mandate

    As a new donor
    I want to set a password and initiate a monthly Regular Giving commitment
    And I want my first donation to be collected immediately
    So that I can support my chosen charity regularly

    Scenario: New donor registers and sets up new Regular Giving mandate
        Given I have registered and logged in as a donor
        When I open the Regular Giving application campaign start donating page
        And I enter an amount of £1
        And I enter a UK Visa card number
        And I progress to next step
        And I click the "Start regular giving now" button
        When I wait a few seconds
        Then I should see a Regular Giving mandate for £1 in my account
        And the mandate should say monthly processing started today and will proceed on the current day-ish each month
        When I wait long enough for email processing
#        Then my last email should contain a new monthly mandate confirmation showing amount £1
