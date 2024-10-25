@skip()
Feature: New donor: restarting donation completes successfully

    As a new donor
    I want payment to be taken for a match campaign for a Stripe charity even if I change the amounts after initial selection
    So that I can support my chosen charity with a doubled donation

    Scenario: New donor: restarting donation completes successfully
        Given that I am on my chosen Stripe-enabled charity's Donate page
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        And I enter my name, email address and Stripe payment details
        And I choose a preference for charity and TBG communications
        And I navigate back to the first step
        And I re-enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        And I enter my name, email address and Stripe payment details
        And I choose a preference for charity and TBG communications
        And I press Donate
        When I wait a few seconds
        Then I should be redirected to a Thank You confirmation page with the correct amount
        When I wait long enough for email processing
        Then my last email should contain the correct amounts
        And my last email should contain the charity's custom thank you message
        And my last email should contain the correct name

        Given that I am on my chosen Stripe-enabled charity's Donate page
         # And I didn't set a password above, or log-in
        Then I should be invited to log in
