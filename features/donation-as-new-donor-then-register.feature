Feature: New donor: donation completes successfully and donor registers

    As a new donor
    I want payment to be taken for a match campaign for a Stripe charity
    So that I can support my chosen charity with a doubled donation

    Scenario: New donor: donation completes successfully and donor registers
        Given that I am on my chosen Stripe-enabled charity's Donate page
        And I close the cookie notice if shown
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        And I enter my name, email address and Stripe payment details
        And I choose a preference for charity and TBG communications
        And I press Donate
        When I wait a few seconds
        Then I should be redirected to a Thank You confirmation page with the correct amount
        Then my last email should contain the correct amounts
        And my last email should contain the charity's custom thank you message
        And my last email should contain the correct name
        When I press on the button to set a password
        And I enter my new password
        And I press on the button to create an account
        Then the page should update to say I'm registered
        When I wait "45" seconds
        Then I should recieve a registration success email with the email I donated with