Feature: Make a matched donation to a Stripe charity

    As a returning donor
    I want payment to be taken for a match campaign for a Stripe charity with less manual input by me
    So that I can support my chosen charity with a doubled donation

    Scenario: Match funds available and payment for existing Stripe Customer with saved Payment Method is processed successfully, before match fund reservation expires
        Given that I am on my chosen Stripe-enabled charity's Donate page
        And I close the cookie notice if shown
        And I click the "Log in" button
        And I enter the ID account test email address for "Email address"
        And I enter the ID account test password for "Password"
        And I click the "Log in" button
        Then I should see "Logged in as tech+regression+donor@thebiggive.org.uk" in the ID info box
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        Then I should see my name and email address already populated
        And I should see an existing card ending 4242 already pre-selected
        When I continue through this step with no changes
        And I choose a preference for charity and TBG communications
        And I press Donate
        Then I should be redirected to a Thank You confirmation page with the correct amount
        When I wait a few seconds for email processing
        Then my last email should contain the correct amounts
        And my last email should contain the charity's custom thank you message
