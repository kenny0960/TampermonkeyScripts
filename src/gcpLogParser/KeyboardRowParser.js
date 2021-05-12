class KeyboardRowParser {
    constructor(rowDom) {
        this.rowDom = rowDom;
    }

    getSummaryDom() {
        return this.rowDom.querySelector('logs-summary.p6n-logs-flex-col-stretch.p6n-logs-message');
    }

    getJsonDom() {
        return this.getSummaryDom().querySelector('span[dir="ltr"]');
    }

    hasParsed() {
        return this.getJsonDom() === null;
    }

    getJsonText() {
        return this.getJsonDom().innerText.replace(/\\/g, '');
    }

    isJsonParsable(jsonText) {
        try {
            JSON.parse(jsonText);
        } catch (error) {
            return false;
        }
        return true;
    }

    hasOrderText() {
        return this.getJsonText().indexOf('取得订单成功') !== -1;
    }

    getOrder() {
        return JSON.parse(this.getJsonText().match(/取得订单成功 - (?<orderJson>...+08:00"})/).groups.orderJson);
    }

    getReadableOrderText() {
        const {
            destinationBankAccountName,
            destinationBankAccountNumber,
            destinationBankCode,
            amount
        } = this.getOrder();
        return `${destinationBankAccountName} - ${destinationBankAccountNumber}(${destinationBankCode}) $${amount}`;
    }

    replaceOrderText(jsonText) {
        return jsonText.replace(/取得订单成功 - ...+08:00"}/, `💰 取得订单成功(${this.getReadableOrderText()})`);
    }

    hasOrderSummaryText() {
        return this.getJsonText().indexOf('取得出款订单摘要') !== -1;
    }

    getOrderSummary() {
        return JSON.parse(this.getJsonText().match(/取得出款订单摘要 - (?<orderSummaryJson>...+"}})/).groups.orderSummaryJson);
    }

    replaceOrderSummaryText(jsonText) {
        return jsonText.replace(/取得出款订单摘要 - ...+"}}/, `取得出款订单摘要：${this.getOrderSummary().status}`);
    }

    has404Text() {
        return this.getJsonText().indexOf('无回应画面') !== -1;
    }

    get404Json() {
        return JSON.parse(this.getJsonText().match(/无回应画面\(\d+\)：(?<noResponseJson>...+"}]|\[\])/).groups.noResponseJson);
    }

    replace404Text(jsonText) {
        return jsonText.replace(/无回应画面\(\d+\)：(...+"}]|\[\])/, `⏰ 无回应画面`);
    }

    hasSuccessText() {
        return this.getJsonText().indexOf('成功出款') !== -1;
    }

    replaceSuccessText(jsonText) {
        return jsonText.replace(/成功出款/g, `✅ 成功出款`);
    }

    hasFailedText() {
        return this.getJsonText().indexOf('出款失败') !== -1;
    }

    replaceFailedText(jsonText) {
        return jsonText.replace(/出款失败/g, `❌ 出款失败`);
    }

    isPermissionsGranted(json) {
        if (json.permission === undefined) {
            return true;
        }
        return Object.values(json.permission).includes(false) === false;
    }

    shortenModel(model) {
        if (model === 'Redmi Note 7') {
            return 'N7';
        }
        if (model === 'M2003J15SC') {
            return 'N9';
        }
        return model;
    };

    rewriteSummaryDom(json) {
        const { labels, mobile, payload } = json;
        const { model } = mobile;
        const { name, bankCode } = labels;
        const { message } = payload;
        const shortenModelName = this.shortenModel(model);
        this.getSummaryDom().innerHTML = `
            <div style="display: flex;justify-content: space-between;">
                <div>
                    ${name ? name + ' - ' : ''}${message}
                </div>
                <div>
                    ${bankCode ? ' 💳  ' + bankCode : ''}
                    📱 ${shortenModelName}
                </div>
            </div>`;
    }
}
