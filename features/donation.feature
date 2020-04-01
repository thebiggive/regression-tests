Feature: Make a matched donation

    As a donor
    I want payment to be taken for a match campaign
    So that I can support my chosen charity with a doubled donation

    Scenario: Match funds available and payment is processed successfully, before match fund reservation expires
        Given that I am on my chosen Donate page
        When I enter an amount between £5 and £25,000
        And I choose a preference for Gift Aid, charity comms and TBG comms
        And I press Donate
        Then I am taken to Charity Checkout pages
        And I complete my donation as a guest
        And enter my payment information
        When my bank approves the charge and the payment steps took less than 15 minutes
        Then I should be redirected to a Thank You confirmation page
        Given I login to my admin page
#       Then I should download the donation csv file
#       And I should see an initial message saying the donation succeeded
#       When I wait 5 seconds
#       Then I should see my Charity Checkout transaction ID
#       And I should see my matched amount is the same as my donation amount
#       And I should see the total value of my donation is double my donation amount, plus any Gift Aid
