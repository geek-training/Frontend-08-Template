学习笔记
1. 如果 exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null。
2. 返回结果Result 数组的值
    1. 第 0 个元素是与正则表达式相匹配的文本
    2. 第 1 个元素是与第一个子表达式相匹配的文本
    3. 第 i 个元素是与第i个子表达式相匹配的文本
    4. index 记录检索开始位置
    5. input 被检索字符串
    
3. regexp 的值
    1. source 被检索字符串
    2. lastIndex 下次检索开始位置
    3. flags
    4. global
    5. ignoreCase
    
4. Expression
    1. <AdditionExpression><EOF>

5. AdditionExpression
    1. <MultiplicationExpression>
    2. <AdditionExpression><+><MultiplicationExpression>
    3. <AdditionExpression><-><MultiplicationExpression>


6. MultiplicationExpression  
    1. <Number>
    2. <MultiplicationExpression><*><Number>
    3. <MultiplicationExpression></><Number>

  


