Feature: New donor: donation completes successfully and donor registers

    As a new donor
    I want payment to be taken for a match campaign for a Stripe charity
    So that I can support my chosen charity with a doubled donation

    Scenario: New donor: donation completes successfully and donor registers
        Given that I am on my chosen charity's Donate page
        When I enter an amount of £25000
        And I say no to Gift Aid
        And I enter my name, email address and UK Visa card number
        And I choose a preference for charity and TBG communications
        And I press Donate
        When I wait a few seconds
        Then I should be redirected to a Thank You confirmation page with amount £25000
        When I wait long enough for email processing
        Then my last email should contain amount £25000
        And my last email should contain the charity's custom thank you message
        And my last email should contain the correct name
        When I press on the button to set a password
        And I enter my new password
        And I press on the button to create an account
        Then the page should update to say I'm registered
        When I wait long enough for email processing
#        Then I should recieve a registration success email with the email I donated with
