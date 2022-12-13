Feature: Make a matched donation to a Stripe charity – new donor - edge case of restarting donation

    As a new donor
    I want payment to be taken for a match campaign for a Stripe charity even if I change the amounts after initial selection
    So that I can support my chosen charity with a doubled donation

    Scenario: Re-starting donation as Match funds available and payment for a new Stripe Customer is processed successfully, before match fund reservation expires
        Given that I am on my chosen Stripe-enabled charity's Donate page
        And I close the cookie notice if shown
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
        Then I should be redirected to a Thank You confirmation page with the correct amount
        When I wait a few seconds for email processing
        Then my last email should contain the correct amounts
        And my last email should contain the charity's custom thank you message
        And my last email should contain the correct name
