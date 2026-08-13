Feature: New donor registers and sets up new Regular Giving mandate

    As a new donor
    I want to initiate a monthly Regular Giving commitment
    And I want my first donation to be collected immediately
    So that I can support my chosen charity regularly

    Scenario: New donor registers and sets up new Regular Giving mandate
        Given that I am not logged in and my details are unknown to Big Give
        When I open the Regular Giving application campaign start donating page
        And I confirm that I am an adult
        And I enter a regular amount of £1
        And I enter my email address into the giving form
        And I prove to the regular giving form that I can receive emails
        And I enter my first and last name
        And I create and enter a random password to continue
        And I skip over Gift Aid step
        And I wait a few seconds
        And I enter a UK Visa card number
        And I skip over comms preferences step
        And I click the "Start regular giving now" button
        When I wait a few seconds
        Then I should see a Regular Giving mandate for £1 in my account
        And the mandate should say monthly processing started today and will proceed on the current day-ish each month
        When I wait long enough for email processing
        Then my last email should contain a new monthly mandate confirmation showing amount £1
        Then I should receive a registration success email with the email I donated with
