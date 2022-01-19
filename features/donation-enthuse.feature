Feature: Make a matched donation to an Enthuse charity

    As a donor
    I want payment to be taken for a match campaign for an Enthuse charity
    So that I can support my chosen charity with a doubled donation

    Scenario: Match funds available and payment is processed successfully, before match fund reservation expires
        Given that I am on my chosen Enthuse-enabled charity's Donate page
        And I close the cookie notice if shown
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        And I choose a preference for charity and TBG communications
        And I press Donate
        Then I am taken to the Enthuse pages
        And I complete my donation as a guest
        And enter my payment information
        When my bank approves the charge and the payment steps took less than 15 minutes
        Then I should be redirected to a Thank You confirmation page with the correct amount
