@skip()
Feature: Existing donor: credit donation completes successfully

    As a donor who doesn't have access to a card that can be used to donate via Big Give's platform
    I want payment to be taken for a match campaign for a Stripe charity using my donation credits (Stripe cash balance)
    So that I can support my chosen charity with a doubled donation

    Scenario: Existing donor: credit donation completes successfully
        Given that I am on my chosen Stripe-enabled charity's Donate page
        And I click the "Log in" button
        And I enter the ID credit-funded account test email and password
        And I click the popup's login button
        Then I should see "Logged in as tech+regression+credits@thebiggive.org.uk" in the ID info box
        And I should see "Your credit balance will be used and the donation value capped at £" in the ID info box
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid
        Then I should see my populated first name is "RegressionTest"
        And I should see my populated surname is "User"
        And I should see my populated email is "tech+regression+credits@thebiggive.org.uk"
        And I should see "Your donation funds balance will be applied against this donation. No further funds will be taken." instead of asking for my bank details.
        When I continue through this step with no changes
        And I choose a preference for charity and TBG communications
        And I press Donate
        When I wait a few seconds
        Then I should be redirected to a Thank You confirmation page with the correct amount
        When I wait long enough for email processing
        Then my last email should contain the correct amounts
        And my last email should contain the charity's custom thank you message
        And my last email should contain the correct name
