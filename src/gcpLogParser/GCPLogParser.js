class KeyboardRowParser {
    constructor(rowDom) {
        this.rowDom = rowDom;
    }

    getSummaryDom() {
        return this.rowDom.querySelector('.short-summary');
    }

    getSummaryTextDom() {
        return this.getSummaryDom().querySelector('.summary-text');
    }

    getJsonDom() {
        return this.getSummaryDom().querySelector('logs-truncated-text div');
    }

    hasParsed() {
        return this.getSummaryDom().querySelectorAll('logs-highlightable-text').item(1).innerText.includes('POST') === false;
    }

    getJsonText() {
        return this.getJsonDom().getAttribute('aria-label').replace(/\\/g, '').slice(1, -1);
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
        const { destinationBankAccountName, destinationBankAccountNumber, destinationBankCode, amount } = this.getOrder();
        return `${destinationBankAccountName} - ${destinationBankAccountNumber}(${destinationBankCode}) $${amount}`;
    }

    replaceOrderText(jsonText) {
        return jsonText.replace(/取得订单成功 - ...+08:00"}/, `💰 取得订单成功(${this.getReadableOrderText()})`);
    }

    hasOrderSummaryText() {
        return this.getJsonText().indexOf('取得出款订单摘要') !== -1;
    }

    getOrderSummary() {
        return JSON.parse(
            this.getJsonText().match(/取得出款订单摘要 - (?<orderSummaryJson>...+"}})/).groups.orderSummaryJson
        );
    }

    replaceOrderSummaryText(jsonText) {
        return jsonText.replace(/取得出款订单摘要 - ...+"}}/, `取得出款订单摘要：${this.getOrderSummary().status}`);
    }

    has404Text() {
        return this.getJsonText().indexOf('无回应画面') !== -1;
    }

    get404Json() {
        return JSON.parse(
            this.getJsonText().match(/无回应画面\(\d+\)：(?<noResponseJson>...+"}]|\[\])/).groups.noResponseJson
        );
    }

    replace404Text(jsonText) {
        return jsonText.replace(/无回应画面\(\d+\)：(...+"}]|\[\])/, '⏰ 无回应画面');
    }

    hasSuccessText() {
        return (
            this.getJsonText().includes('成功出款') === true || this.getJsonText().includes('新增手機簡訊內容成功') === true
        );
    }

    replaceSuccessText(jsonText) {
        if (jsonText.includes('成功出款') === true) {
            return jsonText.replace(/成功出款/g, '✅ 成功出款');
        }
        if (jsonText.includes('新增手機簡訊內容成功') === true) {
            return jsonText.replace(/新增手機簡訊內容成功/g, '✅ 新增手機簡訊內容成功');
        }
        return '';
    }

    hasFailedText() {
        return this.getJsonText().indexOf('出款失败') !== -1;
    }

    replaceFailedText(jsonText) {
        return jsonText.replace(/出款失败/g, '❌ 出款失败');
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
    }

    rewriteSummaryDom(json) {
        const { labels, mobile, payload, versions } = json;
        const { model } = mobile;
        const { name, bankCode } = labels;
        const { message } = payload;
        const { bank_app_version } = versions;
        const shortenModelName = this.shortenModel(model);
        this.getSummaryDom().querySelectorAll('logs-highlightable-text').item(1).innerText = `${
            bankCode ? ` 💳${bankCode}` : ''
        }📱${shortenModelName} Ⓥ${bank_app_version}`;
        this.getSummaryDom().querySelectorAll('logs-highlightable-text').item(2).innerText = name;
        this.getSummaryDom().querySelectorAll('logs-highlightable-text').item(3).innerText = message;
    }

    rewriteMessageListenerSummaryDom(json) {
        const { labels, mobile, payload, version } = json;
        const { model } = mobile;
        const { bank_card, serial_number } = labels;
        const { message } = payload;
        const { app_version } = version;
        const shortenModelName = this.shortenModel(model);
        this.getSummaryDom()
            .querySelectorAll('logs-highlightable-text')
            .item(1).innerText = `${serial_number}📱${shortenModelName} Ⓥ${app_version}`;
        this.getSummaryDom().querySelectorAll('logs-highlightable-text').item(2).innerText =
            bank_card === '' ? '未綁定' : bank_card;
        this.getSummaryDom().querySelectorAll('logs-highlightable-text').item(3).innerText = message;
    }
}

class GCPLogParser {
    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    makeJsonPayloadColumnInvisible() {
        document
            .querySelectorAll(
                'button.custom.custom-facet-jsonPayload-request_properties.facet-button.field.has-facet-menu.ng-star-inserted'
            )
            .forEach((buttonDom) => {
                buttonDom.style.width = 0;
                buttonDom.style.padding = 0;
                buttonDom.style.margin = 0;
                buttonDom.style.visibility = 'hidden';
            });
    }

    getSearchTextDom() {
        return document.querySelector('.monaco-mouse-cursor-text');
    }

    isKeyboardApp() {
        return this.getSearchTextDom().innerText.includes('client=mobile');
    }

    isMessageListenerApp() {
        return this.getSearchTextDom().innerText.includes('client=message-app');
    }

    getLogNameLightIcon() {
        const searchText = this.getSearchTextDom().innerText;
        if (searchText.includes('VNPAY')) {
            return '🔴';
        }
        if (searchText.includes('QA-HK')) {
            return '🟡';
        }
        if (searchText.includes('DEVELOP')) {
            return '🟢';
        }
        return '';
    }

    getLogNameIcon() {
        if (this.isKeyboardApp() === true) {
            return '⌨';
        }
        if (this.isMessageListenerApp() === true) {
            return '✉';
        }
        return '';
    }

    getContentsDom() {
        return document.querySelectorAll('.summary-container.short-summary');
    }

    getRowsDom() {
        return document.querySelectorAll('.log-entry-container');
    }

    generatePreDom(json) {
        const pre = document.createElement('pre');
        pre.style.background = 'rgba(71,87,120,0.08)';
        pre.style.padding = '6px';
        pre.style.font = '11px/14px "Menlo","Consolas","Monaco",monospace';
        pre.innerText = JSON.stringify(json, null, 4);
        return pre;
    }

    vnpay_websocket_laravel() {
        this.getContentsDom().forEach((contentDom) => {
            const contentText = contentDom.innerText;
            const matches = contentText.match(
                /\[\d+-\d+-\d+\s\d+:\d+:\d+\]\sproduction.[A-Z]+:(?<title>...+)\s(?<jsonString>{...+})/
            );

            if (matches === null) {
                return;
            }

            if (this.isJson(matches.groups.jsonString)) {
                const { title, jsonString } = matches.groups;

                const pre = this.generatePreDom(JSON.parse(jsonString));
                const div = document.createElement('div');
                div.style.fontWeight = 'bold';
                div.innerText = title;

                contentDom.innerHTML = '';
                contentDom.appendChild(div);
                contentDom.appendChild(pre);
            }
        });
    }

    vnpay_outgoing_vn_bank_web() {
        this.getContentsDom().forEach((contentDom) => {
            const contentText = contentDom.innerText;

            if (contentText.includes("b'/")) {
                const base64 = contentText.match(/轉帳(失敗|成功)截圖： b'(?<base64>.+)'/).groups.base64;
                const imageSource = `data:image/png;base64,${base64}`;
                const image = document.createElement('img');
                image.width = 150;
                image.height = 150;
                image.src = imageSource;
                contentDom.innerHTML = '';
                contentDom.append(image);
                contentDom.onclick = () => {
                    const newWindow = window.open();
                    const image = document.createElement('img');
                    image.src = imageSource;
                    newWindow.document.write(image.outerHTML);
                };
                contentDom.parentNode.style.height = '155px';
                return;
            }

            if (contentText.includes('body')) {
                const html = document.createElement('html');
                html.innerHTML = contentText;
                contentDom.innerHTML = '';
                contentDom.appendChild(html);
                contentDom.onclick = () => {
                    const newWindow = window.open();
                    newWindow.document.write(contentText);
                };
                contentDom.parentNode.style.height = '100px';
                return;
            }
        });
    }

    vnpay_outgoing_api_laravel_http_access() {
        this.makeJsonPayloadColumnInvisible();
        document.title = `${this.getLogNameLightIcon()} ${this.getLogNameIcon()}`;

        this.getRowsDom().forEach((contentDom) => {
            const parser = new KeyboardRowParser(contentDom);

            // 鍵盤出款日誌
            if (this.isKeyboardApp() === true) {
                if (parser.hasParsed() === true) {
                    return;
                }

                let jsonText = parser.getJsonText();
                let backgroundColor = '';
                let title = '';

                // 把 ORDER JSON 轉換成易讀的字串
                if (parser.hasOrderText() === true) {
                    jsonText = parser.replaceOrderText(jsonText);
                    backgroundColor = '#ccffcc';
                    title = JSON.stringify(parser.getOrder());
                }

                // 把 ORDER SUMMARY JSON 轉換成易讀的字串
                if (parser.hasOrderSummaryText() === true) {
                    jsonText = parser.replaceOrderSummaryText(jsonText);
                    title = JSON.stringify(parser.getOrderSummary());
                }

                // 把 404 JSON 轉換成易讀的字串
                if (parser.has404Text() === true) {
                    try {
                        parser.get404Json();
                        jsonText = parser.replace404Text(jsonText);
                        backgroundColor = '#ffedcc';
                    } catch (error) {
                        console.log(error);
                    }
                }

                if (parser.hasSuccessText() === true) {
                    jsonText = parser.replaceSuccessText(jsonText);
                    backgroundColor = '#ccffcc';
                }

                if (parser.hasFailedText() === true) {
                    jsonText = parser.replaceFailedText(jsonText);
                    backgroundColor = '#ffe6e6';
                }

                if (parser.isJsonParsable(jsonText) === false) {
                    return;
                }

                const json = JSON.parse(jsonText);

                if (parser.isPermissionsGranted(json) === false) {
                    backgroundColor = '#ffe6e6';
                    title = '請核對權限';
                }

                parser.rewriteSummaryDom(json);
                parser.rowDom.style.backgroundColor = backgroundColor;
                parser.rowDom.title = title;
            }

            // 自動傳送簡訊日誌
            if (this.isMessageListenerApp() === true) {
                if (parser.hasParsed() === true) {
                    return;
                }

                let jsonText = `{${parser.getJsonText()}}`;
                let backgroundColor = '';

                if (parser.hasSuccessText() === true) {
                    jsonText = parser.replaceSuccessText(jsonText);
                    backgroundColor = '#ccffcc';
                }

                if (parser.isJsonParsable(jsonText) === false) {
                    return;
                }

                const json = JSON.parse(jsonText);
                parser.rewriteMessageListenerSummaryDom(json);
                parser.rowDom.style.backgroundColor = backgroundColor;
            }
        });
    }

    vnpay_outgoing_vn_bank_web_entries() {
        this.getContentsDom().forEach((contentDom) => {
            const contentText = contentDom.innerText;

            if (contentText.includes("b'/")) {
                const base64 = contentText.match(/b'(?<base64>.+)'/).groups.base64;
                const imageSource = `data:image/png;base64,${base64}`;
                const image = document.createElement('img');
                image.width = 150;
                image.height = 150;
                image.src = imageSource;
                contentDom.innerHTML = '';
                contentDom.append(image);
                contentDom.onclick = () => {
                    const newWindow = window.open();
                    const image = document.createElement('img');
                    image.src = imageSource;
                    newWindow.document.write(image.outerHTML);
                };
                contentDom.parentNode.style.height = '155px';
                return;
            }

            if (contentText.includes('body')) {
                const html = document.createElement('html');
                html.innerHTML = contentText;
                contentDom.innerHTML = '';
                contentDom.appendChild(html);
                contentDom.onclick = () => {
                    const newWindow = window.open();
                    newWindow.document.write(contentText);
                };
                contentDom.parentNode.style.height = '100px';
                return;
            }
        });
    }
}
