// 저장된 HTML에서도 편집기가 지원하는 서식만 새 요소로 복사합니다.
export function cleanBoardContent(html) {
  const source = new DOMParser().parseFromString(html || "", "text/html");
  const output = document.createElement("div");
  const allowedTags = ["DIV", "P", "BR", "SPAN", "B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "FONT", "A", "IMG"];
  const blockedTags = ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG", "MATH", "TEMPLATE"];
  const colorPattern = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|transparent)$/i;

  function copyNode(node, parent) {
    if (node.nodeType === 3) {
      parent.appendChild(document.createTextNode(node.textContent));
      return;
    }
    if (node.nodeType !== 1 || blockedTags.includes(node.tagName)) return;
    if (!allowedTags.includes(node.tagName)) {
      node.childNodes.forEach((child) => copyNode(child, parent));
      return;
    }
    const element = document.createElement(node.tagName.toLowerCase());
    if (node.tagName === "IMG") {
      const src = node.getAttribute("src") || "";
      // 현재는 직접 읽고 변환한 이미지 데이터만 표시합니다.
      if (src.length > 700000 || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src)) return;
      element.setAttribute("src", src);
      element.setAttribute("alt", node.getAttribute("alt") || "첨부 사진");
    }
    const rules = {
      color: colorPattern,
      backgroundColor: colorPattern,
      fontWeight: /^(bold|normal|[1-9]00)$/,
      fontStyle: /^(italic|normal)$/,
      textDecorationLine: /^(underline|none)$/,
      fontSize: /^(10|12|13|14|16|18|24|32|48)px$|^(x-small|small|medium|large|x-large|xx-large|xxx-large)$/,
      fontFamily: /^(Malgun Gothic|Arial|Georgia|맑은 고딕)$/i,
    };
    Object.entries(rules).forEach(([property, pattern]) => {
      const value = node.style[property].replace(/["']/g, "");
      if (pattern.test(value)) element.style[property] = value;
    });
    // execCommand가 style 대신 color 속성으로 색상을 남기는 브라우저도 지원합니다.
    const colorAttribute = (node.getAttribute("color") || "").replace(/["']/g, "");
    if (colorPattern.test(colorAttribute)) element.style.color = colorAttribute;
    if (node.tagName === "FONT") {
      if (/^[1-7]$/.test(node.getAttribute("size") || "")) element.setAttribute("size", node.getAttribute("size"));
      const face = (node.getAttribute("face") || "").replace(/["']/g, "");
      if (rules.fontFamily.test(face)) element.setAttribute("face", face);
    }
    if (node.tagName === "A") {
      const href = node.getAttribute("href") || "";
      if (/^https:\/\//i.test(href)) {
        element.setAttribute("href", href);
        element.setAttribute("target", "_blank");
        element.setAttribute("rel", "noopener noreferrer");
      }
    }
    node.childNodes.forEach((child) => copyNode(child, element));
    parent.appendChild(element);
  }
  source.body.childNodes.forEach((node) => copyNode(node, output));
  return output.innerHTML;
}
