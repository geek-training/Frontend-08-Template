学习笔记

## HTTP 状态码

1. 1xx 信息响应
2. 2xx 成功响应
3. 3xx 重定向
4. 4xx 客户端响应
5. 5xx 服务器响应

## Request

### Request line

example: `POST/HTTP/1.1`

### Headers

Hose: 127.0.0.1
Content-Type: application/json
Content-Length: 12
以空行结束

### Body

key-value 格式

## Response

### status line

example: `HTTP/1.1 200 OK`

### Headers

Content-Type:
Date:
Connection:
Transfer-Encoding:
以空行结束

### Body

## 状态机

现实事物是有不同状态的，例如一个自动门，就有 open 和 closed 两种状态。我们通常所说的状态机是有限状态机（Finite-state machine, FSM），也就是被描述的事物的状态的数量是有限个，例如自动门的状态就是两个 open 和 closed 。 状态机的全称是有限状态自动机，自动两个字也是包含重要含义的。给定一个状态机，同时给定它的当前状态以及输入，那么输出状态时可以明确的运算出来的。例如对于自动门，给定初始状态 closed ，给定输入“开门”，那么下一个状态时可以运算出来的。

简单的转换图可以用 M\*M 矩阵表示

### 概念

1. State：状态。一个状态机至少要包含两个状态。例如上面自动门的例子，有 open 和 closed 两个状态。
2. Event：事件。事件就是执行某个操作的触发条件或者口令。对于自动门，“按下开门按钮”就是一个事件。
3. Action：动作。事件发生以后要执行动作。例如事件是“按开门按钮”，动作是“开门”。编程的时候，一个 Action 一般就对应一个函数。
4. Transition：变换。也就是从一个状态变化为另一个状态。例如“开门过程”就是一个变换。
