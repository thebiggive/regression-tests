import { inputSelectorValue } from '../support/action';
import { checkSelectorContent } from '../support/check';
import {generateRandomPassword} from "../support/util";

const registrationTextSelector = '#registrationCompleteText';

export default class RegistrationPage {
    static async populatePassword() {
        const newPassword = generateRandomPassword();
        try {
            await inputSelectorValue('#password', newPassword);
        } catch (_error) {
            await inputSelectorValue('#password-post-donation', newPassword);
        }
        return newPassword;
    }

    static async checkCopySaysImRegistered() {
        await checkSelectorContent(registrationTextSelector, 'You are now registered');
    }
}
