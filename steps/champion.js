import {
    BeforeAll,
    Given,
    Then,
    When
} from '@cucumber/cucumber';

import ChampionPortalLoginPage from '../pages/ChampionPortalAllocateFunds';

let page;

// eslint-disable-next-line new-cap
BeforeAll(() => {
    page = new ChampionPortalLoginPage(browser);
});

Given(
    'I open the Champion Portal log in page successfully',
    async () => page.open()
);

Then(
    'I should be able to fill in my log in credentials and successfully log in',
    async () => page.fillInFormAndLogin()
);

When(
    'I navigate to campaigns page',
    async () => page.navigateToCampaignsPage()
);

Then(
    'I should see a list of Master Campaigns I have intended to fund',
    async () => page.checkListOfFundedCampaigns()
);

When(
    'I click Continue Draft next to a campaign',
    async () => page.clickContinueDraft()
);

Then(
    'I should see a list of charities I am able to fund',
    async () => page.checkListOfCharities()
);

When(
    'I click on the pencil icon',
    async () => page.clickPencilIcon()
);

When(
    'I tick the "Fund this Charity?" checkbox',
    async () => page.setOfferFundsCheckbox()
);

When(
    'I unfocus from this selection',
    async () => page.unfocusFromSelection()
);

When(
    'I click on the save button',
    async () => page.clickSaveButton()
);

Then(
    'I should see the full amount allocated to the selected charity',
    async () => page.checkAllocatedAmount()
);

When(
    'I click the "Confirm Offers" button',
    async () => page.clickConfirmOffersButton()
);

Then(
    'I should see a modal with a breakdown of my current funding',
    async () => page.checkModalData()
);

When(
    'I de-allocate the funding I have just made',
    async () => page.deallocateFunding()
);

Then(
    'I should see £0.00 allocated against the charity',
    async () => page.checkChampionFundingAmount('£0.00')
);
