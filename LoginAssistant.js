class LoginAssistant {
    constructor(parameters) {
        this.accountNumberSelector = parameters.accountNumberSelector;
        this.accountNameSelector = parameters.accountNameSelector;
        this.passwordSelector = parameters.passwordSelector;
        this.captchaSelector = parameters.captchaSelector;
        this.submitSelector = parameters.submitSelector;
        this.accountNumber = atob(parameters.accountNumber);
        this.accountName = atob(parameters.accountName);
        this.password = atob(parameters.password);
        this.legalCaptchaLength = parameters.legalCaptchaLength;
    }

    createInputEvent() {
        const inputEvent = document.createEvent('Event');
        inputEvent.initEvent('input', false, false);
        return inputEvent;
    };

    getAccountNumberInput() {
        const dom = document.querySelector(this.accountNumberSelector);
        if (dom === null) {
            console.log('account number dom is null');
            return document.createElement('input');
        }
        return dom;
    }

    typeAccountNumber() {
        this.getAccountNumberInput().value = this.accountNumber;
    }

    dispatchAccountNumberInputEvent() {
        this.getAccountNumberInput().dispatchEvent(this.createInputEvent())
    }

    getAccountNameInput() {
        const dom = document.querySelector(this.accountNameSelector);
        if (dom === null) {
            console.log('account name dom is null');
            return document.createElement('input');
        }
        return dom;
    }

    typeAccountName() {
        this.getAccountNameInput().value = this.accountName;
    }

    dispatchAccountNameInputEvent() {
        this.getAccountNameInput().dispatchEvent(this.createInputEvent())
    }

    getPasswordInput() {
        const dom = document.querySelector(this.passwordSelector);
        if (dom === null) {
            console.log('account number dom is null');
            return document.createElement('input');
        }
        return dom;
    }

    typePassword() {
        this.getPasswordInput().value = this.password;
    }

    dispatchPasswordInputEvent() {
        this.getPasswordInput().dispatchEvent(this.createInputEvent());
    }

    getCaptchaInput() {
        const dom = document.querySelector(this.captchaSelector);
        if (dom === null) {
            console.log('captcha dom is null');
            return document.createElement('input');
        }
        return dom;
    }

    captchaListener() {
        this.getCaptchaInput().oninput = (event) => this.handleCaptchaInputChanged(event);
    }

    handleCaptchaInputChanged(event) {
        if (event.target.value.length !== this.legalCaptchaLength) {
            return;
        }
        this.submit();
    }

    getSubmitButton() {
        const dom = document.querySelector(this.submitSelector);
        if (dom === null) {
            console.log('submit dom is null');
            return document.createElement('button');
        }
        return dom;
    }

    submit() {
        this.getSubmitButton().click();
    }
}
