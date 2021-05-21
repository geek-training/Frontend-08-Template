# 学习笔记

## Git hook + ESLint

通过`pre-commit`的钩子,在`commit`之前进行`ESLint`检查,如果检查不通过则`exitCode != 0`使`commit`失败.

但是会遇到一个问题, `eslint`检查的文件对象是工作区的文件,而`git commit`是对暂存区的文件进行的`commit`则会出现不对齐的情况.

通过`git stash push -k`可以将工作区对齐至暂存区的状态,`git commit`之后再通过`git stash pop`还原工作区.

## 使用Headless Browser

无头浏览器在类似于流行网络浏览器的环境中提供对网页的自动控制，但是通过命令行界面或使用网络通信来执行。 它们对于测试网页特别有用，因为它们能够像浏览器一样呈现和理解超文本标记语言，包括页面布局、颜色、字体选择以及JavaScript和AJAX的执行等样式元素，这些元素在使用其他测试方法时通常是不可用的。

简而言之无头浏览器提供了完整的浏览器环境,能实现网站的各个特性. 但是没有GUI部分大大提升了性能.通常用于爬虫,UI自动化测试,JS库自动化测试.
```
const puppeteer = require('puppeteer');

(async ()=>{
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.zhihu.com/sdfsdfsdfsdfsdfsf')
  let oops = await page.$eval('.ErrorPage-subtitle', node => node.innerText)
  console.log(oops) // 你似乎来到了没有知识存在的荒原
})()
```

## 训练营总结

20期课程结束了，回顾整个学习过程，从开始的踌躇满志，到中后期因为工作生活等原因，没有足够的时间消化当周学习内容，但是始终坚持了看完本周课程并完成作业，给自己点赞。
   
课程中收获了很多，知识面的增加、零散知识点的系统化梳理、思考方式、学习方法、技术研究角度和入手点等，都有所收益。

1. 跟着课程结合以往经验，，沉淀了自己之前的项目，并通过思维导图建立了系统地知识体系
2. 通过编程与算法练习，了解到编程的词法分析，算法的构建和生产式的概念，编程思维也有所提升
3. 系统化学习JavaScript的表达式，循环机制，数据类型
4. 浏览器的工作原理，状态机的使用场景，HTTP协议的相关知识
5. 系统学习了CSS的语法规则，选择器优先级，伪类，伪元素，CSS的重排，回流，BFC的合并
6. 系统学习了HTML的历史，定义理论，浏览器的API总结归纳，重点CSSOM的应用
7. 学习目前主流的组件化编程思想，封装灵活的组件，属性，生命周期，参数
8. 前端工程化，yeoman工具链，webpack，babel，AST构建，单元测试的相关知识
9. 学习了发布系统的流程，Git Hooks的基本使用，无头浏览器的检查DOM
   
接下来一段时间还会继续学习研究，希望自己能在这条路上走得更远。
