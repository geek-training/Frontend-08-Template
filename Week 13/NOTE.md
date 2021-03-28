# 学习笔记

## 重学 HTML

HTML 定义：XML 和 SGML

strong vs em

strong 表示这个词在一个段落中很重要，em 表示一个重音。

### 合法元素

- Element: `<tagname>...</tagname>`
- Text: text
- Comment: `<!-- comments -->`
- DocumentType: `<!Doctype html>`
- ProcessingInstruction: `<？a 1 ?>`
- CDATA: `<![CDATA[]]>`

### 字符引用

- `&#161；`
- `&amp;`
- `&lt;`
- `&quot;`

HTML SVG MathML

冒泡和捕获，不管你监听与否，它们都会发生。

### Range API

- var range = new Range()
- range.setStart(element,9)
  对于 element 的偏移值是 children,对于 text 的偏移值是文字的个数
- range.setEnd(element,4)
- var range = document.getSelection().getRangeAt(0);

- range.setStartBefore
- range.setEndBefore
- range.setStartAfter
- range.setEndAfter
- range.selectNode
- range.selectNodeContents 选中一个元素所有的内容

- var fragment = range.extractContents()  
   range 选取的内容从 DOM 树摘下来，fragment 是 node 的一个子类，它在 append 的时候，它自己不会 append 到 dom 树上，它会把它的所有的子节点代替它自己放上去。fragment 不需要发生重排，它的性能比较高。
- range.insertNode(document.createTexdNode("aaa"))

### CSSOM

### CSSOM View

#### Window

- window.innerHeight,window.innerWidth  
  viewport,浏览实际渲染的宽度和高度
- window.outerWidth,window.outerHeight
- window.devicePixelRatio
- window.screen
  - window.screen.width
  - window.screen.height
  - window.screen.availWidth
  - window.screen.availHeight

#### Window API

- window.open("about:blank","\_blank","width=100,height=100,left=100,right=100")
- moveTo(x,y)
- moveBy(x,y)
- resizeTo(x,y)
- resizeBy(x,y)

#### scroll

- scrollTop
- scrollLeft
- scrollHeight
- scrollWidth
- scroll(x,y)
- scrollBy(x,y)
- scrollIntoView()

- window
  - scrollX
  - scrollY
  - scrollTo(x,y)
  - scrollBy(x,y)

只有在有滚动条的时候，这些 API 才会生效

#### layout

- getClientRects()
- getBoundingClientRect()

#### 标准化组织

- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - CG/WG
