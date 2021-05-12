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

    generatePreDom(json) {
        const pre = document.createElement('pre');
        pre.style.background = 'rgba(71,87,120,0.08)';
        pre.style.padding = '6px';
        pre.style.font = '11px/14px "Menlo","Consolas","Monaco",monospace';
        pre.innerText = JSON.stringify(json, null, 4);
        return pre;
    }

    VNPAY_websocket_laravel() {
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

    VNPAY_outgoing_vn_bank_web() {
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
}
