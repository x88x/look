// const html2canvas = require("./html2canvas")

export default function (selector) {
    const originalNode = document.querySelector(selector);
    const node = originalNode.cloneNode(true);
    const originalList = [originalNode];
    const list = [node];
    [].push.apply(originalList, originalNode.querySelectorAll("*"));
    [].push.apply(list, node.querySelectorAll("*"));

    if (originalList.length !== list.length) {
        console.error("...");
        return
    }

    computedStyle(originalList, list);

    const canvas = document.createElement("canvas")
    canvas.width = originalNode.offsetWidth;
    canvas.height = originalNode.offsetHeight;
    canvas.style.opacity = 0;
    originalNode.parentElement.appendChild(canvas);
    return rasterizeHTML.drawHTML(parseDocumentHTML(node.outerHTML), canvas).then(() => {
        canvas.parentElement.removeChild(canvas)
        return canvas
    })
}

function computedStyle(originalList, list) {
    const mapTagDefaultStyle = new Map();
    const iframe = document.createElement('iframe');
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    function getStyle(e) {
        let defaultStyle = mapTagDefaultStyle.get(e.tagName);
        if (!defaultStyle) {
            const element = document.createElement(e.tagName);
            iframe.contentDocument.body.appendChild(element);
            defaultStyle = window.getComputedStyle(element);
            mapTagDefaultStyle.set(e.tagName, defaultStyle)
        }
        const style = window.getComputedStyle(e);
        const res = {};
        Object.keys(style).forEach(name => {
            if (style[name] === defaultStyle[name]) {
                return
            }
            res[name] = style[name]
        });
        return res
    }

    originalList.forEach((e, i) => {
        Object.assign(list[i].style, getStyle(e))
    });

    iframe.remove();
}

function parseDocumentHTML(html) {
    function getFixStyle() {
        let style = "<style>html,body{margin:0;padding:0;}";
        const sheets = document.styleSheets;
        for (let i = 0, length = sheets.length; i < length; i++) {
            const rules = sheets[i].cssRules;//sheets[i].rules ||
            for (let r = 0, len = rules.length; r < len; r++) {
                if (/\:(after|before)(,|$)/.test(rules[r].selectorText)) {
                    style += rules[r].cssText
                }
            }
        }
        return style + '</style>'
    }

    function getAttributeList(element) {
        if (element.hasAttributes()) {
            return [].map.call(element.attributes, a => a.name + '="' + a.value + '"').join(" ")
        }
        return ""
    }

    return `
<!DOCTYPE html>
<html ${getAttributeList(document.documentElement)}>
<head>
${[].map.call(document.querySelectorAll('meta'), m => m.outerHTML).join("\n")}
${getFixStyle()}
</head>
<body>
${html}
</body>
</html>
`
}