Feature: Make a matched donation to a Stripe charity

    As a donor
    I want payment to be taken for a match campaign for a Stripe charity
    So that I can support my chosen charity with a doubled donation

    Scenario: Match funds available and payment is processed successfully, before match fund reservation expires
        Given that I am on my chosen Stripe-enabled charity's Donate page
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        And I enter my name, email address and Stripe payment details
        And I choose a preference for charity and TBG communications
        And I press Donate
        Then I should be redirected to a Thank You confirmation page with the correct amount
        When I wait a few seconds for email processing
        Then my last email should contain the correct amounts
        And my last email should contain the charity's custom thank you message
