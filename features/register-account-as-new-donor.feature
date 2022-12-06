Feature: Register an account to allow quicker donations in future – new donor

    As a new donor
    I want to be able to save my payment details
    So that I can donate more easily next time I come to the site

    Scenario: Match funds available and payment for a new Stripe Customer is processed successfully, before match fund reservation expires
        Given that I am on my chosen Stripe-enabled charity's Donate page
        And I close the cookie notice if shown
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        And I enter my name, email address and Stripe payment details
        And I choose a preference for charity and TBG communications, waiting for match warning
        And I press Donate
#        And I wait hours to inspect browser manually
        And I should be redirected to a Thank You confirmation page with the correct amount
        And I press Set a password
        And I enter the password "somePassword";
        And I press Create Account
        And I see "Thank you for setting a password";
