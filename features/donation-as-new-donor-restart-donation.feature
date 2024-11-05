Feature: New donor: restarting donation completes successfully

    As a new donor
    I want payment to be taken for a match campaign for a Stripe charity even if I change the amounts after initial selection
    So that I can support my chosen charity with a doubled donation

    Scenario: New donor: restarting donation completes successfully
        Given that I am on my chosen Stripe-enabled charity's Donate page
        When I enter an amount of £25000
        And I say no to Gift Aid
        And I enter my name, email address and UK Visa card number
        And I choose a preference for charity and TBG communications
        And I navigate back to the first step
        # Update donation amount by -1, relative to its initial value.
        And I update the amount to £24999
        And I say no to Gift Aid
        And I enter my name, email address and UK Visa card number
        And I choose a preference for charity and TBG communications
        And I press Donate
        When I wait a few seconds
        Then I should be redirected to a Thank You confirmation page with amount £24999
        When I wait long enough for email processing
        Then my last email should contain amount £24999
        And my last email should contain the charity's custom thank you message
        And my last email should contain the correct name

        ## Fee is calculated as (24999*1.5/100+0.2)*1.2
        And my charity charity has been charged a vat inclusive fee of £450.22

        Given that I am on my chosen Stripe-enabled charity's Donate page
         # And I didn't set a password above, or log-in
        Then I should be invited to log in
