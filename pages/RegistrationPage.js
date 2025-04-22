import { inputSelectorValue } from '../support/action';
import { checkSelectorContent } from '../support/check';

const registrationTextSelector = '#registrationCompleteText';

export default class RegistrationPage {
    static async populatePassword() {
        const newPassword = this.generateRandomPassword();
        try {
            await inputSelectorValue('#password', newPassword);
        } catch (error) {
            await inputSelectorValue('#password-post-donation', newPassword);
        }
        return newPassword;
    }

    /**
     * @private
     */
    static generateRandomPassword() {
        return Array(20).fill(0).map(() => Math.random().toString(36).charAt(2)).join('');
    }

    static async checkCopySaysImRegistered() {
        await checkSelectorContent(registrationTextSelector, 'You are now registered');
    }
}
