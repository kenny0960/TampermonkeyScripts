class GCPLogParser {
    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    deleteTimestampUTCString() {
        document.querySelectorAll("logs-timestamp-field").forEach(timestampDom => {
            timestampDom.innerHTML = timestampDom.innerHTML.replace(' UTC+8', '');
        });
    }

    getContentsDom() {
        return document.querySelectorAll( '[path="entry.payload"]');
    }

    getRowsDom() {
        return document.querySelectorAll( 'div.p6n-logs-flex-row.p6n-logs-entry-summary');
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
        this.deleteTimestampUTCString();

        this.getContentsDom().forEach(contentDom => {
            const contentText = contentDom.innerText;
            const matches = contentText.match(/\[\d+-\d+-\d+\s\d+:\d+:\d+\]\sproduction.[A-Z]+:(?<title>...+)\s(?<jsonString>{...+})/);

            if (matches === null) {
                return;
            }

            if (this.isJson(matches.groups.jsonString)) {
                const { title, jsonString } = matches.groups

                const pre = this.generatePreDom(JSON.parse(jsonString))
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
        this.deleteTimestampUTCString();

        this.getContentsDom().forEach(contentDom => {
            const contentText = contentDom.innerText;

            if (contentText.includes('html')) {
                const html = document.createElement('html');
                html.innerHTML = contentText;
                contentDom.innerHTML = '';
                contentDom.appendChild(html);
                contentDom.onclick = () => {
                    contentDom.innerHTML = '...';
                    const newWindow = window.open();
                    newWindow.document.write(contentText);
                }
                return;
            }

            if (contentText.includes('data:image/png;base64')) {
                const json = JSON.parse(contentText);
                const image = document.createElement('img');
                image.width = 75;
                image.height = 75;
                image.src = json['parameters']['image'];
                contentDom.innerHTML = '';
                contentDom.append(image);
                return;
            }

            if (this.isJson(contentText)) {
                const pre = this.generatePreDom(JSON.parse(contentText))
                contentDom.innerHTML = '';
                contentDom.appendChild(pre);
                return;
            }
        });
    }

    vnpay_outgoing_api_laravel_http_access() {
        this.deleteTimestampUTCString();

        this.getRowsDom().forEach(contentDom => {
            const parser = new KeyboardLogParser(contentDom);

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
        });
    }
}
