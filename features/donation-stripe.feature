Feature: Make a matched donation to a Stripe charity

    As a donor
    I want payment to be taken for a match campaign for a Stripe charity
    So that I can support my chosen charity with a doubled donation

    Scenario: Match funds available and payment is processed successfully, before match fund reservation expires
        Given that I am on my chosen Stripe-enabled charity's Donate page
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        And I enter my name and email address
        And I choose a preference for charity and TBG communications
        And I enter Stripe payment details
        And I press Donate
        Then I should be redirected to a Thank You confirmation page with the correct amount
        # REG-9 TODO: implement thank you email checks
        # When I check my email after 5 seconds
        # Then I should have a message with the correct amounts
        # And it should contain the charity's custom thank you message.
