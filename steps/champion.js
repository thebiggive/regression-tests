import {
    BeforeAll, Given, Then, When
} from 'cucumber';

import ChampionPortalLoginPage from '../pages/ChampionPortalAllocateFunds';

let page;

// eslint-disable-next-line new-cap
BeforeAll(() => {
    page = new ChampionPortalLoginPage(browser);
});

Given(
    'I open the Champion Portal log in page successfully',
    () => page.open()
);

Then(
    'I should be able to fill in my log in credentials and successfully log in',
    () => page.fillInFormAndLogin()
);

When(
    'I navigate to campaigns page',
    () => page.navigateToCampaignsPage()
);

Then(
    'I should see a list of Master Campaigns I have intended to fund',
    () => page.checkListOfFundedCampaigns()
);

When(
    'I click Continue Draft next to a campaign',
    () => page.clickContinueDraft()
);

Then(
    'I should see a list of charities I am able to fund',
    () => page.checkListOfCharities()
);

When(
    'I click on the pencil icon',
    () => page.clickPencilIcon()
);

When(
    'I tick the "Fund this Charity?" checkbox',
    () => page.setOfferFundsCheckbox()
);

When(
    'I unfocus from this selection',
    () => page.unfocusFromSelection()
);

When(
    'I click on the save button',
    () => page.clickSaveButton()
);

Then(
    'I should see the full amount allocated to the selected charity',
    () => page.checkAllocatedAmount()
);

When(
    'I click the "Confirm Offers" button',
    () => page.clickConfirmOffersButton()
);

Then(
    'I should see a modal with a breakdown of my current funding',
    () => page.checkModalData()
);

When(
    'I de-allocate the funding I have just made',
    () => page.deallocateFunding()
);

Then(
    'I should see £0.00 allocated against the charity',
    () => page.checkChampionFundingAmount('£0.00')
);
