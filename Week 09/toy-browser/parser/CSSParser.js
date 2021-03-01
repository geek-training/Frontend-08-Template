const css = require("css");

const CSSParser = class {

  rules = [];

  addCssRules(text) {
    let ast = css.parse(text);
    this.rules.push(...ast.stylesheet.rules);
  }

  computeCSS(element, stack) {
    let parentElements = stack.slice().reverse();
    if (!element.computedStyle) {
      element.computedStyle = {};
    }

    for (let rule of this.rules) {
      /**
       * body div #myId
       * ['#myId', 'div', 'body']
       * 如果第一个 #myId 没匹配上就跳过本次循环
       */
      let selectorParts = rule.selectors[0].split(" ").reverse();

      if (!this.match(element, selectorParts[0])) {
        continue;
      }

      /**
       * #myId 已经匹配上来，接下来从 selectorParts[1] 开始去逐层匹配当前元素的父元素
       */
      let j = 1;
      for (let i = 0; i < parentElements.length; i++) {
        if (this.match(parentElements[i], selectorParts[j])) {
          j++;
        }
      }
      /** 【‘#myId', 'div', 'body'】每项都匹配到了，则为true */
      let matched = false;
      if (j >= selectorParts.length) {
        matched = true;
      }
      if (matched) {
        /** 如果匹配到，我们要加入 */
        const sp = this.specificity(rule.selectors[0]);
        const computedStyle = element.computedStyle;
        for (const declaration of rule.declarations) {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {};
          }
          if (!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
          } else if (
            this.compare(computedStyle[declaration.property].specificity, sp) < 0
          ) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
          }
        }
        console.log("+++ Matched +++", element.computedStyle);
      }
    }
  }


  /**
   * 只考虑简单选择器
   * div
   * .name
   * #title
   * 选做：支持 class='img myImg'
   */
  match(element, selector) {
    if (!selector || !element.attributes) {
      return false;
    }

    const startChar = selector.charAt(0);
    if (startChar == "#") {
      const attr = element.attributes.filter((attr) => attr.name === "id");
      if (attr.length !== 0 && attr[0].value === selector.replace("#", "")) {
        return true;
      }
    } else if (startChar == ".") {
      const classAttr = element.attributes.filter(
        (attr) => attr.name === "class"
      );
      if (!classAttr || classAttr.length === 0) {
        return false;
      }

      const classArray = classAttr[0].value.split(" ");
      for (let i = 0; i < classArray.length; i++) {
        if (classArray[i] === selector.replace(".", "")) {
          return true;
        }
      }
    } else {
      if (element.tagName === selector) {
        return true;
      }
    }
    return false;
  }

  specificity(selector) {
    let p = [0, 0, 0, 0];
    const selectorParts = selector.split(" ");
    for (const part of selectorParts) {
      const startChar = part.charAt(0);
      if (startChar == "#") {
        p[1] += 1;
      } else if (startChar == ".") {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
    }
    return p;
  }

  compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
      return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
      return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
      return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
  }
}

module.exports = CSSParser;
