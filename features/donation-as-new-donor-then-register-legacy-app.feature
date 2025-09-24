# Just run in one actual browser, modern Chrome. We want to test that the bundle works in general, but it's
# too cumbersome to run modern automation tools on actual old browsers.
@skip(browserName=["microsoftedge","safari"])
Feature: New donor with legacy-brower-friendly app: donate & register

    As a new donor on an older browser
    I want payment to be taken for a match campaign for a Stripe charity
    So that I can support my chosen charity with a doubled donation

    Scenario: New donor with legacy-brower-friendly app: donation completes successfully and donor registers
        Given that I am on my chosen charity's Donate page, using the legacy browser app
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

        When I register using the link in my donation thanks message
        Then I should receive a registration success email with the email I donated with
